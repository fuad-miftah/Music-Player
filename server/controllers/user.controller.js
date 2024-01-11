import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import express from 'express';
import { createSuccess } from '../utils/success.js';
import { createError } from '../utils/error.js';

const router = express.Router();

// Update User
export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { firstName, lastName, username, email, img, address, phone } = req.body;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json(createError(404, 'User not found.'));
        }

        // Update user fields
        existingUser.firstName = firstName || existingUser.firstName;
        existingUser.lastName = lastName || existingUser.lastName;
        existingUser.username = username || existingUser.username;
        existingUser.email = email || existingUser.email;
        existingUser.img = img || existingUser.img;
        existingUser.address = address || existingUser.address;
        existingUser.phone = phone || existingUser.phone;

        // Save the updated user
        const updatedUser = await existingUser.save();

        res.status(200).json(createSuccess('User updated successfully', updatedUser));
    } catch (error) {
        console.error('Error during user update:', error);
        res.status(500).json(createError(500, 'Internal server error during user update.'));
    }
};

// Delete User
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json(createError(404, 'User not found.'));
        }

        // Delete user's cloudinary image if it exists
        if (existingUser.img) {
            await cloudinary.uploader.destroy(existingUser.img);
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(204).end();
    } catch (error) {
        console.error('Error during user deletion:', error);
        res.status(500).json(createError(500, 'Internal server error during user deletion.'));
    }
};

// Get User by ID
export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json(createError(404, 'User not found.'));
        }

        res.status(200).json(createSuccess('User retrieved successfully', user));
    } catch (error) {
        console.error('Error during fetching user:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching user.'));
    }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
    try {
        const userList = await User.find({});
        res.status(200).json(createSuccess('All users retrieved successfully', userList));
    } catch (error) {
        console.error('Error during fetching all users:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching all users.'));
    }
};

export default router;
