import express from 'express';
import { dbConnect } from './libs/db.js';
import authRouter from './routes/auth.router.js';
import productsRouter from './routes/products.router.js';
import dotenv from 'dotenv';
import cartsRouter from './routes/carts.router.js';
import searchRouter from './routes/search.router.js';
import cors from 'cors';
import axios from "axios"

//for no rendering in render
const url = `https://delibazar-server.onrender.com`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);



//Middlewares
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


// Routes
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter );
app.use('/search', searchRouter );


//Grettings
app.get('/',(req,res)=>{
    res.send('Hello World!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,async()=>{
    await dbConnect();
    console.log('Server running on port 3000');
})