import React from 'react';
import { CheckCircle, Circle, Clock, DollarSign } from 'lucide-react';
import { Task } from '../types';
import { formatDueDate, getCountdown, getTaskColorClass } from '../utils/taskUtils';
import { formatCurrency } from '../utils/budgetUtils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onToggleComplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onToggleComplete }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" fill="currentColor" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Not Started':
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium border';
    switch (task.status) {
      case 'Completed':
        return `${baseClasses} bg-emerald-100 text-emerald-700 border-emerald-200`;
      case 'In Progress':
        return `${baseClasses} bg-blue-100 text-blue-700 border-blue-200`;
      case 'Not Started':
        return `${baseClasses} bg-gray-100 text-gray-700 border-gray-200`;
    }
  };

  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
        task.status === 'Completed'
          ? 'border-l-emerald-500'
          : task.status === 'In Progress'
          ? 'border-l-blue-500'
          : 'border-l-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="flex-shrink-0"
        >
          {getStatusIcon()}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium text-gray-800 mb-2 ${
              task.status === 'Completed' ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.name}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {task.category}
            </span>
            <span className="text-gray-500">
              Due: {formatDueDate(task.dueDate)}
            </span>
            <span className={`font-medium ${getTaskColorClass(task)}`}>
              ({getCountdown(task.dueDate)})
            </span>
            {(task.budgetAllocated > 0 || task.budgetActual > 0) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">
                <DollarSign className="w-3 h-3" />
                {task.budgetActual > 0 ? formatCurrency(task.budgetActual) : formatCurrency(task.budgetAllocated)}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className={getStatusBadge()}>{task.status}</span>
          {task.budgetAllocated > 0 && task.budgetActual > 0 && (
            <span className="text-xs text-gray-500">
              {formatCurrency(task.budgetActual)} / {formatCurrency(task.budgetAllocated)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
