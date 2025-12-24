
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'expenses' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'expenses' | 'insights') => void;
  onLogout: () => void;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'expenses', label: 'History', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'insights', label: 'Advisor', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 p-8 z-50">
        <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">R</div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 leading-tight tracking-tight">RSD Tracker</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Family Expenses</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white font-bold shadow-xl shadow-slate-200' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold'
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <img src={user.avatar} className="w-10 h-10 rounded-xl bg-white border border-slate-200" alt="Avatar" />
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Vault Secure</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-100 text-slate-400 text-xs font-black hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              SIGN OUT
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center p-4 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-indigo-50' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
              </svg>
            </div>
          </button>
        ))}
        <button 
          onClick={onLogout}
          className="p-2 text-rose-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      </nav>
    </>
  );
};

export default Navbar;