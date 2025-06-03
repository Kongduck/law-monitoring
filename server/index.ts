import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import nodemailer from 'nodemailer';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// 이메일 전송을 위한 설정
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 임시 데이터 저장소
let notifications: any[] = [];
let notificationSettings: any[] = [];
let lawAmendments: any[] = [];

// 알림 관련 API
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.post('/api/notifications/mark-read', (req, res) => {
  const { notificationId } = req.body;
  notifications = notifications.map(n => 
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  res.json({ success: true });
});

app.post('/api/notification-settings', (req, res) => {
  const setting = req.body;
  const index = notificationSettings.findIndex(s => s.lawId === setting.lawId);
  if (index >= 0) {
    notificationSettings[index] = setting;
  } else {
    notificationSettings.push(setting);
  }
  res.json(setting);
});

// 대시보드 통계 API
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalLaws: lawAmendments.length,
    statusCounts: {
      검토중: lawAmendments.filter(l => l.status === '검토중').length,
      진행중: lawAmendments.filter(l => l.status === '진행중').length,
      완료: lawAmendments.filter(l => l.status === '완료').length,
    },
    monthlyAmendments: calculateMonthlyStats(),
    departmentStats: calculateDepartmentStats(),
    upcomingDueDates: calculateUpcomingDueDates()
  };
  res.json(stats);
});

// 통계 계산 함수들
function calculateMonthlyStats() {
  // 월별 통계 계산 로직
  return [];
}

function calculateDepartmentStats() {
  // 부서별 통계 계산 로직
  return [];
}

function calculateUpcomingDueDates() {
  // 시행 예정 법령 계산 로직
  return [];
}

// 알림 생성 및 발송
async function createNotification(type: string, lawId: string, message: string) {
  const notification = {
    id: Date.now().toString(),
    type,
    lawId,
    message,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  notifications.push(notification);
  
  // 웹소켓으로 실시간 알림 전송
  io.emit('notification', notification);
  
  // 이메일 알림 설정 확인 및 발송
  const setting = notificationSettings.find(s => s.lawId === lawId);
  if (setting?.isEmailEnabled) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: setting.email,
        subject: '법령 모니터링 알림',
        text: message
      });
    } catch (error) {
      console.error('이메일 발송 실패:', error);
    }
  }
}

// 웹소켓 연결 처리
io.on('connection', (socket) => {
  console.log('클라이언트 연결됨');
  
  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제됨');
  });
});

// 서버 시작
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 