
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, UserProfile, User } from './types';
import { apiService } from './services/apiService';
import { supabase } from './services/supabaseClient';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AIInsights from './components/AIInsights';
import Landing from './components/Landing';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    currency: '$',
    monthlyBudget: 3000,
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'insights' | 'add'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount using Supabase
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
        });
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [fetchedExpenses, fetchedProfile] = await Promise.all([
        apiService.getExpenses(),
        apiService.getProfile()
      ]);
      setExpenses(fetchedExpenses);
      setUserProfile(fetchedProfile);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setExpenses([]);
  };

  const handleAddExpense = async (data: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await apiService.addExpense(data);
      setExpenses(prev => [...prev, newExpense]);
    } catch (error) {
      alert("Error adding transaction");
    }
  };

  const handleUpdateExpense = async (data: Omit<Expense, 'id'>) => {
    if (!editingExpense) return;
    try {
      const updated = await apiService.updateExpense(editingExpense.id, data);
      setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
      setEditingExpense(null);
      setActiveTab('expenses');
    } catch (error) {
      alert("Error updating transaction");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      alert("Error deleting transaction");
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase">Connecting to Supabase...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 bg-slate-50">
      <Navbar 
        activeTab={activeTab === 'add' ? 'dashboard' : activeTab} 
        setActiveTab={(tab) => {
          setEditingExpense(null);
          setActiveTab(tab as any);
        }} 
        onLogout={handleLogout}
        user={user}
      />
      
      <button 
        onClick={() => { setEditingExpense(null); setActiveTab('add'); }}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center z-[60] active:scale-95 transition-transform"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" />
        </svg>
      </button>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Expense Overview'}
              {activeTab === 'expenses' && 'Transaction History'}
              {/* {activeTab === 'insights' && 'AI Financial Advisor'} */}
              {activeTab === 'add' && (editingExpense ? 'Edit Transaction' : 'New Transaction')}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'add' ? 'Update your database securely.' : `Welcome back, ${user.name}.`}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className={`space-y-8 ${activeTab === 'add' ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
            {activeTab === 'dashboard' && (
              <>
                <Dashboard expenses={expenses} profile={userProfile} />
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recent Spending</h2>
                    <button onClick={() => setActiveTab('expenses')} className="text-indigo-600 text-sm font-bold">See All</button>
                  </div>
                  <ExpenseList 
                    expenses={expenses.slice(-5)} 
                    onDelete={handleDeleteExpense} 
                    onEdit={handleEditClick} 
                  />
                </div>
              </>
            )}
            
            {activeTab === 'add' && (
              <div className="max-w-3xl mx-auto w-full">
                <div className={`bg-white rounded-3xl shadow-2xl p-8 border transition-all duration-300 ${editingExpense ? 'border-indigo-400' : 'border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${editingExpense ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white shadow-lg'}`}>
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">
                          {editingExpense ? 'Update Entry' : 'New Entry'}
                        </h2>
                        <p className="text-slate-400 text-sm font-medium">SECURE TRANSACTION</p>
                      </div>
                    </div>
                  </div>
                  <ExpenseForm 
                    onAdd={editingExpense ? handleUpdateExpense : handleAddExpense} 
                    initialData={editingExpense || undefined}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'expenses' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
                  <button 
                    onClick={() => { setEditingExpense(null); setActiveTab('add'); }}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 hover:scale-105 transition-all"
                  >
                    <span>+ New Record</span>
                  </button>
                </div>
                <ExpenseList 
                  expenses={expenses} 
                  onDelete={handleDeleteExpense} 
                  onEdit={handleEditClick} 
                />
              </div>
            )}

            {activeTab === 'insights' && (
              <AIInsights expenses={expenses} profile={userProfile} />
            )}
          </div>

          {activeTab !== 'add' && (
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Total Expense</h3>
                <p className="text-5xl font-black mt-4 tracking-tight">
                  {userProfile.currency + " "}
                  {expenses.reduce((acc, curr) => 
                    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
                  ).toLocaleString()}
                </p>
                <div className="mt-8 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Monthly Cap</span>
                  <span>{userProfile.currency}{userProfile.monthlyBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full mt-3 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (expenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0) / userProfile.monthlyBudget) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Security Log
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase">Supabase Sync Active</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Real-time Data Stream Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
