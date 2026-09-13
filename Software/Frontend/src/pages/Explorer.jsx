import { useEffect, useState } from 'react';
import { MapPin, MessageCircle, Search, ThumbsUp, Clock, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROBLEMS } from '../mock/problems';

const CATEGORIES = ['All', 'Water', 'Roads', 'Healthcare', 'Farming', 'Education', 'Environment', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Solved'];
const CAT_COLOR = { water:'#06b6d4', roads:'#f59e0b', healthcare:'#ec4899', farming:'#22c55e', education:'#7c3aed', environment:'#10b981', other:'#8b87a8' };

function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function ProblemCard({ p }) {
  const color = CAT_COLOR[p.category?.toLowerCase()] || '#8b87a8';
  const initial = p.author_name?.[0]?.toUpperCase() || '?';
  return (
    <Link to={`/problems/${p.id}`} className="ex-card">
      {p.image_url && <img src={p.image_url} alt="" className="ex-card-img" />}
      <div className="ex-card-body">
        <div className="ex-card-top">
          <span className="ex-cat" style={{ color, background: `${color}18` }}>{p.category || 'General'}</span>
          <span className={`ex-status s-${p.status}`}>{p.status?.replace('_', ' ')}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="ex-card-foot">
          <div className="ex-author">
            <div className="ex-avatar" style={{ background: color }}>{initial}</div>
            <span>{p.author_name || 'Member'}</span>
          </div>
          {p.location && <span className="ex-loc"><MapPin size={11} />{p.location}</span>}
          <span className="ex-time"><Clock size={11} />{p.created_at ? ago(p.created_at) : ''}</span>
          <span className="ex-votes"><ThumbsUp size={11} />{p.upvotes || 0}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Explorer() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    setProblems(PROBLEMS);
    setLoading(false);
  }, []);

  const filtered = problems
    .filter(p => cat === 'All' || p.category?.toLowerCase() === cat.toLowerCase())
    .filter(p => status === 'All' || p.status?.replace('_', ' ').toLowerCase() === status.toLowerCase())
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'top' ? (b.upvotes - a.upvotes) : new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="ex-wrap">
      {/* Header */}
      <div className="ex-header">
        <div>
          <h1>Explorer</h1>
          <p>Discover problems posted by the community</p>
        </div>
        <Link to="/post-problem" className="btn btn-primary">+ Post a Problem</Link>
      </div>

      {/* Search + Sort */}
      <div className="ex-search-row">
        <div className="ex-search">
          <Search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems by title or description…" />
        </div>
        <div className="ex-sort">
          <SlidersHorizontal size={14} />
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="top">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Category filters */}
      <div className="ex-filters">
        {CATEGORIES.map(c => (
          <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>{c}</button>
        ))}
        <div className="ex-filter-divider" />
        {STATUSES.map(s => (
          <button key={s} className={`ex-status-btn ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>{s}</button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="ex-stats-bar">
        <span><b>{filtered.length}</b> problems found</span>
        {cat !== 'All' && <span className="ex-active-filter">{cat} <button onClick={() => setCat('All')}>×</button></span>}
        {status !== 'All' && <span className="ex-active-filter">{status} <button onClick={() => setStatus('All')}>×</button></span>}
        {search && <span className="ex-active-filter">"{search}" <button onClick={() => setSearch('')}>×</button></span>}
      </div>

      {/* Grid */}
      {loading
        ? <div className="ex-grid">{[...Array(6)].map((_, i) => <div key={i} className="ex-skeleton" />)}</div>
        : filtered.length === 0
          ? <div className="ex-empty"><MessageCircle size={40} /><h3>No problems found</h3><p>Try adjusting your filters or search term.</p></div>
          : <div className="ex-grid">{filtered.map(p => <ProblemCard key={p.id} p={p} />)}</div>
      }
    </div>
  );
}
