import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SearchController from './app/controllers/SearchController';

const router = Router();

router.route('/user').post(UserController.post).get(UserController.index);

router.route('/user/:id').patch(UserController.patch);

router.route('/search').get(SearchController.index);

export default router;
