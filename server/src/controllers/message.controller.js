import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContects route of message.controller.js\n\nError:\n", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessagesByUserId route of message.controller.js \n\nError:\n", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if(!text && !image) {
      return res.status(400).json({message: "Text or image is required."});
    }

    if(senderId.equals(receiverId)) {
      return res.status(400).json({message: "Cannot send messages to Yourself."});
    }

    const receiverExsists = await User.exists({ _id: receiverId});
    if(!receiverExsists) return res.status(404).json({message: "Receiver not Found!"});

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    // todo: send message in real-time if user is online - socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage route of message.controller.js\n\nError:\n", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all messages involving the logged-in user, sorted by creation date
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).sort({ createdAt: -1 });

    // Use a map to store the latest message for each chat partner
    const latestMessagesMap = new Map();

    messages.forEach((message) => {
      const otherUserId = message.senderId.equals(loggedInUserId)
        ? message.receiverId.toString()
        : message.senderId.toString();

      if (!latestMessagesMap.has(otherUserId)) {
        latestMessagesMap.set(otherUserId, message);
      }
    });

    const chatPartnersIds = Array.from(latestMessagesMap.keys());

    if(chatPartnersIds.length === 0) {
      return res.status(200).json([]);
    }

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");

    // Sort the chat partners based on the time of the last message
    chatPartners.sort((a, b) => {
      const lastMessageA = latestMessagesMap.get(a._id.toString());
      const lastMessageB = latestMessagesMap.get(b._id.toString());

      return lastMessageB.createdAt - lastMessageA.createdAt;
    });

    const populatedChats = chatPartners.map(partner => {
      const lastMessage = latestMessagesMap.get(partner._id.toString());
      return {
        ...partner.toObject(),
        lastMessage: {
          text: lastMessage.text || 'Image',
          createdAt: lastMessage.createdAt
        }
      }
    });

    res.status(200).json(populatedChats);
  } catch (error) {
    console.log(
      "Error in getChatPartners of message.controller.js\n\nError:\n",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};