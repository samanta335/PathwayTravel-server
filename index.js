const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvw2zcx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// "mongodb+srv://travel:tACuCce9pnDlNzXy@cluster0.wvw2zcx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
    // await client.connect();
const userCollection = client.db("pathwayTravel").collection("users");
const packages=client.db('pathwayTravel').collection('package')
const  reviews=client.db('pathwayTravel').collection('reviews')
const  about=client.db('pathwayTravel').collection('about')
const booking=client.db('pathwayTravel').collection('booking')

app.post("/users", async (req, res) => {
  const user = req.body;

  const query = { email: user.email };
  const existUser = await userCollection.findOne(query);

  if (existUser) {
    return res.send({ message: "user already exist" });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});

app.get("/users", async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});

app.get("/package",async(req,res)=>{
  const result= await packages.find().toArray()
  res.send(result)
})

app.get("/reviews",async(req,res)=>{
  const result= await reviews.find().toArray()
  res.send(result)
})

app.get("/about",async(req,res)=>{
  const result= await about.find().toArray()
  res.send(result)
})

app.post("/booking", async (req, res) => {
  const body = req.body;
  const result = await booking.insertOne(body);
  res.send(result);
});

app.get("/booking/:email", async (req, res) => {
  const result = await booking
  .find({email:req.params.email})
  .toArray();
  res.send(result);
});

app.delete("/booking/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await booking.deleteOne(query);
  res.send(result);
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('PathwayTravel are open')
})

app.listen(port,()=>{
    console.log(`PathwayTravel are available ${port}`)
})