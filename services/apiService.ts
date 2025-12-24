import { Expense, UserProfile } from '../types';
import { supabase } from './supabaseClient';

export const apiService = {
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }

    return data as Expense[];
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        ...expense,
        user_id: userId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw new Error(error.message);
    }

    return data as Expense;
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating expense:', error);
      throw new Error(error.message);
    }

    return data as Expense;
  },

  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      throw new Error(error.message);
    }
  },

  async getProfile(): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, currency, monthly_budget')
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    }

    return data ? {
      name: data.name,
      currency: data.currency,
      monthlyBudget: data.monthly_budget
    } : { name: 'User', currency: '$', monthlyBudget: 3000 };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    const dbUpdates = {
      name: updates.name,
      currency: updates.currency,
      monthly_budget: updates.monthlyBudget
    };

    // Check for existing profile row (handles UUID or numeric PKs)
    const { data: existing, error: selErr } = await supabase
      .from('profiles')
      .select('id')
      .maybeSingle();

    if (selErr) {
      console.error('Error checking profile existence:', selErr);
      throw new Error(selErr.message);
    }

    if (existing?.id) {
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw new Error(error.message);
      }
    } else {
      // Insert new profile row; let DB generate the primary key (UUID or numeric default)
      const { error } = await supabase
        .from('profiles')
        .insert(dbUpdates);

      if (error) {
        console.error('Error inserting profile:', error);
        throw new Error(error.message);
      }
    }
  }
};
