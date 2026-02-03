import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';

export async function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    const apiKey = authHeader.substring(7);
    const keyPrefix = apiKey.substring(0, 8);

    const apiKeyResult = await pool.query(
      'SELECT ak.*, u.* FROM "API_Keys" ak INNER JOIN "User" u ON ak.userid = u.id WHERE ak.keyprefix = $1 AND ak.is_active = true',
      [keyPrefix]
    );

    if (apiKeyResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const apiKeyRecord = apiKeyResult.rows[0];

    const isValid = await bcrypt.compare(apiKey, apiKeyRecord.keyhash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    await pool.query(
      'UPDATE "API_Keys" SET last_used = NOW() WHERE id = $1',
      [apiKeyRecord.id]
    );

    const user = {
      id: apiKeyRecord.userid,
      email: apiKeyRecord.email,
      name: apiKeyRecord.name,
      plan: apiKeyRecord.plan,
    };

    (req as any).user = user;
    (req as any).apiKey = {
      id: apiKeyRecord.id,
      userid: apiKeyRecord.userid,
      keyhash: apiKeyRecord.keyhash,
      keyprefix: apiKeyRecord.keyprefix,
      is_active: apiKeyRecord.is_active,
      last_used: apiKeyRecord.last_used,
    };

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

