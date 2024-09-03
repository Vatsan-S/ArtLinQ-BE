import Chat from '../Models/chatSchema.js'
import Message from '../Models/messageSchema.js'
import User from '../Models/userSchema.js'



export const accessChat = async(req,res)=>{
    const {userID} = req.body

    const userData = await User.findById(userID).select("-password")
    // console.log(userData)
    if(!userData){
        return res.status(404).json({message:"No user found "})
    }
    
    if(!userID){
        return res.status(404).json({message:"No user ID present"})
    }
    const existingChat = await Chat.find(
        {$and:[
            {users:{$elemMatch:{$eq:userID}}},
            {users:{$elemMatch:{$eq:req.user}}}
        ]}
    )
    .populate("users","-password")

    if(existingChat.length > 0){
        return res.status(200).json({chat:existingChat[0]})
    }
    else{
        try {
            const newChat = new Chat({
                chatName:userData.userName,
                users:[req.user,userID]
            })
            await newChat.save()
            res.status(200).json({message:"All chats",chat:newChat})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal server error in accessing chat",error})
        }
    }
    
}

export const sendMessage = async (req,res)=>{
    const {chat, content, sender} = req.body
    // validation
    if(!chat || !content || !sender){
        return res.status(400).json({message:"All three datas are mandatory"})
    }

    // ---------------------existing user----------------------------
    const existingUser = await User.findById(sender)
    if(!existingUser){
        return res.status(404).json({message:"No user found"})
    }

    // ----------------------existing chat---------------------------
    const existingChat = await Chat.findById(chat)
    if(!existingChat){
        return res.status(404).json({message:"No chat found"})
    }
    try {
        const newMessage= new Message({
            chat,
            content,
            sender
        })
        await newMessage.save()
        res.status(200).json({message:"Message Sent"})
    } catch (error) {
        res.status(500).json({message:"Internal server error in sending Message",error})
    }
}

export const fetchAllChat = async(req,res)=>{
    const user = req.user
    if(!user){
        return res.status(400).json({message:"No user data"})
    }

    // --------------------existing user----------------------------
    const existingUser = await User.findById(user)
    if(!existingUser){
        return res.status(404).json({message:"No user found"})
    }
    try {
        const allChats = await Chat.find({users:{$elemMatch:{$eq:user}}}).populate("users","-password")
        res.status(200).json({allChats})
    } catch (error) {
        res.status(500).json({message:"Internal server error in fetching all chat",error})
    }
}

export const fetchAllMessages = async(req,res)=>{
    const {chat}=req.body
    // validation
    // ---------------------existing chat-------------------
    const existingChat = await Chat.findById(chat)
    if(!existingChat){
        return res.status(404).json({message:"No chat found"})
    }
    try {
        const allMessages = await Message.find({chat:chat})
        res.status(200).json({message:"All messages", allMessages})
    } catch (error) {
        res.status(500).json({message:"Internal server error in fetching all messages"})
    }
}

export const fetchChat = async(req,res)=>{
    const {chatID} = req.body

    // validation
    if(!chatID){
        return res.status(400).json({message:"No chatID available"})
    }
    
    try {
       // ------------------existing chat-----------------------------------
    const existingChat = await Chat.findById(chatID)
    if(!existingChat){
        return res.status(404).json({message:"No chat found"})
    } 
    res.status(200).json({chatDetails: existingChat})
    } catch (error) {
        res.status(500).json({message:"Internal server error in fetching the chat", error: error})
    }
}