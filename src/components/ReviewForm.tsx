import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Review } from '../types';

interface ReviewFormProps {
  amendmentId: string;
  onSubmit: (review: Omit<Review, 'id'>) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ amendmentId, onSubmit }) => {
  const [reviewer, setReviewer] = useState('');
  const [comments, setComments] = useState('');
  const [implementationPlan, setImplementationPlan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amendmentId,
      reviewer,
      reviewDate: new Date().toISOString(),
      comments,
      implementationPlan
    });
    
    // 폼 초기화
    setReviewer('');
    setComments('');
    setImplementationPlan('');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        검토 의견 등록
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="검토자"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="검토 의견"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="적용 방안"
          value={implementationPlan}
          onChange={(e) => setImplementationPlan(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          fullWidth
        >
          등록
        </Button>
      </Box>
    </Paper>
  );
}; 