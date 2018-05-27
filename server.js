import express from 'express';
import { Pool } from 'pg';
import 'module-alias/register';

const app = express();
const port = process.env.PORT || 8080;

const URI = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const pool =  new Pool({
  connectionString: URI,
  ssl : true
});

pool.connect((err) => {
  if (err) {
    console.error('DB connection error', err.stack)
  } else {
    console.log('DB connected')
  }

  app.get('/', function (req, res) {
    res.send({ express: 'Hello From CirclCI' });
  });

  app.get('/posts', function (req, res) {
    pool.query('SELECT * from posts', (err, out) => {
      if (err) {
        console.log(err.stack)
      } else {
        res.send(out.rows[0])
      }
    });
  });

  app.listen(port, () => console.log(`Listening on port ${port}`));
});
