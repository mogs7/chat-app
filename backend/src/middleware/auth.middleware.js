import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({message: "Unauthorized access. No token provided."});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        if (!decoded) {
            return res.status(401).json({message: "Unauthorized access. Invaid token."});
        }

        const user = await User.findById(decoded.userID).select("-password"); //get everything except password
        console.log(user);
        if (!user){
            return res.status(404).json({message: "User not found."});
        }

        req.user = user; // if user is authenticated,
        next(); // add user to request and call next function

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({messsge: "Internal Server Error"});
    }
};