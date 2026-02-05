import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyOtp } from '../services/otpservice';

interface AuthRequest extends Request {
  userid?: string;
}
export const register = async (req: Request, res: Response) => {
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials user not found' });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials password wrong' });
    }

    const token = jwt.sign({
      id: user.id,
    }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });

    res.json({
      message: "logged in successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
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
export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        message: "password field is requires"
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE User SET password = $1 WHERE email = $2', [hashedPassword, email]
    );
    return res.status(200).json({
      message: 'password changed successfully'
    });
  } catch (error) {
    console.log("error in updatePassword", error);
    return res.status(500).json({
      message: 'password update failed'
    });
  }
}
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required"
      });
    }

    const otpResult = await verifyOtp(email, otp, 'reset-password');

    if (!otpResult.valid) {
      return res.status(400).json({
        message: otpResult.message || "Invalid or expired OTP"
      });
    }

    const userResult = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE email = $2',
      [hashedPassword, email]
    );
    return res.status(200).json({
      message: "Password reset successfully"
    });
  } catch (error) {
    console.log("error in resetPassword", error);
    return res.status(500).json({
      message: "Password reset failed"
    });
  }
}

