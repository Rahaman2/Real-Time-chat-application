import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

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
export const login = (req, res) => {
    res.send("Signup page")
}
export const logout = (req, res) => {
    res.send("Signup page")
}