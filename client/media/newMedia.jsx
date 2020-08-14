/* eslint-disable no-unused-expressions,jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/AddToQueue';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import CardActions from '@material-ui/core/CardActions';
import auth from '../auth/auth-helper';
import { create } from './api-media';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1em',
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: '10px',
  },
}));

function NewMedia() {
  const classes = useStyles();
  const [values, setValues] = useState({
    title: '',
    video: '',
    description: '',
    genre: '',
    redirect: false,
    error: '',
    mediaId: '',
  });
  const jwt = auth.isAuthenticated();

  const clickSubmit = () => {
    const mediaData = new FormData();
    values.title && mediaData.append('title', values.title);
    values.video && mediaData.append('video', values.video);
    values.description
      && mediaData.append('description', values.description);
    values.genre && mediaData.append('genre', values.genre);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      mediaData,
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          error: '',
          mediaId: data._id,
          redirect: true,
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === 'video'
      ? event.target.files[0]
      : event.target.value;
    setValues({ ...values, [name]: value });
  };

  if (values.redirect) {
    return <Redirect to={`/media/${values.mediaId}`} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          type="headline"
          component="h1"
          className={classes.title}
        >
          New Video
        </Typography>
        <input
          accept="video/*"
          onChange={handleChange('video')}
          className={classes.input}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <Button
            color="secondary"
            variant="contained"
            component="span"
          >
            Upload
            <FileUpload />
          </Button>
        </label>{' '}
        <span className={classes.filename}>
          {values.video ? values.video.name : ''}
        </span>
        <br />
        <TextField
          id="title"
          label="Title"
          className={classes.textField}
          value={values.title}
          onChange={handleChange('title')}
          margin="normal"
        />
        <br />
        <TextField
          id="multiline-flexible"
          label="Description"
          multiline
          rows="2"
          value={values.description}
          onChange={handleChange('description')}
          className={classes.textField}
          margin="normal"
        />
        <br />
        <TextField
          id="genre"
          label="Genre"
          className={classes.textField}
          value={values.genre}
          onChange={handleChange('genre')}
          margin="normal"
        />
        <br />
        <br />{' '}
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}

export default NewMedia;
