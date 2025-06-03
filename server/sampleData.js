const sampleLawAmendments = [
  {
    id: '1',
    lawName: '개인정보 보호법',
    amendmentDate: '2024-03-01',
    departmentReviewDate: '2024-03-05',
    reviewer: '김철수',
    approver: '박부장',
    status: '검토중',
    isApplied: false,
    title: '개인정보 보호법 시행령 일부개정령(안)',
    content: '개인정보의 안전한 처리를 위한 내부 관리계획 수립 등',
    expectedDate: '2024-06-01',
    notificationSettings: {
      id: '1',
      lawId: '1',
      isEmailEnabled: true,
      isApprovalEnabled: true,
      isDueDateEnabled: true,
      daysBeforeDue: 7
    }
  },
  {
    id: '2',
    lawName: '전자금융거래법',
    amendmentDate: '2024-02-15',
    departmentReviewDate: '2024-02-20',
    reviewer: '이영희',
    approver: '최부장',
    status: '진행중',
    isApplied: false,
    title: '전자금융거래법 시행령 일부개정령(안)',
    content: '전자금융거래의 안전성 확보를 위한 기준 강화',
    expectedDate: '2024-05-15',
    notificationSettings: {
      id: '2',
      lawId: '2',
      isEmailEnabled: true,
      isApprovalEnabled: true,
      isDueDateEnabled: true,
      daysBeforeDue: 14
    }
  },
  {
    id: '3',
    lawName: '정보통신망법',
    amendmentDate: '2024-01-10',
    departmentReviewDate: '2024-01-15',
    reviewer: '박민수',
    approver: '김부장',
    status: '완료',
    isApplied: true,
    title: '정보통신망법 시행령 일부개정령',
    content: '정보보호 최고책임자의 자격요건 등',
    expectedDate: '2024-04-01',
    notificationSettings: {
      id: '3',
      lawId: '3',
      isEmailEnabled: true,
      isApprovalEnabled: true,
      isDueDateEnabled: true,
      daysBeforeDue: 10
    }
  }
];

const sampleNotifications = [
  {
    id: '1',
    type: 'APPROVAL_REQUEST',
    lawId: '1',
    lawName: '개인정보 보호법',
    message: '개인정보 보호법 시행령 개정안에 대한 검토가 필요합니다.',
    createdAt: '2024-03-05T09:00:00.000Z',
    isRead: false,
    link: '/laws/1'
  },
  {
    id: '2',
    type: 'DUE_DATE',
    lawId: '2',
    lawName: '전자금융거래법',
    message: '전자금융거래법 시행령 개정안이 2주 후에 시행됩니다.',
    createdAt: '2024-03-01T10:00:00.000Z',
    isRead: true,
    link: '/laws/2'
  },
  {
    id: '3',
    type: 'APPROVAL_COMPLETE',
    lawId: '3',
    lawName: '정보통신망법',
    message: '정보통신망법 시행령 개정안이 승인되었습니다.',
    createdAt: '2024-02-28T15:00:00.000Z',
    isRead: false,
    link: '/laws/3'
  }
];

const sampleDepartments = [
  {
    department: '법무팀',
    totalCount: 10,
    completedCount: 4,
    pendingCount: 3,
    inProgressCount: 3
  },
  {
    department: '정보보호팀',
    totalCount: 8,
    completedCount: 5,
    pendingCount: 2,
    inProgressCount: 1
  },
  {
    department: '준법감시팀',
    totalCount: 12,
    completedCount: 6,
    pendingCount: 4,
    inProgressCount: 2
  }
];

module.exports = {
  sampleLawAmendments,
  sampleNotifications,
  sampleDepartments
}; 