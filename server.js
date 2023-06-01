import express from 'express';
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import http from 'http';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after connecting to the database
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
