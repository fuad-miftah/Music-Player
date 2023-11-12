// music.routes.js

import express from 'express';
import { 
    createMusic, 
    updateMusic, 
    deleteMusic, 
    getMusic, 
    getAllMusic, 
    getClientMusic 
} from '../controllers/music.controller.js';

import { verifyClient } from "../utils/verifyToken.js";

const router = express.Router();

// Create Music
router.post('/:userId', verifyClient, createMusic);

// Update Music
router.put('/:userId/:musicId', verifyClient, updateMusic);

// Delete Music
router.delete('/:musicId', verifyClient, deleteMusic);

// Get Music by ID
router.get('/:userId/:musicId', getMusic);

// Get All Music
router.get('/all', getAllMusic);

// Get Music for a specific User
router.get('/user/:userId', getClientMusic);

export default router;
