import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {

  const {fullName, email, password} = req.body;

  try{
    if(!fullName || !email || !password) {
      return res.status(400).json({message: "All field are required"});
    }

    if(password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) === false) {
      return res.status(400).json({message: "Invalid email address"});
    }

    const user = await User.findOne({email});
    if(user) {
      return res.status(400).json({message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: fullName,
      email,
      password: hashedPassword
    });

    if(newUser) {
      
      await newUser.save();
      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic
      });
    } else {
      return res.status(400).json({message: "Invalid user data"});
    }

  } catch (error) {
    console.log("Error in auth.controller.js:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

} 