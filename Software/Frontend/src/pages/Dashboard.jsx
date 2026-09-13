import { useEffect, useState } from 'react';
import { Flame, MapPin, MessageCircle, MoreHorizontal, Plus, ThumbsUp, TrendingUp, Clock, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROBLEMS, CHALLENGES } from '../mock/data';
import { useAuth } from '../context/AuthContext';

const CAT_COLOR = { water:'#06b6d4', roads:'#f59e0b', healthcare:'#ec4899', farming:'#22c55e', education:'#7c3aed', environment:'#10b981', other:'#8b87a8' };

function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s/60)}m`;
  if (s < 86400) return `${Math.floor(s/3600)}h`;
  return `${Math.floor(s/86400)}d`;
}

function Avatar({ name, avatar, size = 40, color }) {
  const bg = color || 'var(--grad)';
  const initial = name?.[0]?.toUpperCase() || '?';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.38, flexShrink: 0, overflow: 'hidden' }}>
      {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </div>
  );
}

function Post({ p, onUpvote }) {
  const color = CAT_COLOR[p.category?.toLowerCase()] || '#8b87a8';
  return (
    <article className="fp">
      <div className="fp-head">
        <Avatar name={p.author_name} avatar={p.author_avatar} size={42} color={color} />
        <div className="fp-meta">
          <strong>{p.author_name || 'Community Member'}</strong>
          <span>
            {p.created_at && <>{ago(p.created_at)} ago</>}
            {p.location && <><MapPin size={10} /> {p.location}</>}
          </span>
        </div>
        {p.category && <span className="fp-cat" style={{ color, background: `${color}18` }}>{p.category}</span>}
        <button className="fp-more"><MoreHorizontal size={16} /></button>
      </div>

      <Link to={`/problems/${p.id}`} className="fp-body">
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        {p.image_url && <img src={p.image_url} alt="" />}
      </Link>

      <div className="fp-foot">
        <button onClick={e => { e.preventDefault(); onUpvote(p.id, (p.upvotes||0)+1); }} className="fp-btn">
          <ThumbsUp size={15} /> <span>{p.upvotes || 0}</span>
        </button>
        <Link to={`/problems/${p.id}`} className="fp-btn">
          <MessageCircle size={15} /> <span>Discuss</span>
        </Link>
        <span className={`fp-status s-${p.status}`}>{p.status?.replace('_', ' ')}</span>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [tab, setTab] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProblems(PROBLEMS);
    setChallenges(CHALLENGES.slice(0, 5));
    setLoading(false);
  }, []);

  const feed = [...problems].sort((a, b) =>
    tab === 'top' ? (b.upvotes - a.upvotes) : new Date(b.created_at) - new Date(a.created_at)
  );

  const onUpvote = (id, upvotes) => setProblems(prev => prev.map(p => p.id === id ? { ...p, upvotes } : p));

  return (
    <div className="dash-wrap">

      {/* ── FEED ── */}
      <main className="dash-feed">

        {/* Composer */}
        <Link to="/post-problem" className="composer-box">
          <Avatar name={user?.name} size={40} />
          <div className="composer-input">What problem should the community solve?</div>
          <span className="composer-btn"><Plus size={15} /> Post</span>
        </Link>

        {/* Tabs */}
        <div className="feed-tabs">
          <button className={tab === 'latest' ? 'active' : ''} onClick={() => setTab('latest')}><Clock size={13} /> Latest</button>
          <button className={tab === 'top' ? 'active' : ''} onClick={() => setTab('top')}><Flame size={13} /> Top</button>
        </div>

        {/* Posts */}
        {loading
          ? <div className="feed-empty"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div>
          : feed.length === 0
            ? <div className="feed-empty-msg"><TrendingUp size={40} /><h3>No problems posted yet</h3><p>Be the first to share a challenge with the community.</p><Link to="/post-problem" className="btn btn-primary">Post a Problem</Link></div>
            : feed.map(p => <Post key={p.id} p={p} onUpvote={onUpvote} />)
        }
      </main>

      {/* ── SIDEBAR ── */}
      <aside className="dash-side">

        {/* Active Challenges */}
        <div className="side-card">
          <div className="side-card-head">
            <Zap size={15} style={{ color: 'var(--purple)' }} />
            <h3>Active Challenges</h3>
          </div>
          {challenges.length === 0
            ? <p style={{ fontSize: 11, color: 'var(--muted)' }}>No challenges yet.</p>
            : challenges.map(c => (
              <Link key={c.id} to={`/challenges/${c.id}`} className="side-challenge">
                <div className="side-challenge-dot" />
                <div>
                  <strong>{c.title}</strong>
                  <span>{c.org_name}</span>
                </div>
              </Link>
            ))
          }
          <Link to="/challenges" className="side-view-all">View all <ChevronRight size={12} /></Link>
        </div>

        {/* Post CTA */}
        <div className="side-cta">
          <h3>Got a problem?</h3>
          <p>Share it with solvers, mentors and organizations.</p>
          <Link to="/post-problem" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}><Plus size={14} /> Post a Problem</Link>
        </div>

      </aside>
    </div>
  );
}
