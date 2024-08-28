import Service from "../Models/serviceSchema.js";
import User from "../Models/userSchema.js";

export const createService = async (req, res) => {
    // return res.status(200).json({message:"Working"})
  const { title, category, description, artistID, image1, image2, image3, image4 } = req.body;
  // validation
  // --------------------------validate User------------------------
  const existingUser = await User.findById(artistID);
  if (!existingUser) {
    return res.status(404).json({ message: "No user found" });
  }
  try {

    const Data ={
      title,
      category,
      description,
      artistID,
      ratings: 0,
      ratingsCount: 0,
      appoinments: [],
      image1
    }
    if(image2) Data["image2"] = image2
    if(image3) Data["image3"] = image3
    if(image4) Data["image4"] = image4
    const newService = new Service(Data);
    const addedService = await newService.save();
    console.log(addedService);
    const updateArtist = await User.findOneAndUpdate(
      { _id: addedService.artistID },
      { $push: { services: addedService._id } }
    );
    res.status(201).json({ message: "Service created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in creating service", error });
  }
};


export const getAllServices = async (req,res)=>{
  try {
    const allServices = await Service.find().populate("artistID","-password")
    const allArtist = await User.find({role:"Artist"})
    res.status(200).json({message:"All services",allServices, allArtist})
  } catch (error) {
    res.status(500).json({message:"Internal server error in getting all services", error})
  }
}