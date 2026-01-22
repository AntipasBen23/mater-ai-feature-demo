import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in GBP
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return formatDate(dateString);
};

// Get color for priority score
export const getPriorityColor = (score: number): string => {
  if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

// Get color for status
export const getStatusColor = (
  status: 'Queued' | 'In Synthesis' | 'Testing' | 'Validated' | 'Rejected'
): string => {
  const colors = {
    Queued: 'bg-gray-100 text-gray-700 border-gray-300',
    'In Synthesis': 'bg-blue-100 text-blue-700 border-blue-300',
    Testing: 'bg-purple-100 text-purple-700 border-purple-300',
    Validated: 'bg-green-100 text-green-700 border-green-300',
    Rejected: 'bg-red-100 text-red-700 border-red-300',
  };
  return colors[status];
};

// Get color for complexity
export const getComplexityColor = (complexity: 'Low' | 'Medium' | 'High'): string => {
  const colors = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-red-100 text-red-700',
  };
  return colors[complexity];
};

// Get badge color for lab partner
export const getLabPartnerColor = (lab?: string): string => {
  if (!lab) return 'bg-gray-100 text-gray-600';
  
  const colors: Record<string, string> = {
    Cambridge: 'bg-blue-100 text-blue-700',
    Imperial: 'bg-purple-100 text-purple-700',
    'Henry Royce': 'bg-indigo-100 text-indigo-700',
  };
  return colors[lab] || 'bg-gray-100 text-gray-600';
};

// Calculate statistics
export const calculateStats = (materials: any[]) => {
  const queued = materials.filter((m) => m.status === 'Queued').length;
  const inSynthesis = materials.filter((m) => m.status === 'In Synthesis').length;
  const testing = materials.filter((m) => m.status === 'Testing').length;
  const validated = materials.filter((m) => m.status === 'Validated').length;

  const avgZT =
    materials.reduce((sum, m) => sum + m.predictedZT, 0) / materials.length;
  const avgCost =
    materials.reduce((sum, m) => sum + m.estimatedCost, 0) / materials.length;

  return {
    queued,
    inSynthesis,
    testing,
    validated,
    total: materials.length,
    avgZT: Number(avgZT.toFixed(2)),
    avgCost: Number(avgCost.toFixed(0)),
  };
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate chart colors (matching Mater-AI brand)
export const chartColors = {
  primary: '#2B5FDE',
  secondary: '#4285F4',
  success: '#34A853',
  warning: '#FBBC05',
  danger: '#EA4335',
  purple: '#9333EA',
  gray: '#6B7280',
};