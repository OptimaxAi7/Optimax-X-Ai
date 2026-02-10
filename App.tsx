import React, { useState, useEffect } from 'react';
import { Rocket, Twitter, Settings, Save, BarChart2, Activity, Users, Globe, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- STABLE PRODUCTION CONFIG ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('config');
  const [isSaving, setIsSaving] = useState(false);
  
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  const [userSettings, setUserSettings] = useState({
    niche: '',
    mentors: ['', '', '', '', '', '', '', '', '', ''] 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchSettings(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchSettings(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // UPDATED: Mapped to your 'user_ai_profiles' table columns
  const fetchSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_ai_profiles')
        .select('main_niche, mentor_handles')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setUserSettings({
          niche: data.main_niche || '',
          mentors: data.mentor_handles && data.mentor_handles.length === 10 
            ? data.mentor_handles 
            : ['', '', '', '', '', '', '', '', '', '']
        });
        if (data.main_niche) setHasSynced(true);
      }
    } catch (e) {
      console.error("Data Fetch Blocked:", e);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Saves to 'user_ai_profiles' with correct column names
  const saveToDatabase = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    
    const { error } = await supabase.from('user_ai_profiles').upsert({
      user_id: session.user.id,
      main_niche: userSettings.niche,
      mentor_handles: userSettings.mentors,
      ai_character: "Mimic-Agent-V1", // Required field from your SQL
      updated_at: new Date()
    });

    setIsSaving(false);
    if (!error) {
      setHasSynced(true);
      alert("SaaS AI Engine Updated.");
    } else {
      console.error("Save Error:", error);
      alert("Error saving context. Check your Supabase RLS policies.");
    }
  };

  const runAnalysis = async () => {
    const validMentors = userSettings.mentors.filter(m => m.trim() !== '');
    if (!userSettings.niche || validMentors.length < 3) {
      alert("Please provide your niche and at least 3 mentors to begin analysis.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisLog(["Initializing Analysis Engine...", "Establishing Neural Link to X handles..."]);

    try {
      // Points to your Netlify Function
      const response = await fetch('/api/analyze-mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          niche: userSettings.niche, 
          mentors: validMentors 
        }),
      });
      
      if (!response.ok) throw new Error("Engine timeout");
      
      setAnalysisLog(prev => [...prev, "Analyzing Writing Tones...", "Parsing Engagement Patterns...", "SUCCESS: Mimicry Profile Active."]);
    } catch (err) {
      setAnalysisLog(prev => [...prev, "ERROR: Analysis Interrupted. Check API connection."]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <RefreshCw className="animate-spin text-blue-600 w-12 h-12" />
      <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Authenticating SaaS Node...</p>
    </div>
  );

  if (!session) return <LandingPage />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-slate-900">
      <aside className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Rocket className="w-5 h-5" /></div>
          <span className="font-black text-2xl tracking-tighter uppercase">Optimax</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[{ id: 'config', icon: <Users/>, label: 'AI Training' }, { id: 'agent', icon: <Activity/>, label: 'Live Agent' }, { id: 'matrix', icon: <BarChart2/>, label: 'Growth Matrix' }].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-slate-900 text-white font-bold' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {item.icon} <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black text-slate-300 uppercase mt-auto hover:text-red-500">Sign Out</button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
           <h1 className="text-4xl font-black tracking-tight uppercase">Dashboard</h1>
           <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
             {session.user.email}
           </div>
        </header>

        {activeTab === 'config' && (
          <div className="max-w-4xl space-y-10 animate-in fade-in duration-700">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Globe className="w-4 h-4"/><span className="text-[10px] font-black uppercase tracking-widest">Target Niche</span>
              </div>
              <input 
                value={userSettings.niche}
                onChange={(e) => { setUserSettings({...userSettings, niche: e.target.value}); setHasSynced(false); }}
                placeholder="e.g. AI Automation, Tech Investing..."
                className="w-full p-6 bg-white border border-slate-200 rounded-3xl text-xl font-bold focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
              />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="w-4 h-4"/><span className="text-[10px] font-black uppercase tracking-widest">10 Mentors to Imitate</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {userSettings.mentors.map((m, i) => (
                  <div key={i} className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-1 shadow-sm">
                    <span className="text-slate-300 font-bold text-xs mr-4">{i+1}</span>
                    <input 
                      value={m}
                      onChange={(e) => {
                        const upd = [...userSettings.mentors];
                        upd[i] = e.target.value;
                        setUserSettings({...userSettings, mentors: upd});
                        setHasSynced(false);
                      }}
                      placeholder="@username"
                      className="w-full py-3 bg-transparent border-none font-bold text-slate-700 outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <button 
                onClick={saveToDatabase}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="animate-spin" /> : "1. Sync AI Settings"}
              </button>

              <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${hasSynced ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${hasSynced ? 'text-white' : 'text-slate-400'}`}>
                    <Activity className={`w-4 h-4 ${hasSynced ? 'text-blue-500' : 'text-slate-300'}`} /> Neural Analysis Log
                  </h3>
                  {isAnalyzing && <RefreshCw className="animate-spin text-blue-500 w-4 h-4" />}
                </div>
                
                <div className="font-mono text-[11px] text-slate-400 space-y-2 h-24 overflow-y-auto mb-6 bg-black/20 p-4 rounded-xl">
                  {analysisLog.length === 0 ? (
                    <p className="italic opacity-50">Awaiting sync... Save niche and mentors above to enable style extraction.</p>
                  ) : (
                    analysisLog.map((log, i) => (
                      <p key={i} className={log.includes('SUCCESS') ? 'text-green-400 font-bold' : ''}>&gt; {log}</p>
                    ))
                  )}
                </div>

                <button 
                  onClick={runAnalysis}
                  disabled={!hasSynced || isAnalyzing}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg ${hasSynced ? 'bg-white text-black hover:bg-blue-500 hover:text-white' : 'bg-slate-200 text-slate-400'}`}
                >
                  {isAnalyzing ? "Processing DNA..." : "2. Launch Style Extraction"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matrix' && <div className="p-20 text-center text-slate-300 font-black italic border-4 border-dashed border-slate-100 rounded-[3rem]">Live Matrix Feed Connecting via X API...</div>}
        {activeTab === 'agent' && <div className="p-20 text-center text-slate-300 font-black italic border-4 border-dashed border-slate-100 rounded-[3rem]">Agent Standby: Awaiting Style Profile...</div>}
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center p-8">
      <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-2xl rotate-3"><Rocket className="w-10 h-10" /></div>
      <h1 className="text-8xl font-black tracking-tighter mb-6 italic text-slate-900">Optimax.</h1>
      <p className="text-xl text-slate-400 font-medium mb-12 max-w-lg">Autonomous SaaS growth for X. Imitate the best. Become the biggest.</p>
      <button 
        onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter' })}
        className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-2xl flex items-center gap-4 shadow-2xl hover:bg-black transition-all"
      >
        <Twitter /> Login with X
      </button>
    </div>
  );
}
