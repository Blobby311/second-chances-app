import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { connectDB } from './config/database';
import { getPort, getUploadDir, isAzureEnvironment } from './config/azure';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import productRoutes from './routes/products';
import sellerRoutes from './routes/seller';
import orderRoutes from './routes/orders';
import favoriteRoutes from './routes/favorites';
import addressRoutes from './routes/addresses';
import paymentRoutes from './routes/payments';
import ratingRoutes from './routes/ratings';
import pointsRoutes from './routes/points';
import badgeRoutes from './routes/badges';
import missionRoutes from './routes/missions';
import rewardRoutes from './routes/rewards';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';
import profileRoutes from './routes/profiles';
import guideRoutes from './routes/guides';
import aiRoutes from './routes/ai';
import aiDebugRoutes from './routes/aiDebug';
import referralRoutes from './routes/referrals';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
});

const PORT = getPort();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development (for phone testing)
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadDir = getUploadDir();
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user/favorites', favoriteRoutes);
app.use('/api/user/addresses', addressRoutes);
app.use('/api/user/payment-methods', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/user/points', pointsRoutes);
app.use('/api/user/badges', badgeRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', profileRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/ai', aiRoutes);
// Diagnostic route for AI service health and configuration (non-secret)
app.use('/api/ai', aiDebugRoutes);
app.use('/api/referrals', referralRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (chatId: string) => {
    socket.join(`chat-${chatId}`);
  });

  socket.on('send-message', async (data: { chatId: string; message: any }) => {
    // Broadcast to all users in the chat room
    io.to(`chat-${data.chatId}`).emit('new-message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to database and start server
connectDB().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Azure Environment: ${isAzureEnvironment() ? 'Yes' : 'No'}`);
    if (isAzureEnvironment()) {
      console.log(`Azure App Service: ${process.env.WEBSITE_SITE_NAME || 'N/A'}`);
    }

    // Non-secret diagnostic: indicate whether the GROQ API key is configured in the environment
    console.info(`[AI] GROQ_API_KEY present: ${!!process.env.GROQ_API_KEY ? 'Yes' : 'No'}`);
  });
});

export { io };

