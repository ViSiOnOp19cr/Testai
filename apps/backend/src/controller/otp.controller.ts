import {Request ,Response} from 'express';
import {checkRateLimit} from '../services/otpservice';
import {generateOtp} from '../services/otpservice';
import {storeOtp} from '../services/otpservice';
import {sendOtpEmail} from '../services/emailservice';

export async function sendOtp(req: Request, res: Response) {
    try{
        const {email, purpose = 'signup'} = req.body;
        if(!email){
            return res.status(400).json({
                message:"email is requires"
            });
        }
        const rateLimit = await checkRateLimit(email);
        if(!rateLimit){
            return res.status(400).json({
                message:"too many requests"
            })
        }
        const otp = generateOtp();
        await storeOtp(email,otp,purpose);
        await sendOtpEmail(email,otp,purpose);
        return res.status(200).json({
            message:"otp sent successfully"
        });
    }catch(error){
        console.log("error in sendOtp",error);
        return res.status(500).json({
            message:"otp sent failed"
        });
    }
}
    