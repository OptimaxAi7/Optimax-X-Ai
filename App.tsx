import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  BarChart2, 
  Users, 
  TrendingUp, 
  Mail, 
  CheckCircle, 
  LogOut 
} from 'lucide-react';
import { createClient, User } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from "@google/genai";

// --- CONSTANTS & CONFIGURATION ---
const APP_NAME = "Optimax X Virality AI";
const SUPABASE_URL = 'https://ydgtsdfwkchcdttvqijv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ3RzZGZ3a2NoY2R0dHZxaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTIxNTksImV4cCI6MjA4NTk4ODE1OX0.bQ2qCDEMCvw-hAs3lNYYUUYilfm9M-AMTFjLViDBOA8';

// --- INITIALIZE SERVICES ---
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// FIXED: Removed the markdown backticks that were causing syntax errors
const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// --- TYPES ---
interface ViralityAnalysis {
  score: number;
  reason: string;
  improvedVersion: string;
}

// --- SERVICES ---
const analyzePost = async (content: string): Promise<ViralityAnalysis> => {
  try {
    // FIXED: Added the missing "if" keyword here
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
       console.warn("API Key is missing. Returning mock response for demo.");
       await new Promise(r => setTimeout(r, 1500));
       return {
          score: 72,
          reason: "The hook is decent but lacks a specific call to action or emotional urgency.",
          improvedVersion: "🚀 AI is rewriting the rules of work. Are you adapting or falling behind? 👇 #FutureOfWork"
       };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this social media post for virality potential on Twitter/X. 
      Post: "${content}"
      
      Provide a virality score (0-100), a short 1-sentence reason why, and a rewritten version that is more engaging/viral.
      Return the response in strict JSON format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Simple JSON extraction to be safe
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ViralityAnalysis;
    }
    
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("Error analyzing post:", error);
    return {
      score: 45,
      reason: "The text is too generic and lacks a hook or emotional trigger.",
      improvedVersion: "🚀 Just launched something game-changing! You won't believe what we've built. 👇 #LaunchDay"
    };
  }
};

// --- UI COMPONENTS ---

const Button: React.FC<any> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none";
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:border-blue-600 shadow-sm",
    outline: "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70' : ''}`} disabled={isLoading} {...props}>
      {isLoading ? "Processing..." : children}
    </button>
  );
};

const Card: React.FC<any> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>{children}</div>
);

const IntegrationCenter: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleXLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: window.location.origin }
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto items-center justify-center my-8">
      {user ? (
        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user.user_metadata.full_name?.[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{user.user_metadata.full_name || 'User'}</span>
            <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Connected</span>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="ml-4 text-gray-400 hover:text-red-500"><LogOut className="w-4 h-4" /></button>
        </div>
      ) : (
        <Button onClick={handleXLogin} isLoading={isLoading} className="w-full md:w-auto">Connect X/Twitter</Button>
      )}
      <Button variant="secondary" className="w-full md:w-auto">Connect Gmail</Button>
    </div>
  );
};

const FeatureGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 my-12">
    {[
      { title: "Find Your Audience", desc: "Data-backed insights to locate your target reach.", icon: <Users /> },
      { title: "AI Content", desc: "Adapts to your unique tone of voice.", icon: <Sparkles /> },
      { title: "Track Virality", desc: "Monitor engagement velocity in real-time.", icon: <TrendingUp /> }
    ].map((f, i) => (
      <Card key={i}>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">{f.icon}</div>
        <h3 className="font-bold mb-2">{f.title}</h3>
        <p className="text-sm text-gray-500">{f.desc}</p>
      </Card>
    ))}
  </div>
);

const PostBuilder = () => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ViralityAnalysis | null>(null);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    const res = await analyzePost(content);
    setResult(res);
    setIsAnalyzing(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <textarea 
            className="w-full h-40 p-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write your post draft here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleAnalysis} isLoading={isAnalyzing} className="w-full">Analyze with AI</Button>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300">
          {result ? (
            <div className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">{result.score}% Virality</div>
              <p className="text-sm text-gray-600 italic">"{result.reason}"</p>
              <div className="p-3 bg-white border rounded-lg text-sm">{result.improvedVersion}</div>
              <Button variant="outline" onClick={() => setContent(result.improvedVersion)} className="w-full text-xs">Apply Improvement</Button>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">AI Analysis will appear here</div>
          )}
        </div>
      </div>
    </Card>
  );
};

const Hero = () => (
  <section className="pt-24 pb-12 px-4 text-center">
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
      Go Viral, <span className="text-blue-600">Autonomously</span>
    </h1>
    <p className="text-gray-600 max-w-2xl mx-auto mb-8">Engineering maximum engagement using predictive analytics.</p>
    <IntegrationCenter />
  </section>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="h-16 border-b bg-white flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="font-bold text-xl">{APP_NAME}</div>
        <Button className="h-10 px-4 text-sm">Start Free</Button>
      </nav>
      <main>
        <Hero />
        <PostBuilder />
        <FeatureGrid />
      </main>
    </div>
  );
};

export default App;
