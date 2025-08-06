import User from "../models/auth.model.js";

const adminVerify = async (req, res, next) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res.status(401).json({ message: 'Unauthorized: No email found in token' });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }

    next();
  } 
  catch (err) {
    console.error('Error verifying admin:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default adminVerify;
