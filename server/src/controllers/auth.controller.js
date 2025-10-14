import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {

  const {fullName, email, password} = req.body;

  try{
    if(!fullName || !email || !password) {
      return res.status(400).json({message: "All field are required", ok: false});
    }

    if(password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters", ok:false});
    }

    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) === false) {
      return res.status(400).json({message: "Invalid email address", ok: false});
    }

    const user = await User.findOne({email});
    if(user) {
      return res.status(400).json({message: "User already exists", ok: false});
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

      try {
        await sendWelcomeEmail(email, fullName, "https://chit-chat-futer.sevalla.app");
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

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

export const login = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "All fileds are required", ok: false});
  }

  try {
    const user = await User.findOne({email});

    if(!user) return res.status(400).json({message: "Invalid credentials!", ok: false});

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials", ok: false});

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.username,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.log("Error in auth.controller.js:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const logout = async (_, res) => {
  res.cookie("jwt", "", {maxAge: 0});
  res.status(200).json({message: "Logged out successfully!"});
}

export const updateProfile = async(req, res) => {
  try {
    const { profilePic } = req.body;
    if(!profilePic) return res.status(400).json({message: "Profile pic is required"});

    const userId = req.user.id

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findById(userId, {profilePic: uploadResponse.secure_url}, {new: true}).select("-password");  

    res.status(200).json(updatedUser);

  } catch(error) {
    console.log("Error in auth.controller.js\n\nError:\n", error);
    return res.status(500).json({message: "Internal Server error"});
  }
}