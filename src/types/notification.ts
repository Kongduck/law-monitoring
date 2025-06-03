export interface Notification {
  id: string;
  type: 'LAW_UPDATE' | 'APPROVAL_REQUEST' | 'APPROVAL_COMPLETE' | 'MANAGER_CHANGE';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetId: string; // 관련된 법령 또는 결재 ID
  userId: string; // 알람을 받을 사용자 ID
}

export type NotificationType = {
  LAW_UPDATE: '법령 개정';
  APPROVAL_REQUEST: '결재 요청';
  APPROVAL_COMPLETE: '결재 완료';
  MANAGER_CHANGE: '담당자 변경';
};

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
} 