import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { groupTasksByTimeline } from '../utils/taskUtils';
import { TaskCard } from './TaskCard';

interface TimelineViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

const bucketOrder = [
  'Overdue',
  'This Week',
  'Next Week',
  'This Month',
  '2-3 Months Out',
  '3-6 Months Out',
  '6+ Months Out'
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onTaskClick,
  onToggleComplete
}) => {
  const [expandedBuckets, setExpandedBuckets] = useState<Set<string>>(
    new Set(['Overdue', 'This Week', 'Next Week'])
  );

  const groupedTasks = groupTasksByTimeline(tasks);

  const toggleBucket = (bucket: string) => {
    setExpandedBuckets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bucket)) {
        newSet.delete(bucket);
      } else {
        newSet.add(bucket);
      }
      return newSet;
    });
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'Overdue':
        return 'text-red-600';
      case 'This Week':
        return 'text-amber-600';
      case 'Next Week':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {bucketOrder.map(bucket => {
        const bucketTasks = groupedTasks[bucket] || [];
        if (bucketTasks.length === 0) return null;

        const isExpanded = expandedBuckets.has(bucket);

        return (
          <div
            key={bucket}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleBucket(bucket)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${getBucketColor(bucket)} mb-1`}>
                    {bucket}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bucketTasks.length} task{bucketTasks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <span className={`text-2xl font-bold ${getBucketColor(bucket)}`}>
                  {bucketTasks.length}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-200">
                {bucketTasks.map((task, index) => (
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
  );
};
