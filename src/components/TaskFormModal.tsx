import React, { useState } from 'react';
import { X, Calendar, DollarSign, User, Info } from 'lucide-react';
import { Task } from '../types';
import { useApp } from '../contexts/AppContext';

interface TaskFormModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
}

const categories = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Music & Entertainment',
  'Flowers & Decorations', 'Attire', 'Invitations & Stationery', 'Beauty & Hair',
  'Transportation', 'Accommodations', 'Wedding Cake', 'Favors & Gifts',
  'Ceremony', 'Reception', 'Rehearsal Dinner', 'Pre-Wedding Events',
  'Post-Wedding Events', 'Legal & Administrative', 'Miscellaneous', 'Honeymoon', 'Other'
];

const priorities = ['Required', 'Optional', 'Conditional'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, onClose, onSave }) => {
  const { users } = useApp();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    name: task?.name || '',
    category: task?.category || 'Other',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    status: task?.status || 'Not Started',
    priority: task?.priority || 'Optional',
    assignedTo: task?.assignedTo || null,
    budgetAllocated: task?.budgetAllocated ?? 0,
    budgetActual: task?.budgetActual || 0,
    paidToDate: task?.paidToDate || 0,
    daysBeforeWedding: task?.daysBeforeWedding || 0,
    isManualDate: task?.isManualDate || false
  });

  const [budgetAllocatedInput, setBudgetAllocatedInput] = useState<string>(
    task?.budgetAllocated === null ? 'N/A' : (task?.budgetAllocated ? formatCurrency(task.budgetAllocated) : '0.00')
  );

  const [budgetActualInput, setBudgetActualInput] = useState<string>(
    task?.budgetActual ? formatCurrency(task.budgetActual) : '0.00'
  );

  const [paidToDateInput, setPaidToDateInput] = useState<string>(
    task?.paidToDate ? formatCurrency(task.paidToDate) : '0.00'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBudgetAllocatedChange = (value: string) => {
    setBudgetAllocatedInput(value);
    const upperValue = value.trim().toUpperCase();
    if (upperValue === 'N/A' || upperValue === 'NA') {
      handleChange('budgetAllocated', null);
    } else {
      const numValue = parseCurrency(value);
      handleChange('budgetAllocated', numValue);
    }
  };

  const handleBudgetActualChange = (value: string) => {
    setBudgetActualInput(value);
    const numValue = parseCurrency(value);
    handleChange('budgetActual', numValue);
  };

  const handlePaidToDateChange = (value: string) => {
    setPaidToDateInput(value);
    const numValue = parseCurrency(value);
    handleChange('paidToDate', numValue);
  };

  const handleBudgetAllocatedBlur = () => {
    const upperValue = budgetAllocatedInput.trim().toUpperCase();
    if (upperValue !== 'N/A' && upperValue !== 'NA' && formData.budgetAllocated !== null) {
      setBudgetAllocatedInput(formatCurrency(formData.budgetAllocated));
    }
  };

  const handleBudgetActualBlur = () => {
    setBudgetActualInput(formatCurrency(formData.budgetActual));
  };

  const handlePaidToDateBlur = () => {
    setPaidToDateInput(formatCurrency(formData.paidToDate));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      notes: task?.notes || [],
      paymentStatus: (task?.paymentStatus || 'Not Paid') as 'Not Paid' | 'Deposit Paid' | 'Fully Paid',
      depositAmount: task?.depositAmount || 0,
      depositDate: task?.depositDate || null,
      balanceDue: task?.balanceDue || 0,
      hasExpenses: task?.hasExpenses || false
    };

    if (isEditing) {
      onSave({ ...taskData, id: task.id });
    } else {
      onSave(taskData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
              placeholder="e.g., Book wedding venue"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center gap-1">
                  Category *
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="space-y-1.5">
                        <div className="font-semibold mb-2">Common budget categories:</div>
                        <div><span className="font-semibold">Venue:</span> Ceremony and reception locations</div>
                        <div><span className="font-semibold">Catering:</span> Food, drinks, and service</div>
                        <div><span className="font-semibold">Photography:</span> Professional photos and albums</div>
                        <div><span className="font-semibold">Attire:</span> Wedding dress, suit, and accessories</div>
                        <div><span className="font-semibold">Flowers:</span> Bouquets, centerpieces, and decor</div>
                      </div>
                      <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-400 focus:border-transparent`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center gap-1">
                  Priority
                  <div className="relative group">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="space-y-1.5">
                        <div><span className="font-semibold">Required:</span> Essential tasks that must be completed</div>
                        <div><span className="font-semibold">Optional:</span> Nice-to-have tasks that can be skipped</div>
                        <div><span className="font-semibold">Conditional:</span> Tasks that depend on specific choices</div>
                      </div>
                      <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Assign To
            </label>
            <select
              value={formData.assignedTo || ''}
              onChange={(e) => handleChange('assignedTo', e.target.value || null)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Budget Allocated
              </label>
              <input
                type="text"
                value={budgetAllocatedInput}
                onChange={(e) => handleBudgetAllocatedChange(e.target.value)}
                onBlur={handleBudgetAllocatedBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                placeholder="Enter amount or N/A"
              />
              <p className="mt-1 text-xs text-gray-500">Enter a number or "N/A" for no cost</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount Spent/Committed
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={budgetActualInput}
                  onChange={(e) => handleBudgetActualChange(e.target.value)}
                  onBlur={handleBudgetActualBlur}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Paid To Date
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={paidToDateInput}
                  onChange={(e) => handlePaidToDateChange(e.target.value)}
                  onBlur={handlePaidToDateBlur}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Outstanding Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formatCurrency(formData.budgetActual - formData.paidToDate)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-lg"
            >
              {isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
