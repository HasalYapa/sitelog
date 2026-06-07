export interface Task {
  id: number;
  wbs: string;
  task_name: string;
  duration: number; // in days
  start_date: Date | null;
  finish_date: Date | null;
  predecessors: string;
}

export interface ParsedPredecessor {
  taskId: number;
  type: 'FS' | 'SS';
  lagDays: number;
}

/**
 * 1. Dependency Parsing
 * Parses strings like "4FS+5 days", "2SS", "12,31"
 */
export function parsePredecessors(predecessorsStr: string): ParsedPredecessor[] {
  if (!predecessorsStr || typeof predecessorsStr !== 'string' || predecessorsStr.trim() === '') {
    return [];
  }

  const parts = predecessorsStr.split(',').map((p) => p.trim());
  const parsed: ParsedPredecessor[] = [];

  for (const part of parts) {
    // Matches ID (e.g., 4), Type (e.g., FS, SS), Sign (+ or -), and Days (e.g., 5)
    // Examples: "4", "2SS", "4FS+5 days", "44FS-3 days"
    const match = part.match(/^(\d+)(FS|SS)?(?:([+-])\s*(\d+))?/i);

    if (match) {
      const taskId = parseInt(match[1], 10);
      const type = (match[2]?.toUpperCase() as 'FS' | 'SS') || 'FS';
      
      let lagDays = 0;
      if (match[3] && match[4]) {
        const sign = match[3] === '-' ? -1 : 1;
        lagDays = parseInt(match[4], 10) * sign;
      }

      parsed.push({ taskId, type, lagDays });
    }
  }

  return parsed;
}

/**
 * Adds network days to a date, skipping weekends.
 */
export function addWorkingDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let remainingDays = Math.abs(days);
  const direction = days >= 0 ? 1 : -1;

  while (remainingDays > 0) {
    result.setDate(result.getDate() + direction);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remainingDays--;
    }
  }

  return result;
}

/**
 * Calculates working days between two dates
 */
export function getWorkingDays(startDate: Date, endDate: Date): number {
  if (startDate > endDate) return 0;

  let days = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * 2. Date Calculation Algorithm (Auto-Schedule)
 * Uses iterative relaxation to push topological updates and rollup summaries.
 */
export function autoScheduleTasks(tasks: Task[]): Task[] {
  // Create a deep copy to avoid mutating the original input immediately
  const updatedTasks: Task[] = tasks.map(t => ({
    ...t,
    start_date: t.start_date ? new Date(t.start_date) : null,
    finish_date: t.finish_date ? new Date(t.finish_date) : null,
  }));

  // Parse dependencies upfront out of the loop
  const depsMap = new Map<number, ParsedPredecessor[]>();
  const taskMap = new Map<number, Task>();
  updatedTasks.forEach((t) => {
    depsMap.set(t.id, parsePredecessors(t.predecessors));
    taskMap.set(t.id, t);
  });

  // Map parent WBS to its children (e.g., "1.2" -> tasks "1.2.1", "1.2.2")
  const childrenMap = new Map<string, Task[]>();
  updatedTasks.forEach((t) => {
    const parts = t.wbs.split('.');
    if (parts.length > 1) {
      parts.pop(); // Remove last segment to get parent WBS
      const parentWbs = parts.join('.');
      if (!childrenMap.has(parentWbs)) {
        childrenMap.set(parentWbs, []);
      }
      childrenMap.get(parentWbs)!.push(t);
    }
  });

  const isSummaryTask = (t: Task) =>
    childrenMap.has(t.wbs) && childrenMap.get(t.wbs)!.length > 0;

  // We iterate through the list of tasks multiple times.
  // Because tasks roll up to parents, and dependents rely on predecessors,
  // we repeat until no start or finish dates change (Convergence).
  // Bellman-Ford algorithm style handles this topological push elegantly.
  let changed = true;
  let iterations = 0;
  const maxIterations = tasks.length * 2; // Safeguard against circular dependencies

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    for (const task of updatedTasks) {
      const originalStart = task.start_date ? task.start_date.getTime() : null;
      const originalFinish = task.finish_date ? task.finish_date.getTime() : null;

      if (isSummaryTask(task)) {
        // Rollup logic for Summary Tasks
        const children = childrenMap.get(task.wbs)!;
        let minStart: number | null = null;
        let maxFinish: number | null = null;

        children.forEach((child) => {
          if (child.start_date) {
            const st = child.start_date.getTime();
            if (minStart === null || st < minStart) minStart = st;
          }
          if (child.finish_date) {
            const ft = child.finish_date.getTime();
            if (maxFinish === null || ft > maxFinish) maxFinish = ft;
          }
        });

        if (minStart !== null) task.start_date = new Date(minStart);
        if (maxFinish !== null) task.finish_date = new Date(maxFinish);

        if (task.start_date && task.finish_date) {
          task.duration = getWorkingDays(task.start_date, task.finish_date);
        }
      } else {
        // Calculation logic for Leaf Tasks (Dependents)
        const deps = depsMap.get(task.id) || [];
        let minAllowedStart: Date | null = null;

        if (deps.length > 0) {
          deps.forEach((dep) => {
            const parentTask = taskMap.get(dep.taskId);
            if (!parentTask) return;

            let candidateDate: Date | null = null;

            // Start-to-Start (SS) vs Finish-to-Start (FS)
            if (dep.type === 'FS' && parentTask.finish_date) {
                // Task starts the *next working day* after the predecessor finishes, plus any lag
                candidateDate = addWorkingDays(new Date(parentTask.finish_date), dep.lagDays + 1);
            } else if (dep.type === 'SS' && parentTask.start_date) {
                candidateDate = addWorkingDays(new Date(parentTask.start_date), dep.lagDays);
            }

            if (candidateDate) {
              // The task must wait for the absolute latest dependency to finish
              if (!minAllowedStart || candidateDate > minAllowedStart) {
                minAllowedStart = candidateDate;
              }
            }
          });
        }

        if (minAllowedStart) {
          task.start_date = minAllowedStart;
        } else if (!task.start_date) {
          // Fallback project start date if no predecessors exist
          task.start_date = new Date();
        }

        // Calculate finish date based on duration
        if (task.start_date && task.duration > 0) {
          // e.g., duration 1 day -> finishes on the same day it starts
          task.finish_date = addWorkingDays(new Date(task.start_date), task.duration - 1);
        } else if (task.start_date && task.duration === 0) {
          // milestone styling
          task.finish_date = new Date(task.start_date);
        }
      }

      // Check if dates shifted in this iteration
      const newStart = task.start_date ? task.start_date.getTime() : null;
      const newFinish = task.finish_date ? task.finish_date.getTime() : null;

      if (originalStart !== newStart || originalFinish !== newFinish) {
        changed = true; // Still propagating, require another loop
      }
    }
  }

  if (iterations >= maxIterations) {
    console.warn("Auto-scheduler reached max iterations. Possible circular dependency detected.");
  }

  return updatedTasks;
}
