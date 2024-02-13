import express from 'express';
import { catchErrors } from './lib/catch-errors.js';
import { router, bye, hello, error } from './routes/api.js';

const app = express();

app.get('/', catchErrors(hello), catchErrors(error), catchErrors(bye));
app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
