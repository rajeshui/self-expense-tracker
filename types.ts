
export type Category = 
  | 'Food' 
  | 'Travel' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Shopping' 
  | 'Healthcare' 
  | 'Education' 
  | 'Income'
  | 'Groceries' 
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface AIInsight {
  summary: string;
  suggestions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  topCategories: { category: string; percentage: number }[];
}

export interface UserProfile {
  name: string;
  currency: string;
  monthlyBudget: number;
}
