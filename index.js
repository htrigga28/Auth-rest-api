import express, { Router } from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/', router());

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
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
