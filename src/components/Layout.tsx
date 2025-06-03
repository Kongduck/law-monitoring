import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { NotificationBell } from './NotificationBell';
import { useNotification } from '../contexts/NotificationContext';
import { Home } from '../pages/Home';

const Layout: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotification();

  const handleNotificationClick = (notification: any) => {
    // 알림 클릭 시 해당 페이지로 이동하는 로직 구현
    console.log('Notification clicked:', notification);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            법령 모니터링 시스템
          </Typography>
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={markAsRead}
          />
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default Layout; 