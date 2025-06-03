import React from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface SearchFilterProps {
  status: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExportExcel: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  status,
  onStatusChange,
  searchTerm,
  onSearchChange,
  onExportExcel
}) => {
  const handleStatusChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: string,
  ) => {
    if (newStatus !== null) {
      onStatusChange(newStatus);
    }
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        placeholder="법령명 또는 내용 검색"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 250 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <ToggleButtonGroup
        value={status}
        exclusive
        onChange={handleStatusChange}
        aria-label="상태 필터"
        size="small"
      >
        <ToggleButton value="" aria-label="전체">
          전체
        </ToggleButton>
        <ToggleButton value="검토중" aria-label="검토중">
          검토중
        </ToggleButton>
        <ToggleButton value="진행중" aria-label="진행중">
          진행중
        </ToggleButton>
        <ToggleButton value="완료" aria-label="완료">
          완료
        </ToggleButton>
      </ToggleButtonGroup>

      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={onExportExcel}
        sx={{ marginLeft: 'auto' }}
      >
        엑셀 내보내기
      </Button>
    </Box>
  );
}; 