import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { randomBytes } from 'crypto';
import { generateToken, randomString } from '../helpers/index.js';

export const register = async (req, res) => {
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
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = (await bcrypt.hash(password, salt)).toString();

    // Create a new user
    const newUser = new User({
      username,
      email,
      authentication: {
        salt,
        password: hashedPassword,
      },
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' }).end();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username }).select(
      '+authentication.salt +authentication.password'
    );
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    // Compare the provided password with the stored hash

    const passwordMatch = await bcrypt.compare(
      password,
      user.authentication.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const sessionToken = generateToken(salt, user._id.toString());

    user.authentication.sessionToken = sessionToken;

    await user.save();

    res.cookie('sessionToken', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    });

    const cookies = await req.cookies;

    res.json({ message: 'Signin successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.authentication.sessionToken = null;

    await user.save();

    res.clearCookie('sessionToken');

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
