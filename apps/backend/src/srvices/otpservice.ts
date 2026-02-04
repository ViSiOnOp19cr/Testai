import bcrypt from 'bcrypt';
import client from './redisclinet';

export const generateOtp = async (email: string) => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const storeOtp = async (email: string, otp: string, purpose: string) => {
    const key = `otp:${email}:${purpose}`;
    const hashedkey = await bcrypt.hash(otp, 10);
    await client.setex(key, 60 * 5, hashedkey);
    await client.setex(`attempts:${email}:${purpose}`, 60 * 5, 0);
}

export const verifyOtp = async (email: string, otp: string, purpose: string) => {
    try {
        const key = `otp:${email}:${purpose}`;
        const attemptsKey = `attempts:${email}:${purpose}`;
        const hashedkey = await client.get(key);
        if (!hashedkey) {
            return {
                valid: false,
                message: "otp not found or expired"
            }
        }
        const attempts = await client.get(attemptsKey);
        if (attempts && parseInt(attempts) >= 3) {
            return {
                valid: false,
                message: "too many attempts"
            }
        }
        const isValid = await bcrypt.compare(otp, hashedkey);
        if (!isValid) {
            return {
                valid: false,
                message: "otp is wrong"
            }
        }
        await client.del(key);
        await client.del(attemptsKey);
        return {
            valid: true,
            message: "otp verified successfully"
        };
    } catch (error) {
        return {
            valid: false,
            message: "otp verification failed"
        }
    }
}

