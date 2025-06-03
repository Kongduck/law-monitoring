import { LawAmendment } from './law';

export type { LawAmendment };

export interface LawAmendmentHistory {
  id: string;
  amendmentDate: string;     // 개정일자
  departmentReviewDate: string | null;  // 부서 확인일자
  reviewer: string | null;   // 담당자
  approver: string | null;   // 승인자
  status: string;           // 상태값
  isApplied: boolean | null; // 적용유무
  title: string;           // 제목
  content: string;         // 내용
  approvalComment?: string;  // 결재 의견
  lawLink?: string;        // 법령 원문 링크
}

export interface Review {
  id: string;
  amendmentId: string;
  reviewer: string;
  reviewDate: string;
  comments: string;
  implementationPlan: string;
}

export interface LawSubscription {
  id: string;
  lawId: string;
  lawName: string;
  email: string;
  createdAt: string;
}

// 알림 관련 타입
export interface NotificationSetting {
  id: string;
  lawId: string;
  isEmailEnabled: boolean;    // 이메일 알림 활성화 여부
  isApprovalEnabled: boolean; // 결재 알림 활성화 여부
  isDueDateEnabled: boolean;  // 시행일 알림 활성화 여부
  daysBeforeDue: number;     // 시행일 몇일 전 알림
}

export interface Notification {
  id: string;
  type: 'APPROVAL_REQUEST' | 'APPROVAL_COMPLETE' | 'DUE_DATE' | 'STATUS_CHANGE';
  lawId: string;
  lawName: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link: string;
}

// 대시보드 관련 타입
export interface DashboardStats {
  totalLaws: number;
  statusCounts: {
    검토중: number;
    진행중: number;
    완료: number;
  };
  monthlyAmendments: MonthlyAmendment[];
  departmentStats: DepartmentStat[];
  upcomingDueDates: UpcomingDueDate[];
}

export interface MonthlyAmendment {
  month: string;  // YYYY-MM 형식
  count: number;
  statusCounts: {
    검토중: number;
    진행중: number;
    완료: number;
  };
}

export interface DepartmentStat {
  department: string;
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  inProgressCount: number;
}

export interface UpcomingDueDate {
  id: string;
  lawName: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  status: string;
} 