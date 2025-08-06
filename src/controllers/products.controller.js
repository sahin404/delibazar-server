import Product from "../models/products.model.js"

export const getAllProducts = async(req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err){
        console.log('An error occured to get all products!', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }

}

export const getCategorizedProducts = async(req,res)=>{
    try{
        const {category} = req.params;
        const categorizedProducts = await Product.find({category});
        res.status(200).json(categorizedProducts);
    }
    catch(err){
        console.log('An error occured to get all categorized products!', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}

export const getAProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        const product= await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json(product);
    }
    catch(err){
        console.log('An error occured to get the product!', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}

export const addAProduct = async(req,res)=>{
    try{
        const { picture, name, category, price, description, stock_status } = req.body;
        const newProduct = new Product({
            picture,
            name,
            category,
            price,
            description,
            stock_status
        })
        await newProduct.save();
        res.status(201).json({message:'Successfully Added the product!'});
    }
    catch(err){
        console.log('An error occured to add a product!', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }   

}

export const updateAProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        const newData = req.body;
        const updatedData = await Product.findByIdAndUpdate(id, newData, {new:true});
        if (!updatedData) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedData);
    }
    catch(err){
        console.log('An error occurred to update product', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}

export const deleteAProduct = async(req,res)=>{
    try{
        const {id} = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({message:"Succesfully Deleted the product!"});
    }
    catch(err){
        console.log('An error occurred while deleting the product!', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}