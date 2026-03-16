export interface Task {
  id: string;
  name: string;
  category: string;
  daysBeforeWedding: number;
  dueDate: Date;
  status: 'Not Started' | 'In Progress' | 'Completed';
  isManualDate: boolean;
  budgetAllocated: number;
  budgetActual: number;
  paidToDate: number;
  depositAmount: number;
  depositDate: Date | null;
  balanceDue: number;
  paymentStatus: 'Not Paid' | 'Deposit Paid' | 'Fully Paid';
  priority: 'Required' | 'Optional' | 'Conditional';
  assignedTo: string | null;
  notes: Array<{ text: string; timestamp: Date }>;
  hasExpenses: boolean;
}

export interface TaskCategory {
  name: string;
  icon: string;
  suggestedPercentage: number;
}

export interface BudgetData {
  total: number;
  spent: number;
  remaining: number;
}

export interface CategoryBudget {
  name: string;
  icon: string;
  suggestedPercentage: number;
  allocatedBudget: number;
  spentAmount: number;
  remaining: number;
  percentage: number;
}

export interface BudgetSummary {
  totalBudget: number;
  totalAllocated: number;
  totalSpent: number;
  totalCommitted: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Collaborator';
}

export interface Wedding {
  template: 'Traditional' | 'Destination' | 'Small' | 'Micro' | 'DIY';
  weddingDate: Date;
  totalBudget: number;
  isSetupComplete: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  status: 'Researching' | 'Contacted' | 'Booked' | 'Paid' | 'Declined';
  contractSigned: boolean;
  contractDate: Date | null;
  totalAmount: number;
  depositAmount: number;
  depositDueDate: Date | null;
  depositPaid: boolean;
  balanceDue: number;
  finalPaymentDate: Date | null;
  finalPaymentPaid: boolean;
  paymentStatus: 'Not Paid' | 'Deposit Paid' | 'Fully Paid';
  notes: Array<{ text: string; timestamp: Date }>;
  linkedTasks: string[];
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rsvpStatus: 'Not Sent' | 'Invited' | 'Confirmed' | 'Declined' | 'Maybe';
  responseDate: Date | null;
  plusOneAllowed: boolean;
  plusOneName: string;
  numberInParty: number;
  mealChoice: string;
  plusOneMealChoice: string;
  dietaryRestrictions: string;
  tableNumber: number | null;
  specialNotes: string;
  giftReceived: boolean;
  thankYouSent: boolean;
}

export interface Table {
  number: number;
  capacity: number;
  assignedGuests: string[];
}

export type ViewMode = 'category' | 'timeline';
export type StatusFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed';
export type TimelineFilter = 'All' | 'Overdue' | 'This Week' | 'This Month' | 'Next 3 Months';
export type PriorityFilter = 'All' | 'Required' | 'Optional' | 'Conditional';
export type AssignmentFilter = 'All Tasks' | 'My Tasks' | 'Unassigned';
export type VendorViewMode = 'grid' | 'list' | 'category';
export type GuestViewMode = 'list' | 'card' | 'seating';
