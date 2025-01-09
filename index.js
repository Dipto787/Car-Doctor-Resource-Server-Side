let express = require('express');
let cors = require('cors');
let app = express();
let port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jt86e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        let serviceCollection = client.db('carResource').collection('service');
        let bookingData = client.db('carResource').collection('book');
        app.get('/services', async (req, res) => {
            let cursor = serviceCollection.find();
            let result = await cursor.toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            let cursor = { _id: new ObjectId(req.params.id) };
            let result = await serviceCollection.findOne(cursor);
            res.send(result);
        })
        app.get('/', (req, res) => {
            res.send('car doctor resource is running')
        })
        app.get('/checkout', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            let result = await bookingData.find(query).toArray();
            res.send(result);
        })
        app.delete('/checkout/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await bookingData.deleteOne(query);
            res.send(result);
        })
        app.get('/checkout/:id', async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await bookingData.findOne(query);
            res.send(result);
        })
        app.post('/checkout', async (req, res) => {
            let findData = await bookingData.insertOne(req.body);
            res.send(findData);
        })
        app.get('/checkout', async (req, res) => {
            let cursor = bookingData.find(req.body);
            let result = await cursor.toArray();
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




app.listen(port, () => {
    console.log(`let star our server is ${port} n.o`)
})