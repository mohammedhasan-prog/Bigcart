import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    description: {type:String,require:true},
    price: { type: Number, require: true,min:0 },
    image: { type: String, require: true },
    category: { type: String, require: true },
    countInStock: { type: Number, require: true, min: 0 },
    isFetured:{type:Boolean,require:true,default:false}
  },
  { timestamps: true }
);

const Product=mongoose.model('Product',ProductSchema);
export default Product;