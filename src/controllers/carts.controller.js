import Cart from "../models/carts.model.js"

export const getCarts = async(req,res)=>{
    try{
        const {email} = req.query;
        const carts = await Cart.find({userEmail:email});
        res.status(200).json(carts);
    }
    catch(err){
        console.log('Error occured to getting cart: ', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}

export const addCarts = async(req,res)=>{
    try{
        const {userEmail,name, picture,price,id} = req.body;
        const newCart = new Cart({
            userEmail,
            name,
            picture,
            price,
            id
        })
        await newCart.save();
        res.status(201).json({message:'Cart Added Successfully!'});
    }
    catch(err){
        console.log('Error occured to save cart: ', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
    
}

export const deleteCart = async(req,res)=>{
    try{
        const {id} = req.params;
        await Cart.findByIdAndDelete(id);
        res.status(200).json({message:'Cart Deleted Successfully!'});
    }
    catch(err){
        console.log('Error occured to delete cart: ', err.message);
        res.status(500).json({message:'Internal Server Error!'});
    }
}