import Conversation from "../Models/conversationModels.js";
import Message from "../Models/MessageSchema.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessages = async (req, res) => {
  try {
    const {message} = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id.toString();

    let chats = await Conversation.findOne({participants: {$all: [senderId, receiverId]}});
    if(!chats) {
      chats = await Conversation.create({participants: [senderId, receiverId]});
    }

    const newMessages = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id
    });

    if(newMessages) {
      chats.messages.push(newMessages._id);
    }
    
    await Promise.all([chats.save(), newMessages.save()]);
    
    //SOCKET.IO Functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessages);
    }

    res.status(201).send(newMessages);
  }catch(error) {
    console.error(`Error: ${error}`);
    res.status(500).send({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id.toString();

        const chats = await Conversation.findOne({participants: {$all: [senderId, receiverId]}}).populate("messages");
        if(!chats) {
            return res.status(404).json({ message: "No messages found" });
        }
        const messages = chats.messages;
        res.status(200).send(messages);
    }catch(error) {
        console.error(`Error: ${error}`);
        res.status(500).send({ message: error.message });
    }
}