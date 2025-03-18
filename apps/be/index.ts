import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import contestRoutes from './routes/contest.routes';
import pcdRoutes from './routes/pcd.routes';
import adminRoutes from './routes/admin.routes';
import { setupScheduler } from './services/scheduler.service';
import { prismaClient as db } from 'db';    

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/pcd', pcdRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
// app.use(errorHandler);

// Connect to database and start server
async function startServer() {
  try {
    // Verify database connection by running a simple query
    await db.user.findFirst();
    console.log('Database connection established successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Start scheduled jobs
      setupScheduler();
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

startServer();

export default app;