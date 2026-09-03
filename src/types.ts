/**
 * Types for Quran Khatm application
 */

export interface KhatmState {
  currentKhatm: number;       // e.g. 1, 2, 3...
  lastAssignedPage: number;   // 0 to 604 (0 means no page has been assigned yet in this khatm)
  completedKhatms: number;    // Number of completely finished khatms
  totalAssignedPagesAllTime?: number; // Total cumulative pages assigned all-time
  updatedAt?: any;
}

export interface AllocationResult {
  pageNumber: number;
  khatmNumber: number;
  completedKhatms: number;
  timestamp: number;
}

export interface UserSavedPage {
  pageNumber: number;
  khatmNumber: number;
  assignedAt: number;
}

export interface PageMetadata {
  page: number;
  surah: string;
  juz: number;
}
