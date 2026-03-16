import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { groupTasksByCategory, getCategoryProgress } from '../utils/taskUtils';
import { TaskCard } from './TaskCard';
import { taskCategories } from '../data/taskData';

interface CategoryViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  tasks,
  onTaskClick,
  onToggleComplete
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Budget & Planning']));
  const [expandAll, setExpandAll] = useState(false);

  const groupedTasks = groupTasksByCategory(tasks);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(Object.keys(groupedTasks)));
    }
    setExpandAll(!expandAll);
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExpandAll}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-4">
        {taskCategories.map(category => {
          const categoryTasks = groupedTasks[category.name] || [];
          if (categoryTasks.length === 0) return null;

          const progress = getCategoryProgress(categoryTasks);
          const isExpanded = expandedCategories.has(category.name);

          return (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        {progress.completed} of {progress.total} tasks completed
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="font-medium text-primary-600">
                        {progress.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200">
                  {categoryTasks.map((task, index) => (
                    <div key={task.id}>
                      {index > 0 && <div className="border-t border-gray-100" />}
                      <TaskCard
                        task={task}
                        onClick={() => onTaskClick(task)}
                        onToggleComplete={() => onToggleComplete(task.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
