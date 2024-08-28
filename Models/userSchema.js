import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required:true
    },
    phone:{
        type:String,
    },
    gender:{
        type: String,
        enum:["Male","Female","Others"],
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["Artist","Customer"],
        required: true
    },
    randomString:{
        type: String
    },
    randomStringExpiration:{
        type:Date
    },
    activation:{
        type: Boolean,
        default: false
    },
    services:{
        type: [],
        default: []
    },
    appoinments:[]
})

const User = mongoose.model("User", userSchema)
export default User