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
    // console.log(addedService);
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

export const editService = async(req,res)=>{
  const {image1, image2, image3, image4, serviceID, category, description, title } = req.body
  // console.log(req.user)
  // validation
  // ---------------------------identify service-----------------------
  const existingService = await Service.findById(serviceID)
  if(!existingService){
    return res.status(404).json({message:"No service Found"})
  }

  // ---------------------validate right user-----------------------
  if(req.user != existingService.artistID){
    return res.status(400).json({message:"Un authorized for this user"})
  }
  try {
    const data = {
      category: category,
      description: description,
      title: title
    }
    if(image1) data["image1"] = image1
    if(image2) data["image2"] = image2
    if(image3) data["image3"] = image3
    if(image4) data["image4"] = image4
    const updatedService = await Service.findOneAndUpdate({_id:serviceID},data,{new:true})
    // console.log(updatedService)
    res.status(200).json({updatedService: updatedService})
  } catch (error) {
    res.status(500).json({message:"Internal server error in editig service"})
  }
}

export const deleteService = async(req,res)=>{
  const {serviceID} = req.body

  // validate
  const existingService = await Service.findById(serviceID)
  if(!existingService){
    return res.status(404).json({message:"No service Found"})
  }

  // validate right User
  if(req.user != existingService.artistID){
    return res.status(400).json({message:"Un authorized Access"})
  }
  try {
    const deletedService = await Service.findOneAndDelete({_id:serviceID})
    res.status(200).json({message:"Service Deleted Successfully"})
  } catch (error) {
    res.status(500).json({message:"Internal server error in deleting service"})
  }
}
export const getAllServices = async (req,res)=>{
  try {
    const allServices = await Service.find().populate("artistID","-password")
    const allArtist = await User.find({role:"Artist"})
    res.status(200).json({message:"All services",allServices, allArtist})
  } catch (error) {
    res.status(500).json({message:"Internal server error in getting all services", error})
  }
}

export const getService = async(req,res)=>{

  const {id} = req.body
  // validaition
  const existingService = await Service.findById(id).populate('artistID')
  if(!existingService){
    return res.status(404).json({message:"Service not found"})
  }
  try {
    res.status(200).json({serviceData: existingService})
  } catch (error) {
    res.status(500).json({message:"Internal server error in fetching service"})
  }
}

export const getServiceCategory = async(req,res)=>{
  const {type} = req.body
  // validation
  if(!type){
    return res.status(400).json({message:"No type found"})
  }

  
  try {
    let categoryList;
    if(type === 'All'){
      categoryList = await Service.find().populate('artistID')
    }else{
      categoryList = await Service.find({category: type}).populate('artistID')
      if(!categoryList){
        return res.status(404).json({message:"No valid type"})
      }
    }
    res.status(200).json({allData:categoryList})
    
  } catch (error) {
    res.status(500).json({message:"Internal server error in getting service category"})
  }
}