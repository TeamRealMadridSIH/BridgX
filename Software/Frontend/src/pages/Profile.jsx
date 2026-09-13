import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Edit3, ExternalLink, FileText, GitBranch as Github, Link2, MapPin, Save, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { USERS } from '../mock/users';
import { PROBLEMS } from '../mock/data';
import { useAuth } from '../context/AuthContext';
import ProblemCard from '../components/ProblemCard';

const roleLabels = { citizen: 'Citizen', solver: 'Solver', mentor: 'Mentor', organization: 'Organization' };

export default function Profile() {
  const { id } = useParams(); const { user } = useAuth(); const profileId = id || user?.id;
  const [profile, setProfile] = useState(null); const [form, setForm] = useState(null);
  const [tab, setTab] = useState('Problems'); const [editing, setEditing] = useState(false); const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!profileId) return;
    const found = USERS.find(u => String(u.id) === String(profileId));
    const userProblems = PROBLEMS.filter(p => String(p.author_id) === String(profileId));
    const data = found ? { ...found, problems: userProblems } : null;
    setProfile(data); setForm(data); setLoading(false);
  }, [profileId]);
  const isMe = String(user?.id) === String(profileId); const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const cancelEdit = () => { setForm(profile); setEditing(false); };
  const save = () => { setProfile(prev => ({ ...prev, ...form })); setEditing(false); toast.success('Your profile has been updated'); };
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success('Profile link copied'); } catch { toast('Copy the page address to share your profile'); } };
  if (loading) return <main className="profile-page-shell"><div className="profile-loading">Loading profile…</div></main>;
  if (!profile) return <main className="profile-page-shell"><section className="profile-empty"><Users size={30} /><h1>Profile not found</h1><p>This member may no longer be available.</p><Link className="btn btn-primary" to="/">Back to home</Link></section></main>;
  const initial = profile.name?.trim()?.[0]?.toUpperCase() || '?'; const problems = profile.problems || [];
  return <main className="profile-page-shell"><section className="profile-banner ig-profile"><div className="ig-top"><div className="ig-photo">{profile.avatar ? <img src={profile.avatar} alt={`${profile.name}'s avatar`} /> : initial}</div><div className="ig-stats"><div><b>{problems.length}</b><span>Posts</span></div><div><b>{profile.followers || 0}</b><span>Followers</span></div><div><b>{profile.solved_count || 0}</b><span>Solved</span></div></div></div><div className="ig-info"><div className="ig-name-row"><h1>{profile.name}</h1><CheckCircle2 size={16} aria-label="Verified" /><span className={`role-pill role-${profile.role}`}>{roleLabels[profile.role] || 'Member'}</span></div><p className="profile-handle">@{profile.github_username || profile.name?.toLowerCase().replace(/\s+/g, '') || 'member'}</p>{editing ? <div className="profile-editor" style={{marginLeft:0,marginRight:0}}><label>Display name<input value={form.name || ''} onChange={e => updateForm('name', e.target.value)} placeholder="Your name" /></label><label>Avatar URL<input value={form.avatar || ''} onChange={e => updateForm('avatar', e.target.value)} placeholder="https://…" /></label><label className="editor-wide">About you<textarea rows="3" value={form.bio || ''} onChange={e => updateForm('bio', e.target.value)} placeholder="Tell the SolveHub community a little about yourself" /></label><label className="editor-wide">GitHub username<input value={form.github_username || ''} onChange={e => updateForm('github_username', e.target.value)} placeholder="octocat" /></label><div className="editor-buttons"><button className="btn btn-primary" onClick={save}><Save size={15} />Save changes</button><button className="btn btn-light" onClick={cancelEdit}><X size={15} />Cancel</button></div></div> : <><p className="profile-bio-text">{profile.bio || ''}</p><div className="profile-meta">{profile.github_username && <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer"><Github size={14} />{profile.github_username}<ExternalLink size={11} /></a>}<span><MapPin size={14} />SolveHub community</span></div></>}<div className="ig-actions">{isMe && !editing && <button className="btn btn-light" onClick={() => setEditing(true)}><Edit3 size={14} />Edit profile</button>}{!editing && <button className="btn btn-light profile-share" onClick={share}><Link2 size={14} />Share</button>}</div></div></section><div className="profile-tabs" role="tablist">{['Problems', 'About'].map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} role="tab">{item}{item === 'Problems' && <small>{problems.length}</small>}</button>)}</div>{tab === 'Problems' ? <section className="profile-content"><div className="profile-section-title"><div><p className="eyebrow">CONTRIBUTIONS</p><h2>{isMe ? 'Your posted problems' : `${profile.name}'s posted problems`}</h2></div></div>{problems.length ? <div className="grid-2">{problems.map(problem => <ProblemCard key={problem.id} problem={{ ...problem, author_name: profile.name }} />)}</div> : <div className="profile-empty compact"><FileText size={26} /><h2>No problems posted yet</h2><p>{isMe ? 'Share a local challenge and bring the community together.' : 'Check back later for new contributions.'}</p>{isMe && <Link to="/post-problem" className="btn btn-primary">Post a problem</Link>}</div>}</section> : <section className="profile-about card"><h2>About {profile.name}</h2><div><span>Role</span><b>{roleLabels[profile.role] || 'Member'}</b></div><div><span>Contribution</span><b>{profile.solved_count || 0} problems solved</b></div>{profile.github_username && <div><span>GitHub</span><a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer">@{profile.github_username}</a></div>}</section>}</main>;
}
