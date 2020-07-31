import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MediaList from '../media/mediaList';
import { listPopular } from '../media/api-media';

const styles = (theme) => ({
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
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      media: [],
    };
  }

  componentDidMount = () => {
    listPopular().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ media: data });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Card className={classes.card}>
          <Typography
            type="headline"
            component="h2"
            className={classes.title}
          >
            Popular Videos
          </Typography>
          <MediaList media={this.state.media} />
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(Home);

Home.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
