import  jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute=async (req,res,next)=>{
     try {
        const aceessToken=req.cookies.acessToken;
        if(!aceessToken){
  return res.status(400).json({message:"Unauthorized Request-No Token Provided"});
        }

      try {
          const decode=jwt.verify(aceessToken,process.env.JWT_SECRET);
      
          const user= await User.findById(decode._id).select("-password");
  
          if(!user){
    return res.status(400).json({message:"User Not Found"});
  
          }
  
          req.user=user;
          next()
      } catch (error) {
        if(error.name=='TokenExpiredError'){
            console.log("AccesToken Expired ",error)

        }
        else{
            throw error  
        }
      }
        
     } catch (error) {
        console.log("Unauthorized Request",error)
     }
}

export const adminRoute =(req,res,next)=>{
    if(req.user &&req.user.role==='admin'){
        next();
    }
    else{
        res.status(400).json({message:"Acces Deniend-Admin Only"})
    }
}