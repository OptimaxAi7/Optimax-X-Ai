import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { analyzePost } from '../services/geminiService';
import { ViralityAnalysis } from '../types';

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
      // Reset result slightly so they can improve again if they edit
      // or keep it to show the score of the improved version? 
      // Let's keep it simple and just update text.
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
            {/* Left Column: Input */}
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

            {/* Right Column: Analysis */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center min-h-[300px]">
                {!result ? (
                    <div className="text-center text-gray-400">
                        <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Run analysis to see your virality score and AI suggestions.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in space-y-6">
                        {/* Score Section */}
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Virality Score</p>
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

                        {/* Feedback Section */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Analysis</p>
                            <p className="text-gray-700 text-sm italic">"{result.reason}"</p>
                        </div>

                        {/* Suggestion Section */}
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

export default PostBuilder;