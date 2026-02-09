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
// 1. Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Gemini AI
// Note: In a production React environment, process.env.API_KEY usually requires a build step configuration (like .env).
// Ensure your Netlify environment variables are set correctly.
```tsx const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// --- TYPES ---
interface ViralityAnalysis {
  score: number;
  reason: string;
  improvedVersion: string;
}

// --- SERVICES ---
const analyzePost = async (content: string): Promise<ViralityAnalysis> => {
  try {
    (!import.meta.env.VITE_GEMINI_API_KEY) {
       console.warn("API Key is missing. Returning mock response for demo.");
       // Fallback for demo purposes if key isn't present
       await new Promise(r => setTimeout(r, 1500));
       return {
          score: 72,
          reason: "The hook is decent but lacks a specific call to action or emotional urgency.",
          improvedVersion: "🚀 AI is rewriting the rules of work. Are you adapting or falling behind? 👇 #FutureOfWork"
       };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this social media post for virality potential on Twitter/X. 
      Post: "${content}"
      
      Provide a virality score (0-100), a short 1-sentence reason why, and a rewritten version that is more engaging/viral.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            improvedVersion: { type: Type.STRING },
          },
          required: ["score", "reason", "improvedVersion"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ViralityAnalysis;
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

// 1. Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-virality-blue text-white hover:bg-virality-blue-hover hover:shadow-glow shadow-md border border-transparent focus:ring-virality-blue",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:border-virality-blue hover:text-virality-blue shadow-soft",
    outline: "bg-transparent text-virality-blue border border-virality-blue hover:bg-blue-50",
    ghost: "bg-transparent text-gray-600 hover:text-virality-blue hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
};

// 2. Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-virality-card rounded-2xl border border-gray-100 shadow-soft backdrop-blur-sm ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

// 3. IntegrationCenter Component
const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IntegrationCenter: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleXLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter', 
        options: {
          redirectTo: 'https://optimaxxai.netlify.app',
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in with X:', error);
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mx-auto items-center justify-center my-8">
        {user ? (
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-gray-200 shadow-soft animate-fade-in min-w-[240px]">
                <div className="w-10 h-10 rounded-full bg-virality-blue/10 flex items-center justify-center text-virality-blue font-bold border border-virality-blue/20">
                    {user.user_metadata.full_name ? user.user_metadata.full_name[0] : 'U'}
                </div>
                <div className="flex flex-col mr-2">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                        {user.user_metadata.full_name || 'User'}
                    </span>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Connected
                    </span>
                </div>
                <div className="h-8 w-px bg-gray-200 mx-1"></div>
                <button 
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        ) : (
            <Button 
                variant="primary" 
                onClick={handleXLogin}
                isLoading={isLoading}
                className="w-full md:w-auto min-w-[200px]"
            >
                <XLogo />
                <span className="ml-2">Connect X/Twitter</span>
            </Button>
        )}

        <Button variant="secondary" className="w-full md:w-auto min-w-[200px]">
            <Mail className="w-5 h-5 mr-2" />
            Connect Gmail
        </Button>
    </div>
  );
};

// 4. FeatureGrid Component
const features = [
  {
    title: "Find Your Audience",
    description: "Deep data-backed insights to locate exactly who needs to see your content right now.",
    icon: <Users className="w-6 h-6 text-virality-blue" />,
  },
  {
    title: "Generate Authentic Content",
    description: "AI that adapts to your unique tone of voice, ensuring every post feels personally crafted.",
    icon: <Sparkles className="w-6 h-6 text-virality-blue" />,
  },
  {
    title: "Track Your Virality",
    description: "Monitor engagement velocity in real-time and predict viral spikes before they happen.",
    icon: <TrendingUp className="w-6 h-6 text-virality-blue" />,
  },
];

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 mt-12 mb-20">
      {features.map((feature, index) => (
        <Card key={index} className="flex flex-col items-start hover:shadow-lg transition-shadow duration-300">
          <div className="p-3 bg-blue-50 rounded-xl mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
};

// 5. PostBuilder Component
const PostBuilder: React.FC = () => {
  const [content, setContent] = useState("AI is changing the way we work forever. #FutureOfWork");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ViralityAnalysis | null>(null);

  const handleAnalysis = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const analysis = await analyzePost(content);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  const applyImprovement = () => {
    if (result) {
      setContent(result.improvedVersion);
      setResult(null); 
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-blue-400/20 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none"></div>
      
      <Card className="border-t-4 border-virality-blue overflow-hidden">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-virality-blue" />
                Post Builder Preview
            </h2>
            <div className="bg-blue-50 text-virality-blue text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                AI Powered
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Draft Your Post</label>
                <div className="relative">
                    <textarea 
                        className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-virality-blue focus:border-transparent outline-none resize-none transition-all text-gray-700 text-lg shadow-inner"
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {content.length} chars
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button 
                        onClick={handleAnalysis} 
                        isLoading={isAnalyzing} 
                        className="flex-1"
                    >
                        <Sparkles className="w-4 h-4" />
                        Analyze & Improve
                    </Button>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center min-h-[300px]">
                {!result ? (
                    <div className="text-center text-gray-400">
                        <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Run analysis to see your Optimax score and AI suggestions.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Optimax Score</p>
                                <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                                    {result.score}%
                                </div>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                <div 
                                    className={`h-full rounded-full ${getScoreBg(result.score)}`} 
                                    style={{ width: `${result.score}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Analysis</p>
                            <p className="text-gray-700 text-sm italic">"{result.reason}"</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                            <p className="text-xs text-virality-blue uppercase font-semibold mb-2 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> 
                                Suggested Improvement
                            </p>
                            <p className="text-gray-800 font-medium text-sm mb-3">
                                {result.improvedVersion}
                            </p>
                            <Button variant="outline" onClick={applyImprovement} className="w-full text-xs py-2 h-auto">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Use This Version
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};

// 6. Hero Component
const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-12 px-4 text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
         <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-virality-blue text-xs font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-virality-blue mr-2"></span>
            v2.0 Now Available with Gemini 2.5
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
          Go Viral, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-virality-blue to-indigo-600">
            Autonomously
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The first AI social media manager that doesn't just schedule posts—it engineers them for maximum engagement using predictive analytics.
        </p>

        <IntegrationCenter />
      </div>
    </section>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-virality-blue selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-virality-bg/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-virality-blue to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-glow">
                OX
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">{APP_NAME}</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-virality-blue font-medium text-sm transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-virality-blue font-medium text-sm transition-colors">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-virality-blue font-medium text-sm transition-colors">Case Studies</a>
              <Button variant="primary" className="py-2 px-4 text-sm h-10">Get Started</Button>
            </div>

            <div className="md:hidden">
              <button className="text-gray-600 p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero />
        
        {/* Post Builder Section */}
        <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Experience the Engine</h2>
                <p className="text-gray-500 mt-2">Try our predictive virality engine below. It's not magic, it's math.</p>
            </div>
            <PostBuilder />
        </section>

        <FeatureGrid />

        {/* Bottom CTA */}
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to scale your presence?</h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">Join 10,000+ creators who are automating their growth with {APP_NAME}.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button variant="primary" className="px-8 text-lg">Start Free Trial</Button>
                    <Button variant="secondary" className="px-8 text-lg">View Demo</Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
                © 2024 {APP_NAME} Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-virality-blue transition-colors">Privacy</a>
                <a href="#" className="hover:text-virality-blue transition-colors">Terms</a>
                <a href="#" className="hover:text-virality-blue transition-colors">Twitter</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
