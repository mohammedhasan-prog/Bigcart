import { client } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await Product.find();
    res.status(200).json({ allProduct });
  } catch (error) {
    console.log("Error in Fetching All Products", error);
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await client.get("fetautred_Products");
    if (featuredProducts) {
      res.status(200).json(featuredProducts);
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      res.status(400).json({ message: "no Fetaured Product" });
    }

    //store on raddis cach
    await client.set("fetautred_Products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    res.status(500).josn({ message: "serverError" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, isFetured, category } = req.body;
    let cloudinaryResponce = null;
    if (image) {
      cloudinaryResponce = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponce.url||null,
      isFetured,
      category
    });
    res.status(201).json({product})
  } catch (error) {
   res.status(500).json({message:"Unaable to create Product"})

  }
};

export const deleteProduct=async (req,res)=>{
   try {
      const {id}=req.params;
      const product=await Product.findById(id);

      if(!product){
res.status(404).json({mess:"product Note Found"});
      }
      if(product.image){
         const publicId=product.image.split("/").pop().split(".")[0];
         try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("image deleted from cloudinary")
         } catch (error) {
            console.log("erroe in cliudinary image delete",error)
         }
      }
      await Product.findByIdAndDelete(id);
      res.json({message:"Product Deleted succesfully"})
   } catch (error) {
      res.status(500).json({message:error.message})
   }
}