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

export default {
  create,
};
