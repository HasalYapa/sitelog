import React, { useState } from 'react';
import { Task, autoScheduleTasks } from '../lib/ganttScheduler';
import { Plus, Trash2, Upload } from 'lucide-react';
import { CSVImportModal } from './CSVImportModal';

const initialTasks: Task[] = [
  { id: 1, wbs: '1', task_name: 'Main Project Renovation', duration: 0, start_date: new Date(), finish_date: null, predecessors: '' },
  { id: 2, wbs: '1.1', task_name: 'Project start date', duration: 0, start_date: null, finish_date: null, predecessors: '1' },
  { id: 3, wbs: '1.2', task_name: 'Mobilization', duration: 0, start_date: null, finish_date: null, predecessors: '' },
  { id: 4, wbs: '1.2.1', task_name: 'Site office setup', duration: 20, start_date: null, finish_date: null, predecessors: '2' },
  { id: 5, wbs: '1.2.2', task_name: 'Worker welfare', duration: 4, start_date: null, finish_date: null, predecessors: '4' },
  { id: 6, wbs: '1.3', task_name: 'Phase 1 - External Work', duration: 0, start_date: null, finish_date: null, predecessors: '' },
  { id: 7, wbs: '1.3.1', task_name: 'Demolition work', duration: 60, start_date: null, finish_date: null, predecessors: '4' },
  { id: 8, wbs: '1.3.1.1', task_name: 'Wall plaster External', duration: 30, start_date: null, finish_date: null, predecessors: '7' },
  { id: 9, wbs: '1.3.2', task_name: 'Wall finishes', duration: 15, start_date: null, finish_date: null, predecessors: '8' },
  { id: 10, wbs: '1.3.2.1', task_name: 'External Plaster', duration: 15, start_date: null, finish_date: null, predecessors: '9' },
];

export function ScheduleDashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleAutoSchedule = () => {
    const updated = autoScheduleTasks(tasks);
    setTasks(updated);
  };

  const handleImportTasks = (importedTasks: any[]) => {
    const newTasks: Task[] = importedTasks.map((row, index) => ({
      id: index + 1,
      wbs: row['WBS'] || row['wbs'] || '',
      task_name: row['Task Name'] || row['task name'] || row['Task name'] || row['task_name'] || `Task ${index + 1}`,
      duration: parseInt(row['Duration'] || row['duration'] || '0', 10),
      start_date: null,
      finish_date: null,
      predecessors: row['Predecessors'] || row['predecessors'] || ''
    }));
    setTasks(newTasks);
    setIsImportModalOpen(false);
  };

  const handleAddTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([...tasks, {
      id: newId,
      wbs: '',
      task_name: 'New Task',
      duration: 1,
      start_date: null,
      finish_date: null,
      predecessors: ''
    }]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleGenerateRFI = async () => {
    try {
      const { generateRFIReport } = await import('../lib/reportGenerator');
      await generateRFIReport('SiteLog Pro Project', tasks); // pass project name and tasks
    } catch (err) {
      console.error(err);
      alert('Failed to generate RFI');
    }
  };

  const handleGenerateDPR = async () => {
    try {
      const { generateDPRReport } = await import('../lib/reportGenerator');
      await generateDPRReport('SiteLog Pro Project', tasks); // pass project name and tasks
    } catch (err) {
      console.error(err);
      alert('Failed to generate DPR');
    }
  };

  const isSummaryTask = (wbs: string) => {
    if (!wbs) return false;
    return tasks.some(t => t.wbs !== wbs && t.wbs.startsWith(wbs + '.'));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Project Schedule</h2>
          <p className="text-sm text-slate-500">Manage tasks and dependencies.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={handleGenerateRFI}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            ISO RFI
          </button>
          <button
            onClick={handleGenerateDPR}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            ISO DPR
          </button>
          <button
            onClick={handleAutoSchedule}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Auto Schedule
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-20">ID</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-24">WBS</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase min-w-[200px]">Task Name</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-24">Duration</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-32">Start</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-32">Finish</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-32">Predecessors</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-16"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const wbsDepth = task.wbs ? task.wbs.split('.').length - 1 : 0;
              const isSummary = isSummaryTask(task.wbs);
              
              return (
              <tr key={task.id} className={`border-b hover:bg-slate-50/50 ${isSummary ? 'bg-amber-50/30 border-amber-100' : 'border-slate-100'}`}>
                <td className="py-3 px-4 text-sm font-medium text-slate-500">{task.id}</td>
                <td className="py-3 px-4 text-sm font-medium text-slate-900">
                  <input
                    type="text"
                    value={task.wbs}
                    onChange={(e) => {
                      const newTasks = tasks.map((t) => t.id === task.id ? { ...t, wbs: e.target.value } : t);
                      setTasks(newTasks);
                    }}
                    className={`w-16 border border-transparent hover:border-slate-200 focus:border-brand-blue rounded px-1 py-1 bg-transparent transition-colors ${isSummary ? 'font-bold' : ''}`}
                  />
                </td>
                <td className="py-3 text-sm text-slate-700" style={{ paddingLeft: `${wbsDepth * 1.5 + 1}rem`, paddingRight: '1rem' }}>
                  <input
                    type="text"
                    value={task.task_name}
                    onChange={(e) => {
                      const newTasks = tasks.map((t) => t.id === task.id ? { ...t, task_name: e.target.value } : t);
                      setTasks(newTasks);
                    }}
                    className={`w-full border border-transparent hover:border-slate-200 focus:border-brand-blue rounded px-1 py-1 bg-transparent transition-colors ${isSummary ? 'font-bold text-slate-900' : ''}`}
                  />
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {isSummary ? (
                     <span className="font-bold px-2 text-slate-900">{task.duration} d</span>
                  ) : (
                    <input
                      type="number"
                      value={task.duration}
                      onChange={(e) => {
                        const newTasks = tasks.map((t) => t.id === task.id ? { ...t, duration: Number(e.target.value) } : t);
                        setTasks(newTasks);
                      }}
                      className="w-16 border border-transparent hover:border-slate-200 focus:border-brand-blue rounded px-2 py-1 bg-transparent transition-colors"
                    />
                  )}
                </td>
                <td className={`py-3 px-4 text-sm ${isSummary ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                  {task.start_date ? task.start_date.toLocaleDateString() : '-'}
                </td>
                <td className={`py-3 px-4 text-sm ${isSummary ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                  {task.finish_date ? task.finish_date.toLocaleDateString() : '-'}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  <input
                    type="text"
                    value={task.predecessors}
                    onChange={(e) => {
                      const newTasks = tasks.map((t) => t.id === task.id ? { ...t, predecessors: e.target.value } : t);
                      setTasks(newTasks);
                    }}
                    className={`w-24 border border-transparent hover:border-slate-200 focus:border-brand-blue rounded px-2 py-1 bg-transparent transition-colors ${isSummary ? 'font-bold text-slate-900' : ''}`}
                  />
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>
      <CSVImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImportTasks} 
      />
    </div>
  );
}
