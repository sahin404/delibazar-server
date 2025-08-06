import Product from '../models/products.model.js';

export const searchProducts = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json([]);
  }

  try {
    
    const results = await Product.find({
      name: { $regex: query, $options: "i" }, 
    }).limit(5);

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
