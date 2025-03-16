import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"; // no {} because export is default
import bcrypt from "bcryptjs"; // encrypts passwords

export const signup = async (req,res) => {
    const {fullName, email, password } = req.body; // destructuring. this is because req.body
    // may contain variables like req.body.fullName, req.body.email, req.body.password, etc...
    try {
        //check if any fields are empty and throw error if there are
        if (!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required" }); // since it has return it exits the function
        }
        //hash passwords
        if (password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters " }); // since it has return it exits the function
        }

        //searches db if user exists
        const user = await User.findOne({email});
        // console.log(user);
        if (user){
            return res.status(400).json({message: "email already exists"}); // since it has return it exits the function
        }   
        
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //if everything is valid, create the new user
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if(newUser){
            // generate jwt token
            generateToken(newUser._id,res);
            await newUser.save(); // save newUser to database. .save() comes from mongoose
            // await ensures newUser is saved to database

            res.status(201).json({ // continue running function since there's no return on the res
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({message: " Invalid user data " });
        }

    } catch (error) {
        console.log("Error in signup controller ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    };

    res.send("signup route");
};

export const login = async (req,res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        console.log(user);
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message: " Internal Server Error"});
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt" ,"", {maxAge:0});
        res.status(500).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).json({message: "Logged out successfully"});
    }
};

