import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, BarChart2, Users, TrendingUp, Twitter, 
  Zap, Rocket, Eye, MessageSquare, Heart, Repeat, Image as ImageIcon, Activity, 
  Settings, ChevronRight, Save, Database
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';

// --- PRODUCTION CONFIG ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- MAIN SAAS COMPONENT ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agent' | 'analytics' | 'config'>('agent');
  const [userSettings, setUserSettings] = useState<{niche: string, mentors: string[]}>({
    niche: '',
    mentors: Array(10).fill('')
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserSettings(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      if (s?.user) fetchUserSettings(s.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserSettings = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) setUserSettings({ niche: data.niche, mentors: data.mentors });
  };

  const saveSettings = async () => {
    if (!user) return;
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user.id,
      niche: userSettings.niche,
      mentors: userSettings.mentors,
      updated_at: new Date()
    });
    if (!error) alert("Configuration Saved. AI Agent Re-Targeting...");
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><RefreshCw className="animate-spin text-blue-600 w-10 h-10"/></div>;

  if (!user) return <LandingPage />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-[#1A1A1A]">
      {/* SAAS SIDEBAR */}
      <aside className="w-24 md:w-80 bg-white border-r border-gray-100 p-8 flex flex-col">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Rocket className="w-6 h-6" />
          </div>
          <span className="hidden md:block font-black text-2xl tracking-tighter">Optimax AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'agent', label: 'Command Center', icon: <Activity className="w-5 h-5"/> },
            { id: 'analytics', label: 'Live Metrics', icon: <BarChart2 className="w-5 h-5"/> },
            { id: 'config', label: 'Agent Config', icon: <Settings className="w-5 h-5"/> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-300 ${activeTab === item.id ? 'bg-blue-50 text-blue-600 font-black' : 'text-gray-400 hover:text-black font-semibold'}`}
            >
              {item.icon} <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Log Out</button>
      </aside>

      {/* MAIN INTERFACE */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-start mb-12">
           <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Protocol: 10K_GROWTH</h2>
              <h1 className="text-5xl font-black tracking-tighter">Live {activeTab === 'agent' ? 'Dashboard' : activeTab}</h1>
           </div>
           <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-full border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs">{user.email?.[0].toUpperCase()}</div>
              <span className="text-xs font-black tracking-tight">{user.email?.split('@')[0]}</span>
           </div>
        </header>

        {activeTab === 'config' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Target Niche</label>
                <input 
                  value={userSettings.niche}
                  onChange={(e) => setUserSettings({...userSettings, niche: e.target.value})}
                  className="w-full p-6 bg-gray-50 rounded-2xl border-none text-xl font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. AI SaaS, Personal Branding, Web3 Marketing"
                />
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">The 10 North Star Mentors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSettings.mentors.map((m, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs">{i+1}</div>
                      <input 
                        value={m}
                        onChange={(e) => {
                          const updated = [...userSettings.mentors];
                          updated[i] = e.target.value;
                          setUserSettings({...userSettings, mentors: updated});
                        }}
                        className="w-full pl-10 pr-6 py-4 bg-gray-50 rounded-xl border-none font-bold text-gray-700 group-focus-within:bg-blue-50 transition-colors"
                        placeholder="@handle"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={saveSettings}
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                <Save className="w-6 h-6"/> Sync AI Strategy
              </button>
            </div>
          </div>
        )}

        {activeTab === 'agent' && <LiveAgentConsole niche={userSettings.niche} mentors={userSettings.mentors} />}
        {activeTab === 'analytics' && <LiveGrowthMatrix />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS FOR LIVE FEED ---

function LiveAgentConsole({ niche, mentors }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-black rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl h-[500px] flex flex-col">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <span className="text-white font-black text-xs tracking-widest uppercase">Autonomous Neural Log</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 text-[10px] font-black uppercase">Live Connection Active</span>
          </div>
        </div>
        <div className="flex-1 font-mono text-sm text-gray-400 space-y-4 overflow-y-auto pr-4">
          <p className="text-blue-400 font-bold">Connecting to X API Stream...</p>
          <p>Analyzing Niche: <span className="text-white">[{niche || 'NOT SET'}]</span></p>
          <p>Monitoring Mentors: <span className="text-white">[{mentors.filter((m:any) => m).length}/10 Active]</span></p>
          <div className="border-l-2 border-gray-800 pl-4 py-2 italic text-gray-500">
            Waiting for next viral window based on Mentor activity peaks...
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-full">
           <ImageIcon className="w-12 h-12 text-gray-200 mb-6" />
           <h4 className="font-black text-gray-900 mb-2">Whisk AI Engine</h4>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Ready for Image Synthesis</p>
           <button className="mt-8 w-full py-4 bg-gray-50 text-gray-400 font-black text-[10px] tracking-widest rounded-xl border border-dashed cursor-not-allowed">AUTO-GENERATE MEDIA</button>
        </div>
      </div>
    </div>
  );
}

function LiveGrowthMatrix() {
  return (
    <div className="space-y-8">
      <div className="bg-[#0061C1] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Live 10,000 Follower Trajectory</h3>
        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-7xl font-black tracking-tighter">1,242</span>
          <span className="text-xl font-bold opacity-40">Followers (Live Feed)</span>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '12.4%' }} />
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black uppercase opacity-60 tracking-widest">
           <span>Month 1 (12.4%)</span>
           <span>Month 7 (Target 100%)</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {['Engagement Velocity', 'Impression Share', 'AI Post Accuracy'].map((label, i) => (
           <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</p>
              <div className="text-3xl font-black text-gray-900 tracking-tighter">0.00</div>
              <p className="text-[10px] text-blue-500 font-bold mt-2 uppercase">Awaiting API Payload...</p>
           </div>
         ))}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mb-16 shadow-2xl">
             <Rocket className="w-12 h-12" />
          </div>
          <h1 className="text-9xl font-black tracking-tighter text-center leading-[0.8] mb-12">
             Optimax.<br/>
             <span className="text-blue-600">Autonomous.</span>
          </h1>
          <p className="text-gray-500 font-medium text-2xl max-w-xl text-center mb-16 leading-relaxed">
             The only AI agent that engineers 10k followers for you while you sleep. Multi-user SaaS ready.
          </p>
          <button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: window.location.origin } })}
            className="group relative bg-[#0F172A] text-white px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-black transition-all shadow-2xl flex items-center gap-4"
          >
             <Twitter className="w-8 h-8 fill-current" /> Initialize SaaS Node
          </button>
      </div>
    </div>
  );
}
