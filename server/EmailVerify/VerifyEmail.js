import nodemailer from 'nodemailer';
import 'dotenv/config';



export const VerifyEmail=async(token,email)=>{

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


transporter.sendMail(mailConfiguration,(error,info)=>{
    if(error){
        console.log('Error sending email:',error);
    }else{
        console.log('Email sent successfully:',info.response);
    }
})
}


