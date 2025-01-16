import jwt from "jsonwebtoken";


export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in ms
        httpOnly: true, // prevent XXS attacks
        sameSite: true,
        secure: process.env.NODE_ENV !== "development"
    })
    return token
}