import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { 
  Notification, 
  NotificationSetting, 
  DashboardStats 
} from '../types';

const API_BASE_URL = 'http://localhost:4000/api';
const SOCKET_URL = 'http://localhost:4000';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 소켓 연결
let socket: Socket;

export const connectSocket = (onNotification: (notification: Notification) => void) => {
  socket = io(SOCKET_URL);
  
  socket.on('connect', () => {
    console.log('소켓 연결됨');
  });
  
  socket.on('notification', (notification: Notification) => {
    onNotification(notification);
  });
  
  socket.on('disconnect', () => {
    console.log('소켓 연결 해제됨');
  });
  
  return () => {
    socket.disconnect();
  };
};

// 알림 관련 API
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await api.post('/notifications/mark-read', { notificationId });
};

export const saveNotificationSettings = async (settings: NotificationSetting): Promise<NotificationSetting> => {
  const response = await api.post('/notification-settings', settings);
  return response.data;
};

// 대시보드 관련 API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
}; 