import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, DollarSign, Users, List, Settings, Heart, Menu, X, HelpCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Sidebar: React.FC = () => {
  const { coupleNames } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/budget', icon: DollarSign, label: 'Budget' },
    { to: '/vendors', icon: Users, label: 'Vendors' },
    { to: '/guests', icon: List, label: 'Guest List' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/help', icon: HelpCircle, label: 'Help' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-500" fill="currentColor" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-gray-800">{coupleNames}</h2>
              <p className="text-xs text-gray-500">Wedding Planner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
