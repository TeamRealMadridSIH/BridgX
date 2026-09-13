import { useState, useEffect } from 'react';
import { Building2, Calendar, Plus, Search, Trophy, Users, Zap, Flame, Globe, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHALLENGES } from '../mock/data';
import { useAuth } from '../context/AuthContext';

const THEMES = ['All', 'Smart Automation', 'MedTech', 'Disaster Management', 'Agriculture', 'Education', 'Cybersecurity', 'Space Technology', 'Clean Technology'];

const COMMUNITIES = [
  {
    id: 'sih',
    name: 'Smart India Hackathon',
    short: 'SIH',
    desc: 'National level hackathon by AICTE & MoE with 240+ problem statements from top government ministries.',
    color: '#5046e5',
    bg: 'linear-gradient(135deg,#5046e5,#7c3aed)',
    icon: <Flame size={22} />,
    members: '10K+',
    challenges: 240,
  },
  {
    id: 'open',
    name: 'Open Challenges',
    short: 'OC',
    desc: 'Community-driven challenges posted by verified organizations and institutions open to all solvers.',
    color: '#0891b2',
    bg: 'linear-gradient(135deg,#0891b2,#06b6d4)',
    icon: <Globe size={22} />,
    members: '5K+',
    challenges: null,
  },
  {
    id: 'edu',
    name: 'Academic & Research',
    short: 'AR',
    desc: 'University and research institution challenges focused on innovation, thesis projects, and R&D.',
    color: '#059669',
    bg: 'linear-gradient(135deg,#059669,#10b981)',
    icon: <BookOpen size={22} />,
    members: '3K+',
    challenges: null,
  },
];

function ChallengeCard({ c }) {
  const deadline = c.deadline
    ? new Date(c.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Open';
  const initial = c.org_name?.[0]?.toUpperCase() || 'O';
  const statusColors = {
    open: { bg: '#e8f8f1', color: '#159c63' },
    closed: { bg: '#fef2f2', color: '#dc2626' },
    in_progress: { bg: '#eeeefe', color: '#5146e5' },
  };
  const sc = statusColors[c.status] || statusColors.open;

  return (
    <Link to={`/challenges/${c.id}`} className="comm-card">
      <div className="comm-card-header">
        <div className="comm-org-avatar">{initial}</div>
        <div className="comm-org-meta">
          <strong>{c.org_name}</strong>
          <span>{c.ps_number || c.category}</span>
        </div>
        <span className="comm-status-badge" style={{ background: sc.bg, color: sc.color }}>
          {c.status?.replace('_', ' ')}
        </span>
      </div>

      <h3 className="comm-card-title">{c.title}</h3>
      <p className="comm-card-desc">{c.description}</p>

      <div className="comm-card-footer">
        {c.theme && (
          <span className="comm-tag comm-tag-theme"><Zap size={10} />{c.theme}</span>
        )}
        <span className="comm-tag comm-tag-date"><Calendar size={10} />{deadline}</span>
        {c.prize && (
          <span className="comm-tag comm-tag-prize"><Trophy size={10} />{c.prize}</span>
        )}
      </div>
    </Link>
  );
}

export default function Community() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('All');
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', deadline: '', prize: '' });
  const { user } = useAuth();

  useEffect(() => {
    setChallenges(CHALLENGES);
    setLoading(false);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newC = { id: Date.now(), ...form, org_id: user.id, org_name: user.name, org_avatar: user.avatar, status: 'open', created_at: new Date().toISOString() };
    setChallenges(prev => [newC, ...prev]);
    setShowCreate(false);
    setForm({ title: '', description: '', category: '', deadline: '', prize: '' });
  };

  const filtered = challenges
    .filter(c => !activeCommunity || c.community === activeCommunity)
    .filter(c => theme === 'All' || c.theme?.toLowerCase().includes(theme.toLowerCase()) || c.category?.toLowerCase().includes(theme.toLowerCase()))
    .filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.org_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="comm-wrap">

      {/* Communities */}
      <section className="comm-section">
        <div className="comm-section-head">
          <h2>Communities</h2>
          <span className="comm-section-sub">Select a community to filter challenges</span>
        </div>
        <div className="comm-communities-grid">
          {COMMUNITIES.map(com => (
            <button
              key={com.id}
              className={`comm-community-tile ${activeCommunity === com.id ? 'active' : ''}`}
              onClick={() => setActiveCommunity(activeCommunity === com.id ? null : com.id)}
            >
              <div className="comm-tile-icon" style={{ background: com.bg }}>{com.icon}</div>
              <div className="comm-tile-body">
                <strong>{com.name}</strong>
                <p>{com.desc}</p>
                <div className="comm-tile-meta">
                  <span><Users size={11} />{com.members} members</span>
                  {com.challenges && <span><Zap size={11} />{com.challenges} challenges</span>}
                </div>
              </div>
              {activeCommunity === com.id && (
                <div className="comm-tile-check">✓</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section className="comm-section">
        <div className="comm-section-head">
          <h2>Challenges</h2>
          {user?.role === 'organization' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              <Plus size={13} /> New
            </button>
          )}
        </div>

        {/* Search + Theme filters */}
        <div className="comm-filters">
          <div className="ex-search">
            <Search size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search challenges or organizations…"
            />
          </div>
          <div className="comm-theme-pills">
            {THEMES.map(t => (
              <button
                key={t}
                className={theme === t ? 'active' : ''}
                onClick={() => setTheme(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        <div className="comm-results-bar">
          <span><b>{filtered.length}</b> challenges</span>
          {activeCommunity && (
            <span className="ex-active-filter">
              {COMMUNITIES.find(c => c.id === activeCommunity)?.name}
              <button onClick={() => setActiveCommunity(null)}>×</button>
            </span>
          )}
          {theme !== 'All' && (
            <span className="ex-active-filter">
              {theme} <button onClick={() => setTheme('All')}>×</button>
            </span>
          )}
        </div>

        {loading ? (
          <div className="comm-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="ex-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="ex-empty">
            <Building2 size={40} />
            <h3>No challenges found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="comm-grid">
            {filtered.map(c => <ChallengeCard key={c.id} c={c} />)}
          </div>
        )}
      </section>

      {/* Create modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Post a Challenge</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Prize</label>
                  <input placeholder="e.g. ₹50,000" value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit" style={{ flex: 1, justifyContent: 'center' }}>Post Challenge</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
