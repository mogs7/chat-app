import jwt from "jsonwebtoken";

export const generateToken = (userID, res) =>{
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {  // cookie comes from express
        maxAge: 7*24*60*60*1000, // 7days in ms
        httpOnly: true, //prevents xss attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })

    return token;
}