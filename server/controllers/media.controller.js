import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import formidable from 'formidable';
import fs from 'fs';
import Media from '../models/media.model';
import errorHandler from '../helpers/dbErrorHandler';

Grid.mongo = mongoose.mongo;
let gridfs = null;
mongoose.connection.on('connected', () => {
  gridfs = Grid(mongoose.connection.db);
});

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Video could not be uploaded',
      });
    }
    const media = new Media(fields);
    media.postedBy = req.profile;
    if (files.video) {
      const writestream = gridfs.createWriteStream({
        _id: media._id,
      });
      fs.createReadStream(files.video.path).pipe(
        writestream,
      );
    }
    media.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(result);
    });
  });
};

const mediaByID = (req, res, next, id) => {
  Media.findById(id)
    .populate('postedBy', '_id name')
    .exec((err, media) => {
      if (err || !media) {
        return res.status('400').json({
          error: 'Media not found',
        });
      }
      req.media = media;
      next();
    });
};

const video = (req, res) => {
  gridfs.findOne(
    {
      _id: req.media._id,
    },
    (err, file) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler.getErrorMessage(err),
        });
      }
      if (!file) {
        return res.status(404).send({
          error: 'No video found',
        });
      }

      if (req.headers.range) {
        const parts = req.headers.range
          .replace(/bytes=/, '')
          .split('-');
        const partialstart = parts[0];
        const partialend = parts[1];

        const start = parseInt(partialstart, 10);
        const end = partialend
          ? parseInt(partialend, 10)
          : file.length - 1;
        const chunksize = end - start + 1;

        res.writeHead(206, {
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Range': `bytes ${start}-${end}/${file.length}`,
          'Content-Type': file.contentType,
        });

        gridfs
          .createReadStream({
            _id: file._id,
            range: {
              startPos: start,
              endPos: end,
            },
          })
          .pipe(res);
      } else {
        res.header('Content-Length', file.length);
        res.header('Content-Type', file.contentType);

        gridfs
          .createReadStream({
            _id: file._id,
          })
          .pipe(res);
      }
    },
  );
};

const listPopular = (req, res) => {
  Media.find({})
    .limit(10)
    .populate('postedBy', '_id name')
    .sort('-views')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

const listByUser = (req, res) => {
  Media.find({ postedBy: req.profile._id })
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

export default {
  create,
  mediaByID,
  video,
  listPopular,
  listByUser,
};
