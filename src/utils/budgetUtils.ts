import { Task, CategoryBudget, BudgetSummary, Vendor } from '../types';
import { taskCategories } from '../data/taskData';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateCategoryBudgets = (
  tasks: Task[],
  categoryBudgets: Record<string, number>,
  vendors: Vendor[] = []
): CategoryBudget[] => {
  const categoryMap = new Map<string, CategoryBudget>();

  taskCategories.forEach(category => {
    categoryMap.set(category.name, {
      name: category.name,
      icon: category.icon,
      suggestedPercentage: category.suggestedPercentage,
      allocatedBudget: categoryBudgets[category.name] || 0,
      spentAmount: 0,
      remaining: categoryBudgets[category.name] || 0,
      percentage: 0
    });
  });

  tasks.forEach(task => {
    const category = categoryMap.get(task.category);
    if (category) {
      category.spentAmount += task.budgetActual;
    }
  });

  vendors.forEach(vendor => {
    const category = categoryMap.get(vendor.category);
    if (category) {
      let vendorSpent = 0;
      if (vendor.depositPaid) {
        vendorSpent += vendor.depositAmount || 0;
      }
      if (vendor.finalPaymentPaid) {
        vendorSpent += vendor.balanceDue || 0;
      }
      category.spentAmount += vendorSpent;
    }
  });

  categoryMap.forEach(category => {
    category.remaining = category.allocatedBudget - category.spentAmount;
    if (category.allocatedBudget > 0) {
      category.percentage = (category.spentAmount / category.allocatedBudget) * 100;
    }
  });

  return Array.from(categoryMap.values());
};

export const calculateBudgetSummary = (
  totalBudget: number,
  tasks: Task[],
  categoryBudgets: Record<string, number>,
  vendors: Vendor[] = []
): BudgetSummary => {
  const totalAllocated = Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0);
  const taskSpent = tasks.reduce((sum, task) => sum + task.budgetActual, 0);

  const vendorSpent = vendors.reduce((sum, vendor) => {
    let spent = 0;
    if (vendor.depositPaid) {
      spent += vendor.depositAmount || 0;
    }
    if (vendor.finalPaymentPaid) {
      spent += vendor.balanceDue || 0;
    }
    return sum + spent;
  }, 0);

  const totalSpent = taskSpent + vendorSpent;
  const totalCommitted = tasks.reduce((sum, task) => sum + task.depositAmount, 0);
  const remaining = totalBudget - totalSpent;
  const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return {
    totalBudget,
    totalAllocated,
    totalSpent,
    totalCommitted,
    remaining,
    utilizationPercentage
  };
};

export const getBudgetColorClass = (percentage: number): string => {
  if (percentage >= 95) return 'text-red-600';
  if (percentage >= 80) return 'text-amber-600';
  return 'text-emerald-600';
};

export const getBudgetBgColorClass = (percentage: number): string => {
  if (percentage >= 95) return 'bg-red-50 border-red-200';
  if (percentage >= 80) return 'bg-amber-50 border-amber-200';
  return 'bg-emerald-50 border-emerald-200';
};

export const getBudgetProgressColor = (percentage: number): string => {
  if (percentage >= 95) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  return 'bg-emerald-500';
};

export const calculateSuggestedBudgets = (totalBudget: number): Record<string, number> => {
  const budgets: Record<string, number> = {};
  taskCategories.forEach(category => {
    budgets[category.name] = Math.round((totalBudget * category.suggestedPercentage) / 100);
  });
  return budgets;
};

export const getOverBudgetCategories = (categoryBudgets: CategoryBudget[]): CategoryBudget[] => {
  return categoryBudgets.filter(cat => cat.spentAmount > cat.allocatedBudget && cat.allocatedBudget > 0);
};

export const getTopSpendingCategories = (categoryBudgets: CategoryBudget[], count: number = 3): CategoryBudget[] => {
  return [...categoryBudgets]
    .sort((a, b) => b.spentAmount - a.spentAmount)
    .slice(0, count)
    .filter(cat => cat.spentAmount > 0);
};

export const getCategoryTaskSummary = (tasks: Task[], category: string) => {
  const categoryTasks = tasks.filter(t => t.category === category);
  const allocated = categoryTasks.reduce((sum, t) => sum + t.budgetAllocated, 0);
  const spent = categoryTasks.reduce((sum, t) => sum + t.budgetActual, 0);
  const committed = categoryTasks.reduce((sum, t) => sum + t.depositAmount, 0);

  return {
    allocated,
    spent,
    committed,
    remaining: allocated - spent,
    taskCount: categoryTasks.length,
    budgetedTaskCount: categoryTasks.filter(t => t.budgetAllocated > 0).length
  };
};

export const categoryHasExpenses = (tasks: Task[], categoryName: string): boolean => {
  return tasks.some(task => task.category === categoryName && task.hasExpenses);
};
