import * as XLSX from 'xlsx';
import { LawAmendment, PreviousAmendment } from '../types/law';

interface ExcelRow {
  법규명: string;
  개정일자: string;
  부서확인일자: string;
  담당자: string;
  결재자: string;
  상태: string;
  적용여부: string;
}

export const exportToExcel = (amendments: LawAmendment[]): void => {
  const rows: ExcelRow[] = [];

  amendments.forEach(amendment => {
    // 현재 개정안 추가
    rows.push({
      법규명: amendment.lawName,
      개정일자: amendment.amendmentDate,
      부서확인일자: amendment.departmentReviewDate || '-',
      담당자: amendment.reviewer || '-',
      결재자: amendment.approver || '-',
      상태: getStatusText(amendment.status),
      적용여부: amendment.isApplied ? 'O' : 'X'
    });

    // 이전 개정 이력 추가
    amendment.previousAmendments?.forEach((prev: PreviousAmendment) => {
      rows.push({
        법규명: amendment.lawName,
        개정일자: prev.amendmentDate,
        부서확인일자: prev.departmentReviewDate || '-',
        담당자: prev.reviewer || '-',
        결재자: prev.approver || '-',
        상태: getStatusText(prev.status),
        적용여부: prev.isApplied ? 'O' : 'X'
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '법령 개정 현황');
  XLSX.writeFile(workbook, '법령_개정_현황.xlsx');
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'REVIEW':
      return '검토중';
    case 'IN_PROGRESS':
      return '진행중';
    case 'COMPLETED':
      return '완료';
    default:
      return '-';
  }
}; 