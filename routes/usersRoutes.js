import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/userController.js';
import { isAuthenticated, isOwner } from '../middleware/index.js';

export default (router) => {
  router.get('/users', isAuthenticated, getUsers);
  router.get('/users/:id', isAuthenticated, getUser);
  router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
};
