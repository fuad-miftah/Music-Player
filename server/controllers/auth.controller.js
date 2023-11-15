import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const register = async (req, res, next) => {
  try {
    req.body.role = 'Client';

    const validationError = await validateUser(req.body);
    if (validationError) {
      return res.status(validationError.status).json(validationError);
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await newUser.save();

    res.status(201).json(createSuccess('User has been created.', savedUser));
  } catch (err) {
    next(err);
  }
};

const validateUser = async (userData) => {
  try {
    // Check if email is repeated
    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) {
      return createError(400, 'Email is already in use.');
    }

    // Check if username is repeated
    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) {
      return createError(400, 'Username is already taken.');
    }

    // Check if password meets length requirement
    if (userData.password.length < 6) {
      return createError(400, 'Password must be at least 6 characters long.');
    }

    // Validate the rest of the User model
    await User.validate(userData);

    return null;
  } catch (validationError) {
    return createError(400, validationError.message);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    // Check if the JWT secret key is set correctly in your environment variables
    if (!process.env.JWT) {
      return next(createError(500, "JWT secret key is not configured."));
    }

    const access_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT  // Use the JWT secret key from environment variables 
    );

    const { password, role, ...otherDetails } = user._doc;
    res
      .cookie("access_token", access_token, {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(createSuccess("Login successful.", { details: { ...otherDetails }, role, access_token }));
  } catch (err) {
    next(err);
  }
};

// function to return the user details
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));
    res.status(200).json(createSuccess("User found.", user));
  } catch (err) {
    next(err);
  }
};
