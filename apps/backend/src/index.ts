import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from 'cors';

try {
  dotenv.config();
  const app = express();

  const PORT = process.env.PORT || 3006;

  app.use(express.json());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ error: 'Internal server error' });
  });

  const server = app.listen(PORT, () => {
    console.log(`[SUCCESS] Server running on port ${PORT}`);
  });

  server.on('error', (error: Error) => {
    console.error('[ERROR] Server error:', error);
    console.error('[ERROR] Stack:', error.stack);
  });

  server.on('close', () => {
  });

  // Keep process alive
  const keepAlive = setInterval(() => {
    // Just keep the process running - this should not be needed but helps debug
    if (process.exitCode !== undefined) {
    }
  }, 10000); // Check every 10 seconds

  // Clean up on exit
  process.on('exit', (code) => {
    clearInterval(keepAlive);
  });

  // Ensure process doesn't exit unexpectedly
  process.exitCode = undefined;

} catch (error) {
  process.exit(1);
}
