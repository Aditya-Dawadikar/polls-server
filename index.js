const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

var dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const url = process.env.DB_CONNECTION_STRING

mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify:true },()=>{
    console.log("connected to database")
})

const routes = require('./app/route')

app.use('/api/poll',routes)

const port = 3030
app.listen(port,()=>{
    console.log("server running on port "+port)
})