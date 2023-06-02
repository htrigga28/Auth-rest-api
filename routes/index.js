import { Router } from 'express';
import authRoutes from './authRoutes.js';
import usersRoutes from './usersRoutes.js';

const router = Router();

export default () => {
  authRoutes(router);
  usersRoutes(router);
  return router;
};
