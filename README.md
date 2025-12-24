
# Expense Tracker (Supabase Edition)

A professional AI-driven expense tracker integrated with Supabase for cloud storage.

## 📁 Architecture
- **Frontend**: React 19 + Tailwind CSS.
- **Backend**: **Supabase** (PostgreSQL) for real-time cloud data management.
- **AI**: Google Gemini API for automated categorization and insights.

## 🚀 Supabase Setup

To use this app, you need to configure your Supabase project:

1.  **Create Tables**: In your Supabase SQL Editor, run:
    ```sql
    -- Expenses Table
    CREATE TABLE expenses (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL
    );

    -- Profiles Table
    CREATE TABLE profiles (
      id INTEGER PRIMARY KEY,
      name TEXT,
      currency TEXT,
      monthly_budget NUMERIC
    );
    ```
2.  **Update Tokens**: Open `services/supabaseClient.ts` and replace the placeholders with your project's URL and API Key from the Supabase Dashboard (Settings > API).

## 🛠️ Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🔒 Security
The app interacts directly with Supabase. For production use, ensure you enable **Row Level Security (RLS)** in the Supabase dashboard to protect your users' data.
