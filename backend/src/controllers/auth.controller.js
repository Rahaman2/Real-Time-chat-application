import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinray from "../lib/cloudinary.js";

export const signup = async (req, res) => {

    // hash the password
    
    try {
        const { fullName, email, password } = req.body;
        if(!email || !password || !fullName) {
            res.status(400).json({message: "All fields are required"})
        }
        if (password.length < 6) {
            res.status(400).json({message: "Password should be atleast 6 characters"})
        }
        const  user = await User.findOne({email});
        
        if (user) return res.status(400).json({message : "User already exists"})
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                fullName,
                email,
                password: hashedPassword
            })

        if (newUser) {
            // generate jwt
            generateToken(newUser._id, res)
            await newUser.save();
            const {_id, fullName, profilePic, email} = newUser
            res.status(201).json({
                _id,
                fullName,
                profilePic,
                email
            })

        } else {
            return res.status(400).json({message: "Invalid User data"});
        }
    } catch (error) {
        console.log("Error in signup message ", error);
        res.status(500).json({message: "Internal Server Error"});
        
    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
           return res.status(400).json({message : "Fields must not be empty"})
        }
        const user = await User.findOne({email});
        if(!user) {
           return res.status(400).json({message: "Invalid Credentials"});
        } else {
            const correctPassword = await bcrypt.compare(password, user.password);
            if (!correctPassword) {
               return res.status(400).json({message: "Invalid Credentials"});
            }
            generateToken(user._id, res);
            const  {_id, fullName, email, profilePic } = user
           return res.status(200).json({_id, fullName, email, profilePic})
        }
        
    } catch (error) {
        res.status(500).json({message :"Interal Server Error"})
    }
    
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message : "Log out success"})
    } catch (error) {
        console.log("Error in logout controller\n", error);
        res.status(500).json({message :"Interal Server Error"})
        
    }
}


export const updateProfile = async ( req, res ) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // set in the protect route function
        if(!profilePic) {
            res.status(400).json({message :"Profile picture is required"})
        }

        const uploadResponse = await cloudinray.uploader.upload(profilePic);
        const updatedUser = User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("An error occured in the updateProfile function", error);
        res.status(500).json({message: "Interal Server Error"});
    }
}


export const checkAuth =  (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log( "Error in the checkAuth Controller" ,error);
        res.status(500).json({message: "Interal Server Error"});
        
    }
}