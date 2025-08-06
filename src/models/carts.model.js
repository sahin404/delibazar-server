import mongoose from "mongoose";


const cartsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
     },
    id: {
        type: String,
        required: true,
        trim: true
  }
}, {timestamps:true});

const Cart = mongoose.model('Cart', cartsSchema);

export default Cart;