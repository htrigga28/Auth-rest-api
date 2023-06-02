import { login, logout, register } from '../controllers/authController.js';

export default (router) => {
  router.post('/auth/signup', register);
  router.post('/auth/signin', login);
  router.get('/auth/logout/:id', logout);
};
