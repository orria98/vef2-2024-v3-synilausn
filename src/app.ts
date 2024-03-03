import express from 'express';
import { cors } from './lib/cors.js';
import { router } from './routes/api.js';

const app = express();

app.use(express.json());

app.use(cors);
app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
