import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {/* 상태별 통계 */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            상태별 현황
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                검토중
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.statusCounts.검토중 / stats.totalLaws) * 100}
                    color="warning"
                  />
                </Box>
                <Typography variant="body2">
                  {stats.statusCounts.검토중}건
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                진행중
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.statusCounts.진행중 / stats.totalLaws) * 100}
                    color="primary"
                  />
                </Box>
                <Typography variant="body2">
                  {stats.statusCounts.진행중}건
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                완료
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.statusCounts.완료 / stats.totalLaws) * 100}
                    color="success"
                  />
                </Box>
                <Typography variant="body2">
                  {stats.statusCounts.완료}건
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* 월별 통계 차트 */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            월별 개정 현황
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyAmendments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="statusCounts.검토중" name="검토중" fill="#ff9800" stackId="a" />
                <Bar dataKey="statusCounts.진행중" name="진행중" fill="#2196f3" stackId="a" />
                <Bar dataKey="statusCounts.완료" name="완료" fill="#4caf50" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* 부서별 현황 */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            부서별 현황
          </Typography>
          <List>
            {stats.departmentStats.map((dept, index) => (
              <React.Fragment key={dept.department}>
                <ListItem>
                  <ListItemText
                    primary={dept.department}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(dept.completedCount / dept.totalCount) * 100}
                            sx={{ flexGrow: 1, mr: 2 }}
                          />
                          <Typography variant="body2">
                            {Math.round((dept.completedCount / dept.totalCount) * 100)}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            size="small"
                            label={`검토중 ${dept.pendingCount}`}
                            color="warning"
                          />
                          <Chip
                            size="small"
                            label={`진행중 ${dept.inProgressCount}`}
                            color="primary"
                          />
                          <Chip
                            size="small"
                            label={`완료 ${dept.completedCount}`}
                            color="success"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < stats.departmentStats.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* 시행 예정 법령 */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            시행 예정 법령
          </Typography>
          <List>
            {stats.upcomingDueDates.map((law, index) => (
              <React.Fragment key={law.id}>
                <ListItem>
                  <ListItemText
                    primary={law.lawName}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {law.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip
                            size="small"
                            label={`D-${law.daysRemaining}`}
                            color={law.daysRemaining <= 7 ? 'error' : 'default'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {law.dueDate} 시행
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < stats.upcomingDueDates.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}; 