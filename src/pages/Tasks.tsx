import React, { useState } from 'react';
import { LayoutGrid, Calendar, Search, X, Plus, Sparkles, Download } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useApp } from '../contexts/AppContext';
import { Task, ViewMode, StatusFilter, TimelineFilter } from '../types';
import { filterTasksByStatus, filterTasksByTimeline, searchTasks } from '../utils/taskUtils';
import { CategoryView } from '../components/CategoryView';
import { TimelineView } from '../components/TimelineView';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { TaskFormModal } from '../components/TaskFormModal';
import { createInitialTasks } from '../data/taskData';
import { supabase } from '../utils/supabase';
import { exportTasksToCSV } from '../utils/exportUtils';
import { HelpTooltip } from '../components/HelpTooltip';

interface TasksProps {
  highlightFilters?: boolean;
  highlightAddTask?: boolean;
}

export const Tasks: React.FC<TasksProps> = ({ highlightFilters = false, highlightAddTask = false }) => {
  const { tasks, setTasks, updateTask, addTask, deleteTask, weddingDate, totalBudget } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'Completed' ? 'Not Started' : 'Completed'
            }
          : task
      )
    );
    if (selectedTask?.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        status: selectedTask.status === 'Completed' ? 'Not Started' : 'Completed'
      });
    }
  };

  const filteredTasks = searchTasks(
    filterTasksByTimeline(
      filterTasksByStatus(tasks, statusFilter),
      timelineFilter
    ),
    searchQuery
  );

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: any) => {
    if ('id' in taskData) {
      updateTask(taskData.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsFormModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setSelectedTask(null);
    }
  };

  const handleGenerateTasks = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to generate tasks');
        setIsGenerating(false);
        return;
      }

      const { data: coupleData } = await supabase
        .from('couples')
        .select('id, wedding_date, wedding_type, budget')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!coupleData) {
        alert('Unable to load your wedding details');
        setIsGenerating(false);
        return;
      }

      const { count: existingTasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('couple_id', coupleData.id);

      if (existingTasksCount && existingTasksCount > 0) {
        const userChoice = window.confirm(
          `You already have ${existingTasksCount} tasks in your database. ` +
          `Generating new tasks will create duplicates.\n\n` +
          `Click OK to delete existing tasks and regenerate.\n` +
          `Click Cancel to keep your current tasks.\n\n` +
          `TIP: You can export your current tasks from the Settings page before regenerating.`
        );

        if (!userChoice) {
          setIsGenerating(false);
          return;
        }

        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('couple_id', coupleData.id);

        if (deleteError) {
          console.error('Error deleting existing tasks:', deleteError);
          alert('Failed to delete existing tasks. Please try again.');
          setIsGenerating(false);
          return;
        }
      }

      const weddingDateToUse = coupleData.wedding_date ? new Date(coupleData.wedding_date) : weddingDate;
      const budgetToUse = coupleData.budget ? Number(coupleData.budget) : totalBudget;
      const weddingTypeRaw = coupleData.wedding_type || 'traditional';

      const weddingTypeMap: Record<string, 'Traditional' | 'Destination' | 'Small' | 'Micro' | 'DIY'> = {
        'traditional': 'Traditional',
        'destination': 'Destination',
        'small': 'Small',
        'micro': 'Micro',
        'diy': 'DIY'
      };

      const weddingType = weddingTypeMap[weddingTypeRaw.toLowerCase()] || 'Traditional';

      const initialTasks = createInitialTasks(weddingDateToUse, weddingType, budgetToUse);

      console.log(`Generated ${initialTasks.length} tasks for ${weddingType} wedding`);

      const tasksToInsert = initialTasks.map((task: Task) => ({
        couple_id: coupleData.id,
        title: task.name,
        description: task.notes && task.notes.length > 0 ? task.notes[0].text : '',
        category: task.category,
        priority: task.priority === 'Required' ? 'high' : task.priority === 'Optional' ? 'low' : 'medium',
        due_date: task.dueDate.toISOString().split('T')[0],
        completed: task.status === 'Completed',
        days_before_wedding: task.daysBeforeWedding,
        is_manual_date: task.isManualDate
      }));

      const { data: insertedTasks, error } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select();

      if (error) {
        console.error('Error inserting tasks:', error);
        alert('Failed to generate tasks. Please try again.');
      } else if (insertedTasks) {
        const loadedTasks: Task[] = insertedTasks.map((task: any) => ({
          id: task.id,
          name: task.title,
          title: task.title,
          category: task.category || '',
          status: task.completed ? 'Completed' : 'Not Started',
          dueDate: new Date(task.due_date),
          priority: task.priority === 'high' ? 'Required' : task.priority === 'low' ? 'Optional' : 'Conditional',
          description: task.description || '',
          assignedTo: null,
          budgetAllocated: 0,
          budgetActual: 0,
          paidToDate: 0,
          depositAmount: 0,
          depositDate: null,
          balanceDue: 0,
          paymentStatus: 'Not Paid' as const,
          vendor: '',
          notes: task.description ? [{ text: task.description, timestamp: new Date() }] : [],
          daysBeforeWedding: task.days_before_wedding || 0,
          isManualDate: task.is_manual_date !== undefined ? task.is_manual_date : true,
          hasExpenses: false
        }));
        setTasks(loadedTasks);
        alert(`Successfully generated ${loadedTasks.length} tasks!`);
      }
    } catch (err) {
      console.error('Error generating tasks:', err);
      alert('An error occurred while generating tasks');
    }
    setIsGenerating(false);
  };

  const statusFilters: StatusFilter[] = ['All', 'Not Started', 'In Progress', 'Completed'];
  const timelineFilters: TimelineFilter[] = ['All', 'Overdue', 'This Week', 'This Month', 'Next 3 Months'];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Tasks</h1>
            <HelpTooltip content="Manage all your wedding tasks organized by category or timeline. Assign tasks to you or your partner, set deadlines, and track budget for each task." />
          </div>
          <p className="text-gray-600">Manage your wedding planning checklist</p>
        </div>
        <div className="relative">
          {highlightAddTask && (
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl opacity-75 animate-pulse"></div>
          )}
          <button
            onClick={handleAddTask}
            className="relative flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Task</span>
          </button>
        </div>
      </div>

      {!highlightAddTask && (
        <div className="mb-6 space-y-4">
          <div className={`space-y-4 transition-all duration-500 ${highlightFilters ? 'border-2 border-[#5f9b9c] rounded-xl p-4' : ''}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('category')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'category'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="font-medium">Category</span>
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Timeline</span>
                </button>
              </div>
              <HelpTooltip content="Switch between Category view (grouped by type like Venue, Catering, etc.) and Timeline view (organized by when tasks are due)." />
            </div>

            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === filter
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <div className="flex flex-wrap gap-2">
                {timelineFilters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimelineFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timelineFilter === filter
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(statusFilter !== 'All' || timelineFilter !== 'All' || searchQuery) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() => {
                setStatusFilter('All');
                setTimelineFilter('All');
                setSearchQuery('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
            No Tasks Yet
          </h2>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Get started by generating your wedding planning checklist, or create tasks manually as you go.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <Tippy
                content="Generate a complete list of tasks for the wedding type you have selected."
                placement="top"
                maxWidth={300}
                interactive={true}
                trigger="click"
                touch={['hold', 500]}
              >
                <button
                  onClick={handleGenerateTasks}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-500 text-white rounded-xl hover:from-primary-600 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isGenerating ? 'Generating...' : 'Generate Task List'}</span>
                </button>
              </Tippy>
              <button
                onClick={handleAddTask}
                className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-300 text-primary-600 rounded-xl hover:bg-primary-50 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Create Task Manually</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HelpTooltip content="Generate Task List creates a comprehensive checklist based on your wedding type (Traditional, Destination, etc.). This includes tasks for venue, catering, photography, and more with suggested due dates. You can always add custom tasks manually." />
              <span>Not sure where to start? Generate a complete task list based on your wedding type.</span>
            </div>
          </div>
        </div>
      ) : viewMode === 'category' ? (
        <CategoryView
          tasks={filteredTasks}
          onTaskClick={setSelectedTask}
          onToggleComplete={handleToggleComplete}
        />
      ) : (
        <TimelineView
          tasks={filteredTasks}
          onTaskClick={setSelectedTask}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleComplete={() => handleToggleComplete(selectedTask.id)}
          onUpdateTask={(updates) => {
            updateTask(selectedTask.id, updates);
            setSelectedTask({ ...selectedTask, ...updates });
          }}
          onEdit={() => handleEditTask(selectedTask)}
          onDelete={() => handleDeleteTask(selectedTask.id)}
        />
      )}

      {isFormModalOpen && (
        <TaskFormModal
          task={editingTask}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};
