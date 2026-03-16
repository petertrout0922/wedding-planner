import { Task } from '../types';

export const exportTasksToCSV = (tasks: Task[], filename: string = 'wedding-tasks.csv') => {
  const headers = [
    'Task Name',
    'Category',
    'Due Date',
    'Status',
    'Priority',
    'Assigned To',
    'Vendor',
    'Budget Allocated',
    'Budget Actual',
    'Paid to Date',
    'Deposit Amount',
    'Deposit Date',
    'Balance Due',
    'Payment Status',
    'Notes'
  ];

  const rows = tasks.map(task => [
    task.name || task.title || '',
    task.category,
    task.dueDate.toLocaleDateString(),
    task.status,
    task.priority,
    task.assignedTo || 'Unassigned',
    task.vendor || '',
    task.budgetAllocated?.toString() || '0',
    task.budgetActual?.toString() || '0',
    task.paidToDate?.toString() || '0',
    task.depositAmount?.toString() || '0',
    task.depositDate ? new Date(task.depositDate).toLocaleDateString() : '',
    task.balanceDue?.toString() || '0',
    task.paymentStatus || 'Not Paid',
    task.notes?.map(n => n.text).join('; ') || task.description || ''
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
