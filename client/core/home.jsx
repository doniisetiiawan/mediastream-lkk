import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

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

  return (
    <Card className={classes.card}>
      <Typography variant="h2" className={classes.title}>
        Popular Videos
      </Typography>
    </Card>
  );
}

export default Home;
