import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { LawAmendment } from '../types/law';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface LawListProps {
  amendments: LawAmendment[];
  onAmendmentClick: (amendment: LawAmendment) => void;
}

const statusMap = {
  'REVIEW': '검토중',
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료'
} as const;

// 상태값에 따른 칩 색상 설정
const getStatusColor = (status: string) => {
  switch (status) {
    case '진행중':
      return 'primary';
    case '완료':
      return 'success';
    case '검토중':
      return 'warning';
    default:
      return 'default';
  }
};

// 적용유무 아이콘 및 색상 설정
const AppliedStatus: React.FC<{ isApplied: boolean | null }> = ({ isApplied }) => {
  if (isApplied === null) {
    return <HelpIcon color="disabled" titleAccess="미확인" />;
  }
  return isApplied ? (
    <CheckCircleIcon color="success" titleAccess="적용" />
  ) : (
    <CancelIcon color="error" titleAccess="미적용" />
  );
};

export const LawList: React.FC<LawListProps> = ({ amendments, onAmendmentClick }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        입법예고 목록
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>법규명</TableCell>
              <TableCell>개정일자</TableCell>
              <TableCell>부서 확인일자</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell align="center">적용유무</TableCell>
              <TableCell>상태</TableCell>
              <TableCell align="center">상세보기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amendments.map((amendment) => (
              <TableRow
                key={amendment.id}
                hover
                onClick={() => onAmendmentClick(amendment)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{amendment.lawName}</TableCell>
                <TableCell>{amendment.amendmentDate}</TableCell>
                <TableCell>
                  {amendment.departmentReviewDate || '-'}
                </TableCell>
                <TableCell>{amendment.reviewer || '-'}</TableCell>
                <TableCell align="center">
                  <AppliedStatus isApplied={amendment.isApplied ?? null} />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={statusMap[amendment.status]}
                    color={
                      amendment.status === 'COMPLETED' ? 'success' :
                      amendment.status === 'IN_PROGRESS' ? 'primary' : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="상세 보기">
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAmendmentClick(amendment);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 