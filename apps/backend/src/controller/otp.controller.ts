import { Request, Response } from 'express';
import { checkRateLimit } from '../services/otpservice';
import { generateOtp } from '../services/otpservice';
import { storeOtp, verifyOtp } from '../services/otpservice';
import { sendOtpEmail } from '../services/emailservice';

export async function sendOtp(req: Request, res: Response) {
    try {
        const { email, purpose } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "email is requires"
            });
        }
        const rateLimit = await checkRateLimit(email);
        if (!rateLimit) {
            return res.status(400).json({
                message: "too many requests"
            })
        }
        const otp = generateOtp();
        await storeOtp(email, otp, purpose);
        await sendOtpEmail(email, otp, purpose);
        return res.status(200).json({
            message: "otp sent successfully"
        });
    } catch (error) {
        console.log("error in sendOtp", error);
        return res.status(500).json({
            message: "otp sent failed"
        });
    }
}
export const verifyotp = async (req: Request, res: Response) => {
    try {
        const { email, otp, purpose } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "email and otp both are required"
            });
        }

        const result = await verifyOtp(email, otp, purpose);
        if (!result.valid) {
            return res.status(400).json({
                message: result.message
            });
        }
        return res.status(200).json({
            message: "OTP verified successfully."
        });
    } catch (error) {
        console.log("error in verifyotp", error);
        return res.status(500).json({
            message: "otp verification failed"
        });
    }
}
