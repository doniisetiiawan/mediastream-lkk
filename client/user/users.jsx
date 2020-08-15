/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { ArrowForward, Person } from '@material-ui/icons';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import { list } from './api-user';

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
}));

function Users() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        All Users
      </Typography>
      <List dense>
        {users.map((item, i) => (
          <Link to={`/user/${item._id}`} key={i}>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    </Paper>
  );
}

export default Users;
