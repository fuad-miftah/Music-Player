// music.routes.js

import express from 'express';
import { 
    createMusic, 
    updateMusic, 
    deleteMusic, 
    getMusic, 
    getAllMusic, 
    getClientMusic,
    getAllMusicWithStats,
    getAllClientMusicWithStats,
    updateRating
} from '../controllers/music.controller.js';

import { verifyClient } from "../utils/verifyToken.js";

const router = express.Router();

// Get Music for a specific User
router.get('/user/:userId', getClientMusic);

// Get All Client Music with stats (new route)
router.get('/clientwithstat/:userId', verifyClient, getAllClientMusicWithStats);

// Create Music
router.post('/:userId', verifyClient, createMusic);

router.put('/rating/:userId/:musicId', updateRating);

// Update Music
router.put('/:userId/:musicId', verifyClient, updateMusic);

// Delete Music
router.delete('/:userId/:musicId', verifyClient, deleteMusic);

// Get Music by ID
router.get('/single/:musicId', getMusic);

// Get All Music
router.get('/all', getAllMusic);

// Get All Music with stats
router.get('/allwithstat', getAllMusicWithStats);



export default router;
