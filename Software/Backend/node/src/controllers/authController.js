import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const SECRET = process.env.JWT_SECRET || 'bridgex_secret';
const sign = (user) => jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }, SECRET, { expiresIn: '7d' });

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role,avatar`,
      [name, email, hash, role || 'citizen']
    );
    const user = rows[0];
    res.json({ token: sign(user), user });
  } catch (e) {
    res.status(400).json({ error: e.detail || 'Email already exists' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  const user = rows[0];
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
}

export async function getMe(req, res) {
  res.json(req.user);
}
