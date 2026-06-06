import {
  BarChart2,
  Cloud,
  FileText,
  Home,
  Image as ImageIcon,
  Tractor,
  Users,
  Edit2,
  Check
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useProject } from '../lib/ProjectContext';

export type TabName = 'Home' | 'Daily Logs' | 'Workforce' | 'Machinery' | 'Weather' | 'Photos' | 'Reports';

const navItems: { name: TabName; icon: any }[] = [
  { name: 'Home', icon: Home },
  { name: 'Daily Logs', icon: FileText },
  { name: 'Workforce', icon: Users },
  { name: 'Machinery', icon: Tractor },
  { name: 'Weather', icon: Cloud },
  { name: 'Photos', icon: ImageIcon },
  { name: 'Reports', icon: BarChart2 },
];

interface SidebarProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { projectTitle, setProjectTitle } = useProject();
  const [isEditingData, setIsEditingData] = useState(false);
  const [editedTitle, setEditedTitle] = useState(projectTitle);

  useEffect(() => {
    setEditedTitle(projectTitle);
  }, [projectTitle]);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      setProjectTitle(editedTitle.trim());
    } else {
      setEditedTitle(projectTitle);
    }
    setIsEditingData(false);
  };

  const handleTabClick = (name: TabName) => {
    setActiveTab(name);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 z-50 flex flex-col pt-5 pb-4 transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center px-6 mb-8">
          <div className="flex bg-brand-blue p-1.5 rounded-lg mr-3">
            <Tractor className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SiteLog Pro</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.name)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === item.name
                  ? 'bg-orange-50 text-brand-orange'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 group'
              }`}
            >
              <Icon
                className={`flex-shrink-0 mr-3 h-5 w-5 ${
                  activeTab === item.name ? 'text-brand-orange' : 'text-slate-400 group-hover:text-slate-500'
                }`}
              />
              {item.name}
            </button>
          );
        })}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 group">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Project</h4>
            {!isEditingData ? (
              <button onClick={() => setIsEditingData(true)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-blue transition-opacity">
                <Edit2 className="w-3 h-3" />
              </button>
            ) : (
              <button onClick={handleSaveTitle} className="text-brand-blue hover:text-blue-800">
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
          {!isEditingData ? (
            <p className="text-sm text-slate-600 font-medium truncate" onDoubleClick={() => setIsEditingData(true)} title={projectTitle}>{projectTitle}</p>
          ) : (
            <input 
              autoFocus
              className="text-sm text-slate-600 font-medium bg-white border border-brand-blue rounded px-2 py-1 w-full outline-none"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
            />
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
