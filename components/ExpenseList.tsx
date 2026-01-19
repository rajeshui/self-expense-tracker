
import React, { useState } from 'react';
import { Category, Expense } from '../types';
import { CATEGORIES } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
  const [expensesState, setExpenses] = useState<Expense[]>(expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredExpenses = selectedCategory
    ? expensesState.filter(expense => expense.category === selectedCategory)
    : expensesState;

  const handleSortChange = (eventValue: string) => {
    if (eventValue === 'date') {
      const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setExpenses(sortedExpenses);
      return;
    } else if (eventValue === 'amount') {
      const sortedExpenses = [...filteredExpenses].sort((a, b) => a.amount - b.amount);
      setExpenses(sortedExpenses);
      return;
    }
  }
  const handleCategoryFilterChange = (category: string | null) => {
    setSelectedCategory(category as Category | null); // Convert string to Category type
  };
  
  if (expensesState.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">Clear as a whistle</p>
        <p className="text-slate-400 text-sm">You haven't added any transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4 ml-8 float-left">
        <p className="text-slate-500 font-medium text-sm">Sort by:</p>
        <select name="sort" className="m-4 p-2 border border-slate-200 rounded-lg" onChange={(e) => handleSortChange(e.target.value)}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4 float-right">
        <p className="text-slate-500 font-medium text-sm">Filter by category:</p>
        <select name="category" value={selectedCategory ? selectedCategory : ""} onChange={(e) => handleCategoryFilterChange(e.target.value as Category)} className="m-4 p-2 border border-slate-200 rounded-lg">
          <option value="">All</option>
          {CATEGORIES.map((category: Category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredExpenses.slice().reverse().map((expense) => (
            <tr key={expense.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">{expense.description}</p>
                <p className={`text-[10px] font-bold uppercase ${expense.type === 'income' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {expense.type}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 text-xs font-medium text-slate-500">{expense.date}</td>
              <td className={`px-6 py-4 text-sm font-bold text-right ${expense.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
