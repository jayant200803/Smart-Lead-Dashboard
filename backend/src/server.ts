import 'dotenv/config';
import app from './app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

// Connect to DB on startup (cached for serverless reuse)
connectDB().catch((err) => logger.error('Failed to connect to DB:', err));

// Only start HTTP server when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
}

// Export app for Vercel serverless handler
export default app;
