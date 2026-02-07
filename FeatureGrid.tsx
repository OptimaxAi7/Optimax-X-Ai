import React from 'react';
import { Users, Sparkles, TrendingUp } from 'lucide-react';
import Card from './Card';

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

export default FeatureGrid;