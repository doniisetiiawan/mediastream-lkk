import express from 'express';
import authCtrl from '../controllers/auth.controller';
import mediaCtrl from '../controllers/media.controller';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router
  .route('/api/media/new/:userId')
  .post(authCtrl.requireSignin, mediaCtrl.create);

router.param('userId', userCtrl.userByID);

export default router;
