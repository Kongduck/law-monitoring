export type LawStatus = 'REVIEW' | 'IN_PROGRESS' | 'COMPLETED';

export interface Law {
  id: string;
  title: string;
  content: string;
  revisionDate: string;
  departmentConfirmDate?: string;
  manager?: string;
  isApplied: boolean;
  status: LawStatus;
  lawLink?: string;
  notificationSettings?: NotificationSettings;
}

export interface NotificationSettings {
  lawId: string;
  emailEnabled: boolean;
  emailAddress: string;
  notifyOnStatusChange: boolean;
  notifyOnApproval: boolean;
  notifyBeforeDueDate: boolean;
  daysBeforeDueDate: number;
}

export interface PreviousAmendment {
  id: string;
  lawId: string;
  lawName: string;
  title: string;
  status: LawStatus;
  amendmentDate: string;
  departmentReviewDate?: string;
  reviewer?: string;
  approver?: string;
  content: string;
  approvalComment?: string;
  lawLink?: string;
  isApplied: boolean;
}

export interface LawAmendment {
  id: string;
  lawId: string;
  lawName: string;
  title: string;
  status: LawStatus;
  amendmentDate: string;
  expectedDate: string;
  content: string;
  departmentReviewDate?: string;
  reviewer?: string;
  approver?: string;
  approvalComment?: string;
  isApplied: boolean | null;
  lawLink?: string;
  previousAmendments?: PreviousAmendment[];
  notificationSettings?: NotificationSettings;
} 