import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import {
  Home as HomeIcon,
  Add as AddBoxIcon,
} from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import auth from '../auth/auth-helper';

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: '#f99085' };
  return { color: '#efdcd5' };
};

function Menu({ history }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography type="title" color="inherit">
          MERN Mediastream
        </Typography>
        <div>
          <Link to="/">
            <IconButton
              aria-label="Home"
              style={isActive(history, '/')}
            >
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div
          style={{ position: 'absolute', right: '10px' }}
        >
          <span style={{ float: 'right' }}>
            {!auth.isAuthenticated() && (
              <span>
                <Link to="/signup">
                  <Button
                    style={isActive(history, '/signup')}
                  >
                    Sign up
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button
                    style={isActive(history, '/signin')}
                  >
                    Sign In
                  </Button>
                </Link>
              </span>
            )}
            {auth.isAuthenticated() && (
              <span>
                <Link to="/media/new">
                  <Button
                    style={isActive(history, '/media/new')}
                  >
                    <AddBoxIcon
                      style={{ marginRight: '8px' }}
                    />{' '}
                    Add Media
                  </Button>
                </Link>
                <Link
                  to={`/user/${
                    auth.isAuthenticated().user._id
                  }`}
                >
                  <Button
                    style={isActive(
                      history,
                      `/user/${
                        auth.isAuthenticated().user._id
                      }`,
                    )}
                  >
                    My Profile
                  </Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.signout(() => history.push('/'));
                  }}
                >
                  Sign out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Menu);
