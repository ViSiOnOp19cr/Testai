import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

console.log('[DEBUG] Starting application...');
console.log('[DEBUG] All imports loaded');

try {
  dotenv.config();
  console.log('[DEBUG] Dotenv configured');

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('[ERROR] Uncaught Exception:', error);
    console.error('[ERROR] Stack:', error.stack);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[ERROR] Unhandled Rejection at:', promise);
    console.error('[ERROR] Reason:', reason);
  });

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('[DEBUG] Received SIGINT, shutting down gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('[DEBUG] Received SIGTERM, shutting down gracefully...');
    process.exit(0);
  });

  console.log('[DEBUG] Event handlers registered');

  const app = express();
  console.log('[DEBUG] Express app created');

  const PORT = process.env.PORT || 3006;
  console.log('[DEBUG] Port:', PORT);

  app.use(express.json());
  console.log('[DEBUG] JSON middleware added');

  app.use(routes);
  console.log('[DEBUG] Routes middleware added');

  app.get('/health', (req, res) => {
    console.log('[DEBUG] Health check called');
    res.json({ status: 'ok' });
  });
  console.log('[DEBUG] Health route registered');

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[ERROR] Express error:', err);
    console.error('[ERROR] Stack:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });
  console.log('[DEBUG] Error middleware added');

  console.log('[DEBUG] Starting server...');
  const server = app.listen(PORT, () => {
    console.log(`[SUCCESS] Server running on port ${PORT}`);
    console.log('[DEBUG] Server is listening for connections');
  });

  server.on('error', (error: Error) => {
    console.error('[ERROR] Server error:', error);
    console.error('[ERROR] Stack:', error.stack);
  });

  server.on('close', () => {
    console.log('[DEBUG] Server closed');
  });

  console.log('[DEBUG] Server listen called, process should stay alive...');

  // Keep process alive
  const keepAlive = setInterval(() => {
    // Just keep the process running - this should not be needed but helps debug
    if (process.exitCode !== undefined) {
      console.log('[DEBUG] Process exit code set to:', process.exitCode);
    }
  }, 10000); // Check every 10 seconds

  // Clean up on exit
  process.on('exit', (code) => {
    console.log('[DEBUG] Process exiting with code:', code);
    clearInterval(keepAlive);
  });

  // Ensure process doesn't exit unexpectedly
  process.exitCode = undefined;

} catch (error) {
  console.error('[ERROR] Fatal error during startup:', error);
  console.error('[ERROR] Stack:', (error as Error).stack);
  process.exit(1);
}
