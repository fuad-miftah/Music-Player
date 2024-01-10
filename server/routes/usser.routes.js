import express from 'express';
import { 
    updateUser, 
    deleteUser, 
    getUser, 
    getAllUsers, 
} from '../controllers/user.controller.js';

import { verifyAdmin, verifyClient } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/:userId', verifyClient, getUser);

router.get('/', verifyAdmin, getAllUsers);

router.put('/:userId', verifyClient, updateUser);

router.delete('/:userId', verifyClient, deleteUser);



export default router;
