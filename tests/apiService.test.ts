
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../services/apiService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('apiService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should fetch empty expenses initially', async () => {
    const expenses = await apiService.getExpenses();
    expect(expenses).toEqual([]);
  });

  it('should add a new expense', async () => {
    const newExpenseData = {
      amount: 50,
      description: 'Test Dinner',
      category: 'Food' as const,
      type: 'expense' as const,
      date: '2023-10-01'
    };

    const added = await apiService.addExpense(newExpenseData);
    expect(added.description).toBe('Test Dinner');
    expect(added.id).toBeDefined();

    const all = await apiService.getExpenses();
    expect(all.length).toBe(1);
    expect(all[0].amount).toBe(50);
  });
});
