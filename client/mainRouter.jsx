import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/home';
import Users from './user/users';
import Signup from './user/signup';
import Signin from './auth/signin';
import Profile from './user/profile';
import PrivateRoute from './auth/PrivateRoute';
import EditProfile from './user/editProfile';
import Menu from './core/menu';
import NewMedia from './media/newMedia';

class MainRouter extends React.Component {
  componentDidMount = () => {
    const jssStyles = document.getElementById(
      'jss-server-side',
    );
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  };

  render() {
    return (
      <>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute
            path="/user/edit/:userId"
            component={EditProfile}
          />
          <Route path="/user/:userId" component={Profile} />

          <PrivateRoute
            path="/media/new"
            component={NewMedia}
          />
        </Switch>
      </>
    );
  }
}

export default MainRouter;
