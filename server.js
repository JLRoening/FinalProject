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

app.use(cors());

//handles form data (urlencoded data)
app.use(express.urlencoded({ extended: false}));

//handles json data
app.use(express.json());

//serve static files eg. css, images, etc.
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

app.all('*',(req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

//check to see if connected to MongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})