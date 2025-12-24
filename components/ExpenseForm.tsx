
import React, { useState, useEffect } from 'react';
import { Category, Expense } from '../types';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => Promise<void> | void;
  initialData?: Expense;
}

const CATEGORIES: Category[] = [
  'Groceries', 'Utilities', 'Shopping', 'Food', 'Travel', 'Entertainment', 'Healthcare', 'Education', 'Income', 'Other'
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, initialData }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Groceries');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setCategory(initialData.category);
      setType(initialData.type);
      setDate(initialData.date);
    } else {
      setAmount('');
      setDescription('');
      setCategory('Groceries');
      setType('expense');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        amount: parseFloat(amount),
        description,
        category,
        type,
        date
      });

      if (!initialData) {
        setAmount('');
        setDescription('');
        setCategory('Food');
        setType('expense');
        setDate(new Date().toISOString().split('T')[0]);
        
        // Show success animation for new entries
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 rounded-2xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Transaction Saved!</h3>
          <p className="text-slate-500 mt-1">Database updated successfully</p>
          <button 
            type="button"
            onClick={() => setShowSuccess(false)}
            className="mt-6 text-indigo-600 font-bold text-sm"
          >
            Add Another Record
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Transaction Flow</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setType('expense'); if(category==='Income') setCategory('Food'); }}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${
                type === 'expense' 
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-400 grayscale hover:grayscale-0'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'expense' ? 'bg-rose-200' : 'bg-slate-100'}`}>
                ↑
              </div>
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory('Income'); }}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${
                type === 'income' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-400 grayscale hover:grayscale-0'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'income' ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                ↓
              </div>
              Income
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Amount</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xl group-focus-within:text-indigo-500 transition-colors">$</span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-2xl font-black text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Transaction Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Category</label>
            <div className="relative">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
              >
                {type === 'expense' 
                  ? CATEGORIES.filter(c => c !== 'Income').map(c => <option key={c} value={c}>{c}</option>)
                  : <option value="Income">Income / Salary</option>
                }
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Memo / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks, Monthly Rent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide transition-all shadow-xl disabled:opacity-50 ${
          initialData 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-1 active:translate-y-0' 
          : 'bg-slate-900 text-white hover:bg-black shadow-slate-200 hover:-translate-y-1 active:translate-y-0'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Syncing...</span>
          </div>
        ) : (
          initialData ? 'Update Record' : 'Save Transaction'
        )}
      </button>
    </form>
  );
};

export default ExpenseForm;
