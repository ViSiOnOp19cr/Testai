import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO "User" (id, email, password, name, plan, "createdAt", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, name, plan',
      [email, hashedPassword, name, 'free']
    );

    const user = result.rows[0];

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function createApi(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const apiKey = `tst_${crypto.randomBytes(32).toString('hex')}`;
    const keyPrefix = apiKey.substring(0, 8);
    const keyHash = await bcrypt.hash(apiKey, 10);

    const apiKeyResult = await pool.query(
      'INSERT INTO "API_Keys" (id, userid, keyhash, keyprefix, is_active, last_used) VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW()) RETURNING id',
      [user.id, keyHash, keyPrefix, true]
    );

    const apiKeyRecord = apiKeyResult.rows[0];

    res.status(201).json({
      id: apiKeyRecord.id,
      apiKey: apiKey,
      prefix: keyPrefix,
      createdAt: apiKeyRecord.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
}

export async function getApiKeys(req: Request, res: Response) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userResult = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const apiKeysResult = await pool.query(
      'SELECT id, keyprefix as prefix, last_used as "createdAt" FROM "API_Keys" WHERE userid = $1 AND is_active = true ORDER BY last_used DESC',
      [user.id]
    );

    const apiKeys = apiKeysResult.rows.map(row => ({
      id: row.id,
      prefix: row.prefix,
      createdAt: row.createdAt,
      apiKey: '••••••••••••••••••••••••••••••••' // Hidden for security
    }));

    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
}

export async function whoami(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
}
