const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();
const bodyParser = require('body-parser');
const authentication = require('./Routes/routing.js');


const PORT  = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE, {useUnifiedTopology: true, useNewUrlParser: true});

const connection = mongoose.connection;

connection.on("errror", (errror)=>{
    console.log("Connection to the database failed" + errror);
});

connection.once("open", ()=>{
    console.log("Connected to the database");
});

app.use('/auth', authentication);


app.get('/', (req,res)=>{
    res.send("The page is working fine");
});

app.listen(PORT, ()=>{
    console.log(`The server is running on http://localhost:${PORT}`);
});