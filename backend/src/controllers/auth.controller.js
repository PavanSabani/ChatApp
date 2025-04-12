import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res)=>{

    const {fullName,email,password} = req.body

    try {
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All fields are Required"}); 
        }
        if(password<6){
            return res.status(400).json({message:"Password must be at least 6 charecters"});
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:"User already Exists"});


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // once new user is created we will genrate jwt token
            genrateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });

        }
        else{
           return res.status(400).json({message:"Invalid User Data"}); 
        }
        
    } catch (error) {
        console.log("err0r in signup controller:"+error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = (req,res)=>{
    res.send("login");
}

export const logout = (req,res)=>{
    res.send("logout");
}