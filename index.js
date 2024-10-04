require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./route/user');
const busRouter = require('./route/bus');
const port = process.env.PORT || 8000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bus-system')
.then(()=>{
    console.log("database connected");
});

app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/bus', busRouter);

app.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
});