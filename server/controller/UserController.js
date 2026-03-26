import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { VerifyEmail } from "../EmailVerify/VerifyEmail.js";

import Session from "../model/SessionModel.js";
import { OtpVerification } from "../EmailVerify/OtpSent.js";
import cloudinary from "../utils/Cloudinary.js";

export const regester=async(req,res)=>{
    console.log("router hit")
    try {
        const {firstName,lastName,email,password}=req.body;

        if(!firstName || !lastName || !email || !password){
           return res.status(400).json({
                success:false,
                message:"All fields are required"
             })
            }
        const user=await User.findOne({email});
        if(user){
         return res.status(400).json({
                success:false,
                message:"User already exists"
             })
        }
        const hashedPasswoed=await bcrypt.hash(password,10);
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:hashedPasswoed
        })
        const token=jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:'10m'})

        await VerifyEmail(token,email);
        newUser.token=token;
        await newUser.save();
        console.log("User regestered successfully")
       return res.status(201).json({
            success:true,
            message:"User regestered successfully",
            user:newUser
         })
        
    
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
         })
    }
}

export const verify=async(req,res)=>{
    try {
        const auth=req.headers.authorization;
        if(!auth || !auth.startsWith('Bearer ')){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
             })
        }
        const token=auth.split(' ')[1];
        let decoded;
        try {
            decoded=jwt.verify(token,process.env.SECRET_KEY);
        } 
        catch (error) {
            if(error.name==='TokenExpiredError'){
                return res.status(400).json({
                    success:false,
                    message:"Token expired"
                 })
            }
            return res.status(400).json({
                success:false,
                message:"Invalid token"
             })
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        user.token=null;
        user.isVerified=true;
        await user.save();
 return res.status(200).json({
            success:true,
            message:"Email verified successfully"
         })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
         })
    }
}

export const ReVerify=async(req,res)=>{
const {email}=req.body;
try {
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
    }
    const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'10m'})
    await VerifyEmail(token,email);
    user.token=token;
    await user.save();
    return res.status(200).json({
        success:true,
        message:"Again Verification email sent successfully",
        token:user.token
    })
} catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
     })
}
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const isPasswordValid=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        if(existingUser.isVerified===false){
            return res.status(400).json({
                success:false,
                message:"Please verify your email before logging in"
            
            })
        }
        const ascessToken=jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'10d'})
        const refreshToken=jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'30d'})
        existingUser.isLoggedIn=true;
        await existingUser.save();

        const existingSession=await Session.findOne({userId:existingUser._id})
        if(existingSession){
            await Session.deleteOne({userId:existingUser._id})
        }
        await Session.create({
            userId:existingUser._id
        })

        return res.status(200).json({
            success:true,
            message:`Welcome Back ${existingUser.firstName}`,
            accessToken:ascessToken,
            user:existingUser,
            refreshToken:refreshToken
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const logout=async(req,res)=>{
    try {
        
 const userId=req.id;
 await Session.deleteMany({userId:userId})
 await User.findByIdAndUpdate(userId,{isLoggedIn:false})
    return res.status(200).json({
        success:true,
        message:"Logged out successfully"
     })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const forgetPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })

        }
        const otp=Math.floor(100000 + Math.random()*900000).toString();
        const otpExpire=new Date(Date.now()+10*60*1000);
        await OtpVerification(otp,email);
        user.otp=otp;
        user.otpExpiry=otpExpire;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"OTP sent to your email",
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const otpVerify=async(req,res)=>{

    try {
         const {otp}=req.body;
    const email=req.params.email;
    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is required"
        })
    }
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
    }
    if(!user.otp || !user.otpExpiry){
        return res.status(400).json({
            success:false,
            message:"OTP not found, please request for new OTP"
        })
    }
    if(user.otpExpiry < new Date()){
        return res.status(400).json({
            success:false,
            message:"OTP expired, please request for new OTP"
        })
    }
    if(otp !== user.otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })

    }

    user.otp=null;
    user.otpExpiry=null;
    await user.save();
    return res.status(200).json({
        success:true,
        message:"OTP verified successfully"
     })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
   
  
}

export const changePassword=async(req,res)=>{
    try {
        const {newPassword,confirmPassword}=req.body;
        const {email}=req.params
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        if(!newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match"
            })
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
         })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
       if(users.length===0){
        return res.status(400).json({
            success:false,
            message:"No users found"
        })
       }
       return res.status(200).json({
        success:true,
        message:"Users found successfully",
        users
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getUserById=async(req,res)=>{
    try {
        const {userId}=req.params;
        const user=await User.findById(userId).select('-password -token -otp -optExpiry -role -isVerified -isLoggedIn');
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User found successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const UpdateUser=async(req,res)=>{
    try {
        const userId=req.params.id;
        const userLoggedin=req.user;
        const{firstName,lastName,phoneNo,address,city,zipCode,role}=req.body;
        if(userLoggedin._id.toString() !== userId && userLoggedin.role !== 'admin'){
            return res.status(403).json({
                success:false,
                message:"you are not allowed to update the user"
            })
        }
       const user=await User.findById(userId)
       if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
       }
       let ProfilePicUrl=user.profilePic;
       let profilePicpublicId=user.profilePicpublicId;

       if(req.file){
        if(user.profilePicpublicId){
          await cloudinary.uploader.destroy(profilePicpublicId)
       }
        const uploadResult=await new Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream({
                folder:'profilePics'
            },(error,result)=>{
                if(error){
                    reject(error)
                }
                else{
                    resolve(result)
                }
            }
            )
            stream.end(req.file.buffer)

        })
      ProfilePicUrl=uploadResult.secure_url;
        profilePicpublicId=uploadResult.public_id;
    }

    user.firstName=firstName || user.firstName;
    user.lastName=lastName || user.lastName;
    user.profilePic=ProfilePicUrl;
    user.profilePicpublicId=profilePicpublicId;
    user.phoneNo=phoneNo || user.phoneNo;
    user.address=address || user.address;
    user.city=city || user.city;
    user.role=role || user.role;
    user.zipCode=zipCode || user.zipCode;

    const updatedUser=await user.save();

    return res.status(200).json({
        success:true,
        message:"User updated successfully",
        updatedUser
    })



    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

