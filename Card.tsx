import React from 'react';

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

export default Card;