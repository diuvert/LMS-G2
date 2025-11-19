const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => res.json({ status: 'ok', name: 'LMS API' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
