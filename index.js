require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./route/user');
const busRouter = require('./route/bus');
const connectDB = require('./db');
const port = process.env.PORT || 8000;
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/bus', busRouter);

app.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
});