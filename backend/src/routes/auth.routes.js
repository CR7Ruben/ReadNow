
import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const r = await pool.query('SELECT id,name,email,role FROM users WHERE email=$1',[email]);
  if (!r.rows.length) return res.status(401).json({message:'No encontrado'});
  res.json(r.rows[0]);
});
export default router;
