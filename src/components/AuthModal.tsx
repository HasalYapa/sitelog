import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const { signIn } = useAuth();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    {mode === 'signin' ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-slate-500 mb-8">
                  {mode === 'signin' 
                    ? 'Enter your credentials to access your daily logs and site reports.' 
                    : 'Join SiteLog Pro to manage your construction workforce and machinery efficiently.'}
                </p>

                <div className="space-y-4 mb-6">
                  <button 
                    onClick={() => {
                      signIn();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                    <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-colors" />
                  </div>
                  
                  <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                </div>
                
                <p className="text-center text-sm text-slate-600">
                  {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="font-medium text-brand-blue hover:text-blue-800"
                  >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
                
                {mode === 'signup' && (
                  <div className="mt-6 flex items-start gap-2 text-xs text-slate-500">
                    <Check className="w-4 h-4 text-brand-blue shrink-0" />
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
