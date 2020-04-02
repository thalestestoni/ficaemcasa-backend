import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SearchController from './app/controllers/SearchController';

const router = Router();

router.route('/user').post(UserController.post);

router.route('/search').get(SearchController.index);

export default router;
