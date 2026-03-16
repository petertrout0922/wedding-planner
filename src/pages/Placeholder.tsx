import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  description,
  icon: Icon
}) => {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-3">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
