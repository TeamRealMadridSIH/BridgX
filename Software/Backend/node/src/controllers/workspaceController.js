import { pool } from '../config/db.js';
import { Message } from '../models/Message.js';

export async function getWorkspace(req, res) {
  const { rows } = await pool.query(
    `SELECT w.*, array_agg(json_build_object('id',u.id,'name',u.name,'avatar',u.avatar,'role',u.role)) as members
     FROM workspaces w
     JOIN workspace_members wm ON w.id=wm.workspace_id
     JOIN users u ON wm.user_id=u.id
     WHERE w.id=$1
     GROUP BY w.id`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  const messages = await Message.find({ workspaceId: req.params.id }).sort({ createdAt: 1 }).limit(100);
  res.json({ ...rows[0], messages });
}

export async function linkGithub(req, res) {
  const { repo } = req.body;
  const { rows } = await pool.query(
    'UPDATE workspaces SET github_repo=$1 WHERE id=$2 RETURNING *',
    [repo, req.params.id]
  );
  res.json(rows[0]);
}

export async function getNotifications(req, res) {
  const { rows } = await pool.query(
    'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',
    [req.user.id]
  );
  res.json(rows);
}

export async function markNotifRead(req, res) {
  await pool.query('UPDATE notifications SET read=true WHERE user_id=$1', [req.user.id]);
  res.json({ ok: true });
}

export async function getMessages(req, res) {
  const { rows } = await pool.query(
    `SELECT w.id, COALESCE(p.title, c.title, 'Team workspace') AS name
     FROM workspace_members wm
     JOIN workspaces w ON w.id = wm.workspace_id
     LEFT JOIN problems p ON p.id = w.problem_id
     LEFT JOIN challenges c ON c.id = w.challenge_id
     WHERE wm.user_id = $1`,
    [req.user.id]
  );
  const workspaceIds = rows.map(workspace => String(workspace.id));
  const messages = workspaceIds.length
    ? await Message.find({ workspaceId: { $in: workspaceIds } }).sort({ createdAt: -1 }).limit(200)
    : [];
  res.json({ workspaces: rows, messages });
}

export async function sendInboxMessage(req, res) {
  const { workspaceId, text } = req.body;
  if (!workspaceId || !text?.trim()) return res.status(400).json({ error: 'Workspace and message are required' });
  const { rows } = await pool.query(
    'SELECT 1 FROM workspace_members WHERE workspace_id=$1 AND user_id=$2',
    [workspaceId, req.user.id]
  );
  if (!rows[0]) return res.status(403).json({ error: 'You are not a member of this workspace' });
  const sender = await pool.query('SELECT name, avatar FROM users WHERE id=$1', [req.user.id]);
  const msg = await Message.create({ workspaceId: String(workspaceId), senderId: req.user.id, senderName: sender.rows[0]?.name, senderAvatar: sender.rows[0]?.avatar, text: text.trim() });
  res.status(201).json(msg);
}

export async function getProfile(req, res) {
  const { rows } = await pool.query(
    'SELECT id,name,email,role,avatar,bio,github_username,followers,solved_count,created_at FROM users WHERE id=$1',
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  const problems = await pool.query('SELECT * FROM problems WHERE author_id=$1 ORDER BY created_at DESC', [req.params.id]);
  res.json({ ...rows[0], problems: problems.rows });
}

export async function updateProfile(req, res) {
  const { name, bio, github_username, avatar } = req.body;
  const { rows } = await pool.query(
    'UPDATE users SET name=$1,bio=$2,github_username=$3,avatar=$4 WHERE id=$5 RETURNING id,name,email,role,avatar,bio,github_username,followers,solved_count',
    [name, bio, github_username, avatar, req.user.id]
  );
  res.json(rows[0]);
}
