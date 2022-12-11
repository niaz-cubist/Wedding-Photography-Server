const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express()

//middle wares
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7grdyfl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const database = client.db('photography').collection('services')
        const orderCollection = client.db('photography').collection('orderCollection')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = database.find(query).limit(3)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = database.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await database.findOne(query)
            res.send(user)
        })

        //Order api

        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        app.get('/orders', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)

        })

    }
    catch (err) {
        console.log(err);
    }
}
run()

app.get('/', (req, res) => {
    res.send('Ok')
})

app.listen(port, () => console.log('server Running'))


