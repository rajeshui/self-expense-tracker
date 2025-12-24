
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, UserProfile, AIInsight } from '../types';

interface AIInsightsProps {
  expenses: Expense[];
  profile: UserProfile;
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses, profile }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    if (expenses.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // Initialize the AI client with the system-provided API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze my spending for the last month. Expenses: ${JSON.stringify(expenses)}. Budget: ${profile.monthlyBudget}. Provide a summary, 3 actionable suggestions, risk level, and top 3 categories by percentage.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskLevel: { type: Type.STRING },
              topCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    percentage: { type: Type.NUMBER }
                  }
                }
              }
            },
            required: ["summary", "suggestions", "riskLevel", "topCategories"]
          }
        }
      });

      // Correctly access the .text property and trim before parsing as per SDK guidelines
      const jsonStr = response.text?.trim();
      if (!jsonStr) {
        throw new Error("Received an empty response from the AI model.");
      }
      
      const data = JSON.parse(jsonStr);
      setInsight(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI insights. Please check your data and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 3) {
      generateInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">AI Spending Analysis</h2>
          <p className="text-slate-500 text-sm">Personalized advice based on your history.</p>
        </div>
        <button 
          onClick={generateInsights}
          disabled={loading || expenses.length < 3}
          className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {expenses.length < 3 && !loading && (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Add at least 3 transactions to unlock AI insights.</p>
        </div>
      )}

      {loading && (
        <div className="p-12 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {insight && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Executive Summary</h4>
                <p className="text-slate-600 leading-relaxed">{insight.summary}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-4">Risk Level</h4>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                insight.riskLevel === 'low' ? 'bg-emerald-500' :
                insight.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
              }`}></div>
              <span className="capitalize font-bold text-slate-700">{insight.riskLevel} Risk</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Based on current budget utilization and category distribution.</p>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-4">Top Spending Categories</h4>
            <div className="space-y-4">
              {insight.topCategories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{cat.category}</span>
                    <span className="text-slate-500">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 bg-indigo-600 p-6 rounded-2xl shadow-xl text-white">
            <h4 className="font-bold text-lg mb-4">Action Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {insight.suggestions.map((s, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <span className="text-2xl mb-2 block">💡</span>
                  <p className="text-sm font-medium leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
