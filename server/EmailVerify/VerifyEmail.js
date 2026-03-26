import nodemailer from 'nodemailer';
import 'dotenv/config';



export const VerifyEmail=async(token,email)=>{

    if(!process.env.MAIL_USER || !process.env.MAIL_PASS){
        throw new Error('MAIL_USER or MAIL_PASS is not configured');
    }

    const frontendBaseUrl=(process.env.CLIENT_URL || 'https://full-stacl-ecommerce-vlbf.vercel.app').replace(/\/$/, '');
    const verifyUrl=`${frontendBaseUrl}/verify/${token}`;

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
    subject:'Email Verification',
    text:`Please click the following link to verify your email: ${verifyUrl}`
}

    await transporter.verify();
    const info=await transporter.sendMail(mailConfiguration);
    console.log('Email sent successfully:',info.response);
}


