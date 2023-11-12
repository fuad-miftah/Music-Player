import { v2 as cloudinary } from 'cloudinary';
import Music from '../models/music.model.js';
import User from '../models/user.model.js';
import express from 'express';
import fileUpload from 'express-fileupload';

const router = express.Router();
router.use(fileUpload());

// Create Music
export const createMusic = async (req, res, next) => {
    try {
        const { title, artist, album, genre } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: 'No files were uploaded.' });
        }

        const { audioFile, imageFile } = req.files;

        const audioResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
            resource_type: 'auto',
            folder: 'audio',
        });

        const imageResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            resource_type: 'image',
            folder: 'images',
        });

        const newMusic = await Music.create({
            title,
            artist,
            album,
            genre,
            'coverImg.public_id': imageResult.public_id,
            'coverImg.url': imageResult.secure_url,
            'audio.public_id': audioResult.public_id,
            'audio.url': audioResult.secure_url,
            user: userId,  // Assuming you want to associate the music with the user who created it
        });

        // Update the user's music array
        await User.findByIdAndUpdate(userId, { $addToSet: { music: newMusic._id } });

        res.status(201).json(newMusic);

    } catch (err) {
        console.error('Error during music creation:', err);
        res.status(500).json({ success: false, message: 'Internal server error during music creation.' });
    }
};

// Update Music
export const updateMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;
        const { title, artist, album, genre } = req.body;

        const existingMusic = await Music.findById(musicId);

        if (!existingMusic) {
            return res.status(404).json({ success: false, message: 'Music not found.' });
        }

        // Check if the user is the owner or an admin
        if (req.user.role === 'admin' || (existingMusic.user && existingMusic.user.toString() === req.user.id.toString())) {
            // Check if there are files in the request
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ success: false, message: 'No files were uploaded.' });
            }

            const { audioFile, imageFile } = req.files;

            // Delete previous Cloudinary resources
            await cloudinary.uploader.destroy(existingMusic.coverImg.public_id);
            await cloudinary.uploader.destroy(existingMusic.audio.public_id, { resource_type: 'video' });

            // Upload new audio file to Cloudinary
            const audioResult = await cloudinary.uploader.upload(audioFile.tempFilePath, {
                resource_type: 'auto', // You may need to adjust this based on the file content
                folder: 'audio',
            });

            // Upload new image file to Cloudinary
            const imageResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
                resource_type: 'image',
                folder: 'images',
            });

            // Update Music in the database with new public_ids
            const updatedMusic = await Music.findByIdAndUpdate(
                musicId,
                {
                    $set: {
                        title,
                        artist,
                        album,
                        genre,
                        'coverImg.public_id': imageResult.public_id,
                        'coverImg.url': imageResult.secure_url,
                        'audio.public_id': audioResult.public_id,
                        'audio.url': audioResult.secure_url,
                    },
                },
                { new: true }
            );

            res.status(200).json(updatedMusic);
        } else {
            res.status(403).json({ success: false, message: 'Access denied. You do not have permission to update this music.' });
        }
    } catch (err) {
        console.error('Error during music update:', err);
        res.status(500).json({ success: false, message: 'Internal server error during music update.' });
    }
};


// Delete Music
export const deleteMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;

        const existingMusic = await Music.findById(musicId);

        if (!existingMusic) {
            return res.status(404).json({ success: false, message: 'Music not found.' });
        }

        // Check if the user is the owner or an admin
        if (req.user.role === 'admin' || req.user.music.includes(existingMusic._id.toString())) {
            // Remove the reference from the User's music array
            await User.findByIdAndUpdate(req.user._id, { $pull: { music: musicId } });

            // Delete the Music document
            await Music.findByIdAndDelete(musicId);

            res.status(204).end();
        } else {
            res.status(403).json({ success: false, message: 'Access denied. You do not have permission to delete this music.' });
        }
    } catch (err) {
        console.error('Error during music deletion:', err);
        res.status(500).json({ success: false, message: 'Internal server error during music deletion.' });
    }
};

// Get Music by ID
export const getMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;

        const music = await Music.findById(musicId);

        if (!music) {
            return res.status(404).json({ success: false, message: 'Music not found.' });
        }

        // Anyone can access individual music details
        res.status(200).json(music);
    } catch (err) {
        console.error('Error during fetching music:', err);
        res.status(500).json({ success: false, message: 'Internal server error during fetching music.' });
    }
};

// Get All Music
export const getAllMusic = async (req, res, next) => {
    try {
        const musicList = await Music.find({});
        res.status(200).json(musicList);
    } catch (err) {
        console.error('Error during fetching all music:', err);
        res.status(500).json({ success: false, message: 'Internal server error during fetching all music.' });
    }
};

// Get Music for a specific User
export const getClientMusic = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Admin can access the entire music list for any user
        if (req.user && req.user.role === 'admin') {
            const musicList = await Music.find({ client: userId });
            res.status(200).json(musicList);
        } else {
            // Regular users can only access their own music

            // Make sure to populate the 'music' field here
            const user = await User.findById(userId).populate('music');

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }

            const musicList = user ? user.music : [];
            res.status(200).json(musicList);
        }
    } catch (err) {
        console.error('Error during fetching client music:', err);
        res.status(500).json({ success: false, message: 'Internal server error during fetching client music.' });
    }
};


