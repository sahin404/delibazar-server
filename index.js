const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware');
const jwt = require('jsonwebtoken')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xy1rb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const products = client.db('delibazar').collection('products');
    const cartsCollection = client.db('delibazar').collection('carts');
    const users = client.db('delibazar').collection('users');


    // admin verify middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await users.findOne(query);
      let admin = false;
      if (user?.role) {
        if (user?.role === 'admin') {
          admin = true;
        }
        if (admin) {
          next();
        }
        else {
          return res.status(403).send({ message: 'forbidden-access' });
        }
      }

      else {
        return res.status(403).send({ message: 'forbidden-access' });
      }
    }

    // Admin Verify Backend
    app.get('/users/admin/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: 'anuthorized Access' })
      }
      const query = { email: email };
      const result = await users.findOne(query);
      let admin = false;
      if (result) {
        admin = result?.role === 'admin';
      }
      res.send({ admin })
    })


    // Showing homepage product
    app.get('/products/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category: category }
      const result = await products.find(query).toArray();
      res.send(result);
    })


    // Product details
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    })


    // JWT
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });
    })



    // Carts Related API
    app.post('/carts', async (req, res) => {
      const info = req.body;
      // console.log(info);
      const result = await cartsCollection.insertOne(info);
      res.send(result);
    })
    app.get('/carts', verifyToken, async (req, res) => {
      const { email } = req.query;
      if (req.decoded.email != email) {
        return res.status(400).json({ message: "User email is required" });
      }
      if (!email) {
        return res.status(400).json({ message: "User email is required" });
      }
      const query = { userEmail: email };
      const result = await cartsCollection.find(query).toArray(); // Convert cursor to array
      res.json(result); // Send the data as JSON response
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    })


    // Users related API
    app.post('/users', async (req, res) => {
      const email = req.body.email;
      const isExist = await users.findOne({ email });

      if (isExist) {
        return res.status(200).send({ message: 'User Already Exists' });
      }

      const data = req.body;
      const result = await users.insertOne(data);
      res.send(result);

    })


    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    })



    // Search API
    app.get('/search', async (req, res) => {
      const query = req.query.query;

      if (!query) {
        return res.json([]);
      }
      try {
        const results = await products.find({
          name: { $regex: query, $options: "i" }, // Case-insensitive search
        }).limit(5).toArray();  // Use toArray() to convert the result to a plain array of objects

        res.json(results);  // Send plain JavaScript objects
      } catch (error) {
        console.error("Search error:", error);  // Log detailed error
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });


    // Dashboard API
    app.get('/products', verifyToken, verifyAdmin, async (req, res) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
      const result = await products.find().skip(skip).limit(limit).toArray();
      const total = await products.estimatedDocumentCount();
      res.json({ result, total });
    })

    app.get('/dbusers', verifyToken, verifyAdmin, async (req, res) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
      const result = await users.find().skip(skip).limit(limit).toArray();
      const total = await users.estimatedDocumentCount();
      res.json({ result, total });
    })

    app.post('/addProduct', verifyToken, verifyAdmin, async (req, res) => {
      const newProduct = req.body;
      const result = products.insertOne(newProduct);
      res.send(result);
    })

    app.delete('/productDelete/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.deleteOne(query);
      res.send(result);
    })

    app.get('/update/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    })

    app.patch('/update/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const UpdatedInfo = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: UpdatedInfo
      }
      const result = await products.updateOne(query, updateDoc);
      res.send(result);
    })

    app.delete('/user/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.deleteOne(query);
      res.send(result);
    })

    app.patch('/userMakeAdmin/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await users.updateOne(query, updateDoc);
      res.send(result);
    })


    app.patch('/userRemoveAdmin/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: ''
        }
      }
      const result = await users.updateOne(query, updateDoc);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`server is running at ${port}`);
})

