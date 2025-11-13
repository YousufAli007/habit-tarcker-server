const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const cors =require('cors')
const app =express();
const port =3000;
// middle ware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
  res.send('Habit Tarcker')
})

// MongoDB connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cydeyqc.mongodb.net/?appName=Cluster0`;
// const uri ="mongodb+srv://habitDBuser:kHpxKXNxOXFFinRW@cluster0.cydeyqc.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database =client.db('habit_db');
    const habitCollection =database.collection('habits');

    // habit post
    app.post('/habits', async(req,res)=>{
      // console.log('yousuf body',req.body)
      const newHabit = {
        ...req.body,
        created_at: new Date()
      };
      const result = await habitCollection.insertOne(newHabit);
      res.send(result)
      
    })
    // latest habit get
    app.get('/latest_habit',async(req,res)=>{
      const habit = habitCollection.find().sort({created_at:-1}).limit(6);
      cursor =habit.toArray()
      const result =await cursor
      res.send(result)
    })


    // all habit
    app.get('/all_habits', async(req,res)=>{
      const email =req.query.email;
      const query ={}
      if(email){
        query.userEmail=email
      }
      const habits =habitCollection.find(query)
      const cursor =habits.toArray()
      const result =await cursor
      res.send(result)
    })

    //  update 
    app.put("/habits/:id", async (req, res) => {
      const id = req.params.id;
      const updatedHabit = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          habitTitle: updatedHabit.habitTitle,
          category: updatedHabit.category,
        },
      };
      const result = await habitCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Delete a habit by id


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`);
})