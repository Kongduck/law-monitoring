import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LawList } from '../components/LawList';
import { LawDetail } from '../components/LawDetail';
import { SearchFilter } from '../components/SearchFilter';
import { LawAmendment } from '../types/law';
import { exportToExcel } from '../utils/excel';

// 임시 데이터
const initialAmendments: LawAmendment[] = [
  {
    id: '1',
    lawId: 'law-1',
    lawName: '개인정보 보호법',
    amendmentDate: '2024-06-01',
    expectedDate: '2024-06-15',
    departmentReviewDate: undefined,
    reviewer: '홍길동',
    approver: undefined,
    status: 'REVIEW',
    isApplied: true,
    title: '개인정보 보호법 일부개정법률(안)',
    content: '1. 개정이유\n\n개인정보처리자의 책임성 강화와 정보주체의 실질적 권리보장을 위해 현행 제도의 미비점을 개선·보완하려는 것임\n\n2. 주요내용\n\n가. 개인정보처리자의 책임성 강화(안 제28조)\n나. 개인정보 영향평가 실시 대상의 확대(안 제33조)\n다. 정보주체의 동의 철회권 강화(안 제39조)',
    lawLink: 'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=238438',
    previousAmendments: [
      {
        id: '1-1',
        lawId: 'law-1',
        amendmentDate: '2024-01-15',
        departmentReviewDate: '2024-01-20',
        reviewer: '홍길동',
        approver: '김부장',
        status: 'COMPLETED',
        isApplied: true,
        title: '개인정보 보호법 일부개정법률(안) - 2024년 1월',
        content: '1. 개정이유\n\n개인정보처리자의 안전조치 의무 강화\n\n2. 주요내용\n\n가. 개인정보 처리방침 공개 의무화\n나. 개인정보 유출 통지 기한 단축',
        approvalComment: '개인정보보호 강화를 위한 적절한 조치로 판단됩니다. 승인합니다.',
        lawLink: 'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=238437',
        lawName: '개인정보 보호법'
      }
    ]
  },
  {
    id: '2',
    lawId: 'law-2',
    lawName: '전자금융거래법',
    amendmentDate: '2024-05-15',
    expectedDate: '2024-08-15',
    departmentReviewDate: undefined,
    reviewer: '김담당',
    approver: undefined,
    status: 'IN_PROGRESS',
    isApplied: false,
    title: '전자금융거래법 시행령 일부개정령(안)',
    content: '1. 개정이유\n\n전자금융 거래의 안전성 강화를 위한 보안 규정 보완\n\n2. 주요내용\n\n가. 전자금융 보안 기준 강화\n나. 이상거래 탐지 시스템 고도화\n다. 사고예방 대책 수립 의무화',
    lawLink: 'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=238440',
    previousAmendments: []
  },
  {
    id: '3',
    lawId: 'law-3',
    lawName: '정보통신망법',
    amendmentDate: '2024-04-30',
    expectedDate: '2024-07-30',
    departmentReviewDate: '2024-05-20',
    reviewer: '김철수',
    approver: '이부장',
    status: 'COMPLETED',
    isApplied: false,
    title: '정보통신망법 시행규칙 일부개정령(안)',
    content: '1. 개정이유\n\n정보보호 관리체계 인증 제도의 실효성 제고\n\n2. 주요내용\n\n가. 정보보호 관리체계 인증 기준 개선\n나. 인증 심사 절차 간소화\n다. 인증 유효기간 조정',
    lawLink: 'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=238439',
    previousAmendments: [],
    approvalComment: '인증 제도 개선을 통한 실효성 제고가 기대됩니다. 승인합니다.'
  }
];

export const Home = () => {
  const [amendments, setAmendments] = useState<LawAmendment[]>(initialAmendments);
  const [selectedAmendment, setSelectedAmendment] = useState<LawAmendment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleAmendmentSelect = (amendment: LawAmendment) => {
    setSelectedAmendment(amendment);
  };

  const handleDetailClose = () => {
    setSelectedAmendment(null);
  };

  const handleApplyStatusChange = (isApplied: boolean) => {
    // TODO: 실제 API 연동 시 여기서 서버에 상태 업데이트 요청
    console.log('적용 상태 변경:', isApplied);
  };

  const handleApprove = (amendmentId: string, comment: string) => {
    // TODO: 실제 API 연동 시 여기서 서버에 결재 요청
    const now = new Date().toISOString().split('T')[0];
    const updatedAmendments = amendments.map(amendment => {
      if (amendment.id === amendmentId) {
        return {
          ...amendment,
          departmentReviewDate: now,
          approver: '현재 로그인한 사용자', // TODO: 실제 로그인 사용자 정보 사용
          status: 'COMPLETED' as const,
          approvalComment: comment
        };
      }
      return amendment;
    });
    setAmendments(updatedAmendments);
    setSelectedAmendment(updatedAmendments.find(a => a.id === amendmentId) || null);
  };

  const handleExportExcel = () => {
    exportToExcel(amendments);
  };

  // 필터링된 법령 목록
  const filteredAmendments = useMemo(() => {
    return amendments.filter(amendment => {
      const matchesStatus = !statusFilter || amendment.status === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        amendment.lawName.toLowerCase().includes(searchLower) ||
        amendment.title.toLowerCase().includes(searchLower) ||
        amendment.content.toLowerCase().includes(searchLower);
      
      return matchesStatus && matchesSearch;
    });
  }, [amendments, statusFilter, searchTerm]);

  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        법령 모니터링 시스템
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          최근 입법예고
        </Typography>
        
        <SearchFilter
          status={statusFilter}
          onStatusChange={setStatusFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onExportExcel={handleExportExcel}
        />

        <LawList 
          amendments={filteredAmendments}
          onAmendmentClick={handleAmendmentSelect}
        />
      </Paper>

      {selectedAmendment && (
        <LawDetail
          open={true}
          onClose={handleDetailClose}
          amendment={selectedAmendment}
          onApplyStatusChange={handleApplyStatusChange}
          onApprove={handleApprove}
        />
      )}
    </Box>
  );
}; 