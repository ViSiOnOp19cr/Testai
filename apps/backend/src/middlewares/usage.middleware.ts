import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const checkQuota = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userid || req.user?.id;


  try {
    const userResult = await pool.query(
      `SELECT plan, monthly_quota, quota_reset_date, subscription_status 
       FROM "User" WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    if (user.subscription_status !== 'active') {
      return res.status(403).json({
        error: 'Subscription inactive. Please renew.'
      });
    }

    const today = new Date();
    const resetDate = new Date(user.quota_reset_date);

    if (today >= resetDate) {
      await pool.query(
        `UPDATE "User" 
         SET quota_reset_date = DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
         WHERE id = $1`,
        [userId]
      );
    }


    const usageResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM "API_Usage" 
       WHERE user_id = $1 
       AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );

    const currentUsage = parseInt(usageResult.rows[0].count);

    if (currentUsage >= user.monthly_quota) {
      return res.status(429).json({
        error: 'Monthly quota exceeded',
        used: currentUsage,
        limit: user.monthly_quota,
        resetDate: user.quota_reset_date,
      });
    }

    pool.query(
      `INSERT INTO "API_Usage" (id, user_id, endpoint) VALUES ($1, $2, $3)`,
      [uuidv4(), userId, req.path]
    );
    res.setHeader('X-Quota-Limit', user.monthly_quota);
    res.setHeader('X-Quota-Used', currentUsage + 1);
    res.setHeader('X-Quota-Remaining', user.monthly_quota - currentUsage - 1);

    next();
  } catch (error) {
    console.error('Quota check failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};