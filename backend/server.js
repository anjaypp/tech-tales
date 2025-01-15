const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();
const path = require('path');



const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./db/connection');
connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog', blogRoutes);
//const userRoutes = require('./routes/userRoutes');
//app.use('/api/users', userRoutes);
const searchRoutes = require('./routes/searchRoutes');
app.use('/api/search', searchRoutes);
const interactionRoutes = require('./routes/interactionRoutes');
app.use('/api/interaction', interactionRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);



const PORT = process.env.PORT || 5000


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})