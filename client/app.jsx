import React from 'react';
import { hot } from 'react-hot-loader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import red from '@material-ui/core/colors/red';
import brown from '@material-ui/core/colors/brown';
import MainRouter from './mainRouter';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f05545',
      main: '#b71c1c',
      dark: '#7f0000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#efdcd5',
      main: '#d7ccc8',
      dark: '#8c7b75',
      contrastText: '#424242',
    },
    openTitle: red['500'],
    protectedTitle: brown['300'],
    type: 'light',
  },
});

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <MainRouter />
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default hot(module)(App);
