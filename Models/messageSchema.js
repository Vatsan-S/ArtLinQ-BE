import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({

    // covert it into chatID when erasing all chats after testing
    chat:{
        type: mongoose.Types.ObjectId,
        ref: "Chat"
    },
    sender:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    content:{
        type: String,
        trim: true
    }

},
{timestamps: true})

const Message = mongoose.model("Message", messageSchema)
export default Message