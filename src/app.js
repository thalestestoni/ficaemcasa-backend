import 'dotenv/config';

import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(helmet());
    // this.server.use(
    //   cors({
    //     origin: process.env.FRONT_URL,
    //   })
    // );
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
