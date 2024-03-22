import express from 'express';
import { cors } from './lib/cors.js';
import { environment } from './lib/environment.js';
import { logger } from './lib/logger.js';
import { router } from './routes/api.js';

const app = express();

app.use(express.json());

app.use(cors);
app.use(router);
const env = environment(process.env, logger);

if (!env) {
  logger.error('Environment is not configured correctly');
  process.exit(1);
}

const port = 5432;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
