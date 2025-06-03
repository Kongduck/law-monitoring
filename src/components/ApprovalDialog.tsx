import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface ApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (comment: string) => void;
  lawTitle: string;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  onClose,
  onApprove,
  lawTitle
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onApprove(comment);
    setComment('');
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>결재 처리 - {lawTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="결재 의견"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={!comment.trim()}
        >
          결재
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 