import React, { useState } from 'react';
import { Calendar, AlertCircle, Users, DollarSign, Download, Settings as SettingsIcon, Bell, Heart, UserPlus, Copy, Check, RefreshCw, Utensils } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../utils/supabase';
import { createInitialTasks } from '../data/taskData';
import { Task } from '../types';
import { exportTasksToCSV } from '../utils/exportUtils';
import { HelpTooltip } from '../components/HelpTooltip';
import { MealTypesModal } from '../components/MealTypesModal';

export const Settings: React.FC = () => {
  const { weddingDate, updateWeddingDate, totalBudget, setTotalBudget, tasks, setTasks, guests, vendors, wedding } = useApp();
  const [activeTab, setActiveTab] = useState('wedding');
  const [tempDate, setTempDate] = useState(weddingDate.toISOString().split('T')[0]);
  const [currentWeddingType, setCurrentWeddingType] = useState<string>('traditional');
  const [isUpdatingTasks, setIsUpdatingTasks] = useState(false);
  const [settings, setSettings] = useState({
    showHealthWellness: false,
    showPostWeddingEarly: false,
    budgetAlerts: { at90: true, at95: true, at100: true },
    ceremonyLocation: '',
    receptionLocation: '',
    weddingWebsite: '',
    expectedGuestCount: 150
  });
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isOriginalUser, setIsOriginalUser] = useState(false);
  const [showTypeChangeConfirm, setShowTypeChangeConfirm] = useState(false);
  const [pendingWeddingType, setPendingWeddingType] = useState<string | null>(null);
  const [typeChangePreview, setTypeChangePreview] = useState<{ toAdd: number; toRemove: number }>({ toAdd: 0, toRemove: 0 });
  const [tasksToBeRemoved, setTasksToBeRemoved] = useState<Task[]>([]);
  const [showMealTypesModal, setShowMealTypesModal] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  React.useEffect(() => {
    loadCurrentWeddingType();
    loadJoinCode();
    loadCoupleId();
  }, []);

  const loadCoupleId = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: coupleData } = await supabase
        .from('couples')
        .select('id')
        .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
        .maybeSingle();

      if (coupleData) {
        setCoupleId(coupleData.id);
      }
    } catch (err) {
      console.error('Error loading couple ID:', err);
    }
  };

  const loadJoinCode = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: coupleData } = await supabase
        .from('couples')
        .select('join_code, user_id, partner2_user_id')
        .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
        .maybeSingle();

      if (coupleData?.join_code) {
        setJoinCode(coupleData.join_code);
        setIsOriginalUser(coupleData.user_id === session.user.id);
      }
    } catch (err) {
      console.error('Error loading join code:', err);
    }
  };

  const generateJoinCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const handleGenerateJoinCode = async () => {
    setIsGeneratingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to generate a join code');
        setIsGeneratingCode(false);
        return;
      }

      const { data: coupleData } = await supabase
        .from('couples')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!coupleData) {
        alert('Unable to load your wedding details');
        setIsGeneratingCode(false);
        return;
      }

      let newCode: string;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        newCode = generateJoinCode();

        const { error: updateError } = await supabase
          .from('couples')
          .update({ join_code: newCode })
          .eq('id', coupleData.id);

        if (!updateError) {
          setJoinCode(newCode);
          setIsGeneratingCode(false);
          return;
        }

        if (updateError.code === '23505') {
          attempts++;
          continue;
        }

        console.error('Error generating join code:', updateError);
        alert('Failed to generate join code. Please try again.');
        setIsGeneratingCode(false);
        return;
      }

      alert('Unable to generate a unique code. Please try again.');
    } catch (err) {
      console.error('Error generating join code:', err);
      alert('An error occurred while generating join code');
    }
    setIsGeneratingCode(false);
  };

  const copyJoinCode = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const loadCurrentWeddingType = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: coupleData } = await supabase
        .from('couples')
        .select('wedding_type')
        .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
        .maybeSingle();

      if (coupleData?.wedding_type) {
        setCurrentWeddingType(coupleData.wedding_type);
      }
    } catch (err) {
      console.error('Error loading wedding type:', err);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
    const newDate = new Date(e.target.value);
    updateWeddingDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const exportTasksCSV = () => {
    const headers = ['Task Name', 'Category', 'Due Date', 'Status', 'Priority', 'Assigned To', 'Budget Allocated', 'Actual Cost', 'Notes'];
    const rows = tasks.map(task => [
      task.name,
      task.category,
      task.dueDate.toLocaleDateString(),
      task.status,
      task.priority,
      task.assignedTo || 'Unassigned',
      task.budgetAllocated,
      task.budgetActual,
      task.notes.map(n => n.text).join('; ')
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-tasks.csv';
    a.click();
  };

  const exportGuestsCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'RSVP Status', 'Meal Choice', 'Table Number', 'Plus One'];
    const rows = guests.map(guest => [
      guest.firstName,
      guest.lastName,
      guest.email,
      guest.phone,
      guest.rsvpStatus,
      guest.mealChoice,
      guest.tableNumber || '',
      guest.plusOneName || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guests.csv';
    a.click();
  };

  const exportAllData = () => {
    const data = {
      wedding,
      weddingDate,
      totalBudget,
      tasks,
      guests,
      vendors,
      exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-data-backup.json';
    a.click();
  };

  const previewWeddingTypeChange = async (newType: string) => {
    if (newType === currentWeddingType) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: coupleData } = await supabase
        .from('couples')
        .select('id, wedding_date, budget')
        .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
        .maybeSingle();

      if (!coupleData) return;

      const weddingTypeMap: Record<string, 'Traditional' | 'Destination' | 'Small' | 'Micro' | 'DIY'> = {
        'traditional': 'Traditional',
        'destination': 'Destination',
        'small': 'Small',
        'micro': 'Micro',
        'diy': 'DIY'
      };

      const oldTypeFormatted = weddingTypeMap[currentWeddingType.toLowerCase()] || 'Traditional';
      const newTypeFormatted = weddingTypeMap[newType.toLowerCase()] || 'Traditional';

      const weddingDateToUse = coupleData.wedding_date ? new Date(coupleData.wedding_date) : weddingDate;
      const budgetToUse = coupleData.budget ? Number(coupleData.budget) : totalBudget;

      const oldTasks = createInitialTasks(weddingDateToUse, oldTypeFormatted, budgetToUse);
      const newTasks = createInitialTasks(weddingDateToUse, newTypeFormatted, budgetToUse);

      const oldTaskNames = new Set(oldTasks.map(t => t.name));
      const newTaskNames = new Set(newTasks.map(t => t.name));

      const tasksToRemoveNames = Array.from(oldTaskNames).filter(name => !newTaskNames.has(name));
      const tasksToAdd = newTasks.filter(task => !oldTaskNames.has(task.name));

      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('couple_id', coupleData.id);

      const tasksToRemove: Task[] = [];
      if (existingTasks && tasksToRemoveNames.length > 0) {
        existingTasks.forEach((task: any) => {
          if (tasksToRemoveNames.includes(task.title)) {
            tasksToRemove.push({
              id: task.id,
              name: task.title,
              title: task.title,
              category: task.category || '',
              status: task.completed ? 'Completed' : 'Not Started',
              dueDate: task.due_date ? new Date(task.due_date) : new Date(),
              priority: task.priority === 'high' ? 'Required' : task.priority === 'low' ? 'Optional' : 'Conditional',
              assignedTo: task.assigned_to || null,
              budgetAllocated: Number(task.budget_allocated) || 0,
              budgetActual: Number(task.budget_actual) || 0,
              paidToDate: Number(task.paid_to_date) || 0,
              depositAmount: Number(task.deposit_amount) || 0,
              depositDate: task.deposit_date ? new Date(task.deposit_date) : null,
              balanceDue: Number(task.balance_due) || 0,
              paymentStatus: (task.payment_status || 'Not Paid') as 'Not Paid' | 'Deposit Paid' | 'Fully Paid',
              vendor: task.vendor || '',
              description: task.description || '',
              notes: task.description ? [{ text: task.description, timestamp: new Date() }] : [],
              daysBeforeWedding: 0,
              isManualDate: true,
              hasExpenses: (Number(task.budget_allocated) || 0) > 0 || (Number(task.budget_actual) || 0) > 0
            });
          }
        });
      }

      setTasksToBeRemoved(tasksToRemove);
      setTypeChangePreview({ toAdd: tasksToAdd.length, toRemove: tasksToRemove.length });
      setPendingWeddingType(newType);
      setShowTypeChangeConfirm(true);
    } catch (err) {
      console.error('Error previewing wedding type change:', err);
    }
  };

  const confirmWeddingTypeChange = async () => {
    if (!pendingWeddingType) return;

    setShowTypeChangeConfirm(false);
    setIsUpdatingTasks(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to update wedding type');
        setIsUpdatingTasks(false);
        return;
      }

      const { data: coupleData } = await supabase
        .from('couples')
        .select('id, wedding_date, budget')
        .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
        .maybeSingle();

      if (!coupleData) {
        alert('Unable to load your wedding details');
        setIsUpdatingTasks(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('couples')
        .update({ wedding_type: pendingWeddingType })
        .eq('id', coupleData.id);

      if (updateError) {
        console.error('Error updating wedding type:', updateError);
        alert('Failed to update wedding type');
        setIsUpdatingTasks(false);
        return;
      }

      const weddingTypeMap: Record<string, 'Traditional' | 'Destination' | 'Small' | 'Micro' | 'DIY'> = {
        'traditional': 'Traditional',
        'destination': 'Destination',
        'small': 'Small',
        'micro': 'Micro',
        'diy': 'DIY'
      };

      const oldTypeFormatted = weddingTypeMap[currentWeddingType.toLowerCase()] || 'Traditional';
      const newTypeFormatted = weddingTypeMap[pendingWeddingType.toLowerCase()] || 'Traditional';

      const weddingDateToUse = coupleData.wedding_date ? new Date(coupleData.wedding_date) : weddingDate;
      const budgetToUse = coupleData.budget ? Number(coupleData.budget) : totalBudget;

      const oldTasks = createInitialTasks(weddingDateToUse, oldTypeFormatted, budgetToUse);
      const newTasks = createInitialTasks(weddingDateToUse, newTypeFormatted, budgetToUse);

      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('couple_id', coupleData.id);

      const existingTaskMap = new Map();
      if (existingTasks) {
        existingTasks.forEach((task: any) => {
          existingTaskMap.set(task.title, task);
        });
      }

      const oldTaskNames = new Set(oldTasks.map(t => t.name));
      const newTaskNames = new Set(newTasks.map(t => t.name));

      const tasksToRemove = Array.from(oldTaskNames).filter(name => !newTaskNames.has(name));
      const tasksToAdd = newTasks.filter(task => !oldTaskNames.has(task.name));

      if (tasksToRemove.length > 0) {
        const tasksToDelete = tasksToRemove
          .map(name => existingTaskMap.get(name)?.id)
          .filter(id => id !== undefined);

        if (tasksToDelete.length > 0) {
          await supabase
            .from('tasks')
            .delete()
            .in('id', tasksToDelete);
        }
      }

      if (tasksToAdd.length > 0) {
        const newTasksToInsert = tasksToAdd.map((task: Task) => ({
          couple_id: coupleData.id,
          title: task.name,
          description: task.notes && task.notes.length > 0 ? task.notes[0].text : '',
          category: task.category,
          priority: task.priority === 'Required' ? 'high' : task.priority === 'Optional' ? 'low' : 'medium',
          due_date: task.dueDate.toISOString().split('T')[0],
          completed: false,
          days_before_wedding: task.daysBeforeWedding,
          is_manual_date: task.isManualDate
        }));

        await supabase
          .from('tasks')
          .insert(newTasksToInsert);
      }

      setCurrentWeddingType(pendingWeddingType);
      setPendingWeddingType(null);

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const { data: refreshedCouple } = await supabase
          .from('couples')
          .select('*')
          .or(`user_id.eq.${currentSession.user.id},partner2_user_id.eq.${currentSession.user.id}`)
          .maybeSingle();

        if (refreshedCouple) {
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('couple_id', refreshedCouple.id)
            .order('due_date', { ascending: true });

          if (tasksData) {
            const loadedTasks: Task[] = tasksData.map((task: any) => ({
              id: task.id,
              name: task.title,
              category: task.category || '',
              status: task.completed ? 'Completed' : 'Not Started',
              dueDate: task.due_date ? new Date(task.due_date) : new Date(),
              priority: task.priority === 'high' ? 'Required' : task.priority === 'low' ? 'Optional' : 'Conditional',
              assignedTo: task.assigned_to || null,
              budgetAllocated: Number(task.budget_allocated) || 0,
              budgetActual: Number(task.budget_actual) || 0,
              paidToDate: Number(task.paid_to_date) || 0,
              depositAmount: Number(task.deposit_amount) || 0,
              depositDate: task.deposit_date ? new Date(task.deposit_date) : null,
              balanceDue: Number(task.balance_due) || 0,
              paymentStatus: (task.payment_status || 'Not Paid') as 'Not Paid' | 'Deposit Paid' | 'Fully Paid',
              vendor: task.vendor || '',
              notes: task.description ? [{ text: task.description, timestamp: new Date() }] : [],
              daysBeforeWedding: task.days_before_wedding || 0,
              isManualDate: task.is_manual_date !== undefined ? task.is_manual_date : true,
              hasExpenses: (Number(task.budget_allocated) || 0) > 0 || (Number(task.budget_actual) || 0) > 0
            }));
            setTasks(loadedTasks);
          }
        }
      }

      alert(`Wedding type updated successfully!`);
    } catch (err) {
      console.error('Error updating wedding type:', err);
      alert('An error occurred while updating wedding type');
    }
    setIsUpdatingTasks(false);
  };

  const cancelWeddingTypeChange = () => {
    setShowTypeChangeConfirm(false);
    setPendingWeddingType(null);
    setTasksToBeRemoved([]);
  };

  const handleExportTasksBeforeDelete = () => {
    if (tasksToBeRemoved.length > 0) {
      const timestamp = new Date().toISOString().split('T')[0];
      exportTasksToCSV(tasksToBeRemoved, `tasks-to-be-removed-${timestamp}.csv`);
    }
  };

  const weddingTypes = [
    {
      value: 'traditional',
      label: 'Traditional Wedding',
      description: '100+ Guests, Full Reception'
    },
    {
      value: 'destination',
      label: 'Destination Wedding',
      description: 'Venue at Resort or Destination'
    },
    {
      value: 'small',
      label: 'Small Wedding',
      description: '20-50 Guests, Personal Touch'
    },
    {
      value: 'micro',
      label: 'Micro Wedding',
      description: '5-20 Guests, Ultra Intimate'
    }
  ];

  const allTabs = [
    { id: 'wedding', label: 'Wedding Details', icon: Calendar },
    { id: 'weddingType', label: 'Wedding Type', icon: Heart },
    { id: 'partner', label: 'Partner Invitation', icon: UserPlus },
    { id: 'mealTypes', label: 'Meal Types', icon: Utensils },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'export', label: 'Export Data', icon: Download }
  ];

  const tabs = isOriginalUser
    ? allTabs
    : allTabs.filter(tab => tab.id !== 'partner');

  return (
    <>
      {showMealTypesModal && coupleId && (
        <MealTypesModal
          coupleId={coupleId}
          onClose={() => setShowMealTypesModal(false)}
          onSave={() => {
            setShowMealTypesModal(false);
          }}
        />
      )}

      {showTypeChangeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Wedding Type Change</h2>
                <p className="text-gray-600 text-sm">
                  Changing your wedding type will modify your task list. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tasks to be added:</span>
                <span className="font-bold text-emerald-600 text-lg">+{typeChangePreview.toAdd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tasks to be removed:</span>
                <span className="font-bold text-primary-600 text-lg">-{typeChangePreview.toRemove}</span>
              </div>
            </div>

            {typeChangePreview.toRemove > 0 && (
              <>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-primary-800 font-medium mb-2">
                    Warning: Removed tasks will lose all associated data including notes, budget information, and completion status.
                  </p>
                  <p className="text-sm text-primary-700">
                    Consider exporting these tasks to CSV before proceeding, especially if you need to cancel contracts with vendors.
                  </p>
                </div>
                <button
                  onClick={handleExportTasksBeforeDelete}
                  className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                  <Download className="w-5 h-5" />
                  Export {typeChangePreview.toRemove} Task{typeChangePreview.toRemove !== 1 ? 's' : ''} to CSV
                </button>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={cancelWeddingTypeChange}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmWeddingTypeChange}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-600 transition-all"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your wedding preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'wedding' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Wedding Date</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={tempDate}
                      onChange={handleDateChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Note about date changes
                        </p>
                        <p className="text-sm text-blue-700">
                          Changing this will recalculate all task due dates based on the new wedding date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl border border-primary-100">
                    <p className="text-sm text-gray-600 mb-2">Current Wedding Date</p>
                    <p className="text-2xl font-serif font-bold text-gray-800">
                      {formatDate(weddingDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Venue Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ceremony Location
                    </label>
                    <input
                      type="text"
                      value={settings.ceremonyLocation}
                      onChange={(e) => setSettings({ ...settings, ceremonyLocation: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="St. Mary's Church"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reception Location
                    </label>
                    <input
                      type="text"
                      value={settings.receptionLocation}
                      onChange={(e) => setSettings({ ...settings, receptionLocation: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="Grand Ballroom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wedding Website URL
                    </label>
                    <input
                      type="url"
                      value={settings.weddingWebsite}
                      onChange={(e) => setSettings({ ...settings, weddingWebsite: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="https://ourwedding.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Guest Count
                    </label>
                    <input
                      type="number"
                      value={settings.expectedGuestCount}
                      onChange={(e) => setSettings({ ...settings, expectedGuestCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weddingType' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-serif font-bold text-gray-800">Wedding Type</h2>
                <HelpTooltip content="Your wedding type determines which tasks appear in your task list. Changing this will add or remove tasks specific to your wedding style. You can export tasks before they're removed." />
              </div>
              {isUpdatingTasks && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-semibold text-center">
                  Updating tasks...
                </div>
              )}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-50 rounded-lg border border-primary-200 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-900 mb-1">
                      Changing Wedding Type Will Update Tasks
                    </p>
                    <p className="text-sm text-primary-700">
                      Tasks will be added or removed to match your new wedding type. Existing task statuses and notes will be preserved.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {weddingTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      currentWeddingType === type.value
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    } ${isUpdatingTasks ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="weddingType"
                      value={type.value}
                      checked={currentWeddingType === type.value}
                      onChange={(e) => previewWeddingTypeChange(e.target.value)}
                      className="mt-1 w-4 h-4 text-primary-500 focus:ring-primary-400"
                      disabled={isUpdatingTasks}
                    />
                    <div className="ml-3">
                      <span className="font-semibold text-gray-800">{type.label}</span>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mealTypes' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-serif font-bold text-gray-800">Meal Types</h2>
                <HelpTooltip content="Customize the meal options that appear when adding or editing guests. These meal types help you track dietary preferences and provide accurate counts to your caterer." />
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">
                        Customize Your Meal Options
                      </p>
                      <p className="text-sm text-amber-700">
                        Add meal types like Vegetarian, Vegan, Gluten-Free, or Kids Menu. These options will appear when managing your guest list.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMealTypesModal(true)}
                  disabled={!coupleId}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  Manage Meal Types
                </button>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Common Meal Types:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span>Chicken, Beef, Fish, Pork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span>Vegetarian, Vegan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span>Gluten-Free, Dairy-Free</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      <span>Kids Menu, Special Dietary Needs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'partner' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-serif font-bold text-gray-800">Invite Your Partner</h2>
                <HelpTooltip content="Generate a unique 6-character code for your partner. They'll enter this code when registering to link their account to yours. Both of you can then view and manage all wedding details together." />
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Share Your Wedding Planner
                      </p>
                      <p className="text-sm text-blue-700">
                        Generate a join code and share it with your partner so they can access your shared wedding plans.
                      </p>
                    </div>
                  </div>
                </div>

                {!joinCode ? (
                  isOriginalUser ? (
                    <div className="text-center py-8">
                      <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Join Code Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Generate a unique code that your partner can use during registration to link their account to yours.
                      </p>
                      <button
                        onClick={handleGenerateJoinCode}
                        disabled={isGeneratingCode}
                        className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        {isGeneratingCode ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            Generate Join Code
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Partner Invitation</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Only the account creator can generate join codes.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                      <p className="text-sm text-gray-600 mb-2">Your Join Code</p>
                      <div className="flex items-center justify-between">
                        <p className="text-4xl font-bold text-emerald-700 tracking-wider font-mono">
                          {joinCode}
                        </p>
                        <button
                          onClick={copyJoinCode}
                          className="px-4 py-2 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-600">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {isOriginalUser && (
                      <button
                        onClick={handleGenerateJoinCode}
                        disabled={isGeneratingCode}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Generate New Code
                      </button>
                    )}

                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3">How to Share:</h4>
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary-500">1.</span>
                          <span>Copy your join code using the copy button</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary-500">2.</span>
                          <span>Share it with your partner via text, call, or in person</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary-500">3.</span>
                          <span>Your partner enters this code during registration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-primary-500">4.</span>
                          <span>You'll both have access to the same wedding plans!</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-serif font-bold text-gray-800">Budget Settings</h2>
                  <HelpTooltip content="Set your total wedding budget here. You can then allocate this budget across different categories in the Budget section. The app tracks your spending automatically." />
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="text-sm text-gray-600 mb-1">Current Budget</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ${totalBudget.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Budget Alerts</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">90% Budget Alert</div>
                      <div className="text-sm text-gray-600">Notify when reaching 90% of budget</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.budgetAlerts.at90}
                      onChange={(e) => setSettings({
                        ...settings,
                        budgetAlerts: { ...settings.budgetAlerts, at90: e.target.checked }
                      })}
                      className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">95% Budget Alert</div>
                      <div className="text-sm text-gray-600">Notify when reaching 95% of budget</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.budgetAlerts.at95}
                      onChange={(e) => setSettings({
                        ...settings,
                        budgetAlerts: { ...settings.budgetAlerts, at95: e.target.checked }
                      })}
                      className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">100% Budget Alert</div>
                      <div className="text-sm text-gray-600">Notify when reaching budget limit</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.budgetAlerts.at100}
                      onChange={(e) => setSettings({
                        ...settings,
                        budgetAlerts: { ...settings.budgetAlerts, at100: e.target.checked }
                      })}
                      className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-800">Health & Wellness Reminders</div>
                    <div className="text-sm text-gray-600">Show wellness tips and self-care reminders</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showHealthWellness}
                    onChange={(e) => setSettings({ ...settings, showHealthWellness: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-800">Show Post-Wedding Checklist Early</div>
                    <div className="text-sm text-gray-600">Preview post-wedding tasks before the big day</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showPostWeddingEarly}
                    onChange={(e) => setSettings({ ...settings, showPostWeddingEarly: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Export Your Data</h2>
                <div className="space-y-4">
                  <button
                    onClick={exportTasksCSV}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">Export Task List</div>
                        <div className="text-sm text-gray-600">Download all tasks as CSV</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">{tasks.length} tasks</div>
                  </button>

                  <button
                    onClick={exportGuestsCSV}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-emerald-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">Export Guest List</div>
                        <div className="text-sm text-gray-600">Download guest list as CSV</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-emerald-600">{guests.length} guests</div>
                  </button>

                  <button
                    onClick={exportAllData}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-50 border border-primary-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-primary-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-800">Export All Data</div>
                        <div className="text-sm text-gray-600">Complete backup as JSON</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-2">About Data Exports</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• CSV files open in Excel, Google Sheets, and other spreadsheet apps</li>
                  <li>• JSON backup includes all your wedding planning data</li>
                  <li>• Keep regular backups of your important planning information</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};
