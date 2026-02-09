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

  // CRITICAL: Initialize with hardcoded empty values to prevent "undefined" map errors
  const [userSettings, setUserSettings] = useState({
    niche: '',
    mentors: ['', '', '', '', '', '', '', '', '', ''] 
  });

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchSettings(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchSettings(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('niche, mentors')
        .eq('user_id', userId)
        .maybeSingle(); // This is the safety valve: it returns null instead of crashing if no data exists

      if (data) {
        setUserSettings({
          niche: data.niche || '',
          mentors: data.mentors && data.mentors.length === 10 ? data.mentors : ['', '', '', '', '', '', '', '', '', '']
        });
      }
    } catch (e) {
      console.error("Data Fetch Blocked:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    const { error } = await supabase.from('user_settings').upsert({
      user_id: session.user.id,
      niche: userSettings.niche,
      mentors: userSettings.mentors,
      updated_at: new Date()
    });
    setIsSaving(false);
    if (!error) alert("SaaS AI Engine Updated.");
    else alert("Error saving. Ensure table 'user_settings' exists in Supabase.");
  };

  // --- RENDERING GUARDS ---
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <RefreshCw className="animate-spin text-blue-600 w-12 h-12" />
      <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Authenticating SaaS Node...</p>
    </div>
  );

  if (!session) return <LandingPage />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-slate-900">
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
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
                onChange={(e) => setUserSettings({...userSettings, niche: e.target.value})}
                placeholder="e.g. AI Automation, Tech Investing..."
                className="w-full p-6 bg-white border border-slate-200 rounded-3xl text-xl font-bold focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="w-4 h-4"/><span className="text-[10px] font-black uppercase tracking-widest">10 Mentors to Imitate (X Usernames)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {userSettings.mentors.map((m, i) => (
                  <div key={i} className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-1">
                    <span className="text-slate-300 font-bold text-xs mr-4">{i+1}</span>
                    <input 
                      value={m}
                      onChange={(e) => {
                        const upd = [...userSettings.mentors];
                        upd[i] = e.target.value;
                        setUserSettings({...userSettings, mentors: upd});
                      }}
                      placeholder="@username"
                      className="w-full py-3 bg-transparent border-none font-bold text-slate-700 outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            <button 
              onClick={saveToDatabase}
              className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              {isSaving ? <RefreshCw className="animate-spin" /> : "Sync AI Settings"}
            </button>
          </div>
        )}

        {activeTab === 'matrix' && <div className="p-20 text-center text-slate-300 font-black italic border-4 border-dashed border-slate-100 rounded-[3rem]">Live Matrix Feed Connecting via X API...</div>}
        {activeTab === 'agent' && <div className="p-20 text-center text-slate-300 font-black italic border-4 border-dashed border-slate-100 rounded-[3rem]">Agent Standby: Awaiting Configuration...</div>}
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
