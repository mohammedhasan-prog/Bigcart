import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema({
  name: { type: String, require: [true, "Name is require"] },
  email: { type: String, require: [true, "email is require"],
    unique:true,
    trim:true,
    lowercase:true
   },
   password:{type:String,require:true,
    minlength:[6,'password is min of 6 character']
   },

   cartItem:[{quantity:{type:Number,
    default:1
   },
   product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
   }

}],
role:{type:String,
    enum:['customer','admin'],
    default:'customer'
}
},{
    timestamps:true
});


// hashing password
UserSchema.pre("save",async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try {
        const salt=await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log(error);
    }
})

UserSchema.methods.comparePassword= async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}
const User=mongoose.model('User',UserSchema);
 export default User;