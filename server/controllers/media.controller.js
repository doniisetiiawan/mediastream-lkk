import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs';
import extend from 'lodash/extend';
import Media from '../models/media.model';
import errorHandler from '../helpers/dbErrorHandler';

let gridfs = null;
mongoose.connection.on('connected', () => {
  gridfs = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
  );
});

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Video could not be uploaded',
      });
    }
    const media = new Media(fields);
    media.postedBy = req.profile;
    if (files.video) {
      const writestream = gridfs.openUploadStream(
        media._id,
        {
          contentType:
            files.video.type || 'binary/octet-stream',
        },
      );
      fs.createReadStream(files.video.path).pipe(
        writestream,
      );
    }
    try {
      const result = await media.save();
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const mediaByID = async (req, res, next, id) => {
  try {
    const media = await Media.findById(id)
      .populate('postedBy', '_id name')
      .exec();
    if (!media) {
      return res.status('400').json({
        error: 'Media not found',
      });
    }
    req.media = media;
    const files = await gridfs
      .find({ filename: media._id })
      .toArray();
    if (!files[0]) {
      return res.status(404).send({
        error: 'No video found',
      });
    }
    // eslint-disable-next-line prefer-destructuring
    req.file = files[0];
    next();
  } catch (err) {
    return res.status(404).send({
      error: 'Could not retrieve media file',
    });
  }
};

const video = (req, res) => {
  const { range } = req.headers;
  if (range && typeof range === 'string') {
    const parts = range.replace(/bytes=/, '').split('-');
    const partialstart = parts[0];
    const partialend = parts[1];

    const start = parseInt(partialstart, 10);
    const end = partialend
      ? parseInt(partialend, 10)
      : req.file.length - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Range': `bytes ${start}-${end}/${req.file.length}`,
      'Content-Type': req.file.contentType,
    });

    const downloadStream = gridfs.openDownloadStream(
      req.file._id,
      { start, end: end + 1 },
    );
    downloadStream.pipe(res);
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
    downloadStream.on('end', () => {
      res.end();
    });
  } else {
    res.header('Content-Length', req.file.length);
    res.header('Content-Type', req.file.contentType);

    const downloadStream = gridfs.openDownloadStream(
      req.file._id,
    );
    downloadStream.pipe(res);
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
    downloadStream.on('end', () => {
      res.end();
    });
  }
};

const listPopular = async (req, res) => {
  try {
    const media = await Media.find({})
      .limit(9)
      .populate('postedBy', '_id name')
      .sort('-views')
      .exec();
    res.json(media);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByUser = async (req, res) => {
  try {
    const media = await Media.find({
      postedBy: req.profile._id,
    })
      .populate('postedBy', '_id name')
      .sort('-created')
      .exec();
    res.json(media);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => res.json(req.media);

const incrementViews = async (req, res, next) => {
  try {
    await Media.findByIdAndUpdate(
      req.media._id,
      { $inc: { views: 1 } },
      { new: true },
    ).exec();
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  try {
    let { media } = req;
    media = extend(media, req.body);
    media.updated = Date.now();
    await media.save();
    res.json(media);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isPoster = (req, res, next) => {
  const isPoster = req.media
    && req.auth
    && req.media.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }
  next();
};

const remove = async (req, res) => {
  try {
    const { media } = req;
    const deletedMedia = await media.remove();
    gridfs.delete(req.file._id);
    res.json(deletedMedia);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listRelated = async (req, res) => {
  try {
    const media = await Media.find({
      _id: { $ne: req.media },
      genre: req.media.genre,
    })
      .limit(4)
      .sort('-views')
      .populate('postedBy', '_id name')
      .exec();
    res.json(media);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  mediaByID,
  video,
  listPopular,
  listByUser,
  read,
  incrementViews,
  update,
  isPoster,
  remove,
  listRelated,
};
