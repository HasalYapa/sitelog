import { Bell, Search, LogOut, Menu } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useSearch } from '../lib/SearchContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);


  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex-1 flex items-center">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="mr-4 text-slate-500 hover:text-slate-700 md:hidden focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md p-1"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-colors"
            placeholder="Search logs, personnel, metadata..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="ml-4 flex items-center md:ml-6 space-x-4">
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative bg-white p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-brand-orange ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="origin-top-right absolute -right-12 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">
                  Notifications
                </p>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <p className="text-sm text-slate-800 font-medium">
                    New Daily Log Added
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Apex Concrete Solutions completed pouring phase 1.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">10 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <p className="text-sm text-slate-800 font-medium">
                    Weather Alert
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Heavy rain expected this afternoon. Secure the site.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            <img
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              src={
                user?.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
              }
              alt="User avatar"
            />
          </button>

          {showProfileMenu && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  signOut();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
