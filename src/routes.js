import { Router } from 'express';

import NecessityController from './app/controllers/NecessityController';
import SearchController from './app/controllers/SearchController';

const routes = new Router();

routes.post('/necessity', NecessityController.store);
routes.get('/necessity', NecessityController.index);

routes.get('/search', SearchController.index);

export default routes;
