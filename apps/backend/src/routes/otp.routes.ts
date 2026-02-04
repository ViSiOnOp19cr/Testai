import express from 'express';
import {sendOtp,verifyotp} from '../controller/otp.controller';
const router = express.Router();

router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyotp);

export default router;
