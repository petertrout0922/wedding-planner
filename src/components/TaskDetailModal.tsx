import React, { useState } from 'react';
import { X, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { formatDueDate } from '../utils/taskUtils';
import { formatCurrency } from '../utils/budgetUtils';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onToggleComplete: () => void;
  onUpdateTask: (updates: Partial<Task>) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onToggleComplete,
  onUpdateTask,
  onEdit,
  onDelete
}) => {
  const [budgetAllocated, setBudgetAllocated] = useState(task.budgetAllocated.toString());
  const [budgetActual, setBudgetActual] = useState(task.budgetActual.toString());
  const [depositAmount, setDepositAmount] = useState(task.depositAmount.toString());
  const [depositDate, setDepositDate] = useState(
    task.depositDate ? task.depositDate.toISOString().split('T')[0] : ''
  );
  const [notes, setNotes] = useState(
    task.notes.map(note => note.text).join('\n')
  );

  const handleSaveAndClose = () => {
    const actualCost = parseFloat(budgetActual) || 0;
    const deposit = parseFloat(depositAmount) || 0;
    const balanceDue = actualCost - deposit;

    const updatedNotes = notes.trim()
      ? [{ text: notes, timestamp: new Date() }]
      : [];

    onUpdateTask({
      budgetAllocated: parseFloat(budgetAllocated) || 0,
      budgetActual: actualCost,
      depositAmount: deposit,
      depositDate: depositDate ? new Date(depositDate) : null,
      balanceDue: balanceDue,
      notes: updatedNotes
    });
    onClose();
  };

  const calculatedBalanceDue = (parseFloat(budgetActual) || 0) - (parseFloat(depositAmount) || 0);

  const getPaymentStatusBadge = () => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium border';
    switch (task.paymentStatus) {
      case 'Fully Paid':
        return `${baseClasses} bg-emerald-100 text-emerald-700 border-emerald-200`;
      case 'Deposit Paid':
        return `${baseClasses} bg-blue-100 text-blue-700 border-blue-200`;
      case 'Not Paid':
        return `${baseClasses} bg-gray-100 text-gray-700 border-gray-200`;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-gray-800">Task Details</h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Task Name
            </label>
            <p className="text-lg text-gray-800">{task.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Category
            </label>
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
              {task.category}
            </span>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Due Date
            </label>
            <p className="text-lg text-gray-800">{formatDueDate(task.dueDate)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {task.daysBeforeWedding >= 0
                ? `${task.daysBeforeWedding} days before wedding`
                : `${Math.abs(task.daysBeforeWedding)} days after wedding`}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Status</label>
            <select
              value={task.status}
              onChange={(e) => onUpdateTask({ status: e.target.value as Task['status'] })}
              className={`px-3 py-2 rounded-lg text-sm font-medium border cursor-pointer focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                task.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : task.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {task.hasExpenses && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Budget & Payment</h3>
                  <p className="text-sm text-gray-600">Manage costs for this task</p>
                </div>
              </div>

              <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Budget Allocated
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={budgetAllocated}
                      onChange={(e) => setBudgetAllocated(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Actual Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={budgetActual}
                      onChange={(e) => setBudgetActual(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Deposit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Deposit Date
                  </label>
                  <input
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={getPaymentStatusBadge()}>{task.paymentStatus}</span>
                </div>
                {(parseFloat(budgetActual) || 0) > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(parseFloat(depositAmount) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Balance Due:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(calculatedBalanceDue)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="font-bold text-gray-800">{formatCurrency(parseFloat(budgetActual) || 0)}</span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                  placeholder="Add notes about this task..."
                  rows={5}
                />
              </div>

              <button
                onClick={handleSaveAndClose}
                className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
          )}

          {!task.hasExpenses && (
            <div className="border-t border-gray-200 pt-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                  placeholder="Add notes about this task..."
                  rows={5}
                />
              </div>

              <button
                onClick={handleSaveAndClose}
                className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors mt-4"
              >
                Save & Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
