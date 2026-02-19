
import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/', async (req, res) => {
  const r = await axios.get('https://www.googleapis.com/books/v1/volumes?q=fiction');
  res.json(r.data.items.map(b => ({
    title: b.volumeInfo.title,
    thumbnail: b.volumeInfo.imageLinks?.thumbnail
  })));
});
export default router;
