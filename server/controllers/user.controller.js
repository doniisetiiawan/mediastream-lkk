import _ from 'lodash';
import User from '../models/user.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = (req, res) => {
  const user = new User(req.body);
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.status(200).json({
      message: 'Successfully signed up!',
    });
  });
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status('400').json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve user',
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(users);
  }).select('name email updated created');
};

const update = (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

const remove = (req, res) => {
  const user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  });
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
};
