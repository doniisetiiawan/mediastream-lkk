import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import { Edit } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import auth from '../auth/auth-helper';
import MediaPlayer from './mediaPlayer';
import DeleteMedia from './deleteMedia';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: '20px',
  },
  header: {
    padding: '0px 16px 16px 12px',
  },
  action: {
    margin: '24px 20px 0px 0px',
    display: 'inline-block',
    fontSize: '1.15em',
    color: theme.palette.secondary.dark,
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
}));

function Media(props) {
  const classes = useStyles();

  const mediaUrl = props.media._id
    ? `/api/media/video/${props.media._id}`
    : null;

  const { nextUrl } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={props.media.title}
        action={(
          <span
            className={classes.action}
          >{`${props.media.views} views`}
          </span>
        )}
        subheader={props.media.genre}
      />
      <MediaPlayer
        srcUrl={mediaUrl}
        nextUrl={nextUrl}
        handleAutoplay={props.handleAutoplay}
      />
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {props.media.postedBy.name
                && props.media.postedBy.name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={props.media.postedBy.name}
            secondary={`Published on ${new Date(
              props.media.created,
            ).toDateString()}`}
          />
          {auth.isAuthenticated().user
            && auth.isAuthenticated().user._id
              == props.media.postedBy._id && (
              <ListItemSecondaryAction>
                <Link to={`/media/edit/${props.media._id}`}>
                  <IconButton
                    aria-label="Edit"
                    color="secondary"
                  >
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteMedia
                  mediaId={props.media._id}
                  mediaTitle={props.media.title}
                />
              </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={props.media.description} />
        </ListItem>
      </List>
    </Card>
  );
}

export default Media;
