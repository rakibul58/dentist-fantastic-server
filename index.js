const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bebjeyw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        // service collection
        const serviceCollection = client.db('dentistFantastic').collection('services');
        // comments collection
        const commentCollection = client.db('dentistFantastic').collection('comments');

        //jwt
        app.post('/jwt' , (req , res)=>{
            const user = req.body;
            console.log(user);
        });

        //services get api
        app.get('/services' , async(req , res)=>{
            const query = {};
            let cursor;
            if(req.query.length){
                const size = parseInt(req.query.length);
                cursor = serviceCollection.find(query).limit(size).sort({_id:-1}) ;
                
            }
            else{
                cursor = serviceCollection.find(query).sort({_id:-1});
            }
            const services = await cursor.toArray();
            res.send(services)
        });

        // individual service get api
        app.get('/services/:id' , async(req , res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const cursor = await serviceCollection.findOne(query);
            res.send(cursor);

        });

        //post service api
        app.post('/services' , async(req , res)=>{
            const order = req.body;
            const result = await serviceCollection.insertOne(order);
            res.send(result);
        });

        //get comments by service id
        app.get('/comments/:id' , async(req , res)=>{
            const id = req.params.id;
            const query = {serviceId: id};
            const cursor = commentCollection.find(query).sort({_id: -1});
            const comments = await cursor.toArray();
            res.send(comments)
        });

        //post comment api
        app.post('/comments' , async(req , res)=>{
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })

    }
    finally{

    }
}

run().catch(err=>console.error(err))


app.get('/' , (req , res)=> {
    res.send('Dentist Fantastic Server is running');
});

app.listen(port , ()=>{
    console.log(`server running on port ${port}`);
});