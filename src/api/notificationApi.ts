import axios from 'axios';
import { NotificationSettings } from '../types/law';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

export const updateNotificationSettings = async (lawId: string, settings: NotificationSettings) => {
  const response = await axios.put(`${API_BASE_URL}/api/laws/${lawId}/notifications`, settings);
  return response.data;
};

export const testEmailNotification = async (emailAddress: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/notifications/test-email`, {
    emailAddress
  });
  return response.data;
}; 