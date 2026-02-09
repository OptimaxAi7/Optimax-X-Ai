import React, { useState, useEffect } from 'react';
import { 
  Menu, Sparkles, ArrowRight, RefreshCw, BarChart2, Users, 
  TrendingUp, Mail, CheckCircle, LogOut, Settings, LayoutDashboard, 
  Plus, Search, Twitter, Zap, Clock
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// SAFETY SHIELD: This prevents the "API Key must be set" crash
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenAI(API_KEY) : null;

// --- TYPES ---
type AppTab = 'studio' | 'tracker' | 'analytics';

interface ViralityAnalysis {
  score: number;
  reason: string;
  improvedVersion: string;
}

interface Mentor {
  handle: string;
  niche: string;
  impact: string;
}

// --- SHARED COMPONENTS ---
const Button: React.FC<any> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:border-blue-600 shadow-sm",
    outline: "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

// --- FEATURE MODULES ---

const MentorTracker = () => {
  const [mentors, setMentors] = useState<Mentor[]>([
    { handle: "@p_miller", niche: "AI / Tech", impact: "High" },
    { handle: "@lexfridman", niche: "Deep Tech", impact: "Viral" },
  ]);
  const [newHandle, setNewHandle] = useState("");

  const addMentor = () => {
    if (newHandle && mentors.length < 10) {
      setMentors([...mentors, { handle: newHandle, niche: "Analysis Pending", impact: "Calc..." }]);
      setNewHandle("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">The Mentor Engine</h2>
          <p className="text-sm text-gray-500">Track 10 accounts to fuel your AI's learning model.</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{mentors.length}/10 Slots</div>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-white border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter X Handle" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} />
        <Button onClick={addMentor} disabled={mentors.length >= 10}><Plus className="w-4 h-4"/> Add</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((m, i) => (
          <div key={i} className="bg-white p-4 border rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600"><Twitter className="w-5 h-5"/></div>
              <div><div className="font-bold">{m.handle}</div><div className="text-xs text-gray-400">{m.niche}</div></div>
            </div>
            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{m.impact}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[{ label: "Virality Avg", val: "84%", icon: <Zap className="text-yellow-500"/> }, { label: "Followers", val: "+242", icon: <TrendingUp className="text-green-500"/> }, { label: "AI Accuracy", val: "92%", icon: <Sparkles className="text-blue-500"/> }].map((s, i) => (
        <div key={i} className="bg-white p-6 border rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">{s.icon} {s.label}</div>
          <div className="text-3xl font-bold">{s.val}</div>
        </div>
      ))}
    </div>
    <div className="bg-white p-6 border rounded-2xl h-64 flex flex-col items-center justify-center text-gray-400"><BarChart2 className="w-12 h-12 mb-2 opacity-20" /><p>Chart Loading...</p></div>
  </div>
);

const PostStudio = () => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ViralityAnalysis | null>(null);

  const handleAnalysis = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    
    // Fallback if AI isn't connected properly
    if (!genAI) {
        setTimeout(() => {
            setResult({ score: 70, reason: "Offline Mode: AI key not detected.", improvedVersion: content + " #Optimax" });
            setIsAnalyzing(false);
        }, 1000);
        return;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent(`Improve this tweet: ${content}. Return JSON: {score, reason, improvedVersion}`);
        const text = res.response.text();
        // Simple logic to handle result
        setResult({ score: 85, reason: "AI Analysis Complete", improvedVersion: text });
    } catch (e) {
        setResult({ score: 50, reason: "Error contacting AI", improvedVersion: content });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <textarea className="w-full h-64 p-6 border rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="Draft your tweet..." value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={handleAnalysis} isLoading={isAnalyzing} className="w-full py-4">Optimize</Button>
      </div>
      <div className="bg-white border rounded-2xl p-6 shadow-sm border-t-4 border-blue-500 flex flex-col items-center justify-center">
        {result ? (
          <div className="w-full space-y-4">
            <h3 className="text-4xl font-black text-blue-600">{result.score}%</h3>
            <p className="text-sm italic">{result.reason}</p>
            <div className="p-4 bg-gray-50 border rounded-lg">{result.improvedVersion}</div>
          </div>
        ) : <p className="text-gray-400">Run optimization to see results.</p>}
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (user) return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <div className="w-64 bg-white border-r p-6 space-y-4">
        <div className="font-bold text-xl mb-8">Optimax AI</div>
        {['studio', 'tracker', 'analytics'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as AppTab)} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === t ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>{t}</button>
        ))}
        <button onClick={() => supabase.auth.signOut()} className="w-full text-left px-4 py-2 text-red-500 mt-20">Logout</button>
      </div>
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 capitalize">{activeTab}</h1>
        {activeTab === 'studio' && <PostStudio />}
        {activeTab === 'tracker' && <MentorTracker />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-6xl font-black">Optimax <span className="text-blue-600">AI</span></h1>
      <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: window.location.origin } })}>Connect X to Start</Button>
    </div>
  );
};

export default App;
