import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, LogOut } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Simple X Icon SVG
const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IntegrationCenter: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleXLogin = async () => {
    console.log('Redirecting to X...');
    try {
      setIsLoading(true);
      // Using 'x' as provider as requested
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'x' as any, 
        options: {
          redirectTo: 'https://optimaxxai.netlify.app',
          scopes: 'tweet.read tweet.write users.read offline.access',
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
            // Success State: User Name + Logout
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
            // Default State: Connect Button
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

export default IntegrationCenter;