
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';

interface LandingProps {
  onLogin: (user: User) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (data.user) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            avatar: `https://ui-avatars.com/api/${data.user.user_metadata?.full_name || data.user.email}`
          });
        }
      } else {
        // const { data, error: authError } = await supabase.auth.signUp({
        //   email,
        //   password,
        //   options: {
        //     data: {
        //       full_name: name,
        //     }
        //   }
        // });

        // if (authError) throw authError;
        // if (data.user) {
        //   alert("Account created! Please check your email for verification (if enabled) or sign in now.");
        //   setIsLogin(true);
        // }

        alert("Cannot sign up now! Please check with the administrator.");

      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-600/30 blur-[120px] rounded-full"></div>
      </div>

      <nav className="p-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">R</div>
          <span className="text-white text-2xl font-black tracking-tight">Expense tracker</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 text-sm font-bold">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            SUPABASE SECURE
          </span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 gap-12 md:gap-24 z-10">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Personal Wealth <br />
            <span className="text-indigo-500">Starts Here.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-8">
            Connected to your Supabase Cloud. Track your journey to financial freedom with AI-driven insights and real-time persistence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
              <span className="text-white text-xs font-bold">Cloud Sync</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              <span className="text-white text-xs font-bold">JWT Protected</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 blur-[60px] rounded-full"></div>
            
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                {isLogin ? 'Sign In' : 'Join Expense Tracker'}
              </h2>
              <p className="text-slate-500 font-medium">Use your Supabase credentials</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-2xl font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" 
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {isLogin ? 'Secure Sign In' : 'Create Secure Account'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-slate-400 font-bold hover:text-indigo-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-slate-500 text-xs font-medium">
            Managed by Supabase Auth Gateway.
          </p>
        </div>
      </main>

      <footer className="p-8 text-center z-10">
        <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">
          Cloud Infrastructure Enabled
        </p>
      </footer>
    </div>
  );
};

export default Landing;
