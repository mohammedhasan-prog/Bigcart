import User from "../models/user.model.js";
import jwt, { decode } from "jsonwebtoken";
import { client } from "../lib/redis.js";

const genrateToken=(_id)=>{
const acessToken=jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:'1d'});
const refresToken=jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:'7d'});

return {acessToken,refresToken};
}

const setcokiees=(res,acessToken,refresToken)=>{

    res.cookie("acessToken",acessToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:15*60*1000
        
    })
    res.cookie("refresToken",refresToken,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
        
    })
}

const storeRefresToken=async (userid,refresToken)=>{
    await client.set(`refressToken:${userid}`,refresToken);

}
export const  signup= async (req,res)=>{
    const {email,password,name}=req.body;

    if(!email || !password|| !name){
        throw new Error({message:'please add email and password'});
    }
   try {
     const userExist=await User.findOne({email});
 
     if(userExist){
         return res.status(400).json('User alredy Exist');
     }

     const user=await User.create({email,password,name});

     const {acessToken,refresToken}=genrateToken(user._id);

     await storeRefresToken(user._id,refresToken);

     setcokiees(res,acessToken,refresToken);
 
     res.status(200).json({user:{_id:user.id,email:user.email,name:user.name,role:user.role},
        message:"account Created succesfully" },
        
     );
 
   } catch (error) {
      console.log(error);
      res.status(400).json(error);
   }
   
}
export const  login= async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new Error({message:'please add email and password'});
    }

    const user= await User.findOne({email});
    if(!user){
        res.status(400).json({message:"Pls signup First"});
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        res.status(400).json({message:'invalid credantials'});

    }

    const {acessToken,refresToken}=genrateToken(user._id);
    await storeRefresToken(user._id,refresToken);
    setcokiees(res,acessToken,refresToken);
    res.status(200).json({user:{_id:user.id,email:user.email,name:user.name,role:user.role},
        message:"login Succesfully" },
    );


   
}
export const  logout= async (req,res)=>{
    try {
        
        const refresToken=req.cookies.refresToken;
        if(refresToken){
            const decoded= jwt.verify(req.cookies.refresToken,process.env.JWT_SECRET); 
            await client.del(`refressToken:${decoded._id}`);
        }

        res.clearCookie('refresToken');
        res.clearCookie('acessToken');
        res.json({message:'logout Succesfully'})
    } catch (error) {
       res.status(500).json({message:error.message})
    }
  
}

// export const getUserProfile=async (req,res)=>{

//     try {
//         const acessToken=req.cookies.acessToken;
//         if(acessToken){
//             const decode=jwt.verify(acessToken,process.env.JWT_SECRET);
//             const user= await User.findOne(decode._id);
//             res.status(200).json(user);
//         }
//     } catch (error) {
//         res.status(400).json({message:"Plese login first"});
        
//     }

   


// }

