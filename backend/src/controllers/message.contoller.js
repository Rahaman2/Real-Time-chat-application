import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinray from "../lib/cloudinary.js";



export const getUsers = async ( req , res ) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne : loggedInUser}}).select("-password");
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log( "Error in the message getUSers controller Controller" ,error);
        res.status(500).json({message: "Interal Server Error"});   
    }
}


export const getMessages = async (req, res ) => {
    try {
        const { id : userToChatId } =  req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {myId: myId, receiverId: userToChatId},
                {myId: userToChatId, receiverId: myId}
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log( "Error in the getMessage Controller" ,error);
        res.status(500).json({message: "Interal Server Error"});   
        
    }
}

export const sendMesage = async (req, res) => {
    try {
        const {text, image } = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinray.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();
        // todo: RealTime functionality goes here
        res.status(201).json(newMessage);
    } catch (error) {
        console.log( "Error in the sendMessage Controller" ,error);
        res.status(500).json({message: "Interal Server Error"});   
    }
}