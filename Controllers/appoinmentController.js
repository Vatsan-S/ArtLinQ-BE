import Appoinment from "../Models/appoinment.js";
import User from "../Models/userSchema.js";

export const createAppoinment = async (req, res) => {
  const { userID, artistID, date, time, description } = req.body;

  // validation
  // -----------------------------content Validation-------------------------
  if (!userID || !artistID || !date) {
    return res
      .status(400)
      .json({
        message: "all details are mandatory, userID, artistID, date and time",
      });
  }

  // -----------------------------validate existing appoinment-------------------------
  const existingAppoinment = await Appoinment.find({ date:date.split('T')[0], time: time });
  // console.log(existingAppoinment)
  // if (existingAppoinment.length > 0) {
  //   return res
  //     .status(400)
  //     .json({ message: "An appoinment is booked in this date already" });
  // }
  try {
    const newAppoinment = new Appoinment({userID,artistID,date:date.split('T')[0],time,description});
    await newAppoinment.save();
    res.status(200).json({ message: "Appoinment booked" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error in booking appoinment" });
  }
};

export const fetchBookedDates = async (req, res) => {
  const { artistID } = req.body;

  // validation
  // -----------------------------------content validation--------------------------------
  if (!artistID) {
    return res.status(400).json({ message: "no artistID available" });
  }

  // -------------------------------------validate user------------------------------------
  const user = await User.findById(artistID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const allAppoinment = await Appoinment.find({
      artistID: artistID,
    }).populate("userID", "-password");
    res.status(200).json({ allAppoinment: allAppoinment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in fetching all bookingDates" });
  }
};

export const cancelBooking = async (req, res) => {
  const { appointmentID } = req.body;
  // validate
  if (!appointmentID) {
    return res.status(400).json({ message: "No ID found" });
  }
  // ----------------------------------existing appoinment------------------------
  const existingAppoinment = await Appoinment.findOne({
    appoinmentID: appointmentID,
  });
  if (!existingAppoinment) {
    return res.status(404).json({ message: "No appointment found" });
  }

  try {
    const cancelAppointment = await Appoinment.findOneAndDelete({
      appoinmentID: appointmentID,
    });
    // console.log(cancelAppointment);

    res.status(200).json({ message: "Appointment cancelled" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in cancelling Appointment" });
  }
};


export const fetchTimeSlot = async (req,res)=>{
  const {date, userID} = req.body
  // Validate
  if(!date || !userID){
    return res.status(400).json({message:"No credentials found"})
  }

  // ----------------------------validate user------------------------
  const existingUser = await User.findById(userID)

  if(!existingUser){
    return res.status(404).json({message:"No user found"})
  }
  // console.log(userID)
  try {
    // ----------------------find appointment-------------------------
    // console.log(`${date}T00:00:00.000+00:00`)
    const appointments = await Appoinment.find({artistID:userID,date:date})
    // console.log(appointments)
    if(appointments.length === 0){
      return res.status(200).json({timeSlots:existingUser.timeSlots})
    }else{
      const existingTimeSlots = appointments.map((ele)=>ele.time)
      // console.log(existingTimeSlots)
      const availableTimeSlots = existingUser.timeSlots.filter((ele)=>!existingTimeSlots.includes(ele))
      // console.log(availableTimeSlots)
      res.status(200).json({timeSlots:availableTimeSlots})
    }
  } catch (error) {
    res.status(500).json({message:"Internal server error in fetching timeSlots"})
  }
}