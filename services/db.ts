
import Dexie, { type Table } from 'dexie';
import { Expense, UserProfile } from '../types';

// Use a class-based approach for proper type inheritance and method availability in Dexie
class RSDDatabase extends Dexie {
  expenses!: Table<Expense, string>;
  profile!: Table<UserProfile & { id: number }, number>;

  constructor() {
    super('rsd_spend_db');
    
    // Schema definition - calling the version method on the instance during construction
    this.version(1).stores({
      expenses: 'id, date, category, type', // Primary key and indexes
      profile: 'id' // Primary key for single row profile
    });
  }
}

// Instantiate the database
const db = new RSDDatabase();

export { db };
