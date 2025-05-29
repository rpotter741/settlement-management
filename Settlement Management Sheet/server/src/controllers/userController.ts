import User from '../db/models/User.js'; // Assuming you have a User model
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT for the user
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );

    // Return the user details and token
    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Ensure both email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Create the JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    // Sign the token with a secret and expiry
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Respond with the token and user data
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        settlements: user.settlements, // Include settlement info if needed
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const signoutUser = async (req, res) => {};

const updateUserSettings = async (req, res) => {};

const invitePlayer = async (req, res) => {};

const joinGame = async (req, res) => {};

export {
  registerUser,
  loginUser,
  signoutUser,
  updateUserSettings,
  invitePlayer,
  joinGame,
};
