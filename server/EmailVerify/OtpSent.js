import nodemailer from 'nodemailer';
import 'dotenv/config';




export const OtpVerification=async(otp,email)=>{

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
console.log('Sending OTP email to:', otp);


transporter.sendMail(mailConfiguration,(error,info)=>{
    if(error){
        console.log('Error sending email:',error);
    }else{
        console.log('Email sent successfully:',info.response);
    }
})
}


