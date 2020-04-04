import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import NecessityController from './app/controllers/NecessityController';
import SearchController from './app/controllers/SearchController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/user/:id', UserController.update);
routes.get('/user/:id', UserController.show);
routes.delete('/user/', UserController.destroy);

routes.post('/necessity', NecessityController.store);
routes.put('/necessity/:id', NecessityController.update);
routes.get('/necessity/:id', NecessityController.show);
routes.get('/necessity/:userId/user', NecessityController.index);
routes.delete('/necessity/:id', NecessityController.destroy);

routes.get('/search', SearchController.index);

export default routes;
