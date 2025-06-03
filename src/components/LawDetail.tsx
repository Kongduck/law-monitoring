import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Collapse,
  Tooltip,
  MenuItem,
  Select
} from '@mui/material';
import { LawAmendment, NotificationSettings as NotificationSettingsType, LawStatus } from '../types/law';
import { ApprovalDialog } from './ApprovalDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LaunchIcon from '@mui/icons-material/Launch';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../contexts/NotificationContext';
import { updateLawAmendment } from '../api/lawApi';
import { updateNotificationSettings } from '../api/notificationApi';
import { NotificationSettings } from './NotificationSettings';

// 상태값 매핑
const statusMap: Record<LawAmendment['status'], string> = {
  'REVIEW': '검토중',
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료'
} as const;

const getStatusText = (status: LawAmendment['status']) => {
  switch (status) {
    case 'COMPLETED':
      return '완료';
    case 'IN_PROGRESS':
      return '진행중';
    case 'REVIEW':
      return '검토중';
    default:
      return status;
  }
};

const getStatusColor = (status: LawAmendment['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'primary';
    case 'REVIEW':
      return 'warning';
    default:
      return 'default';
  }
};

interface LawDetailProps {
  open: boolean;
  onClose: () => void;
  amendment: LawAmendment;
  onApplyStatusChange: (isApplied: boolean) => void;
  onApprove: (amendmentId: string, comment: string) => void;
}

// 법령 검색 URL 생성 함수
const generateLawSearchUrl = (lawName: string, amendmentDate: string) => {
  const baseUrl = 'https://www.law.go.kr/LSW/lsInfoP.do';
  const searchQuery = encodeURIComponent(lawName);
  return `${baseUrl}?efYd=${amendmentDate.replace(/-/g, '')}&searchLs=${searchQuery}`;
};

export const LawDetail: React.FC<LawDetailProps> = ({
  open,
  onClose,
  amendment,
  onApplyStatusChange,
  onApprove
}) => {
  const { addNotification, showNotification } = useNotification();
  const [isApplied, setIsApplied] = useState(amendment.isApplied ?? false);
  const [currentAmendment, setCurrentAmendment] = useState<LawAmendment>(amendment);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showApprovalComment, setShowApprovalComment] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(amendment.amendmentDate);

  const handleApplyStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setIsApplied(newStatus);
    onApplyStatusChange?.(newStatus);
  };

  const handleDateChange = (event: any) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    
    if (newDate === amendment.amendmentDate) {
      setCurrentAmendment(amendment);
    } else {
      const previousVersion = amendment.previousAmendments?.find(
        prev => prev.amendmentDate === newDate
      );
      if (previousVersion) {
        // PreviousAmendment를 LawAmendment로 변환
        const lawAmendment: LawAmendment = {
          ...previousVersion,
          expectedDate: previousVersion.amendmentDate,
          notificationSettings: undefined
        };
        setCurrentAmendment(lawAmendment);
      }
    }
  };

  const handleApprove = async (comment: string) => {
    try {
      if (!currentAmendment.id || !currentAmendment.lawId) {
        throw new Error('개정안 정보가 올바르지 않습니다.');
      }

      const updatedAmendment: LawAmendment = {
        ...currentAmendment,
        status: 'COMPLETED',
        approvalComment: comment,
        approver: '현재 사용자',
        departmentReviewDate: new Date().toISOString().split('T')[0],
        isApplied: true
      };

      console.log('서버로 전송되는 데이터:', updatedAmendment);

      const result = await updateLawAmendment(updatedAmendment).catch((error) => {
        console.error('결재 처리 API 호출 실패:', error);
        throw new Error('결재 처리 중 오류가 발생했습니다.');
      });

      console.log('서버에서 받은 응답:', result);

      if (!result) {
        throw new Error('결재 처리 결과가 없습니다.');
      }
      
      // 상태 업데이트
      setCurrentAmendment(result);
      setIsApplied(true);
      
      // 알림 추가
      addNotification({
        type: 'APPROVAL_COMPLETE',
        title: '결재 완료',
        message: `${result.lawName} 법령의 결재가 완료되었습니다.`,
        isRead: false,
        targetId: result.id,
        userId: 'current-user-id'
      });

      showNotification('결재가 완료되었습니다.', 'success');
      setShowApprovalDialog(false);
      
      // 부모 컴포넌트에 알림
      onApprove(result.id, comment);
    } catch (error) {
      console.error('결재 처리 실패:', error);
      showNotification(error instanceof Error ? error.message : '결재 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleNotificationSettingsSave = async (settings: NotificationSettingsType) => {
    try {
      await updateNotificationSettings(currentAmendment.lawId, settings);
      setCurrentAmendment(prev => ({
        ...prev,
        notificationSettings: settings
      }));
      showNotification('알림 설정이 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('알림 설정 저장에 실패했습니다.', 'error');
    }
  };

  const lawUrl = currentAmendment.lawLink || generateLawSearchUrl(currentAmendment.lawName, currentAmendment.amendmentDate);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div">
                {currentAmendment.lawName}
              </Typography>
              <Tooltip title="법령 원문 보기">
                <IconButton
                  size="small"
                  onClick={() => window.open(lawUrl, '_blank')}
                >
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {amendment.previousAmendments && amendment.previousAmendments.length > 0 && (
                <Select
                  size="small"
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value={amendment.amendmentDate}>
                    {amendment.amendmentDate} (최신)
                  </MenuItem>
                  {amendment.previousAmendments.map((prev) => (
                    <MenuItem key={prev.id} value={prev.amendmentDate}>
                      {prev.amendmentDate}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <Tooltip title="알림 설정">
                <IconButton
                  size="small"
                  onClick={() => setShowNotificationSettings(true)}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {currentAmendment.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                개정일자
              </Typography>
              <Typography variant="body1">
                {currentAmendment.amendmentDate}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                상태
              </Typography>
              <Chip 
                label={statusMap[currentAmendment.status]}
                color={getStatusColor(currentAmendment.status)}
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                부서 확인일자
              </Typography>
              <Typography variant="body1">
                {currentAmendment.departmentReviewDate || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                담당자
              </Typography>
              <Typography variant="body1">
                {currentAmendment.reviewer || '-'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            개정 내용
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {currentAmendment.content}
          </Typography>

          {currentAmendment.approvalComment && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowApprovalComment(!showApprovalComment)}>
                <Typography variant="subtitle2" color="text.secondary">
                  결재 의견
                </Typography>
                <IconButton size="small">
                  {showApprovalComment ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={showApprovalComment}>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {currentAmendment.approvalComment}
                </Typography>
              </Collapse>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isApplied}
                  onChange={handleApplyStatusChange}
                  color="primary"
                />
              }
              label="적용 여부"
            />
            {!currentAmendment.departmentReviewDate && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowApprovalDialog(true)}
              >
                결재
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>닫기</Button>
        </DialogActions>
      </Dialog>

      <ApprovalDialog
        open={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        onApprove={handleApprove}
        lawTitle={`${currentAmendment.lawName} - ${currentAmendment.title}`}
      />

      <NotificationSettings
        open={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
        settings={currentAmendment.notificationSettings || {
          lawId: currentAmendment.lawId,
          emailEnabled: false,
          emailAddress: '',
          notifyOnStatusChange: true,
          notifyOnApproval: true,
          notifyBeforeDueDate: false,
          daysBeforeDueDate: 7
        }}
        onSave={async (settings) => {
          try {
            await updateLawAmendment({
              ...currentAmendment,
              notificationSettings: settings
            });
            setCurrentAmendment(prev => ({
              ...prev,
              notificationSettings: settings
            }));
            showNotification('알림 설정이 저장되었습니다.', 'success');
          } catch (error) {
            showNotification('알림 설정 저장에 실패했습니다.', 'error');
          }
        }}
      />
    </>
  );
}; 