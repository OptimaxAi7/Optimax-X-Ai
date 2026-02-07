import React from 'react';

export interface ViralityAnalysis {
  score: number;
  reason: string;
  improvedVersion: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}