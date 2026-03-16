import React, { useMemo, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { categoryHasExpenses } from '../utils/budgetUtils';
import { taskCategories } from '../data/taskData';
import { TaskFormModal } from '../components/TaskFormModal';
import { Task } from '../types';
import { HelpTooltip } from '../components/HelpTooltip';

interface CategoryBudget {
  name: string;
  suggestedPercentage: number;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export const Budget: React.FC = () => {
  const { totalBudget, categoryBudgets, tasks, vendors, updateTask } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTaskSpreadsheetExpanded, setIsTaskSpreadsheetExpanded] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const categories = useMemo(() => {
    const categoryData: Record<string, CategoryBudget> = {};

    Object.entries(categoryBudgets).forEach(([category, allocated]) => {
      const taskSpent = tasks
        .filter(task => task.category === category)
        .reduce((sum, task) => sum + task.budgetActual, 0);

      const vendorSpentAndCommitted = vendors
        .filter(vendor => vendor.category === category)
        .reduce((sum, vendor) => {
          let spent = 0;
          if (vendor.depositPaid) {
            spent += vendor.depositAmount || 0;
          }
          if (vendor.finalPaymentPaid) {
            spent += vendor.balanceDue || 0;
          }
          return sum + spent;
        }, 0);

      const spent = taskSpent + vendorSpentAndCommitted;
      const remaining = allocated - spent;
      const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;

      const categoryInfo = taskCategories.find(c => c.name === category);
      const suggestedPercentage = categoryInfo?.suggestedPercentage || 0;

      categoryData[category] = {
        name: category,
        suggestedPercentage,
        allocated,
        spent,
        remaining,
        percentage
      };
    });

    return Object.values(categoryData).sort((a, b) => b.allocated - a.allocated);
  }, [categoryBudgets, tasks, vendors]);

  const totals = useMemo(() => {
    const allocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const spent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = allocated - spent;
    const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;

    return { allocated, spent, remaining, percentage };
  }, [categories]);

  const taskStats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return { completedTasks, totalTasks, completionPercentage };
  }, [tasks]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage >= 90) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (percentage >= 75) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Budget</h1>
          <HelpTooltip content="Track all wedding expenses by category. Your budget automatically updates as you add costs to tasks and vendors. Set your total budget in Settings." />
        </div>
        <p className="text-gray-600">Track your wedding expenses and manage your budget</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Budget</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800">${totalBudget.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Allocated</span>
            <PieChart className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800">${totals.allocated.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">
            {((totals.allocated / totalBudget) * 100).toFixed(0)}% of budget
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl shadow-lg border border-primary-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Spent or Amount Committed</span>
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800">${totals.spent.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">
            {totals.percentage.toFixed(0)}% of total budget
          </div>
        </div>

        <div className={`rounded-xl shadow-lg border p-6 ${
          totals.remaining >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
            : 'bg-gradient-to-br from-red-50 to-primary-50 border-red-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Remaining</span>
            {totals.remaining >= 0 ? (
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className={`text-3xl font-bold ${totals.remaining >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
            ${Math.abs(totals.remaining).toLocaleString()}
          </div>
          {totals.remaining < 0 && (
            <div className="text-sm text-red-600 mt-1 font-medium">Over budget</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Overall Progress</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-700">Amount Spent</h3>
              <span className="text-xl font-bold text-gray-800">{totals.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${getProgressColor(totals.percentage)}`}
                style={{ width: `${Math.min(totals.percentage, 100)}%` }}
              />
            </div>
            {totals.percentage >= 90 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Budget Alert:</span> You've used {totals.percentage.toFixed(0)}% of your total budget.
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-700">Completed Tasks</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{taskStats.completedTasks} of {taskStats.totalTasks} tasks</span>
                <span className="text-xl font-bold text-gray-800">{taskStats.completionPercentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${getProgressColor(taskStats.completionPercentage)}`}
                style={{ width: `${Math.min(taskStats.completionPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-xl font-serif font-bold text-gray-800">Expenses by Category</h2>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            {isExpanded ? (
              <>
                Collapse
                <ChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                Expand
                <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{category.name}</span>
                        {category.suggestedPercentage > 0 && (
                          <span className="text-xs text-gray-500">({category.suggestedPercentage}%)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {category.allocated === 0 ? (
                        <span className="text-gray-500 font-medium italic">
                          {categoryHasExpenses(tasks, category.name) ? 'TBD' : 'N/A'}
                        </span>
                      ) : (
                        <span className="text-gray-800 font-medium">
                          ${category.allocated.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-gray-800">
                        ${category.spent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={category.remaining < 0 ? 'text-red-600 font-medium' : 'text-gray-800'}>
                        ${Math.abs(category.remaining).toLocaleString()}
                        {category.remaining < 0 && ' over'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(category.percentage)}`}
                            style={{ width: `${Math.min(category.percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12 text-right">
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(category.percentage)}`}>
                        {category.percentage >= 100 ? 'Over' : category.percentage >= 90 ? 'High' : category.percentage >= 75 ? 'Medium' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-8">
        <div
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsTaskSpreadsheetExpanded(!isTaskSpreadsheetExpanded)}
        >
          <h2 className="text-xl font-serif font-bold text-gray-800">Budget by Task Spreadsheet</h2>
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            {isTaskSpreadsheetExpanded ? (
              <>
                Collapse
                <ChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                Expand
                <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {isTaskSpreadsheetExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Due<br/>Date</div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Amount<br/>Budgeted</div>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Amount<br/>Spent/<br/>Committed</div>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Budget<br/>Remaining</div>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Paid<br/>To<br/>Date</div>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="leading-tight">Outstanding<br/>Amount</div>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                    <div className="leading-tight">Edit<br/>Entry</div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((task) => {
                    const budgetRemaining = task.budgetAllocated !== null ? task.budgetAllocated - task.budgetActual : null;
                    const outstandingAmount = task.budgetActual - task.paidToDate;
                    return (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span className="text-gray-800">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="text-gray-800">{task.name}</span>
                        </td>
                        <td className="px-3 py-4 text-right whitespace-nowrap text-sm">
                          {task.budgetAllocated === null ? (
                            <span className="text-gray-500 italic">N/A</span>
                          ) : (
                            <span className="text-gray-800">
                              ${task.budgetAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-right whitespace-nowrap text-sm">
                          <span className="text-gray-800">
                            ${task.budgetActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right whitespace-nowrap text-sm">
                          {budgetRemaining === null ? (
                            <span className="text-gray-500 italic">N/A</span>
                          ) : (
                            <span className={`font-medium ${budgetRemaining < 0 ? 'text-red-600' : budgetRemaining === 0 ? 'text-gray-600' : 'text-green-600'}`}>
                              ${budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-right whitespace-nowrap text-sm">
                          <span className="text-gray-800">
                            ${task.paidToDate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right whitespace-nowrap text-sm">
                          <span className={`font-medium ${outstandingAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            ${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-center whitespace-nowrap sticky right-0 bg-white">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary-50 text-primary-600 hover:text-primary-700 transition-colors"
                            title="Edit Task"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No budget categories yet</h3>
          <p className="text-gray-600 mb-6">Complete the setup wizard to configure your budget</p>
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Track all expenses as they happen to stay on budget</li>
          <li>• Build in a 10% contingency fund for unexpected costs</li>
          <li>• Review your budget weekly to catch overspending early</li>
          <li>• Consider DIY options for decorations and favors to save money</li>
          <li>• Don't forget to account for tips and service charges</li>
        </ul>
      </div>

      {editingTask && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedTask) => {
            updateTask(editingTask.id, updatedTask);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
