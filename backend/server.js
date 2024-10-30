const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

//Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const blogRoutes = require('./routes/blogRoutes');
app.use('/api', blogRoutes);

const connectDB = require('./config/db');
connectDB();



const PORT = process.env.PORT


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})