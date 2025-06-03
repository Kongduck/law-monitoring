const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { sampleLawAmendments, sampleNotifications, sampleDepartments } = require('./sampleData');

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
  service: 'gmail',
  auth: {
    user: 'myscan1213@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD // Gmail 앱 비밀번호
  }
});

// 이메일 발송 함수
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: 'myscan1213@gmail.com',
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', info.response);
    return true;
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    return false;
  }
};

// 임시 데이터 저장소
let notifications = [...sampleNotifications];
let notificationSettings = sampleLawAmendments.map(law => law.notificationSettings);
let lawAmendments = [...sampleLawAmendments];

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
    departmentStats: sampleDepartments,
    upcomingDueDates: calculateUpcomingDueDates()
  };
  res.json(stats);
});

// 통계 계산 함수들
function calculateMonthlyStats() {
  const currentDate = new Date();
  const monthlyStats = [];
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthStr = month.toISOString().slice(0, 7);
    
    const amendments = lawAmendments.filter(law => 
      law.amendmentDate.startsWith(monthStr)
    );
    
    monthlyStats.unshift({
      month: monthStr,
      total: amendments.length,
      completed: amendments.filter(a => a.status === '완료').length
    });
  }
  
  return monthlyStats;
}

function calculateUpcomingDueDates() {
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
  
  return lawAmendments
    .filter(law => {
      const dueDate = new Date(law.expectedDate);
      return dueDate >= currentDate && dueDate <= thirtyDaysFromNow;
    })
    .map(law => ({
      id: law.id,
      lawName: law.lawName,
      dueDate: law.expectedDate,
      status: law.status
    }))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

// 알림 생성 및 발송
async function createNotification(type, lawId, message) {
  const law = lawAmendments.find(l => l.id === lawId);
  if (!law) return;
  
  const notification = {
    id: Date.now().toString(),
    type,
    lawId,
    lawName: law.lawName,
    message,
    createdAt: new Date().toISOString(),
    isRead: false,
    link: `/laws/${lawId}`
  };
  
  notifications.push(notification);
  
  // 웹소켓으로 실시간 알림 전송
  io.emit('notification', notification);
  
  // 이메일 알림 설정 확인 및 발송
  const setting = notificationSettings.find(s => s.lawId === lawId);
  if (setting?.isEmailEnabled) {
    try {
      await sendEmail(setting.email, '법령 모니터링 알림', message);
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

// 법령 개정안 관련 API
app.put('/api/law-amendments/:id', async (req, res) => {
  console.log('결재 처리 요청 데이터:', req.body);
  
  const { id } = req.params;
  const updatedAmendment = req.body;
  
  const index = lawAmendments.findIndex(law => law.id === id);
  if (index === -1) {
    console.error('법령 개정안을 찾을 수 없음:', id);
    return res.status(404).json({ error: '법령 개정안을 찾을 수 없습니다.' });
  }
  
  lawAmendments[index] = { ...lawAmendments[index], ...updatedAmendment };
  
  // 결재 완료 시 알림 생성 및 이메일 발송
  if (updatedAmendment.status === 'COMPLETED') {
    // 알림 생성
    createNotification(
      'APPROVAL_COMPLETE',
      id,
      `${lawAmendments[index].lawName} 법령의 결재가 완료되었습니다.`
    );

    // 이메일 발송
    const emailSubject = '[법령 모니터링] 결재 완료 알림';
    const emailText = `
법령명: ${lawAmendments[index].lawName}
결재자: ${updatedAmendment.approver}
결재일: ${updatedAmendment.departmentReviewDate}
결재 의견: ${updatedAmendment.approvalComment}

결재가 완료되었습니다.
    `;

    await sendEmail('myscan1213@gmail.com', emailSubject, emailText);
  }
  
  console.log('결재 처리 응답 데이터:', lawAmendments[index]);
  res.json(lawAmendments[index]);
});

// 서버 시작
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 