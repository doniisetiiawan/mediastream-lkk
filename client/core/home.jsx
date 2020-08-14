import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { listPopular } from '../media/api-media';
import MediaList from '../media/mediaList';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: `${theme.spacing(5)}px 30px`,
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(
      2.5,
    )}px 0px`,
    color: theme.palette.text.secondary,
    fontSize: '1em',
  },
  media: {
    minHeight: 330,
  },
}));

function Home() {
  const classes = useStyles();
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    listPopular(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMedia(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Card className={classes.card}>
      <Typography variant="h2" className={classes.title}>
        Popular Videos
      </Typography>
      <MediaList media={media} />
    </Card>
  );
}

export default Home;
