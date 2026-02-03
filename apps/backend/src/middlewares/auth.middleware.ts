import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request{
    userid?:string;
}
export const auth_middleware = (req:AuthRequest, res:Response, next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error:'Unauthorized'});
    }
    const user = jwt.verify(token,process.env.JWT_SECRET);
    req.userid = user.id;
    next();
}