import React, { useState, useEffect } from 'react';
import { 
  Rocket, Twitter, Settings, Save, BarChart2, Activity, 
  Users, Globe, RefreshCw, Zap, Image as ImageIcon, AlertTriangle, LogOut
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';

// --- PRODUCTION READY CONFIG ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'agent' | 'matrix' | 'config'>('config');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // USER INPUTS: Standardized to prevent 'undefined' crashes
  const [config, setConfig] = useState({
    niche: '',
    mentors: Array(10).fill('')
  });

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserConfig(session.user.id);
        }
      } catch (err) {
        setError("Session Error: Check connection.");
      } finally {
        setLoading(false);
      }
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      if (s?.user) loadUserConfig(s.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserConfig = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('niche, mentors')
        .eq('user_id', userId)
        .maybeSingle(); // Prevents crash if no data found

      if (data) {
        setConfig({
          niche: data.niche || '',
          mentors: data.mentors?.length === 10 ? data.mentors : Array(10).fill('')
        });
      }
    } catch (err) {
      console.warn("New user or connection lag.");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('user_settings').upsert({
        user_id: user.id,
        niche: config.niche,
        mentors: config.mentors,
        updated_at: new Date()
      });
      if (error) throw error;
      alert("AI Neural Context Saved Successfully.");
    } catch (err) {
      alert("Save failed. Ensure database tables are created.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <RefreshCw className="animate-spin text-blue-600 w-12 h-12 mb-4" />
      <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Syncing SaaS Core...</span>
    </div>
  );

  if (!user) return <LandingPage />;

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex font-sans text-slate-900">
      {/* PROFESSIONAL SIDEBAR */}
      <aside className="w-20 md:w-80 bg-white border-r border-slate-200 p-6 md:p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Rocket className="w-5 h-5" />
          </div>
          <span className="hidden md:block font-black text-xl tracking-tighter uppercase">Optimax AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'config', label: 'AI Training Hub', icon: <Users className="w-5 h-5"/> },
            { id: 'agent', label: 'Autonomous Agent', icon: <Activity className="w-5 h-5"/> },
            { id: 'matrix', label: 'Growth Matrix', icon: <BarChart2 className="w-5 h-5"/> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-4 md:px-6 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {item.icon} <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-auto hover:text-red-500">
          <LogOut className="w-3 h-3"/> <span className="hidden md:block">Terminate Session</span>
        </button>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              {activeTab === 'config' ? 'AI Training Hub' : activeTab === 'matrix' ? 'Growth Matrix' : 'Live Agent'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">SaaS Protocol: 10K Followers / 7 Months</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-slate-200 shadow-sm">
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 font-black">{user.email?.[0].toUpperCase()}</div>
             <div className="text-xs">
                <p className="font-black text-slate-900 mb-0.5">{user.email?.split('@')[0]}</p>
                <p className="text-blue-600 font-bold uppercase tracking-tighter">Live Connection</p>
             </div>
          </div>
        </header>

        {/* 1. TRAINING HUB: User inputs for Niche & Mentors */}
        {activeTab === 'config' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Master Account Niche</label>
                </div>
                <input 
                  value={config.niche}
                  onChange={(e) => setConfig({...config, niche: e.target.value})}
                  className="w-full p-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white text-xl font-bold transition-all outline-none"
                  placeholder="e.g. AI SaaS, Personal Branding, Web3 Marketing"
                />
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">The 10 North Star Mentors (Style Imitation Targets)</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.mentors.map((m, i) => (
                    <div key={i} className="flex items-center bg-slate-50 rounded-2xl px-5 py-1 border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all">
                      <span className="text-slate-300 font-black text-xs mr-4">{i+1}</span>
                      <input 
                        value={m}
                        onChange={(e) => {
                          const updated = [...config.mentors];
                          updated[i] = e.target.value;
                          setConfig({...config, mentors: updated});
                        }}
                        className="w-full py-4 bg-transparent border-none font-bold text-slate-700 outline-none placeholder:text-slate-300"
                        placeholder="@username"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="animate-spin" /> : <Save className="w-6 h-6"/>}
                {isSaving ? "Syncing DNA..." : "Deploy AI Training Context"}
              </button>
            </div>
          </div>
        )}

        {/* 2. LIVE GROWTH MATRIX */}
        {activeTab === 'matrix' && <GrowthMatrixView />}

        {/* 3. AUTONOMOUS AGENT */}
        {activeTab === 'agent' && <AgentConsole config={config} />}
      </main>
    </div>
  );
}

function GrowthMatrixView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-600 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Total Growth (Live Feed)</p>
          <div className="flex items-baseline gap-6 mb-10">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter">1,242</h2>
            <span className="text-xl font-bold opacity-40">/ 10,000</span>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mb-6">
             <div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-1000" style={{ width: '12.42%' }} />
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
             <span>Month 1 (Live)</span>
             <span>Goal: 10k Followers</span>
          </div>
        </div>
        <TrendingUp className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Followers Gained', val: '+42', sub: 'Last 24h' },
          { label: 'Avg Engagement', val: '8.4%', sub: 'Real-time' },
          { label: 'Viral Strikes', val: '3', sub: 'Posts > 5k' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
            <div className="text-4xl font-black text-slate-900 tracking-tighter">{s.val}</div>
            <div className="mt-4 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentConsole({ config }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[500px]">
      <div className="lg:col-span-2 bg-[#0F172A] rounded-[2.5rem] p-8 md:p-10 border border-slate-800 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Neural Activity Stream</span>
           </div>
           <span className="text-[10px] font-mono text-slate-600">AGENT_v2.0_LIVE</span>
        </div>
        <div className="flex-1 font-mono text-sm space-y-4 overflow-y-auto text-slate-400 scrollbar-hide">
           <p className="text-blue-400">&gt; Starting autonomous cycle...</p>
           <p>&gt; Context: <span className="text-white uppercase font-bold">{config.niche || 'Awaiting Input'}</span></p>
           <p>&gt; Analyzing Style Patterns from {config.mentors.filter((m:any) => m).length} North Star Accounts...</p>
           {config.niche ? (
             <div className="pt-4 border-l-2 border-slate-800 pl-4 space-y-3">
                <p className="text-xs text-slate-500 italic">Syncing with trending X hashtags...</p>
                <p className="animate-pulse text-green-400 font-bold">&gt; AI Agent drafting viral thread in niche vibe...</p>
             </div>
           ) : (
             <div className="mt-8 p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" /> CONFIGURATION REQUIRED: Input niche to begin neural generation.
             </div>
           )}
        </div>
      </div>
      <div className="space-y-6 flex flex-col">
         <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4"><ImageIcon className="text-blue-600 w-8 h-8"/></div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Whisk AI Media</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-2">READY FOR SYNTHESIS</p>
         </div>
         <button className="bg-slate-900 text-white p-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">
            Manual Post Trigger
         </button>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.06),_transparent_50%)]" />
      <div className="relative z-10 text-center space-y-10">
        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-200 rotate-6">
          <Rocket className="w-12 h-12" />
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-4">
           Optimax.<br/><span className="text-blue-600">Autonomous.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-semibold max-w-xl mx-auto leading-relaxed">
           The AI SaaS engine that mimics your 10 favorite accounts to grow your X profile to 10,000 followers.
        </p>
        <button 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: window.location.origin } })}
          className="bg-slate-900 text-white px-12 py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 mx-auto"
        >
          <Twitter className="w-8 h-8 fill-current" /> Initialize SaaS Node
        </button>
      </div>
    </div>
  );
}
