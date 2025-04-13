import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from '../lib/cloudinary.js'

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


        // hashing the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        // new user created throught User model from db

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // once new user is created we will genrate jwt token
            genrateToken(newUser._id,res)
            await newUser.save();

            res.status(200).json({
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

export const login =  async (req,res)=>{
    const {email,password}=req.body

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const ispass=await bcrypt.compare(password,user.password)

        if(!ispass){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        genrateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });
    }
    catch(error){
        console.log("Error in login Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out succesfully"})
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    // Log incoming base64 (first 100 characters for preview)
    console.log("Incoming Base64:", profilePic.slice(0, 100));

    // Validate if profilePic is provided
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic Required" });
    }

    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id; // Use req.user instead of req.User

    // Add the prefix to the base64 string (if not already present)
    let fullBase64 = profilePic;
    if (!fullBase64.startsWith("data:image/jpeg;base64,")) {
      fullBase64 = `data:image/jpeg;base64,${profilePic}`;
    }

    console.log("Uploading to Cloudinary with base64:", fullBase64.slice(0, 100)); // Log first 100 characters for debugging

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fullBase64);

    // Check if upload is successful
    if (!uploadResponse || !uploadResponse.secure_url) {
      console.error("Cloudinary upload failed. Response:", uploadResponse);
      return res.status(500).json({ message: "Image upload failed" });
    }

    console.log("Cloudinary Upload Success:", uploadResponse.secure_url);

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    // Check if the user update was successful
    if (!updatedUser) {
      console.error("User update failed. User not found or error in DB.");
      return res.status(500).json({ message: "Database update failed" });
    }

    console.log("Updated user:", updatedUser);

    // Return updated user data
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error in update profile:", error.message);
    console.error("Full error object:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller ",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}