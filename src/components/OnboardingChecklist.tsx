import React, { useState } from 'react';
import { Check, ChevronRight, ChevronDown, UserPlus, ListTodo, Users, Building2, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface ChecklistItemData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  action: () => void;
}

export const OnboardingChecklist: React.FC = () => {
  const navigate = useNavigate();
  const { coupleData, tasks, guests, vendors } = useApp();
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyJoinCode = () => {
    if (coupleData?.joinCode) {
      navigator.clipboard.writeText(coupleData.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checklistItems: ChecklistItemData[] = [
    {
      id: 'invite-partner',
      title: 'Invite Your Partner',
      description: 'Share access with your partner using join code',
      icon: <UserPlus className="w-5 h-5" />,
      isComplete: coupleData?.hasPartner || false,
      action: () => setShowJoinCode(true)
    },
    {
      id: 'add-tasks',
      title: 'Add Your First Tasks',
      description: 'Start organizing with to-do items',
      icon: <ListTodo className="w-5 h-5" />,
      isComplete: tasks.length > 0,
      action: () => navigate('/tasks')
    },
    {
      id: 'add-guests',
      title: 'Build Your Guest List',
      description: 'Track guests and their meal preferences',
      icon: <Users className="w-5 h-5" />,
      isComplete: guests.length > 0,
      action: () => navigate('/guests')
    },
    {
      id: 'add-vendors',
      title: 'Add Vendors',
      description: 'Keep all your wedding professionals organized',
      icon: <Building2 className="w-5 h-5" />,
      isComplete: vendors.length > 0,
      action: () => navigate('/vendors')
    }
  ];

  const completedCount = checklistItems.filter(item => item.isComplete).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;
  const allComplete = completedCount === checklistItems.length;

  if (allComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 bg-gradient-to-r from-primary-50 to-blue-50 hover:from-primary-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif font-bold" style={{ color: '#FF3300' }}>Click Here To Get Started</h2>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <span className="text-sm font-semibold text-primary-600">
            {completedCount} of {checklistItems.length} complete
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-100">
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                disabled={item.isComplete}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  item.isComplete
                    ? 'bg-green-50 border-2 border-green-200 cursor-default'
                    : 'bg-gray-50 hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent cursor-pointer'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    item.isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {item.isComplete ? <Check className="w-5 h-5" /> : item.icon}
                </div>

                <div className="flex-1 text-left">
                  <div className={`font-semibold ${item.isComplete ? 'text-green-700' : 'text-gray-800'}`}>
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>

                {!item.isComplete && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {showJoinCode && coupleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Invite Your Partner</h3>
              <p className="text-gray-600 mb-6">
                Share this join code with your partner so they can access your wedding planning workspace
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">Join Code</div>
                <div className="text-3xl font-bold text-gray-800 tracking-wider mb-4 font-mono">
                  {coupleData.joinCode}
                </div>
                <button
                  onClick={handleCopyJoinCode}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors mx-auto"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setShowJoinCode(false)}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
