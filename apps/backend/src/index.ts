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
    origin: "*",
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

} catch (error) {
  process.exit(1);
}
