import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserID = req.user._id.toString();
        const user = await User.find({
            $and:[
                {
                    $or:[
                        {username:{$regex: '.*'+ search + '.*', $options: "i"}},
                        {fullname:{$regex: '.*'+ search + '.*', $options: "i"}},
                    ]
                },{
                    _id: {$ne: currentUserID}   
                }
            ]
        }).select("-password").select("email");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 

export const getCurrentChatters = async (req, res) => {
    try {
        const currentUserID = req.user._id.toString();
        const currentChatters = await Conversation.find({
            participants: currentUserID
        }).sort({
            updatedAt: -1
        });

        if(!currentChatters || currentChatters.length === 0) {
            return res.status(200).send([]);
        }

        const participantsIDs = currentChatters.reduce((ids,conversation) => {
            const otherParticipants = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherParticipants];
        },[]);

        const otherParticipantIds = participantsIDs.filter(id => id.toString() !== currentUserID.toString());

        const user = await User.find({
            _id: {
                $in: otherParticipantIds
            }
        }).select("-password").select("-email");

        const users = otherParticipantIds.map(id => user.find(user => user._id.toString() === id.toString()));

        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 