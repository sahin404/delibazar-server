import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    picture:{
        type:String,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    stock_status:{
        type:String,
        enum:["out_of_stock", "in_stock"],
        default:"in_stock",
        required:true
    }

},{timestamps:true});

const Product = mongoose.model('Product', productsSchema);

export default Product;