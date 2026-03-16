import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, BudgetData, Wedding, User, Vendor, Guest } from '../types';
import { createInitialTasks, calculateDueDate, calculateSuggestedBudgets } from '../data/taskData';
import { supabase } from '../utils/supabase';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  wedding: Wedding | null;
  setWedding: (wedding: Wedding) => void;
  weddingDate: Date;
  updateWeddingDate: (date: Date) => Promise<void>;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  budget: BudgetData;
  totalBudget: number;
  setTotalBudget: (budget: number) => Promise<void>;
  categoryBudgets: Record<string, number>;
  setCategoryBudgets: (budgets: Record<string, number>) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User | null;
  vendors: Vendor[];
  setVendors: (vendors: Vendor[]) => void;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  coupleNames: string;
  setCoupleNames: (brideName: string, groomName: string) => void;
  coupleData: { joinCode: string; hasPartner: boolean; seenWelcomeVideo: boolean } | null;
  markWelcomeVideoSeen: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wedding, setWedding] = useState<Wedding | null>(null);

  const today = new Date();
  const defaultWeddingDate = wedding?.weddingDate || new Date(today.setDate(today.getDate() + 180));

  const [weddingDate, setWeddingDate] = useState(defaultWeddingDate);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalBudget, setTotalBudgetState] = useState(wedding?.totalBudget || 30000);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(() =>
    calculateSuggestedBudgets(wedding?.totalBudget || 30000)
  );

  const setTotalBudget = async (newBudget: number) => {
    setTotalBudgetState(newBudget);
    setCategoryBudgets(calculateSuggestedBudgets(newBudget));

    try {
      if (coupleId) {
        await supabase
          .from('couples')
          .update({ budget: newBudget })
          .eq('id', coupleId);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [coupleNamesState, setCoupleNamesState] = useState({ bride: '', groom: '' });
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [coupleData, setCoupleData] = useState<{ joinCode: string; hasPartner: boolean; seenWelcomeVideo: boolean } | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setIsAuthenticated(true);
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        loadUserData(session.user.id).catch(err => {
          console.error('Error loading user data on sign in:', err);
        });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setTasks([]);
        setVendors([]);
        setGuests([]);
        setWedding(null);
        setCoupleNamesState({ bride: '', groom: '' });
        setUsers([]);
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: coupleData } = await supabase
        .from('couples')
        .select('*')
        .or(`user_id.eq.${userId},partner2_user_id.eq.${userId}`)
        .maybeSingle();

      if (coupleData) {
        setCoupleId(coupleData.id);
        setCoupleNamesState({
          bride: coupleData.partner1_first_name || '',
          groom: coupleData.partner2_first_name || ''
        });
        setCoupleData({
          joinCode: coupleData.join_code || '',
          hasPartner: !!coupleData.partner2_user_id,
          seenWelcomeVideo: !!coupleData.seen_welcome_video
        });

        const partnerUsers: User[] = [];

        if (coupleData.partner1_first_name) {
          const partner1Name = `${coupleData.partner1_first_name} ${coupleData.partner1_last_name || ''}`.trim();
          partnerUsers.push({
            id: coupleData.user_id,
            name: partner1Name,
            email: coupleData.partner1_email || '',
            role: 'Partner 1'
          });

          if (coupleData.user_id === userId) {
            setCurrentUser({
              id: coupleData.user_id,
              name: partner1Name,
              email: coupleData.partner1_email || '',
              role: 'Partner 1'
            });
          }
        }

        if (coupleData.partner2_first_name) {
          const partner2Name = `${coupleData.partner2_first_name} ${coupleData.partner2_last_name || ''}`.trim();
          partnerUsers.push({
            id: coupleData.partner2_user_id || 'partner2-pending',
            name: partner2Name,
            email: coupleData.partner2_email || '',
            role: 'Partner 2'
          });

          if (coupleData.partner2_user_id && coupleData.partner2_user_id === userId) {
            setCurrentUser({
              id: coupleData.partner2_user_id,
              name: partner2Name,
              email: coupleData.partner2_email || '',
              role: 'Partner 2'
            });
          }
        }

        setUsers(partnerUsers);

        if (coupleData.wedding_date) {
          setWeddingDate(new Date(coupleData.wedding_date));
        }

        if (coupleData.budget) {
          setTotalBudget(Number(coupleData.budget));
        }

        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .eq('couple_id', coupleData.id)
          .order('due_date', { ascending: true });

        if (tasksData && tasksData.length > 0) {
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
        } else {
          setTasks([]);
        }

        const { data: vendorsData } = await supabase
          .from('vendors')
          .select('*')
          .eq('couple_id', coupleData.id);

        if (vendorsData) {
          const loadedVendors: Vendor[] = vendorsData.map((vendor: any) => ({
            id: vendor.id,
            name: vendor.name || '',
            category: vendor.category || '',
            contactName: vendor.contact_name || '',
            phone: vendor.phone || '',
            email: vendor.email || '',
            website: vendor.website || '',
            address: vendor.address || '',
            status: (vendor.status || 'Researching') as Vendor['status'],
            contractSigned: vendor.contract_signed || false,
            contractDate: vendor.contract_date ? new Date(vendor.contract_date) : null,
            totalAmount: vendor.total_amount || 0,
            depositAmount: vendor.deposit_amount || 0,
            depositDueDate: vendor.deposit_due_date ? new Date(vendor.deposit_due_date) : null,
            depositPaid: vendor.deposit_paid || false,
            balanceDue: vendor.balance_due || 0,
            finalPaymentDate: vendor.final_payment_date ? new Date(vendor.final_payment_date) : null,
            finalPaymentPaid: vendor.final_payment_paid || false,
            paymentStatus: (vendor.payment_status || 'Not Paid') as Vendor['paymentStatus'],
            notes: vendor.vendor_notes || [],
            linkedTasks: vendor.linked_tasks || []
          }));
          setVendors(loadedVendors);
        }

        const { data: guestsData } = await supabase
          .from('guests')
          .select('*')
          .eq('couple_id', coupleData.id);

        if (guestsData) {
          const loadedGuests: Guest[] = guestsData.map((guest: any) => ({
            id: guest.id,
            firstName: guest.first_name || '',
            lastName: guest.last_name || '',
            email: guest.email || '',
            phone: guest.phone || '',
            address: guest.address || '',
            category: guest.category || '',
            rsvpStatus: (guest.rsvp_status || 'Not Sent') as 'Not Sent' | 'Invited' | 'Confirmed' | 'Declined' | 'Maybe',
            responseDate: guest.response_date ? new Date(guest.response_date) : null,
            plusOneAllowed: guest.plus_one_allowed || false,
            plusOneName: guest.plus_one_name || '',
            numberInParty: guest.number_in_party || 1,
            mealChoice: guest.meal_choice || '',
            plusOneMealChoice: guest.plus_one_meal_choice || '',
            dietaryRestrictions: guest.dietary_restrictions || '',
            tableNumber: guest.table_number || null,
            specialNotes: guest.special_notes || '',
            giftReceived: guest.gift_received || false,
            thankYouSent: guest.thank_you_sent || false
          }));
          setGuests(loadedGuests);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSetWedding = (newWedding: Wedding) => {
    setWedding(newWedding);
    setWeddingDate(newWedding.weddingDate);
    setTotalBudget(newWedding.totalBudget);
    setTasks(createInitialTasks(newWedding.weddingDate, newWedding.template, newWedding.totalBudget));
  };

  const updateWeddingDate = async (newDate: Date) => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      dueDate: task.isManualDate ? task.dueDate : calculateDueDate(newDate, task.daysBeforeWedding)
    }));

    setWeddingDate(newDate);
    setTasks(updatedTasks);

    try {
      if (coupleId) {
        await supabase
          .from('couples')
          .update({ wedding_date: newDate.toISOString().split('T')[0] })
          .eq('id', coupleId);

        const taskUpdates = updatedTasks.map(task => ({
          id: task.id,
          due_date: task.dueDate.toISOString().split('T')[0]
        }));

        for (const taskUpdate of taskUpdates) {
          await supabase
            .from('tasks')
            .update({ due_date: taskUpdate.due_date })
            .eq('id', taskUpdate.id);
        }
      }
    } catch (error) {
      console.error('Error updating wedding date:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id !== taskId) return task;

        const updatedTask = { ...task, ...updates };

        if ('budgetActual' in updates || 'depositAmount' in updates) {
          updatedTask.balanceDue = updatedTask.budgetActual - updatedTask.depositAmount;

          if (updatedTask.budgetActual === 0) {
            updatedTask.paymentStatus = 'Not Paid';
          } else if (updatedTask.depositAmount === 0) {
            updatedTask.paymentStatus = 'Not Paid';
          } else if (updatedTask.depositAmount >= updatedTask.budgetActual) {
            updatedTask.paymentStatus = 'Fully Paid';
          } else {
            updatedTask.paymentStatus = 'Deposit Paid';
          }
        }

        return updatedTask;
      })
    );

    try {
      const completed = updates.status === 'Completed';
      const updateData: any = {};

      if ('name' in updates) updateData.title = updates.name;
      if ('description' in updates || 'notes' in updates) {
        const notesText = Array.isArray(updates.notes)
          ? updates.notes.map(n => n.text).join('\n')
          : updates.notes || updates.description || '';
        updateData.description = notesText;
      }
      if ('category' in updates) updateData.category = updates.category;
      if ('priority' in updates) {
        const priorityMap: Record<string, string> = {
          'Required': 'high',
          'Optional': 'low',
          'Conditional': 'medium'
        };
        updateData.priority = priorityMap[updates.priority || ''] || 'medium';
      }
      if ('dueDate' in updates && updates.dueDate) {
        updateData.due_date = updates.dueDate.toISOString().split('T')[0];
      }
      if ('status' in updates) {
        updateData.completed = completed;
        if (completed) {
          updateData.completed_at = new Date().toISOString();
        } else {
          updateData.completed_at = null;
        }
      }
      if ('budgetAllocated' in updates) updateData.budget_allocated = updates.budgetAllocated;
      if ('budgetActual' in updates) updateData.budget_actual = updates.budgetActual;
      if ('paidToDate' in updates) updateData.paid_to_date = updates.paidToDate;
      if ('depositAmount' in updates) updateData.deposit_amount = updates.depositAmount;
      if ('depositDate' in updates) {
        updateData.deposit_date = updates.depositDate ? updates.depositDate.toISOString().split('T')[0] : null;
      }
      if ('balanceDue' in updates) updateData.balance_due = updates.balanceDue;
      if ('paymentStatus' in updates) updateData.payment_status = updates.paymentStatus;
      if ('vendor' in updates) updateData.vendor = updates.vendor;
      if ('assignedTo' in updates) updateData.assigned_to = updates.assignedTo;
      if ('daysBeforeWedding' in updates) updateData.days_before_wedding = updates.daysBeforeWedding;
      if ('isManualDate' in updates) updateData.is_manual_date = updates.isManualDate;

      await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTasks(prevTasks => [...prevTasks, newTask]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: coupleData } = await supabase
          .from('couples')
          .select('id')
          .or(`user_id.eq.${session.user.id},partner2_user_id.eq.${session.user.id}`)
          .maybeSingle();

        if (coupleData) {
          await supabase
            .from('tasks')
            .insert({
              couple_id: coupleData.id,
              title: task.title,
              description: task.notes || task.description,
              category: task.category,
              priority: task.priority.toLowerCase(),
              due_date: task.dueDate.toISOString().split('T')[0],
              completed: task.status === 'Completed',
              days_before_wedding: task.daysBeforeWedding || 0,
              is_manual_date: task.isManualDate !== undefined ? task.isManualDate : true
            });
        }
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    try {
      await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addVendor = async (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setVendors(prevVendors => [...prevVendors, newVendor]);

    try {
      if (coupleId) {
        await supabase
          .from('vendors')
          .insert({
            couple_id: coupleId,
            name: vendor.name,
            category: vendor.category,
            contact_name: vendor.contactName,
            phone: vendor.phone,
            email: vendor.email,
            website: vendor.website,
            address: vendor.address,
            status: vendor.status,
            contract_signed: vendor.contractSigned,
            total_amount: vendor.totalAmount,
            deposit_amount: vendor.depositAmount,
            balance_due: vendor.balanceDue,
            payment_status: vendor.paymentStatus
          });
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const addGuest = async (guest: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guest,
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setGuests(prevGuests => [...prevGuests, newGuest]);

    try {
      if (coupleId) {
        await supabase
          .from('guests')
          .insert({
            couple_id: coupleId,
            first_name: guest.firstName,
            last_name: guest.lastName,
            email: guest.email,
            phone: guest.phone,
            address: guest.address,
            category: guest.category,
            rsvp_status: guest.rsvpStatus,
            plus_one_allowed: guest.plusOneAllowed,
            plus_one_name: guest.plusOneName,
            number_in_party: guest.numberInParty,
            meal_choice: guest.mealChoice,
            plus_one_meal_choice: guest.plusOneMealChoice,
            dietary_restrictions: guest.dietaryRestrictions,
            table_number: guest.tableNumber,
            special_notes: guest.specialNotes,
            gift_received: guest.giftReceived,
            thank_you_sent: guest.thankYouSent
          });
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const [budget] = useState<BudgetData>({
    total: 30000,
    spent: 8500,
    remaining: 21500
  });

  const handleSetCoupleNames = (brideName: string, groomName: string) => {
    setCoupleNamesState({ bride: brideName, groom: groomName });
  };

  const markWelcomeVideoSeen = async () => {
    if (!coupleId) return;

    try {
      await supabase
        .from('couples')
        .update({ seen_welcome_video: true })
        .eq('id', coupleId);

      setCoupleData(prev => prev ? { ...prev, seenWelcomeVideo: true } : null);
    } catch (error) {
      console.error('Error marking welcome video as seen:', error);
    }
  };

  const coupleNames = coupleNamesState.bride && coupleNamesState.groom
    ? `${coupleNamesState.bride} & ${coupleNamesState.groom}`
    : 'Sarah & Michael';

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        wedding,
        setWedding: handleSetWedding,
        weddingDate,
        updateWeddingDate,
        tasks,
        setTasks,
        updateTask,
        addTask,
        deleteTask,
        budget,
        totalBudget,
        setTotalBudget,
        categoryBudgets,
        setCategoryBudgets,
        users,
        setUsers,
        currentUser,
        vendors,
        setVendors,
        addVendor,
        guests,
        setGuests,
        addGuest,
        coupleNames,
        setCoupleNames: handleSetCoupleNames,
        coupleData,
        markWelcomeVideoSeen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
