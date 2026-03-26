import nodemailer from 'nodemailer';
import 'dotenv/config';
import { text } from 'express';



export const VerifyEmail=async(token,email)=>{

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
    text:`Please click the following link to verify your email: http://localhost:5173/verify/${token}`
}


transporter.sendMail(mailConfiguration,(error,info)=>{
    if(error){
        console.log('Error sending email:',error);
    }else{
        console.log('Email sent successfully:',info.response);
    }
})
}


