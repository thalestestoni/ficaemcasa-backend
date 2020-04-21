import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import NecessityController from './app/controllers/NecessityController';
import StatusNecessity from './app/controllers/StatusNecessity';
import AssistController from './app/controllers/AssistController';
import SearchNecessityController from './app/controllers/SearchNecessityController';
import SearchAssistController from './app/controllers/SearchAssistController';
import FileController from './app/controllers/FileController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import ResetPasswordController from './app/controllers/ResetPasswordController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/password/forgot', ForgotPasswordController.store);
routes.post('/password/reset', ResetPasswordController.store);

routes.use(authMiddleware);

routes.put('/user', UserController.update);
routes.get('/user/:id', UserController.show);
routes.delete('/user/', UserController.destroy);

routes.post('/necessity', NecessityController.store);
routes.put('/necessity/:id', NecessityController.update);
routes.get('/necessity/:id', NecessityController.show);
routes.get('/necessity/:userId/user', NecessityController.index);
routes.delete('/necessity/:id', NecessityController.destroy);

routes.put('/necessity', StatusNecessity.update);

routes.post('/assist', AssistController.store);
routes.put('/assist/:id', AssistController.update);
routes.get('/assist/:id', AssistController.show);
routes.get('/assist/:userId/user', AssistController.index);
routes.delete('/assist/:id', AssistController.destroy);

routes.get('/search/necessity', SearchNecessityController.index);
routes.get('/search/assist', SearchAssistController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
