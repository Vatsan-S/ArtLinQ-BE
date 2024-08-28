import mongoose from "mongoose";

const appoinmentSchema = new mongoose.Schema({
    appoinmentID:{
        type: String,
        unique: true,
        default: `AP-${Date.now().toString(32).slice(0,7)}--${Math.random().toString(36).substr(2, 5)}`
    },
    userID:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    artistID:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    date:{
        type: Date,
        required: true,
    },
    time:{
        type: String,
        
    },
    description:{
        type: String
    }
},{timestamps:true})

const Appoinment = mongoose.model("Appoinment",appoinmentSchema)
export default Appoinment