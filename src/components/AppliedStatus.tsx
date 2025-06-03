import React from 'react';
import { Box, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

interface AppliedStatusProps {
  isApplied: boolean | null;
}

export const AppliedStatus: React.FC<AppliedStatusProps> = ({ isApplied }) => {
  if (isApplied === null) {
    return (
      <Tooltip title="미확인">
        <Box component="span" sx={{ color: 'grey.500' }}>
          <HelpIcon />
        </Box>
      </Tooltip>
    );
  }

  return isApplied ? (
    <Tooltip title="적용">
      <Box component="span" sx={{ color: 'success.main' }}>
        <CheckCircleIcon />
      </Box>
    </Tooltip>
  ) : (
    <Tooltip title="미적용">
      <Box component="span" sx={{ color: 'error.main' }}>
        <CancelIcon />
      </Box>
    </Tooltip>
  );
}; 