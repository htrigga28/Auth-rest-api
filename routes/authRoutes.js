import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const missingParams = [];

    // Check if all required parameters are present
    if (!username) {
      missingParams.push('username');
    }
    if (!email) {
      missingParams.push('email');
    }
    if (!password) {
      missingParams.push('password');
    }

    if (missingParams.length > 0) {
      return res
        .status(400)
        .json({ message: 'Missing required parameters', missingParams });
    }

    // Check if the username is already taken

    const usernameExists = await User.findOne({ username });

    const emailExists = await User.findOne({ email });
    if (usernameExists || emailExists) {
      return res.status(409).json({ message: 'user already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Signin successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
