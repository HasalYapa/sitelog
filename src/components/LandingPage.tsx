import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tractor, Shield, Zap, Image as ImageIcon, BarChart3, Users, Clock, Terminal, ChevronRight } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const features = [
    {
      title: 'Real-time Daily Logs',
      description: 'Capture critical site activities, milestones, and issues as they happen.',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Workforce Tracking',
      description: 'Monitor daily attendance and categorize your manpower seamlessly.',
      icon: Users,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Machinery Status',
      description: 'Track running hours and operational status of heavy equipment.',
      icon: Tractor,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Visual Progress',
      description: 'Upload and organize site photos to visually document your project.',
      icon: ImageIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Advanced Reporting',
      description: 'Export professional PDF reports structured for stakeholders.',
      icon: BarChart3,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensuring your site data is always protected.',
      icon: Shield,
      color: 'bg-slate-100 text-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 font-sans selection:bg-brand-blue/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#020817]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue p-2 rounded-xl">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">SiteLog Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => openAuth('signin')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => openAuth('signup')}
              className="px-5 py-2.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Start for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', backgroundSize: '4rem 4rem', maskImage: 'radial-gradient(circle at center, black, transparent 80%)', opacity: 0.2 }} />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-brand-orange" />
              <span>The #1 rated platform for construction sites</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white mb-8 leading-[1.1]"
          >
            Manage your site.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Without the chaos.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SiteLog Pro replaces messy spreadsheets and paper notes with an elegant, centralized dashboard for daily logs, workforce tracking, and machinery management.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-brand-blue text-white rounded-xl font-medium text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-xl font-medium text-lg hover:bg-slate-700 transition-colors flex items-center justify-center"
            >
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Interface Preview */}
      <section className="max-w-6xl mx-auto px-6 relative z-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-slate-900/50 p-2 sm:p-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="rounded-xl overflow-hidden border border-white/5 relative bg-slate-50">
            {/* Fake UI Header */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-500 font-medium flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                <span>sitelog.pro/dashboard</span>
              </div>
            </div>
            {/* Highly realistic UI preview */}
            <div className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-stretch">
               {/* Sidebar Preview */}
               <div className="w-48 shrink-0 hidden md:flex flex-col gap-1 border-r border-slate-200 pr-4">
                  <div className="px-3 py-2 bg-orange-50 text-brand-orange text-sm font-medium rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Home
                  </div>
                  <div className="px-3 py-2 text-slate-600 text-sm font-medium rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Daily Logs
                  </div>
                  <div className="px-3 py-2 text-slate-600 text-sm font-medium rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    Workforce
                  </div>
                  <div className="px-3 py-2 text-slate-600 text-sm font-medium rounded-md flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Machinery
                  </div>
               </div>
               
               {/* Main Dashboard Area Preview */}
               <div className="flex-1 flex flex-col gap-4">
                 <div className="flex items-end justify-between">
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight">Project Overview</h3>
                     <p className="text-xs text-slate-500 mt-1">Monitor real-time status and logs.</p>
                   </div>
                   <div className="px-3 py-1.5 bg-brand-blue text-white text-xs font-medium rounded-lg shadow-sm">
                     + New Log
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
                     <div className="text-xs font-medium text-slate-500 mb-1">Total Workers</div>
                     <div className="text-2xl font-bold text-slate-900">142</div>
                     <div className="text-[10px] font-medium text-emerald-600 mt-2 bg-emerald-50 w-max px-1.5 py-0.5 rounded">↑ 12% today</div>
                   </div>
                   <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
                     <div className="text-xs font-medium text-slate-500 mb-1">Active Machinery</div>
                     <div className="text-2xl font-bold text-slate-900">8 / 12</div>
                     <div className="text-[10px] font-medium text-amber-600 mt-2 bg-amber-50 w-max px-1.5 py-0.5 rounded">4 under maintenance</div>
                   </div>
                   <div className="bg-gradient-to-br from-brand-blue to-blue-800 rounded-xl p-4 shadow-sm text-white flex gap-3 items-center">
                     <svg className="w-10 h-10 text-amber-300 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.883 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.59-1.59zM6.166 18.883a.75.75 0 10-1.06-1.06l-1.59 1.591a.75.75 0 001.061 1.06l1.59-1.59zM18.883 17.823a.75.75 0 01-1.06 1.06l-1.591-1.59a.75.75 0 111.06-1.061l1.59 1.59zM6.166 5.106a.75.75 0 01-1.06 1.06L3.515 4.576a.75.75 0 111.061-1.06l1.59 1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM5.25 12a.75.75 0 01-.75.75H2.25a.75.75 0 010-1.5H4.5a.75.75 0 01.75.75zM12 21.75a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0V21a.75.75 0 01-.75.75z"/></svg>
                     <div>
                       <div className="text-2xl font-bold">28°C</div>
                       <div className="text-xs text-blue-200 mt-0.5">Clear sky</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mt-2 relative">
                    <div className="text-sm font-bold text-slate-900 mb-4 border-l-4 border-brand-orange pl-3">Recent Progress</div>
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-100 group cursor-pointer">
                      <img src="https://picsum.photos/seed/construction/800/400" alt="Site Progress" referrerPolicy="no-referrer" className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3 pt-8">
                        <div className="text-xs font-medium text-white">Foundation poured successfully</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">Today, 2:30 PM by Sarah Jenkins</div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Built for precision.</h2>
            <p className="text-lg text-slate-400">Everything you need to orchestrate your construction site, elegantly wrapped in a blazingly fast interface.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 \${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-[#020817] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Trusted by industry leaders.</h2>
            <p className="text-lg text-slate-400">See what construction professionals are saying about SiteLog Pro.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Jenkins", role: "Project Manager", company: "BuildRight Constructors", quote: "SiteLog Pro has completely transformed how we manage our daily reports. We save at least two hours a day on admin work." },
              { name: "David Chen", role: "Site Superintendent", company: "Apex Developments", quote: "The machinery tracking alone paid for itself in the first week. We no longer guess when equipment needs maintenance." },
              { name: "Michael Rossi", role: "Operations Director", company: "Skyline Builders", quote: "Generating PDF reports for our stakeholders used to be a Friday nightmare. Now it takes exactly three clicks." }
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
              >
                <div className="flex text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 border-t border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-slate-400">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 lg:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-400 mb-6">Perfect for small residential projects.</p>
              <div className="mb-8">
                <span className="text-5xl font-display font-bold text-white">$0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 active project', 'Basic daily logs', 'Up to 5 team members', '7-day photo retention'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAuth('signup')} className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">
                Start Free
              </button>
            </motion.div>
            
            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-b from-brand-blue/20 to-slate-800/50 border border-brand-blue/50 rounded-3xl p-8 lg:p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">Most Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-blue-200 mb-6">For commercial construction teams.</p>
              <div className="mb-8">
                <span className="text-5xl font-display font-bold text-white">$49</span>
                <span className="text-blue-200/70">/ month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited projects', 'Advanced reporting & exports', 'Unlimited team members', 'Unlimited photo retention', 'Priority support'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-100">
                    <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => openAuth('signup')} className="w-full py-3 px-4 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-blue/25">
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-brand-blue to-indigo-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to upgrade your site?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">Join thousands of project managers who have abandoned paper logs for SiteLog Pro.</p>
              <button 
                onClick={() => openAuth('signup')}
                className="px-8 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:scale-105 transition-transform"
              >
                Start using SiteLog Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-20 pb-10 relative z-10 bg-[#020817]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-brand-blue p-2 rounded-xl inline-flex">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white">SiteLog Pro</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The modern operating system for construction sites. Manage your workforce, track machinery, and generate daily logs with unparalleled precision.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-current" style={{ maskImage: social === 'Twitter' ? 'url("data:image/svg+xml,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\'%3E%3Cpath d=\\\'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\\\'/%3E%3C/svg%3E")' : social === 'LinkedIn' ? 'url("data:image/svg+xml,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\'%3E%3Cpath d=\\\'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\\\'/%3E%3C/svg%3E")' : 'url("data:image/svg+xml,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\'%3E%3Cpath d=\\\'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z\\\'/%3E%3C/svg%3E")', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', backgroundColor: 'currentColor' }} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Integrations', 'Pricing', 'Changelog', 'Docs'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-brand-blue transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-brand-blue transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 tracking-tight">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-brand-blue transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} SiteLog Pro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600 text-sm flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> All systems operational</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Popup */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  );
}
