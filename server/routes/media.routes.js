import express from 'express';
import authCtrl from '../controllers/auth.controller';
import mediaCtrl from '../controllers/media.controller';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router
  .route('/api/media/new/:userId')
  .post(authCtrl.requireSignin, mediaCtrl.create);

router
  .route('/api/media/video/:mediaId')
  .get(mediaCtrl.video);

router
  .route('/api/media/popular')
  .get(mediaCtrl.listPopular);

router
  .route('/api/media/by/:userId')
  .get(mediaCtrl.listByUser);

router.param('userId', userCtrl.userByID);
router.param('mediaId', mediaCtrl.mediaByID);

export default router;
