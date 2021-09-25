const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const corsOpts = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
const dbConfig = require('./config/dbConfig');
app.use(express.static('images'));
const PORT = process.env.PORT || 5000;
const userRoute = require('./routes/userRoute')
const homeRoute = require('./routes/homeRoute')
app.get('/api', (req, res) => res.send('server connected successfully!'));
app.use('/api/user', userRoute);
app.use('/api/home', homeRoute);
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));