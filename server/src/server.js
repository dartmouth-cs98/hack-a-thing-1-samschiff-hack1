import express from 'express';
import bodyParser from 'body-parser';
import api from './api';

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'index of fun run' });
});

app.use('/api', api);

app.listen(process.env.PORT || 3000, () => console.log('Listening to port 3000'));
