require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;

//connect to MongoDB
connectDB();

//add CORS -available to all
app.use(cors());

//handle form data (urlencoded data)
app.use(express.urlencoded({ extended: false}));

//handle json data
app.use(express.json());

//serve static files eg. css, images, etc.
app.use(express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

//404 status code for pages that don't exist
app.all('*',(req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

//make sure connected to MongoDB before listening for events
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})