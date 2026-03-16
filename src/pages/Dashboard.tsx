import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign, CheckCircle, AlertTriangle, UserPlus, Building2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { calculateBudgetSummary, getTopSpendingCategories, calculateCategoryBudgets, formatCurrency, getOverBudgetCategories } from '../utils/budgetUtils';
import { GuestModal } from '../components/GuestModal';
import { VendorModal } from '../components/VendorModal';
import { TaskFormModal } from '../components/TaskFormModal';
import { HelpTooltip } from '../components/HelpTooltip';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { WelcomeVideoModal } from '../components/WelcomeVideoModal';

export const Dashboard: React.FC = () => {
  const { weddingDate, tasks, totalBudget, categoryBudgets, addTask, addGuest, addVendor, vendors, coupleData, markWelcomeVideoSeen } = useApp();

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState(true);
  const [highlightCreateTask, setHighlightCreateTask] = useState(false);

  React.useEffect(() => {
    if (coupleData && !coupleData.seenWelcomeVideo) {
      const timer = setTimeout(() => {
        setShowWelcomeVideo(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [coupleData]);

  const handleCloseWelcomeVideo = async () => {
    setShowWelcomeVideo(false);
    await markWelcomeVideoSeen();

    setShowOnboardingChecklist(false);

    setTimeout(() => {
      setHighlightCreateTask(true);
    }, 500);
  };

  const getDaysUntilWedding = () => {
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.status === 'Completed').length;
  };

  const getProgressPercentage = () => {
    if (tasks.length === 0) return 0;
    return Math.round((getCompletedTasksCount() / tasks.length) * 100);
  };

  const getUpcomingTasks = () => {
    return tasks
      .filter(task => task.status !== 'Completed')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 10);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysUntil = getDaysUntilWedding();
  const completedCount = getCompletedTasksCount();
  const progressPercentage = getProgressPercentage();
  const upcomingTasks = getUpcomingTasks();

  const budgetSummary = calculateBudgetSummary(totalBudget, tasks, categoryBudgets, vendors);
  const categoryBudgetDetails = calculateCategoryBudgets(tasks, categoryBudgets, vendors);
  const topSpendingCategories = getTopSpendingCategories(categoryBudgetDetails, 3);
  const overBudgetCategories = getOverBudgetCategories(categoryBudgetDetails);
  const hasOverBudget = overBudgetCategories.length > 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            Welcome to Your Wedding Dashboard
          </h1>
          <HelpTooltip content="Your dashboard shows your wedding countdown, task progress, budget overview, and upcoming deadlines. Quick-add buttons let you create tasks, guests, and vendors right from here." />
        </div>
        <p className="text-gray-600">Track your progress and stay organized</p>
      </div>

      {showOnboardingChecklist && <OnboardingChecklist />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="text-5xl font-bold mb-2">{daysUntil}</div>
          <div className="text-primary-100 font-medium">days until your wedding</div>
          <div className="text-sm text-primary-100 mt-2">{formatDate(weddingDate)}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#3B82F6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{progressPercentage}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="text-xs text-gray-500 mt-1">
              {completedCount} of {tasks.length} tasks completed
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            {hasOverBudget && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Budget Utilization</div>
              <div className="text-2xl font-bold text-gray-800">
                {budgetSummary.utilizationPercentage.toFixed(1)}%
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-500">Spent</div>
                <div className="font-semibold text-orange-600">
                  {formatCurrency(budgetSummary.totalSpent)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500">Remaining</div>
                <div className={`font-semibold ${budgetSummary.remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(budgetSummary.remaining)}
                </div>
              </div>
            </div>
            {topSpendingCategories.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Top Spending</div>
                {topSpendingCategories.slice(0, 2).map(cat => (
                  <div key={cat.name} className="text-xs text-gray-700 flex justify-between">
                    <span>{cat.name}</span>
                    <span className="font-medium">{formatCurrency(cat.spentAmount)}</span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/budget"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium pt-2"
            >
              View Budget Details By Category →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{completedCount}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
            <div className="text-xs text-gray-500 mt-1">
              {tasks.length - completedCount} remaining
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setIsGuestModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 border border-primary-600"
        >
          <div className="p-1 border border-primary-600 rounded">
            <UserPlus className="w-6 h-6 text-primary-600" />
          </div>
          <span className="font-semibold text-primary-600">Add Guest</span>
        </button>

        <button
          onClick={() => setIsVendorModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 border border-primary-600"
        >
          <div className="p-1 border border-primary-600 rounded">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <span className="font-semibold text-primary-600">Add Vendor</span>
        </button>

        <div className={`relative ${highlightCreateTask ? 'animate-pulse-border' : ''}`}>
          {highlightCreateTask && (
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl opacity-75 animate-pulse"></div>
          )}
          <button
            onClick={() => {
              setIsTaskModalOpen(true);
              setHighlightCreateTask(false);
            }}
            className="relative flex items-center gap-3 px-6 py-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 border border-primary-600"
          >
            <div className="p-1 border border-primary-600 rounded">
              <Plus className="w-6 h-6 text-primary-600" />
            </div>
            <span className="font-semibold text-primary-600">Create Task</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-gray-800">Upcoming Tasks</h2>
          <p className="text-sm text-gray-600 mt-1 font-bold">Go to the "Tasks" page to update any of these Upcoming Tasks.</p>
        </div>
        <div className="p-6">
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-4">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-800">{task.name}</div>
                      <div className="text-sm text-gray-500">
                        Due: {formatDate(task.dueDate)}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-8">All tasks completed!</p>
          )}
        </div>
      </div>

      {isGuestModalOpen && (
        <GuestModal
          onClose={() => setIsGuestModalOpen(false)}
          onSave={(guest) => {
            addGuest(guest);
            setIsGuestModalOpen(false);
          }}
        />
      )}

      {isVendorModalOpen && (
        <VendorModal
          onClose={() => setIsVendorModalOpen(false)}
          onSave={(vendor) => {
            addVendor(vendor);
            setIsVendorModalOpen(false);
          }}
        />
      )}

      {isTaskModalOpen && (
        <TaskFormModal
          onClose={() => setIsTaskModalOpen(false)}
          onSave={(task) => {
            addTask(task);
            setIsTaskModalOpen(false);
          }}
        />
      )}

      {showWelcomeVideo && (
        <WelcomeVideoModal onClose={handleCloseWelcomeVideo} />
      )}
    </div>
  );
};
