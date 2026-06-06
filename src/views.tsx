import React from 'react';
import { DailyProgressForm } from './components/DailyProgressForm';
import { DailyLogsList } from './components/DailyLogsList';
import { MachineryStatus } from './components/MachineryStatus';
import { MachineryForm } from './components/MachineryForm';
import { PhotoGallery } from './components/PhotoGallery';
import { WeatherWidget } from './components/WeatherWidget';
import { WeatherDashboard } from './components/WeatherDashboard';
import { WorkforceChart } from './components/WorkforceChart';
import { WorkforceForm } from './components/WorkforceForm';
import { ReportsDashboard } from './components/ReportsDashboard';
import { useProject } from './lib/ProjectContext';

export function HomeView() {
  const { projectTitle } = useProject();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard overview</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor real-time status and logs for {projectTitle}.</p>
        </div>
        <div className="flex items-center text-sm font-medium text-slate-600 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <WeatherWidget />
        </div>
        <div className="col-span-1">
          <WorkforceChart />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <MachineryStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyProgressForm />
        </div>
        <div className="lg:col-span-1">
          <PhotoGallery />
        </div>
      </div>
    </div>
  );
}

export function DailyLogsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and review daily site activities.</p>
      </div>
      <DailyProgressForm />
      <DailyLogsList />
    </div>
  );
}

export function WorkforceView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor personnel and subcontractor attendance.</p>
      </div>
      <div className="h-[60vh] min-h-[400px]">
        <WorkforceChart />
      </div>
      <WorkforceForm />
    </div>
  );
}

export function MachineryView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Machinery</h1>
        <p className="text-sm text-slate-500 mt-1">Status of on-site equipment.</p>
      </div>
      <div className="max-w-4xl">
        <MachineryStatus />
        <MachineryForm />
      </div>
    </div>
  );
}

export function WeatherView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Weather</h1>
        <p className="text-sm text-slate-500 mt-1">Check weather conditions and forecasts for site locations.</p>
      </div>
      <WeatherDashboard />
    </div>
  );
}

export function PhotosView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Photos</h1>
        <p className="text-sm text-slate-500 mt-1">Site progress images.</p>
      </div>
      <div className="max-w-2xl h-[60vh] min-h-[400px]">
        <PhotoGallery />
      </div>
    </div>
  );
}

export function ReportsView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Generate and view project reports.</p>
      </div>
      <ReportsDashboard />
    </div>
  );
}
