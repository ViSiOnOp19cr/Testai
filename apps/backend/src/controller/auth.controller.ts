import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request{
  userid?:string;
}
export const register = async(req: Request, res: Response) => {
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

export const login = async(req: Request, res: Response) => {
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

    const token = jwt.sign({
      id:user.id,
    }, process.env.JWT_SECRET,{
      expiresIn:'1h'
    });

    res.json({
      message:"logged in successfully",
      token
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
export const updatePassword = async(req:AuthRequest, res:Response)=>{
  try{
    const {newPassword} = req.body;
    const user = req.userid;
    if(!newPassword){
      return res.status(400).json({
        message:"password field is requires"
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    await pool.query(
      'UPDATE User SET password = $1 WHERE id = $2',[hashedPassword,user]
    );
    return res.status(200).json({
      message:'password changed successfully'
    });
  }catch(error){
    console.log("error in updatePassword",error);
    return res.status(500).json({
      message:'password update failed'
    });
  }
}
