import { Task, StatusFilter, TimelineFilter } from '../types';

export const getTimeBucket = (dueDate: Date, today: Date): string => {
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return 'Overdue';
  if (daysDiff <= 7) return 'This Week';
  if (daysDiff <= 14) return 'Next Week';
  if (daysDiff <= 30) return 'This Month';
  if (daysDiff <= 90) return '2-3 Months Out';
  if (daysDiff <= 180) return '3-6 Months Out';
  return '6+ Months Out';
};

export const groupTasksByTimeline = (tasks: Task[]): Record<string, Task[]> => {
  const today = new Date();
  const buckets: Record<string, Task[]> = {
    'Overdue': [],
    'This Week': [],
    'Next Week': [],
    'This Month': [],
    '2-3 Months Out': [],
    '3-6 Months Out': [],
    '6+ Months Out': []
  };

  tasks.forEach(task => {
    const bucket = getTimeBucket(task.dueDate, today);
    buckets[bucket].push(task);
  });

  return buckets;
};

export const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};

  tasks.forEach(task => {
    if (!grouped[task.category]) {
      grouped[task.category] = [];
    }
    grouped[task.category].push(task);
  });

  return grouped;
};

export const filterTasksByStatus = (tasks: Task[], filter: StatusFilter): Task[] => {
  if (filter === 'All') return tasks;
  return tasks.filter(task => task.status === filter);
};

export const filterTasksByTimeline = (tasks: Task[], filter: TimelineFilter): Task[] => {
  if (filter === 'All') return tasks;

  const today = new Date();
  const timeDiff = (dueDate: Date) => Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  switch (filter) {
    case 'Overdue':
      return tasks.filter(task => timeDiff(task.dueDate) < 0);
    case 'This Week':
      return tasks.filter(task => {
        const diff = timeDiff(task.dueDate);
        return diff >= 0 && diff <= 7;
      });
    case 'This Month':
      return tasks.filter(task => {
        const diff = timeDiff(task.dueDate);
        return diff >= 0 && diff <= 30;
      });
    case 'Next 3 Months':
      return tasks.filter(task => {
        const diff = timeDiff(task.dueDate);
        return diff >= 0 && diff <= 90;
      });
    default:
      return tasks;
  }
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  const lowerQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.name.toLowerCase().includes(lowerQuery) ||
    task.category.toLowerCase().includes(lowerQuery)
  );
};

export const getCategoryProgress = (tasks: Task[]): { completed: number; total: number; percentage: number } => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'Completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
};

export const formatDueDate = (dueDate: Date): string => {
  return dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getCountdown = (dueDate: Date): string => {
  const today = new Date();
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return `overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''}`;
  } else if (daysDiff === 0) {
    return 'due today';
  } else if (daysDiff === 1) {
    return 'due tomorrow';
  } else {
    return `in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
  }
};

export const getTaskColorClass = (task: Task): string => {
  if (task.status === 'Completed') return 'text-emerald-600';

  const today = new Date();
  const timeDiff = Math.ceil((task.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (timeDiff < 0) return 'text-red-600';
  if (timeDiff <= 7) return 'text-amber-600';
  return 'text-gray-600';
};

export const getTaskBgColorClass = (task: Task): string => {
  if (task.status === 'Completed') return 'bg-emerald-50 border-emerald-200';

  const today = new Date();
  const timeDiff = Math.ceil((task.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (timeDiff < 0) return 'bg-red-50 border-red-200';
  if (timeDiff <= 7) return 'bg-amber-50 border-amber-200';
  return 'bg-white border-gray-200';
};
