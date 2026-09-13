import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import { initSocket } from './socket/index.js';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import challengeRoutes from './routes/challenges.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = [process.env.CLIENT_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'].filter(Boolean);
const corsOptions = { origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)) };
const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api', userRoutes);

initSocket(io);

async function start() {
  await initDB();
  server.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
}

start();
