import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Box,
  Typography,
  Slider
} from '@mui/material';
import { NotificationSettings as NotificationSettingsType } from '../types/law';

interface NotificationSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  open,
  onClose,
  settings,
  onSave
}) => {
  const [currentSettings, setCurrentSettings] = useState<NotificationSettingsType>(settings);

  const handleChange = (field: keyof NotificationSettingsType, value: any) => {
    setCurrentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>알림 설정</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={currentSettings.emailEnabled}
                onChange={(e) => handleChange('emailEnabled', e.target.checked)}
              />
            }
            label="이메일 알림 사용"
          />
          
          {currentSettings.emailEnabled && (
            <TextField
              fullWidth
              margin="normal"
              label="이메일 주소"
              value={currentSettings.emailAddress}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
            />
          )}

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>알림 받을 항목</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={currentSettings.notifyOnStatusChange}
                  onChange={(e) => handleChange('notifyOnStatusChange', e.target.checked)}
                />
              }
              label="상태 변경 시"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={currentSettings.notifyOnApproval}
                  onChange={(e) => handleChange('notifyOnApproval', e.target.checked)}
                />
              }
              label="결재 완료 시"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={currentSettings.notifyBeforeDueDate}
                  onChange={(e) => handleChange('notifyBeforeDueDate', e.target.checked)}
                />
              }
              label="시행일 전"
            />
          </Box>

          {currentSettings.notifyBeforeDueDate && (
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>시행일 몇 일 전에 알림을 받으시겠습니까?</Typography>
              <Slider
                value={currentSettings.daysBeforeDueDate}
                onChange={(_, value) => handleChange('daysBeforeDueDate', value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={30}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 