import { Router } from 'express';
import { parse } from '../controller/llm.controller';
import { authenticateApiKey } from '../middlewares/llm.middleware';
import { checkQuota } from '../middlewares/usage.middleware';

const router = Router();

router.post('/parse', authenticateApiKey, checkQuota, parse);

export default router;

