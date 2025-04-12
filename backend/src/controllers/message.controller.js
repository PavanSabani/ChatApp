import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req,res) =>{
    try {
        // getting logged in user 
        const loggedInUserId = req.user._id;

        // filtering all other users excpet logged in user 
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUsersForSidebar:",error.message);
        res.status(500).json({message:"internal Server Error"});
    }
}

export const getMessages = async (req,res)=>{
    try {
        const {id:userToChatId}=req.params
        const myId=req.user._id;


        // find all the messages between sender and reciver
        const messages = await Message.find({
            $or:[
                {
                    senderId:myId,receiverId:userToChatId
                },
                {
                    senderId:userToChatId,receiverId:myId
                }
            ]
        });

        res.status(400).json(messages);
    } catch (error) {
        console.log("error in getMessages:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessages = async (req,res)=>{
    try {
        const {text ,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            
            // if image exists upload it cloudinary and get url
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        // todo:realtime functinality using socketio will go here

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("error in sendMessages:",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}