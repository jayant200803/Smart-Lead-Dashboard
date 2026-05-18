import 'dotenv/config';
import app from './app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    // On Vercel, the platform handles the HTTP server — just export the app.
    // On every other host (Render, Railway, local), listen on PORT.
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        logger.info(`Health check: http://localhost:${PORT}/health`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export app for Vercel serverless handler
export default app;
