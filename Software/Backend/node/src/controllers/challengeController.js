import { pool } from '../config/db.js';

export async function getChallenges(req, res) {
  const { rows } = await pool.query(
    'SELECT c.*, u.name as org_name, u.avatar as org_avatar FROM challenges c JOIN users u ON c.org_id=u.id ORDER BY c.created_at DESC'
  );
  res.json(rows);
}

export async function getChallenge(req, res) {
  const { rows } = await pool.query(
    'SELECT c.*, u.name as org_name FROM challenges c JOIN users u ON c.org_id=u.id WHERE c.id=$1',
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  const apps = await pool.query(
    'SELECT a.*, u.name, u.avatar, u.role FROM applications a JOIN users u ON a.applicant_id=u.id WHERE a.challenge_id=$1',
    [req.params.id]
  );
  res.json({ ...rows[0], applications: apps.rows });
}

export async function createChallenge(req, res) {
  const { title, description, category, deadline, prize } = req.body;
  if (req.user.role !== 'organization') return res.status(403).json({ error: 'Only organizations can post challenges' });
  const { rows } = await pool.query(
    'INSERT INTO challenges (title,description,category,deadline,prize,org_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [title, description, category, deadline, prize, req.user.id]
  );
  res.json(rows[0]);
}

export async function applyChallenge(req, res) {
  const { proposal } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO applications (challenge_id,applicant_id,proposal) VALUES ($1,$2,$3) RETURNING *',
    [req.params.id, req.user.id, proposal]
  );
  const ch = await pool.query('SELECT org_id FROM challenges WHERE id=$1', [req.params.id]);
  await pool.query('INSERT INTO notifications (user_id,message,type) VALUES ($1,$2,$3)',
    [ch.rows[0].org_id, 'New application received for your challenge!', 'application']);
  res.json(rows[0]);
}

export async function respondApplication(req, res) {
  const { appId, action } = req.body;
  const { rows: appRows } = await pool.query('SELECT * FROM applications WHERE id=$1', [appId]);
  if (!appRows[0]) return res.status(404).json({ error: 'Not found' });

  await pool.query('UPDATE applications SET status=$1 WHERE id=$2', [action, appId]);

  if (action === 'accepted') {
    await pool.query('UPDATE challenges SET status=$1 WHERE id=$2', ['in_progress', appRows[0].challenge_id]);
    const { rows: ws } = await pool.query(
      'INSERT INTO workspaces (challenge_id) VALUES ($1) RETURNING *',
      [appRows[0].challenge_id]
    );
    await pool.query('INSERT INTO workspace_members (workspace_id,user_id) VALUES ($1,$2),($1,$3)',
      [ws[0].id, req.user.id, appRows[0].applicant_id]);
    await pool.query('INSERT INTO notifications (user_id,message,type) VALUES ($1,$2,$3)',
      [appRows[0].applicant_id, 'Your challenge application was accepted!', 'accepted']);
    return res.json({ workspace: ws[0] });
  }
  res.json({ status: action });
}
