const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const routes = require("./routes/authRoutes")


const app = express();

const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173', // or your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' , 'PATCH'],
    credentials: true, 
    allowedHeaders: ['Authorization', 'Content-Type'] // Allow Authorization header
}));

app.use(express.json());
app.use('/uploads/productImages', express.static(path.join(__dirname, 'uploads/productImages')));

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



app.use("/", routes)

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
