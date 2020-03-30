import { Router } from 'express';

import NecessityController from './app/controllers/NecessityController';

const routes = new Router();

routes.post('/necessity', NecessityController.store);

export default routes;
