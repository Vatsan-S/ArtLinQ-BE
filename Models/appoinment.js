import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const appoinmentSchema = new mongoose.Schema({
    appoinmentID:{
        type: String,
        unique: true,
        
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



appoinmentSchema.pre('save',function(next){
    if(this.isNew){
        this.appoinmentID = `AP-${uuidv4()}`
    }
    next()
})
const Appoinment = mongoose.model("Appoinment",appoinmentSchema)
export default Appoinment