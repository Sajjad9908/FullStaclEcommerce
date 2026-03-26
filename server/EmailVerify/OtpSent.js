import nodemailer from 'nodemailer';
import 'dotenv/config';




export const OtpVerification=async(otp,email)=>{

    if(!process.env.MAIL_USER || !process.env.MAIL_PASS){
        throw new Error('MAIL_USER or MAIL_PASS is not configured');
    }

    const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }
})

const mailConfiguration={
    from:process.env.MAIL_USER,
    to:email,
    subject:'OTP Verification',
    html:`<p>Your OTP for email verification is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
}
console.log('Sending OTP email to:', email);

    await transporter.verify();
    const info=await transporter.sendMail(mailConfiguration);
    console.log('Email sent successfully:',info.response);
}


