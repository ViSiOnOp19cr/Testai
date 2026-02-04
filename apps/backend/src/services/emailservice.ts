import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp, purpose) => {
    const templates = {
        signup: {
            subject: '🔐 Verify Your Email - Testai',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #ff8c66 0%, #ff6b35 100%); min-height: 100vh;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🔐 Testai
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">
                                Welcome aboard! Let's verify your email
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                Your Verification Code
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Thanks for signing up! Use the code below to verify your email address and get started with AI-powered API testing.
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 30px; background: linear-gradient(135deg, #fff5f0 0%, #ffe8db 100%); border-radius: 12px; border: 2px dashed #ff6b35;">
                                        <div style="font-size: 42px; font-weight: 700; color: #ff6b35; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="background: #fffaf0; border-left: 4px solid #ff6b35; padding: 16px 20px; border-radius: 8px; margin: 30px 0;">
                                <p style="margin: 0; color: #7c3810; font-size: 14px; line-height: 1.5;">
                                    ⏱️ <strong>Important:</strong> This code will expire in 10 minutes for security reasons.
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                                Need help? Contact us at <a href="mailto:support@testai.com" style="color: #ff6b35; text-decoration: none;">support@testai.com</a>
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © ${new Date().getFullYear()} Testai. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        },
        login: {
            subject: '🔑 Your Login Code - Testai',
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #ff8c66 0%, #e55a2b 100%); min-height: 100vh;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                🔑 Testai
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px;">
                                Welcome back! Let's log you in
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                Your Login Code
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                You requested a login code. Enter the code below to access your account and continue testing.
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 30px; background: linear-gradient(135deg, #fff5f0 0%, #ffe8db 100%); border-radius: 12px; border: 2px dashed #ff6b35;">
                                        <div style="font-size: 42px; font-weight: 700; color: #ff6b35; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="background: #fff5f5; border-left: 4px solid #fc8181; padding: 16px 20px; border-radius: 8px; margin: 30px 0;">
                                <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.5;">
                                    🔒 <strong>Security Notice:</strong> This code expires in 10 minutes. Never share this code with anyone.
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                If you didn't attempt to log in, please secure your account immediately by changing your password.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                                Need help? Contact us at <a href="mailto:support@testai.com" style="color: #ff6b35; text-decoration: none;">support@testai.com</a>
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © ${new Date().getFullYear()} Testai. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `
        }
    };
    const template = templates[purpose] || templates.signup;
    await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: template.subject,
        html: template.html
    });
};
