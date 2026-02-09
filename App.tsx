import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, BarChart2, Users, TrendingUp, Twitter, 
  Zap, Rocket, Eye, MessageSquare, Heart, Repeat, Image as ImageIcon, Activity, 
  ShieldCheck, Moon, Sun, Globe
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- AUTONOMOUS AGENT LOGIC ---
const IS_SLEEP_TIME = new Date().getHours() < 6; // Human-like rest period (12am-6am)

const AutonomousCommand = () => {
  const [logs, setLogs] = useState([
    "System: Optimax OS v2.0 Initialized",
    "Analysis: Scanning 10 Mentor Profiles...",
    "Strategy: Identifying viral patterns in 'AI & Tech' niche",
    "Trend: #AIAgents detected as high-velocity keyword"
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* AI TERMINAL */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0A0A0B] rounded-[2rem] p-8 border border-gray-800 shadow-2xl overflow-hidden relative">
          <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="ml-4 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Neural Activity Log</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {IS_SLEEP_TIME ? <><Moon className="w-3 h-3"/> HUMAN REST MODE ACTIVE</> : <><Sun className="w-3 h-3"/> ACTIVE OPS</>}
             </div>
          </div>
          
          <div className="font-mono text-sm space-y-3 h-[300px] overflow-y-auto scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-gray-600 shrink-0">0{i+1}</span>
                <span className={log.startsWith('Trend') ? 'text-blue-400' : 'text-gray-300'}>{log}</span>
              </div>
            ))}
            <div className="flex gap-4 animate-pulse">
               <span className="text-gray-600 italic">...</span>
               <span className="text-blue-500">Optimax is synthesizing next viral thread...</span>
            </div>
          </div>
        </div>

        {/* INTERACTION HUB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Auto-Comment', icon: <MessageSquare className="w-5 h-5"/>, color: 'text-blue-500' },
             { label: 'Trend Hijack', icon: <Zap className="text-yellow-500 w-5 h-5"/>, color: 'text-yellow-500' },
             { label: 'Whisk AI Gen', icon: <ImageIcon className="w-5 h-5"/>, color: 'text-purple-500' },
             { label: 'Growth Scan', icon: <Activity className="w-5 h-5"/>, color: 'text-green-500' }
           ].map((btn, i) => (
             <button key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left space-y-3 group">
                <div className={`p-3 rounded-2xl bg-gray-50 w-fit group-hover:bg-white transition-colors`}>{btn.icon}</div>
                <div className="text-xs font-black text-gray-900 uppercase tracking-tighter">{btn.label}</div>
             </button>
           ))}
        </div>
      </div>

      {/* WHISK AI PREVIEW CARD */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Media Synthesis</h3>
           <ImageIcon className="text-gray-300 w-5 h-5" />
        </div>
        <div className="flex-1 rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-blue-200 transition-colors">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
               <Rocket className="text-blue-500 w-8 h-8" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Waiting for Prompt</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-tighter">Whisk AI Bridge Offline</p>
        </div>
        <button className="mt-8 w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs tracking-[0.1em] shadow-xl hover:bg-black transition-all">
          TRIGGER AUTO-POST
        </button>
      </div>
    </div>
  );
};

// --- GROWTH ANALYTICS (10K PATH) ---
const GrowthAnalytics = () => (
  <div className="space-y-8">
     <div className="bg-[#0061C1] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="relative z-10">
           <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Growth Progress</p>
           <h2 className="text-6xl font-black tracking-tighter mb-8">1,242 <span className="text-xl font-medium opacity-50">/ 10,000</span></h2>
           <div className="w-full h-3 bg-white/10 rounded-full mb-4">
              <div className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ width: '12.4%' }} />
           </div>
           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
              <span>Month 1 (Current)</span>
              <span>Month 7 (Target)</span>
           </div>
        </div>
        <Globe className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10" />
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Follower Velocity', val: '+42', sub: 'Last 24h', icon: <TrendingUp/> },
          { label: 'Engagement Rate', val: '8.4%', sub: 'Niche Avg: 2.1%', icon: <Heart/> },
          { label: 'Viral Hits', val: '3', sub: 'Posts > 10k Impr', icon: <Zap/> }
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{s.val}</p>
                <p className="text-[10px] font-bold text-green-500 mt-2">{s.sub}</p>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl text-blue-600">{s.icon}</div>
          </div>
        ))}
     </div>
  </div>
);

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'agent' | 'analytics' | 'mentors'>('agent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-blue-600"/></div>;

  if (user) return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-[#1A1A1A]">
      {/* MINIMALIST SIDEBAR */}
      <aside className="w-24 md:w-80 bg-white border-r border-gray-100 p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <Rocket className="w-6 h-6" />
          </div>
          <span className="hidden md:block font-black text-2xl tracking-tighter">Optimax.</span>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'agent', label: 'Command Center', icon: <Activity className="w-5 h-5"/> },
            { id: 'analytics', label: 'Growth Matrix', icon: <BarChart2 className="w-5 h-5"/> },
            { id: 'mentors', label: 'Mentor Feed', icon: <Users className="w-5 h-5"/> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-300 ${activeTab === item.id ? 'bg-[#F1F5F9] text-black font-black' : 'text-gray-400 hover:text-black font-semibold'}`}
            >
              {item.icon} <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Terminate Session</button>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-16">
           <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Protocol: 10K_GROWTH_V2</h2>
              <h1 className="text-5xl font-black tracking-tighter">Autonomous {activeTab === 'agent' ? 'Agent' : activeTab}</h1>
           </div>
           <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">{user.email?.[0]}</div>
              <span className="text-xs font-black tracking-tight">{user.user_metadata?.full_name || 'User.Alpha'}</span>
           </div>
        </header>

        {activeTab === 'agent' && <AutonomousCommand />}
        {activeTab === 'analytics' && <GrowthAnalytics />}
        {activeTab === 'mentors' && <div className="p-20 text-center border-4 border-dashed border-gray-50 rounded-[3rem] text-gray-300 font-black italic">Awaiting Mentor Input (1/10)</div>}
      </main>
    </div>
  );

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 overflow-hidden relative">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
       </div>

       <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white mb-12 shadow-2xl scale-110">
             <Rocket className="w-10 h-10" />
          </div>
          <h1 className="text-8xl font-black tracking-tighter text-center leading-[0.8] mb-8">
             Grow <span className="text-blue-600 italic">Fast.</span><br/>
             Stay <span className="text-gray-300">Quiet.</span>
          </h1>
          <p className="text-gray-500 font-medium text-xl max-w-lg text-center mb-12">
             The autonomous social engine designed to hit 10k followers in 7 months. No manual posting required.
          </p>
          <button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: window.location.origin } })}
            className="group relative bg-[#0F172A] text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl flex items-center gap-4"
          >
             <Twitter className="w-6 h-6 fill-current" /> Initialize Autonomous Agent
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
          </button>
       </div>
    </div>
  );
};

export default App;
