
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Expense, UserProfile } from '../types';

interface DashboardProps {
  expenses: Expense[];
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, profile }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayExpenses = expenses
        .filter(e => e.date === date && e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
      const dayIncome = expenses
        .filter(e => e.date === date && e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        name: date.split('-').slice(1).join('/'),
        spent: dayExpenses,
        earned: dayIncome
      };
    });
  }, [expenses]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    expenses
      .filter(e => e.type === 'expense')
      .forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
      });

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const totalSpent = useMemo(() => categoryData.reduce((acc, curr) => acc + curr.value, 0), [categoryData]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Spending Flow</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">7 Day Trend</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${profile.currency}${value.toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Spending Mix</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Donut</span>
          </div>
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-xl font-bold text-slate-900">{profile.currency}{totalSpent.toLocaleString()}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [`${profile.currency}${value.toLocaleString()}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Daily Balance Analysis</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Income vs Expense</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f8fafc'}}
              />
              <Bar dataKey="spent" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} name="Spent" />
              <Bar dataKey="earned" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} name="Earned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
