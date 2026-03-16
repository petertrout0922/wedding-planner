import { Task, TaskCategory, Wedding } from '../types';
import { expandedTasksTemplate } from './expandedTasks';

export const taskCategories: TaskCategory[] = [
  { name: 'Budget & Planning', icon: 'DollarSign', suggestedPercentage: 0.5 },
  { name: 'Venue & Rentals', icon: 'Building', suggestedPercentage: 25 },
  { name: 'Ceremony', icon: 'Heart', suggestedPercentage: 3 },
  { name: 'Reception & Catering', icon: 'Utensils', suggestedPercentage: 22 },
  { name: 'Photography & Videography', icon: 'Camera', suggestedPercentage: 12 },
  { name: 'Music & Entertainment', icon: 'Music', suggestedPercentage: 10 },
  { name: 'Flowers & Décor', icon: 'Flower2', suggestedPercentage: 8 },
  { name: 'Attire & Accessories', icon: 'Shirt', suggestedPercentage: 8 },
  { name: 'Hair & Makeup', icon: 'Sparkles', suggestedPercentage: 2.5 },
  { name: 'Guest List & Invitations', icon: 'Mail', suggestedPercentage: 3 },
  { name: 'Transportation', icon: 'Car', suggestedPercentage: 2 },
  { name: 'Accommodations & Travel', icon: 'Hotel', suggestedPercentage: 1.5 },
  { name: 'Registry & Gifts', icon: 'Gift', suggestedPercentage: 1 },
  { name: 'Wedding Favors & Details', icon: 'Package', suggestedPercentage: 2 },
  { name: 'Pre-Wedding Events', icon: 'PartyPopper', suggestedPercentage: 2.5 },
  { name: 'Wedding Website & Communications', icon: 'Globe', suggestedPercentage: 0.5 },
  { name: 'Vendor Management', icon: 'Users', suggestedPercentage: 3.5 },
  { name: 'Wedding Day Timeline', icon: 'Clock', suggestedPercentage: 0 },
  { name: 'Health & Wellness', icon: 'Activity', suggestedPercentage: 0.7 },
  { name: 'Legal & Administrative', icon: 'FileText', suggestedPercentage: 1 },
  { name: 'Post-Wedding', icon: 'CheckCircle', suggestedPercentage: 2 }
];

export const initialTasksTemplate = [
  { name: 'Set wedding budget', category: 'Budget & Planning', daysBeforeWedding: 365, status: 'Completed' as const },
  { name: 'Choose wedding date', category: 'Budget & Planning', daysBeforeWedding: 365, status: 'Completed' as const },
  { name: 'Create guest list draft', category: 'Budget & Planning', daysBeforeWedding: 270, status: 'In Progress' as const },
  { name: 'Determine wedding style and theme', category: 'Budget & Planning', daysBeforeWedding: 330, status: 'Not Started' as const },
  { name: 'Research wedding costs', category: 'Budget & Planning', daysBeforeWedding: 350, status: 'Completed' as const },

  { name: 'Book ceremony venue', category: 'Venue & Rentals', daysBeforeWedding: 300, status: 'Not Started' as const },
  { name: 'Book reception venue', category: 'Venue & Rentals', daysBeforeWedding: 300, status: 'Not Started' as const },
  { name: 'Reserve ceremony chairs and décor', category: 'Venue & Rentals', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Rent table linens and dinnerware', category: 'Venue & Rentals', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Arrange tent rental if outdoor', category: 'Venue & Rentals', daysBeforeWedding: 150, status: 'Not Started' as const },

  { name: 'Book officiant', category: 'Ceremony', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Write vows', category: 'Ceremony', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Choose ceremony music', category: 'Ceremony', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Plan processional order', category: 'Ceremony', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Arrange rehearsal', category: 'Ceremony', daysBeforeWedding: 14, status: 'Not Started' as const },
  { name: 'Obtain marriage license', category: 'Ceremony', daysBeforeWedding: 30, status: 'Not Started' as const },

  { name: 'Book caterer', category: 'Reception & Catering', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Schedule tasting', category: 'Reception & Catering', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Finalize menu', category: 'Reception & Catering', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Select signature cocktails', category: 'Reception & Catering', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Confirm final guest count with caterer', category: 'Reception & Catering', daysBeforeWedding: 14, status: 'Not Started' as const },

  { name: 'Book photographer', category: 'Photography & Videography', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Book videographer', category: 'Photography & Videography', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Create photo shot list', category: 'Photography & Videography', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Schedule engagement photo session', category: 'Photography & Videography', daysBeforeWedding: 180, status: 'Not Started' as const },

  { name: 'Book DJ or band', category: 'Music & Entertainment', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Create must-play song list', category: 'Music & Entertainment', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Choose first dance song', category: 'Music & Entertainment', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Plan reception timeline with DJ', category: 'Music & Entertainment', daysBeforeWedding: 45, status: 'Not Started' as const },
  { name: 'Book ceremony musicians', category: 'Music & Entertainment', daysBeforeWedding: 180, status: 'Not Started' as const },

  { name: 'Book florist', category: 'Flowers & Décor', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Choose bridal bouquet', category: 'Flowers & Décor', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Select centerpieces', category: 'Flowers & Décor', daysBeforeWedding: 150, status: 'Not Started' as const },
  { name: 'Finalize ceremony and reception décor', category: 'Flowers & Décor', daysBeforeWedding: 90, status: 'Not Started' as const },

  { name: 'Shop for wedding dress', category: 'Attire & Accessories', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Order wedding dress', category: 'Attire & Accessories', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Schedule dress fittings', category: 'Attire & Accessories', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Shop for groom attire', category: 'Attire & Accessories', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Choose wedding shoes and accessories', category: 'Attire & Accessories', daysBeforeWedding: 150, status: 'Not Started' as const },
  { name: 'Order wedding rings', category: 'Attire & Accessories', daysBeforeWedding: 150, status: 'Not Started' as const },

  { name: 'Book hair stylist', category: 'Hair & Makeup', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Book makeup artist', category: 'Hair & Makeup', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Schedule hair and makeup trial', category: 'Hair & Makeup', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Confirm day-of hair and makeup timeline', category: 'Hair & Makeup', daysBeforeWedding: 30, status: 'Not Started' as const },

  { name: 'Finalize guest list', category: 'Guest List & Invitations', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Order save-the-dates', category: 'Guest List & Invitations', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Mail save-the-dates', category: 'Guest List & Invitations', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Order invitations', category: 'Guest List & Invitations', daysBeforeWedding: 150, status: 'Not Started' as const },
  { name: 'Mail invitations', category: 'Guest List & Invitations', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Track RSVPs', category: 'Guest List & Invitations', daysBeforeWedding: 45, status: 'Not Started' as const },

  { name: 'Arrange transportation for wedding party', category: 'Transportation', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Book guest shuttle service', category: 'Transportation', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Plan getaway car', category: 'Transportation', daysBeforeWedding: 60, status: 'Not Started' as const },

  { name: 'Reserve hotel room blocks', category: 'Accommodations & Travel', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Share accommodation info with guests', category: 'Accommodations & Travel', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Book own wedding night accommodation', category: 'Accommodations & Travel', daysBeforeWedding: 150, status: 'Not Started' as const },
  { name: 'Arrange airport transportation for out-of-town guests', category: 'Accommodations & Travel', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Create welcome bags for guests', category: 'Accommodations & Travel', daysBeforeWedding: 30, status: 'Not Started' as const },

  { name: 'Create wedding registry', category: 'Registry & Gifts', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Add registry to wedding website', category: 'Registry & Gifts', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Purchase gifts for wedding party', category: 'Registry & Gifts', daysBeforeWedding: 45, status: 'Not Started' as const },
  { name: 'Write thank you notes', category: 'Registry & Gifts', daysBeforeWedding: -30, status: 'Not Started' as const },

  { name: 'Choose wedding favors', category: 'Wedding Favors & Details', daysBeforeWedding: 120, status: 'Not Started' as const },
  { name: 'Order wedding favors', category: 'Wedding Favors & Details', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Design ceremony programs', category: 'Wedding Favors & Details', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Create seating chart', category: 'Wedding Favors & Details', daysBeforeWedding: 30, status: 'Not Started' as const },
  { name: 'Order place cards and table numbers', category: 'Wedding Favors & Details', daysBeforeWedding: 60, status: 'Not Started' as const },

  { name: 'Plan engagement party', category: 'Pre-Wedding Events', daysBeforeWedding: 300, status: 'Not Started' as const },
  { name: 'Plan bridal shower', category: 'Pre-Wedding Events', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Plan bachelor party', category: 'Pre-Wedding Events', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Plan bachelorette party', category: 'Pre-Wedding Events', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Organize rehearsal dinner', category: 'Pre-Wedding Events', daysBeforeWedding: 30, status: 'Not Started' as const },

  { name: 'Create wedding website', category: 'Wedding Website & Communications', daysBeforeWedding: 270, status: 'Not Started' as const },
  { name: 'Update website with details', category: 'Wedding Website & Communications', daysBeforeWedding: 180, status: 'Not Started' as const },

  { name: 'Create vendor contact list', category: 'Vendor Management', daysBeforeWedding: 240, status: 'Not Started' as const },
  { name: 'Confirm all vendor contracts', category: 'Vendor Management', daysBeforeWedding: 60, status: 'Not Started' as const },
  { name: 'Send vendor final details', category: 'Vendor Management', daysBeforeWedding: 14, status: 'Not Started' as const },
  { name: 'Prepare vendor tip envelopes', category: 'Vendor Management', daysBeforeWedding: 7, status: 'Not Started' as const },

  { name: 'Create detailed wedding day schedule', category: 'Wedding Day Timeline', daysBeforeWedding: 45, status: 'Not Started' as const },
  { name: 'Share timeline with wedding party', category: 'Wedding Day Timeline', daysBeforeWedding: 30, status: 'Not Started' as const },
  { name: 'Share timeline with vendors', category: 'Wedding Day Timeline', daysBeforeWedding: 21, status: 'Not Started' as const },
  { name: 'Prepare emergency kit', category: 'Wedding Day Timeline', daysBeforeWedding: 7, status: 'Not Started' as const },
  { name: 'Pack for wedding night', category: 'Wedding Day Timeline', daysBeforeWedding: 2, status: 'Not Started' as const },

  { name: 'Start wedding fitness routine', category: 'Health & Wellness', daysBeforeWedding: 180, status: 'Not Started' as const },
  { name: 'Schedule pre-wedding spa day', category: 'Health & Wellness', daysBeforeWedding: 7, status: 'Not Started' as const },
  { name: 'Plan healthy menu leading up to wedding', category: 'Health & Wellness', daysBeforeWedding: 90, status: 'Not Started' as const },
  { name: 'Get final dental cleaning', category: 'Health & Wellness', daysBeforeWedding: 30, status: 'Not Started' as const },
  { name: 'Start skincare routine', category: 'Health & Wellness', daysBeforeWedding: 120, status: 'Not Started' as const },

  { name: 'Obtain marriage license', category: 'Legal & Administrative', daysBeforeWedding: 30, status: 'Not Started' as const },
  { name: 'Update name on documents if changing', category: 'Legal & Administrative', daysBeforeWedding: -14, status: 'Not Started' as const },
  { name: 'Update insurance policies', category: 'Legal & Administrative', daysBeforeWedding: -30, status: 'Not Started' as const },
  { name: 'Create will and estate planning', category: 'Legal & Administrative', daysBeforeWedding: -60, status: 'Not Started' as const },

  { name: 'Send thank you notes for gifts', category: 'Post-Wedding', daysBeforeWedding: -30, status: 'Not Started' as const },
  { name: 'Preserve wedding dress', category: 'Post-Wedding', daysBeforeWedding: -60, status: 'Not Started' as const },
  { name: 'Create wedding photo album', category: 'Post-Wedding', daysBeforeWedding: -90, status: 'Not Started' as const },
  { name: 'Share wedding photos with guests', category: 'Post-Wedding', daysBeforeWedding: -60, status: 'Not Started' as const },
  { name: 'Return rental items', category: 'Post-Wedding', daysBeforeWedding: -7, status: 'Not Started' as const }
];

export const calculateDueDate = (weddingDate: Date, daysBeforeWedding: number): Date => {
  const dueDate = new Date(weddingDate);
  dueDate.setDate(dueDate.getDate() - daysBeforeWedding);
  return dueDate;
};

export const calculateSuggestedBudgets = (totalBudget: number): Record<string, number> => {
  const budgets: Record<string, number> = {};
  taskCategories.forEach(category => {
    budgets[category.name] = Math.round((totalBudget * category.suggestedPercentage) / 100);
  });
  return budgets;
};

export const createInitialTasks = (
  weddingDate: Date,
  template: Wedding['template'] = 'Traditional',
  totalBudget: number = 30000
): Task[] => {
  const tasksToUse = expandedTasksTemplate.filter(task =>
    task.includeInTemplates.includes(template)
  );

  const categoryBudgets = calculateSuggestedBudgets(totalBudget);

  const tasksByCategory = tasksToUse.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasksToUse>);

  const budgetAllocations: Record<string, number> = {};
  Object.entries(tasksByCategory).forEach(([category, tasks]) => {
    const categoryBudget = categoryBudgets[category] || 0;
    const tasksWithExpenses = tasks.filter(t => t.hasExpenses);
    const budgetPerTask = tasksWithExpenses.length > 0
      ? categoryBudget / tasksWithExpenses.length
      : 0;

    tasks.forEach(task => {
      if (task.name === 'Set wedding budget') {
        budgetAllocations[task.name] = totalBudget;
      } else {
        budgetAllocations[task.name] = task.hasExpenses ? budgetPerTask : 0;
      }
    });
  });

  return tasksToUse.map((task, index) => ({
    id: `task-${index + 1}`,
    name: task.name,
    category: task.category,
    daysBeforeWedding: task.daysBeforeWedding,
    dueDate: calculateDueDate(weddingDate, task.daysBeforeWedding),
    status: task.status,
    isManualDate: false,
    budgetAllocated: budgetAllocations[task.name] || 0,
    budgetActual: 0,
    paidToDate: 0,
    depositAmount: 0,
    depositDate: null,
    balanceDue: 0,
    paymentStatus: 'Not Paid' as const,
    priority: task.priority,
    assignedTo: null,
    notes: [],
    hasExpenses: task.hasExpenses
  }));
};
