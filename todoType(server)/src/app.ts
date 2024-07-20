import 'express-async-errors';
import express, { Application, Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { connectDB } from './database/conexao'
import { Tarefa } from './models/tarefa'
import fs from 'fs';
import path from 'path';

const app = express();

app.use(morgan('tiny'));

app.use(cors());

app.use(helmet());

app.use(express.json());

async function conectarBanco(){
  await connectDB();
}

conectarBanco();

function loadRoutes(app: Application) {
  fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    if (file.endsWith('.ts')) {
      const route = require(path.join(__dirname, 'routes', file)) as Router;
      app.use(`/api/${file.slice(0, -3)}`, route);
    }
  });
}

loadRoutes(app);  // Carrega todas as rotas

export default app;