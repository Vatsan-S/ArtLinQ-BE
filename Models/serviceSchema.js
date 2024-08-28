import mongoose, { mongo, Types } from "mongoose";

const serviceSchema = new mongoose.Schema({
    image1:{
        type: String,
        required: true
    },
    image2:{
        type: String
    },
    image3:{
        type: String
    },
    image4:{
        type: String
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type:String,
        enum: ["Visual","Performing", "Literary","Film and Media", "Design","Conceptual", "Craft"],
        required: true
    },
    ratings:{
        type: Number
    },
    ratingCount:{
        type: Number,
        default: 0
    },
    
    artistID:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Service = mongoose.model("Service", serviceSchema)
export default Service