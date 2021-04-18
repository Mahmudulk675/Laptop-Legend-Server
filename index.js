const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT ||5050;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6br73.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const serviceCollection = client.db("laptopLegend").collection("services");
  const adminCollection = client.db("laptopLegend").collection("admins");
  const orderCollection = client.db("laptopLegend").collection("orders");
  const reviewCollection = client.db("laptopLegend").collection("reviews");


    // Post Service
    app.post('/dashboard/addService',(req,res) => {
        const newService = req.body;
        // console.log(newService,'added');
        serviceCollection.insertOne(newService)
        .then(result =>{
          // console.log('count',result );
          res.send(result.insertedCount > 0)
        })
      })


    //   Get For Home
    app.get('/services',(req, res)=>{
        serviceCollection.find()
        .toArray((err, documents)=>{
          // console.log('from db',documents);
          res.send(documents)
        })
      })


  // Get For Confirm Order
  app.get('/order/:id',(req, res)=>{
    // console.log(req.params.id,'id');
    const id = ObjectId(req.params.id);
    serviceCollection.find({_id: id})
    .toArray((err, documents)=>{
      res.send(documents[0])
      // console.log(documents[0]);
    })
  })

  // Post Order Details
  app.post('/order', (req, res) => {
    const orders = req.body;
    // console.log(orders);
    orderCollection.insertOne(orders)
    .then(result => {
       res.send(result.insertCount > 0) ;
    })
})


  // Post a Admin
  app.post('/dashboard/addAdmin',(req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    // console.log(name,email);
    adminCollection.insertOne({ name, email })
    .then(result =>{
      // console.log('count',result );
      res.send(result.insertedCount > 0)
    })
  })


  // Post Review Data
  app.post('/dashboard/review',(req,res) => {
    const reviewData = req.body;
    console.log(reviewData,'added');
    reviewCollection.insertOne(reviewData)
    .then(result =>{
      // console.log('count',result );
      res.send(result.insertedCount > 0)
    })
  })


  // Get Review reviewData
  app.get('/review',(req, res)=>{
    reviewCollection.find()
    .toArray((err, documents)=>{
      // console.log('from db',documents);
      res.send(documents)
    })
  })

  // Manage Delete 
app.delete('/dashboard/manageService/:id', (req, res) =>{
  const id = ObjectId(req.params.id);
  console.log('id', id);
  serviceCollection.removeOne({_id: id})
  .then(documents => res.send(!documents.value))
})


// Get User's Booking
app.get('/dashboard/bookings',(req, res)=>{
  // console.log(req.query.email);
  orderCollection.find({customerEmail :req.query.email})
  .toArray((err, documents)=>{
    res.send(documents);
  })
})


// Get all bookings
app.get('/dashboard/allBookings',(req, res)=>{
  orderCollection.find()
  .toArray((err, documents)=>{
    // console.log('from db',documents);
    res.send(documents)
  })
})


// is Admin
app.post('/isAdmin',(req, res)=>{
  const email = req.body.email;
  adminCollection.find({email: email})
   .toArray((err, admin)=>{
      res.send(admin.length > 0)
   })
})


app.patch('/updateStatus/:id',(req, res)=>{
  const id = ObjectId(req.params.id);
  const status = req.body.status;
  console.log(id, req.body);
  orderCollection.updateOne({_id:id},
    {$set:{status:status}})
    .then(result => res.send(result.matchedCount > 0))

})

//   client.close();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port)  