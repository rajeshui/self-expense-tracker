
import { Expense, UserProfile } from '../types';

const EXPENSES_KEY = 'zenspend_expenses';
const PROFILE_KEY = 'zenspend_profile';

export const storageService = {
  saveExpenses: (expenses: Expense[]) => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  },
  
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  }
};
