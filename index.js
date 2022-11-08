const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        const serviceCollection = client.db('dentistFantastic').collection('services');

        app.get('/services' , async(req , res)=>{
            const query = {};
            let cursor;
            if(req.query.length){
                const size = parseInt(req.query.length);
                cursor = serviceCollection.find(query).limit(size);
                
            }
            else{
                cursor = serviceCollection.find(query);
            }
            const services = await cursor.toArray();
            res.send(services)
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