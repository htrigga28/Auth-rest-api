import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/userController.js';

export default (router) => {
  router.get('/users', getUsers);
  router.get('/users/:id', getUser);
  router.patch('/users/:id', updateUser);
  router.delete('/users/:id', deleteUser);
};
