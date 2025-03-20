const express = require('express');
const cors = require('cors');
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

    app.get('/products/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category: category }
      const result = await products.find(query).toArray();
      res.send(result);
    })


    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    })

  

    // Carts Related API
    app.post('/carts', async (req, res) => {
      const info = req.body;
      // console.log(info);
      const result = await cartsCollection.insertOne(info);
      res.send(result);
    })
    app.get('/carts', async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "User email is required" });
      }
      const query = { userEmail: email };
      const result = await cartsCollection.find(query).toArray(); // Convert cursor to array
      res.json(result); // Send the data as JSON response
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
