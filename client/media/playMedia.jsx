import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { read } from './api-media';
import Media from './media';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  toggle: {
    float: 'right',
    marginRight: '30px',
    marginTop: ' 10px',
  },
}));

function PlayMedia(props) {
  const classes = useStyles();
  const [media, setMedia] = useState({ postedBy: {} });
  const [relatedMedia, setRelatedMedia] = useState([]);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    read({ mediaId: props.match.params.mediaId }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setMedia(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [props.match.params.mediaId]);

  const handleChange = (event) => {
    setAutoPlay(event.target.checked);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={8}>
        <Grid item xs={8} sm={8}>
          <Media media={media} />
        </Grid>
      </Grid>
    </div>
  );
}

export default PlayMedia;
