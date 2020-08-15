/* eslint-disable react/jsx-filename-extension */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import React from 'react';
import {
  ServerStyleSheets,
  ThemeProvider,
} from '@material-ui/styles';
import { matchRoutes } from 'react-router-config';
import Template from '../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import mediaRoutes from './routes/media.routes';
import MainRouter from '../client/mainRouter';
import 'isomorphic-fetch';

// comment out before building for production
import devBundle from './devBundle';
import theme from '../client/theme';
import routes from '../client/routeConfig';

const CURRENT_WORKING_DIR = process.cwd();
const app = express();

// comment out before building for production
devBundle.compile(app);

const loadBranchData = (location) => {
  const branch = matchRoutes(routes, location);
  const promises = branch.map(({ route, match }) => (route.loadData
    ? route.loadData(branch[0].match.params)
    : Promise.resolve(null)));
  return Promise.all(promises);
};

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
  const sheets = new ServerStyleSheets();
  const context = {};

  loadBranchData(req.url)
    .then((data) => {
      const markup = ReactDOMServer.renderToString(
        sheets.collect(
          <StaticRouter
            location={req.url}
            context={context}
          >
            <ThemeProvider theme={theme}>
              <MainRouter data={data} />
            </ThemeProvider>
          </StaticRouter>,
        ),
      );
      if (context.url) {
        return res.redirect(303, context.url);
      }
      const css = sheets.toString();
      res.status(200).send(
        Template({
          markup,
          css,
        }),
      );
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({
          error: 'Could not load React view with data',
        });
    });
});

app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ error: `${err.name}: ${err.message}` });
  } else if (err) {
    res
      .status(400)
      .json({ error: `${err.name}: ${err.message}` });
    console.log(err);
  }
});

export default app;
