import express from 'express';
import { addAdmin, createToken, deleteAnUser, getAllUsers, postAUser, removeAdmin,isAdmin } from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js';
import adminVerify from '../middlewares/adminVerify.js';

const authRouter = express.Router();

authRouter.post('/users', postAUser);
authRouter.get('/users',protectedRoute, adminVerify , getAllUsers)
authRouter.delete('/users/delete/:id',protectedRoute, adminVerify , deleteAnUser);
authRouter.put('/users/remove-admin/:id', protectedRoute, adminVerify , removeAdmin);
authRouter.put('/users/add-admin/:id', protectedRoute, adminVerify , addAdmin);

//authentication related
authRouter.post('/jwt', createToken);
authRouter.get('/admin/:email', protectedRoute, isAdmin)

export default authRouter;