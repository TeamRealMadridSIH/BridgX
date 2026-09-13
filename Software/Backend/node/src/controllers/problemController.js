import { pool } from '../config/db.js';

export async function getProblems(req, res) {
  const { category, status, search } = req.query;
  let q = 'SELECT p.*, u.name as author_name, u.avatar as author_avatar FROM problems p JOIN users u ON p.author_id=u.id WHERE 1=1';
  const params = [];
  if (category) { params.push(category); q += ` AND p.category=$${params.length}`; }
  if (status) { params.push(status); q += ` AND p.status=$${params.length}`; }
  if (search) { params.push(`%${search}%`); q += ` AND (p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`; }
  q += ' ORDER BY p.created_at DESC';
  const { rows } = await pool.query(q, params);
  res.json(rows);
}

export async function getProblem(req, res) {
  const { rows } = await pool.query(
    'SELECT p.*, u.name as author_name, u.avatar as author_avatar FROM problems p JOIN users u ON p.author_id=u.id WHERE p.id=$1',
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function createProblem(req, res) {
  const { title, description, category, location, image_url } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO problems (title,description,category,location,image_url,author_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [title, description, category, location, image_url, req.user.id]
  );
  res.json(rows[0]);
}

export async function upvoteProblem(req, res) {
  const { rows } = await pool.query(
    'UPDATE problems SET upvotes=upvotes+1 WHERE id=$1 RETURNING upvotes',
    [req.params.id]
  );
  res.json(rows[0]);
}

export async function requestSolve(req, res) {
  const { message } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO solve_requests (problem_id,solver_id,message) VALUES ($1,$2,$3) RETURNING *',
    [req.params.id, req.user.id, message]
  );
  // notify problem author
  const prob = await pool.query('SELECT author_id FROM problems WHERE id=$1', [req.params.id]);
  await pool.query(
    'INSERT INTO notifications (user_id,message,type) VALUES ($1,$2,$3)',
    [prob.rows[0].author_id, `Someone wants to solve your problem!`, 'solve_request']
  );
  res.json(rows[0]);
}

export async function respondSolveRequest(req, res) {
  const { requestId, action } = req.body; // action: accept | reject
  const { rows: reqRows } = await pool.query('SELECT * FROM solve_requests WHERE id=$1', [requestId]);
  if (!reqRows[0]) return res.status(404).json({ error: 'Request not found' });

  await pool.query('UPDATE solve_requests SET status=$1 WHERE id=$2', [action, requestId]);

  if (action === 'accept') {
    await pool.query('UPDATE problems SET status=$1, solver_id=$2 WHERE id=$3', ['in_progress', reqRows[0].solver_id, reqRows[0].problem_id]);
    // create workspace
    const { rows: ws } = await pool.query(
      'INSERT INTO workspaces (problem_id) VALUES ($1) RETURNING *',
      [reqRows[0].problem_id]
    );
    await pool.query('INSERT INTO workspace_members (workspace_id,user_id) VALUES ($1,$2),($1,$3)', [ws[0].id, req.user.id, reqRows[0].solver_id]);
    await pool.query('INSERT INTO notifications (user_id,message,type) VALUES ($1,$2,$3)',
      [reqRows[0].solver_id, 'Your solve request was accepted! Workspace is ready.', 'accepted']);
    return res.json({ workspace: ws[0] });
  }
  res.json({ status: action });
}

export async function markSolved(req, res) {
  await pool.query('UPDATE problems SET status=$1 WHERE id=$2 AND author_id=$3', ['solved', req.params.id, req.user.id]);
  await pool.query('UPDATE users SET solved_count=solved_count+1 WHERE id=(SELECT solver_id FROM problems WHERE id=$1)', [req.params.id]);
  res.json({ status: 'solved' });
}
