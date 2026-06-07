import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabName } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { useAuth } from './lib/AuthContext';
import { ProjectProvider } from './lib/ProjectContext';
import { SearchProvider } from './lib/SearchContext';
import {
  DailyLogsView,
  HomeView,
  MachineryView,
  PhotosView,
  ReportsView,
  WeatherView,
  WorkforceView,
  ScheduleView,
} from './views';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProjectProvider>
      <SearchProvider>
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {activeTab === 'Home' && <HomeView />}
              {activeTab === 'Schedule' && <ScheduleView />}
              {activeTab === 'Daily Logs' && <DailyLogsView />}
              {activeTab === 'Workforce' && <WorkforceView />}
              {activeTab === 'Machinery' && <MachineryView />}
              {activeTab === 'Weather' && <WeatherView />}
              {activeTab === 'Photos' && <PhotosView />}
              {activeTab === 'Reports' && <ReportsView />}
            </main>
          </div>
        </div>
      </SearchProvider>
    </ProjectProvider>
  );
}
