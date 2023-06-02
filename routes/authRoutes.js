import { login, register } from '../controllers/authController.js';

export default (router) => {
  router.post('/auth/signup', register);
  router.post('/auth/signin', login);
};
