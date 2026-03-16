import React from 'react';
import { Heart, CheckCircle, Calendar, DollarSign } from 'lucide-react';

const colorSchemes = [
  {
    name: 'Sage Green',
    hex: '#8B9D83',
    description: 'Natural, calming, very popular in modern weddings'
  },
  {
    name: 'Warm Slate',
    hex: '#6B7C8C',
    description: 'Professional, sophisticated, timeless'
  },
  {
    name: 'Soft Taupe',
    hex: '#A89080',
    description: 'Elegant, neutral, works with everything'
  },
  {
    name: 'Deep Teal',
    hex: '#4A7C7E',
    description: 'Balanced, modern, neither warm nor cool'
  },
  {
    name: 'Warm Gray',
    hex: '#7C8084',
    description: 'Clean, contemporary, universally appealing'
  }
];

export default function ColorSamples() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Color Scheme Samples
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Choose your preferred color scheme for the wedding planner
        </p>

        <div className="space-y-12">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.hex}
              className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-lg shadow-md"
                  style={{ backgroundColor: scheme.hex }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {scheme.name}
                  </h2>
                  <p className="text-gray-600">{scheme.hex}</p>
                  <p className="text-sm text-gray-500 mt-1">{scheme.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: scheme.hex }}
                >
                  Primary Button
                </button>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${scheme.hex}10` }}
                >
                  <div className="flex items-center gap-2">
                    <Heart style={{ color: scheme.hex }} size={20} />
                    <span style={{ color: scheme.hex }} className="font-medium">
                      Card Header
                    </span>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: scheme.hex }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle style={{ color: scheme.hex }} size={20} />
                    <span className="text-gray-700 font-medium">Border Style</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar style={{ color: scheme.hex }} size={20} />
                    <span style={{ color: scheme.hex }} className="font-medium">
                      Icon Accent
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sample Task Card
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: scheme.hex }}
                    >
                      In Progress
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Book your dream venue for the big day
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} style={{ color: scheme.hex }} />
                      <span className="text-gray-700">12 months before</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} style={{ color: scheme.hex }} />
                      <span className="text-gray-700">$5,000</span>
                    </span>
                  </div>
                </div>

                <div
                  className="rounded-lg p-6 text-white"
                  style={{ backgroundColor: scheme.hex }}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Dashboard Widget
                  </h3>
                  <p className="text-white/90 mb-4">
                    Your wedding is in 365 days
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm text-white/80">Tasks</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-sm text-white/80">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
