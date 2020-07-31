/* eslint-disable react/jsx-filename-extension */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { JssProvider, SheetsRegistry } from 'react-jss';
import {
  createGenerateClassName,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import React from 'react';
import Template from '../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes';
import MainRouter from '../client/mainRouter';

// comment out before building for production
import devBundle from './devBundle';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// comment out before building for production
devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use(
  '/dist',
  express.static(path.join(CURRENT_WORKING_DIR, 'dist')),
);

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', mediaRoutes);

app.get('*', (req, res) => {
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#757de8',
        main: '#3f51b5',
        dark: '#002984',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff79b0',
        main: '#ff4081',
        dark: '#c60055',
        contrastText: '#000',
      },
      openTitle: indigo['400'],
      protectedTitle: pink['400'],
      type: 'light',
    },
  });
  const generateClassName = createGenerateClassName();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider
          theme={theme}
          sheetsManager={new Map()}
        >
          <MainRouter />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>,
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheetsRegistry.toString();
  res.status(200).send(
    Template({
      markup,
      css,
    }),
  );
});

app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ error: `${err.name}: ${err.message}` });
  }
});

export default app;
