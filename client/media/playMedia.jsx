/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { read } from './api-media';
import Media from './media';
import RelatedMedia from './relatedMedia';

const styles = () => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  toggle: {
    float: 'right',
    marginRight: '30px',
    marginTop: ' 10px',
  },
});

class PlayMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      media: { postedBy: {} },
      relatedMedia: [],
      autoPlay: false,
    };
  }

  loadMedia = (mediaId) => {
    read({ mediaId }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ media: data });
      }
    });
  };

  componentDidMount = () => {
    this.loadMedia(this.props.match.params.mediaId);
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (props) => {
    this.loadMedia(props.match.params.mediaId);
  };

  handleChange = (event) => {
    this.setState({ autoPlay: event.target.checked });
  };

  handleAutoplay = (updateMediaControls) => {
    const playList = this.state.relatedMedia;
    const playMedia = playList[0];
    if (!this.state.autoPlay || playList.length == 0) return updateMediaControls();

    if (playList.length > 1) {
      playList.shift();
      this.setState({
        media: playMedia,
        relatedMedia: playList,
      });
    } else {
      console.log('LIST RELATED');
    }
  };

  render() {
    const nextUrl = this.state.relatedMedia.length > 0
      ? `/media/${this.state.relatedMedia[0]._id}`
      : '';
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={8} sm={8}>
            <Media
              media={this.state.media}
              nextUrl={nextUrl}
              handleAutoplay={this.handleAutoplay}
            />
          </Grid>
          {this.state.relatedMedia.length > 0 && (
            <Grid item xs={4} sm={4}>
              <FormControlLabel
                className={classes.toggle}
                control={(
                  <Switch
                    checked={this.state.autoPlay}
                    onChange={this.handleChange}
                    color="primary"
                  />
                )}
                label={
                  this.state.autoPlay
                    ? 'Autoplay ON'
                    : 'Autoplay OFF'
                }
              />
              <RelatedMedia
                media={this.state.relatedMedia}
              />
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(PlayMedia));
