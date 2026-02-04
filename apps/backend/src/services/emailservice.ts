import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async(email,otp,purpose)=>{
   const templates = {
        signup: {
            subject: '🔐 Verify Your Email',
            html: `<h2>Your verification code is: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
        },
        login: {
            subject: '🔑 Your Login Code',
            html: `<h2>Login code: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
        }
    }; 
    const template = templates[purpose] || templates.signup;
    await resend.emails.send({
        from:process.env.RESEND_FROM_EMAIL,
        to:email,
        subject:template.subject,
        html:template.html
    });  
};
