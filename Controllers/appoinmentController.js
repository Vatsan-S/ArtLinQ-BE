import Appoinment from '../Models/appoinment.js'
import User from '../Models/userSchema.js'

export const createAppoinment = async(req,res)=>{
    const {userID, artistID, date, time, description} = req.body

    // validation  
    // -----------------------------content Validation-------------------------
    if(!userID || !artistID || !date || !time){
        return res.status(400).json({message:"all details are mandatory, userID, artistID, date and time"})
    }

    // -----------------------------validate existing appoinment-------------------------
    const existingAppoinment = await Appoinment.find({date:date, time:time})
    // console.log(existingAppoinment)
    if(existingAppoinment.length>0){
        return res.status(400).json({message:"An appoinment is booked in this date already"})
    }
try {

    const newAppoinment = new Appoinment(req.body)
    await newAppoinment.save()
    res.status(200).json({message:"Appoinment booked"})
} catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal server error in booking appoinment"})
}
}


export const fetchBookedDates = async(req,res)=>{
    const {artistID} = req.body

    // validation
    // -----------------------------------content validation--------------------------------
    if(!artistID){
        return res.status(400).json({message:"no artistID available"})
    }

    // -------------------------------------validate user------------------------------------
    const user = await User.findById(artistID)
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    try {
        const allAppoinment = await Appoinment.find({artistID:artistID})
        res.status(200).json({allAppoinment: allAppoinment})
    } catch (error) {
        res.status(500).json({message:"Internal server error in fetching all bookingDates"})
    }
}