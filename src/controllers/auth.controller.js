import User from "../models/auth.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//Save an user into database
export const postAUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(200).json({ message: "User Saved Successfully!" });
  } catch (err) {
    console.log({ error: err.message });
    res.status(501).json({ message: "Internal Server Error." });
  }
};

// get all users from database into dashboard
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// delete An user
export const deleteAnUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({message: 'User deleted Successfully!'});
  } catch (err) {
    console.log("An Error occured to delete user: ", err.message);
    res.status(500).json({ message: "An Error occured to delete user" });
  }
};

// Add admin to a user
export const addAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Remove admin
export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: "" },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user role:", err.message);
    res.status(500).json({ message: "Inernal Server error"});
  }
};


//jwt
export const createToken=(req,res)=>{
  try{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });  
  }
  catch(err){
    console.error("Error create jwt token:", err.message);
    res.status(500).json({ message: "Internal Server error"});
  }
    
}


//isAdmin for Frontend
export const isAdmin=async(req,res)=>{
  try{
    const {email} = req.params;
    if(email!==req.decoded.email){
      return res.status(403).json({ message: 'Unuthorized Access' });
    }
    const user = await User.findOne({email});
    if(!user || user.role!=='admin'){
      return res.status(403).json({ message: 'Unauthorized Access' });
    }
    res.status(200).json({admin:true});
  }
  catch(err){
    console.error("Error create to admin Checking:", err.message);
    res.status(500).json({ message: "Internal Server error"});
  }
  
}


