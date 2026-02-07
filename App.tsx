import React from 'react';
import Hero from './components/Hero';
import PostBuilder from './components/PostBuilder';
import FeatureGrid from './components/FeatureGrid';
import Button from './components/Button';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-virality-blue selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-virality-bg/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-virality-blue rounded-lg flex items-center justify-center text-white font-bold text-lg">
                V
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Virality AI</span>
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
        
        {/* Post Builder Section - The "Hook" of the landing page */}
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
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">Join 10,000+ creators who are automating their growth with Virality AI.</p>
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
                © 2024 Virality AI Inc. All rights reserved.
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