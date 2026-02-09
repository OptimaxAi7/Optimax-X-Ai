import React, { useState, useEffect } from 'react';
import { 
  Menu, Sparkles, ArrowRight, RefreshCw, BarChart2, Users, 
  TrendingUp, Mail, CheckCircle, LogOut, Settings, LayoutDashboard, 
  Plus, Search, Twitter, Zap, Clock, ShieldCheck, Rocket
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// --- COMPONENTS ---

const Button: React.FC<any> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 border-transparent",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm",
    outline: "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };
  return (
    <button className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};

// --- FEATURE: MENTOR TRACKER ---
const MentorTracker = () => {
  const [mentors, setMentors] = useState<Mentor[]>([
    { handle: "@p_miller", niche: "AI / Tech", impact: "High" },
    { handle: "@lexfridman", niche: "Deep Tech", impact: "Viral" },
  ]);
  const [newHandle, setNewHandle] = useState("");

  const addMentor = () => {
    if (newHandle && mentors.length < 10) {
      setMentors([...mentors, { handle: newHandle, niche: "Pending", impact: "..." }]);
      setNewHandle("");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Mentor Intelligence</h2>
          <p className="text-gray-500">Track up to 10 viral accounts to train your AI model.</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold tracking-wide">
          {mentors.length} / 10 SLOTS USED
        </div>
      </div>

      <div className="flex gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 flex items-center gap-3 px-2">
          <Search className="w-5 h-5 text-gray-400"/>
          <input 
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium" 
            placeholder="Enter X Handle (e.g. @elonmusk)"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
          />
        </div>
        <Button onClick={addMentor} disabled={!newHandle || mentors.length >= 10} className="py-2 px-4 text-sm">
          <Plus className="w-4 h-4"/> Add Mentor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((m, i) => (
          <div key={i} className="bg-white p-5 border border-gray-100 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-50 transition-colors">
                <Twitter className="w-6 h-6"/>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{m.handle}</div>
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">{m.niche}</div>
              </div>
            </div>
            <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              {m.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FEATURE: ANALYTICS ---
const AnalyticsView = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: "Virality Score", val: "84%", sub: "+12% this week", icon: <Zap className="text-yellow-500 w-6 h-6"/> },
        { label: "Follower Velocity", val: "+242", sub: "Users / day", icon: <TrendingUp className="text-green-500 w-6 h-6"/> },
        { label: "AI Accuracy", val: "92.1%", sub: "Prediction rate", icon: <Sparkles className="text-blue-500 w-6 h-6"/> }
      ].map((s, i) => (
        <div key={i} className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl">{s.icon}</div>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">↑ 4.2%</span>
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{s.val}</div>
          <div className="text-sm text-gray-500 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
    
    <div className="bg-white p-10 border border-gray-100 rounded-3xl min-h-[300px] flex flex-col items-center justify-center text-gray-400 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <BarChart2 className="w-10 h-10 opacity-20" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Growth Chart Loading</h3>
      <p className="max-w-xs mx-auto mt-2">We are gathering enough data points to plot your velocity curve.</p>
    </div>
  </div>
);

// --- FEATURE: POST STUDIO (AI) ---
const PostStudio = () => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ViralityAnalysis | null>(null);

  const handleAnalysis = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      // Mock Fallback so UI works even without key
      setTimeout(() => {
         setResult({ 
           score: 72, 
           reason: "Note: API Key missing. Showing Demo Mode results. The hook needs more emotional urgency.", 
           improvedVersion: "🚀 " + content + " \n\n#Optimax #Growth" 
         });
         setIsAnalyzing(false);
      }, 1500);
      return;
    }

    try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent(`Analyze this tweet for virality (0-100) and rewrite it to be more engaging. Tweet: "${content}". Return STRICT JSON: { "score": number, "reason": "string", "improvedVersion": "string" }`);
        const text = res.response.text();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const json = JSON.parse(cleanText);
        setResult(json);
    } catch (e) {
        console.error("AI Error:", e);
        setResult({ score: 50, reason: "Connection error. Try again.", improvedVersion: content });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6">
        <div className="bg-white p-6 border border-gray-200 rounded-3xl shadow-sm focus-within:ring-4 focus-within:ring-blue-100 transition-all">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Draft Input</label>
          <textarea 
            className="w-full h-64 outline-none text-xl text-gray-900 placeholder-gray-300 resize-none font-medium leading-relaxed"
            placeholder="What's on your mind? Type here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Button onClick={handleAnalysis} isLoading={isAnalyzing} className="w-full py-4 text-lg shadow-blue-200">
          <Sparkles className="w-5 h-5" /> Optimize for Virality
        </Button>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-3xl p-8 relative overflow-hidden">
        {result ? (
          <div className="relative z-10 space-y-6">
            <div className="flex items-end justify-between border-b border-blue-100 pb-6">
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Virality Score</p>
                <h3 className="text-6xl font-black text-blue-600 tracking-tighter">{result.score}</h3>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.score > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {result.score > 80 ? 'VIRAL POTENTIAL' : 'NEEDS WORK'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">AI Analysis</p>
              <p className="text-gray-700 italic leading-relaxed">"{result.reason}"</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
              <p className="text-xs font-bold text-blue-500 mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 fill-current"/> OPTIMIZED VERSION
              </p>
              <p className="text-lg font-medium text-gray-900">{result.improvedVersion}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <Button variant="secondary" onClick={() => setContent(result.improvedVersion)}>Apply Edit</Button>
               <Button className="bg-black text-white hover:bg-gray-800 shadow-none"><Twitter className="w-4 h-4"/> Post Now</Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
             <Rocket className="w-16 h-16 text-blue-300 mb-6" />
             <h4 className="text-xl font-bold text-blue-900 mb-2">AI Standby</h4>
             <p className="text-blue-700">Enter your content and hit Optimize to activate the prediction engine.</p>
          </div>
        )}
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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'twitter', 
      options: { redirectTo: window.location.origin } 
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin"/>
    </div>
  );

  // --- LOGGED IN DASHBOARD ---
  if (user) return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR */}
      <div className="w-20 md:w-72 bg-white border-r border-gray-100 flex flex-col fixed md:relative h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">OX</div>
            <span className="hidden md:block font-bold text-xl tracking-tight text-gray-900">Optimax AI</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'studio', label: 'Post Studio', icon: <Sparkles className="w-5 h-5"/> },
            { id: 'tracker', label: 'Mentor Tracker', icon: <Users className="w-5 h-5"/> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5"/> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
            >
              {item.icon} <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
             <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-xs font-bold text-gray-700">
               {user.user_metadata.full_name?.[0]}
             </div>
             <div className="hidden md:block flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{user.user_metadata.full_name}</p>
               <button onClick={() => supabase.auth.signOut()} className="text-xs text-red-500 hover:text-red-600 font-medium">Log Out</button>
             </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 ml-20 md:ml-0 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 capitalize tracking-tight">{activeTab}</h1>
            <p className="text-gray-500 mt-1">Autonomous Social Media Engineering</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" className="hidden md:flex"><Clock className="w-4 h-4"/> History</Button>
             <Button><Plus className="w-4 h-4"/> New Campaign</Button>
          </div>
        </header>

        {activeTab === 'studio' && <PostStudio />}
        {activeTab === 'tracker' && <MentorTracker />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );

  // --- LOGGED OUT LANDING PAGE ---
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">OX</div>
           <span className="font-bold text-xl tracking-tight">Optimax AI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Features</a>
          <a href="#" className="hover:text-black transition-colors">Pricing</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
        </div>
        <Button variant="secondary" onClick={handleLogin} className="hidden md:flex">Sign In</Button>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        
        {/* Abstract Background Blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-4 border border-blue-100">
             <Sparkles className="w-4 h-4"/> v2.0 Now Live
           </div>
           
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.9]">
             Go Viral, <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Autonomously.</span>
           </h1>
           
           <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
             The first AI social media manager that doesn't just schedule posts—it engineers them for maximum engagement using predictive analytics.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
             <Button onClick={handleLogin} className="px-12 py-5 text-xl shadow-xl shadow-blue-500/20 hover:scale-105">
               <Twitter className="w-6 h-6"/> Connect X to Start
             </Button>
             <Button variant="secondary" className="px-12 py-5 text-xl">
               View Demo
             </Button>
           </div>
           
           <div className="pt-16 flex flex-col items-center gap-4 opacity-60">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trusted By Creators From</p>
             <div className="flex gap-8 grayscale opacity-50">
                {/* Simple SVG Placeholders for logos */}
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
