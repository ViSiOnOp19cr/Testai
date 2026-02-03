import { Router } from 'express';
import { parse } from '../controller/llm.controller';
import { authenticateApiKey } from '../middlewares/llm.middleware';

const router = Router();

router.post('/parse', authenticateApiKey, parse);

export default router;

