import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Music from '../models/music.model.js';
import User from '../models/user.model.js';
import express from 'express';
import fileUpload from 'express-fileupload';
import { createSuccess } from '../utils/success.js';
import { createError } from '../utils/error.js';

const router = express.Router();
router.use(fileUpload());

export const createMusic = async (req, res, next) => {
    try {
        const { title, artist, album, genre } = req.body;
        const userId = req.user.id;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json(createError(400, 'No files were uploaded.'));
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
            user: userId,
        });

        await User.findByIdAndUpdate(userId, { $addToSet: { music: newMusic._id } });

        res.status(201).json(createSuccess('Music created successfully', newMusic));

    } catch (error) {
        console.error('Error during music creation:', error);
        res.status(500).json(createError(500, 'Internal server error during music creation.'));
    }
};

// Update Music
export const updateMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;
        const { title, artist, album, genre } = req.body;

        const existingMusic = await Music.findById(musicId);

        if (!existingMusic) {
            return res.status(404).json(createError(404, 'Music not found.'));
        }

        if (req.user.role === 'admin' || (existingMusic.user && existingMusic.user.toString() === req.user.id.toString())) {
            let updateFields = {};
            if (req.files) {

                if (req.files.audioFile) {

                    await cloudinary.uploader.destroy(existingMusic.audio.public_id, { resource_type: 'video' });
                    const audioResult = await cloudinary.uploader.upload(req.files.audioFile.tempFilePath, {
                        resource_type: 'auto',
                        folder: 'audio',
                    });
                    updateFields['audio.public_id'] = audioResult.public_id;
                    updateFields['audio.url'] = audioResult.secure_url;
                }

                if (req.files.imageFile) {

                    await cloudinary.uploader.destroy(existingMusic.coverImg.public_id);
                    const imageResult = await cloudinary.uploader.upload(req.files.imageFile.tempFilePath, {
                        resource_type: 'image',
                        folder: 'images',
                    });
                    updateFields['coverImg.public_id'] = imageResult.public_id;
                    updateFields['coverImg.url'] = imageResult.secure_url;
                }
            }

            if (title) updateFields.title = title;
            if (artist) updateFields.artist = artist;
            if (album) updateFields.album = album;
            if (genre) updateFields.genre = genre;

            const updatedMusic = await Music.findByIdAndUpdate(
                musicId,
                { $set: updateFields },
                { new: true }
            );

            res.status(200).json(createSuccess('Music updated successfully', updatedMusic));
        } else {
            res.status(403).json(createError(403, 'Access denied. You do not have permission to update this music.'));
        }
    } catch (error) {
        console.error('Error during music update:', error);
        res.status(500).json(createError(500, 'Internal server error during music update.'));
    }
};


// Delete Music
export const deleteMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;
        const userId = req.params.userId;

        const existingMusic = await Music.findById(musicId);

        if (!existingMusic) {
            return res.status(404).json(createError(404, 'Music not found.'));
        }

            await cloudinary.uploader.destroy(existingMusic.coverImg.public_id);
            await cloudinary.uploader.destroy(existingMusic.audio.public_id, { resource_type: 'video' });

            await User.findByIdAndUpdate(userId, { $pull: { music: musicId } });

            await Music.findByIdAndDelete(musicId);

            res.status(204).end();
        
    } catch (error) {
        console.error('Error during music deletion:', error);
        res.status(500).json(createError(500, 'Internal server error during music deletion.'));
    }
};


// Get Music by ID
export const getMusic = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;

        const music = await Music.findById(musicId);

        if (!music) {
            return res.status(404).json(createError(404, 'Music not found.'));
        }

        res.status(200).json(createSuccess('Music retrieved successfully', music));
    } catch (error) {
        console.error('Error during fetching music:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching music.'));
    }
};

// Get All Music
export const getAllMusic = async (req, res, next) => {
    try {
        const musicList = await Music.find({});
        res.status(200).json(createSuccess('All music retrieved successfully', musicList));
    } catch (error) {
        console.error('Error during fetching all music:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching all music.'));
    }
};

// Get Music for a specific User
export const getClientMusic = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (req.user && req.user.role === 'admin') {
            const musicList = await Music.find({ client: userId });
            res.status(200).json(createSuccess('Client music retrieved successfully', musicList));
        } else {
            const user = await User.findById(userId).populate('music');

            if (!user) {
                return res.status(404).json(createError(404, 'User not found.'));
            }

            const musicList = user ? user.music : [];
            res.status(200).json(createSuccess('Client music retrieved successfully', musicList));
        }
    } catch (error) {
        console.error('Error during fetching client music:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching client music.'));
    }
};

// Get All Music with Additional Statistics
export const getAllMusicWithStats = async (req, res, next) => {
    try {
        const musicList = await Music.find({});

        // Get total number of songs
        const totalSongs = musicList.length;

        // Get unique genres
        const uniqueGenres = [...new Set(musicList.map((music) => music.genre))];

        // Get number of songs in each genre
        const songsInEachGenre = uniqueGenres.map((genre) => {
            return {
                genre,
                count: musicList.filter((music) => music.genre === genre).length,
            };
        });

        // Get number of songs and albums each artist has
        const artistStats = await Music.aggregate([
            {
                $group: {
                    _id: '$artist',
                    totalSongs: { $sum: 1 },
                    totalAlbums: { $addToSet: '$album' },
                },
            },
        ]);

        // Get songs in each album
        const albumStats = await Music.aggregate([
            {
                $group: {
                    _id: '$album',
                    songs: { $push: '$title' },
                },
            },
        ]);

        // Construct the response object
        const response = {
            totalSongs,
            totalArtists: artistStats.length,
            totalAlbums: albumStats.length,
            uniqueGenres,
            songsInEachGenre,
            artistStats,
            albumStats,
            musicList,
        };

        res.status(200).json(createSuccess('All music retrieved successfully with statistics', response));
    } catch (error) {
        console.error('Error during fetching all music with stats:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching all music with stats.'));
    }
};



// Get All Client Music with Stats
export const getAllClientMusicWithStats = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (req.user.id == req.params.userId || req.user.role === 'admin') {
            const musicList = await Music.find({ user: userId });

            // Get total number of songs for the client
            const totalSongs = musicList.length;

            // Get unique genres for the client's music
            const uniqueGenres = [...new Set(musicList.map((music) => music.genre))];

            // Get number of songs in each genre for the client's music
            const songsInEachGenre = uniqueGenres.map((genre) => {
                return {
                    genre,
                    count: musicList.filter((music) => music.genre === genre).length,
                };
            });

            const artistStats = await Music.aggregate([
                {
                    $match: { user: new mongoose.Types.ObjectId(userId) }, // Only consider music from the specific user
                },
                {
                    $group: {
                        _id: '$artist',
                        totalSongs: { $sum: 1 },
                        totalAlbums: { $addToSet: '$album' },
                    },
                },
            ]);
            
            // Get songs in each album for the client's music
            const albumStats = await Music.aggregate([
                {
                    $match: { user: new mongoose.Types.ObjectId(userId) }, // Only consider music from the specific user
                },
                {
                    $group: {
                        _id: '$album',
                        songs: { $push: '$title' },
                    },
                },
            ]);

            // Construct the response object for the client's music
            const response = {
                totalSongs,
                totalArtists: artistStats.length,
                totalAlbums: albumStats.length,
                uniqueGenres,
                songsInEachGenre,
                artistStats,
                albumStats,
                musicList,
            };

            res.status(200).json(createSuccess('Client music with stats retrieved successfully', response));
        } else {
            // Handle the case where the user is not an admin
            res.status(403).json(createError(403, 'Access denied. You do not have permission to retrieve client music with stats.'));
        }
    } catch (error) {
        console.error('Error during fetching client music with stats:', error);
        res.status(500).json(createError(500, 'Internal server error during fetching client music with stats.'));
    }
};

// Update Rating for Music
export const updateRating = async (req, res, next) => {
    try {
        const musicId = req.params.musicId;
        const { rating: incomingRating } = req.body;
        console.log('incomingRating', incomingRating);

        const existingMusic = await Music.findById(musicId);

        if (!existingMusic) {
            return res.status(404).json(createError(404, 'Music not found.'));
        }

        // Calculate new average rating and update rating count
        const currentRatingSum = existingMusic.rating * existingMusic.ratingCount;
        const newRatingCount = existingMusic.ratingCount + 1;
        const newAverageRating =
            (currentRatingSum + incomingRating) / newRatingCount;

        // Update music document with new rating and rating count
        const updatedMusic = await Music.findByIdAndUpdate(
            musicId,
            {
                $set: {
                    rating: newAverageRating,
                    ratingCount: newRatingCount,
                },
            },
            { new: true }
        );

        res.status(200).json(
            createSuccess('Rating updated successfully', {
                music: updatedMusic,
                newAverageRating,
                newRatingCount,
            })
        );
    } catch (error) {
        console.error('Error during rating update:', error);
        res.status(500).json(
            createError(500, 'Internal server error during rating update.')
        );
    }
};



export default router;
