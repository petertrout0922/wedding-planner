import React, { useState } from 'react';
import { Plane, MapPin, Calendar, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types';

const honeymoonCategories = [
  { name: 'Flight Bookings', tasks: ['Research flights', 'Book tickets', 'Check-in online'] },
  { name: 'Accommodation', tasks: ['Research hotels', 'Book lodging', 'Confirm reservations', 'Arrange transfers'] },
  { name: 'Transportation', tasks: ['Rental car', 'Local transportation', 'Airport transfers'] },
  { name: 'Activities & Excursions', tasks: ['Research activities', 'Book tours', 'Make reservations', 'Plan day trips', 'Reserve special experiences'] },
  { name: 'Restaurant Reservations', tasks: ['Research restaurants', 'Make reservations', 'Plan dining schedule', 'Book special dinners'] },
  { name: 'Travel Insurance', tasks: ['Research policies', 'Purchase insurance'] },
  { name: 'Documentation', tasks: ['Check passports', 'Apply for visas', 'Vaccination requirements', 'Travel documents'] },
  { name: 'Packing', tasks: ['Create packing list', 'Pack bags', 'Confirm luggage limits'] },
  { name: 'Budget & Money', tasks: ['Set budget', 'Notify bank', 'Get local currency'] },
  { name: 'Itinerary Planning', tasks: ['Daily itinerary', 'Backup plans', 'Share with family', 'Download maps'] }
];

export const Honeymoon: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('5000');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Flight Bookings']);
  const [honeymoonTasks, setHoneymoonTasks] = useState<Task[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const daysUntilHoneymoon = startDate
    ? Math.ceil((new Date(startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const tripLength = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Honeymoon Planning</h1>
        <p className="text-gray-600">Plan your dream getaway together</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Bora Bora, French Polynesia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Honeymoon Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {(daysUntilHoneymoon || tripLength) && (
          <div className="mt-6 flex gap-4">
            {daysUntilHoneymoon && daysUntilHoneymoon > 0 && (
              <div className="flex-1 bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-gray-600">Days Until Honeymoon</div>
                <div className="text-3xl font-bold text-blue-600">{daysUntilHoneymoon}</div>
              </div>
            )}
            {tripLength && tripLength > 0 && (
              <div className="flex-1 bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-gray-600">Trip Length</div>
                <div className="text-3xl font-bold text-cyan-600">{tripLength} days</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {honeymoonCategories.map(category => {
          const isExpanded = expandedCategories.includes(category.name);
          const completedTasks = 0;
          const totalTasks = category.tasks.length;

          return (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {completedTasks} of {totalTasks} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((completedTasks / totalTasks) * 100)}%
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-3 mt-4">
                    {category.tasks.map((task, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                            />
                            <span className="text-gray-800">{task}</span>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Optional
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Planning Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Book flights 2-3 months in advance for best prices</li>
          <li>• Research visa requirements at least 6 weeks before departure</li>
          <li>• Make restaurant reservations for special experiences</li>
          <li>• Purchase travel insurance to protect your investment</li>
          <li>• Download offline maps and translation apps</li>
          <li>• Notify your bank and credit cards of travel dates</li>
        </ul>
      </div>
    </div>
  );
};
