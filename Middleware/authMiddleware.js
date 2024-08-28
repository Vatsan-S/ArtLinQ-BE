import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = (req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1]
    if(!token){
        return res.status(404).json({message:"No valid access"})
    }
    try {
        const decoded  = jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!decoded.userID){
        return res.status(404).json({message:"Invalid Access"})
    }
    req.user = decoded.userID
    next()
    } catch (error) {
        // console.log(error)
        res.status(500).json({message:"Internal server error in authenticating user"})
    }
}


export default authMiddleware