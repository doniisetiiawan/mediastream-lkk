/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Edit } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import auth from '../auth/auth-helper';
import DeleteUser from './deleteUser';
import { read } from './api-user';
import { listByUser } from '../media/api-media';
import MediaList from '../media/mediaList';

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  }),
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
}));

function Profile({ match }) {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(
    false,
  );
  const jwt = auth.isAuthenticated();
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal,
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    listByUser(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal,
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setMedia(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {user.name && user.name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={user.email}
          />{' '}
          {auth.isAuthenticated().user
            && auth.isAuthenticated().user._id == user._id && (
              <ListItemSecondaryAction>
                <Link to={`/user/edit/${user._id}`}>
                  <IconButton
                    aria-label="Edit"
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id} />
              </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={`Joined: ${new Date(
              user.created,
            ).toDateString()}`}
          />
        </ListItem>
        <MediaList media={media} />
      </List>
    </Paper>
  );
}

export default Profile;
