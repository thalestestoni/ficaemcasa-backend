import { Router } from 'express';

import NecessityController from './app/controllers/NecessityController';
import UserController from './app/controllers/UserController';
import SearchController from './app/controllers/SearchController';

const router = Router();

router.route('/necessity').get(UserController.index).post(UserController.post);

router.route('/search').get(SearchController.index);

export default routes;
