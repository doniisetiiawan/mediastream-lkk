import React from 'react';
import { hot } from 'react-hot-loader';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './mainRouter';
import theme from './theme';

function App() {
  React.useEffect(() => {
    const jssStyles = document.querySelector(
      '#jss-server-side',
    );
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <MainRouter />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default hot(module)(App);
