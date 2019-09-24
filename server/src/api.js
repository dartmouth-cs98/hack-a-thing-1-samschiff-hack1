import express from 'express';
import { playlist, credentials, code, profile } from './routes';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'fun run api router' });
});

router.post('/playlist', (req, res) => {
  try {
    playlist(req, res);
  } catch (err) {
    console.error(err);
  }
});

router.get('/credentials', (req, res) => {
  credentials(req, res);
});

router.post('/code', (req, res) => {
  try {
    code(req, res);
  } catch (err) {
    console.error(err);
  }
});

router.get('/profile', (req, res) => {
  try {
    profile(req, res);
  } catch (err) {
    console.error(err);
  }
});

export default router;
