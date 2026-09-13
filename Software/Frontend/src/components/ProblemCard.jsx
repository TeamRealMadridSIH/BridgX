import { MapPin, ThumbsUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  water: '#06b6d4', roads: '#f59e0b', healthcare: '#ec4899',
  farming: '#4ade80', education: '#7c3aed', other: '#8b87a8'
};

export default function ProblemCard({ problem, onUpvote }) {
  const handleUpvote = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/problems/${problem.id}/upvote`);
      onUpvote?.(problem.id, data.upvotes);
    } catch { toast.error('Login to upvote'); }
  };

  const color = CATEGORY_COLORS[problem.category] || '#8b87a8';
  const timeAgo = new Date(problem.created_at).toLocaleDateString();

  return (
    <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>

        {problem.image_url && (
          <img src={problem.image_url} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <span className={`badge badge-${problem.status}`}>{problem.status.replace('_', ' ')}</span>
          {problem.category && (
            <span style={{ fontSize: 12, color, background: `${color}20`, padding: '3px 10px', borderRadius: 50, fontWeight: 600 }}>
              {problem.category}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{problem.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {problem.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>
              {problem.author_avatar ? <img src={problem.author_avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} /> : problem.author_name?.[0]}
            </div>
            <span>{problem.author_name}</span>
          </div>
          {problem.location && <><MapPin size={12} /><span>{problem.location}</span></>}
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{timeAgo}</span>
        </div>

        <div className="divider" />
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleUpvote} style={{ padding: '4px 10px' }}>
            <ThumbsUp size={14} /> {problem.upvotes}
          </button>
        </div>
      </div>
    </Link>
  );
}
