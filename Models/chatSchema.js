import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatName: { 
    type: String, 
    trim: true 
},
users: [{type: mongoose.Types.ObjectId, ref: "User"}]

},{timestamps:true});


const Chat = mongoose.model("Chat", chatSchema)
export default Chat