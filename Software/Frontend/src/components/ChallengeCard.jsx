import { Zap, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChallengeCard({ challenge }) {
  const deadline = challenge.deadline ? new Date(challenge.deadline).toLocaleDateString() : 'Open';

  return (
    <Link to={`/challenges/${challenge.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', borderLeft: '3px solid var(--purple)', height: '100%' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className={`badge badge-${challenge.status}`}>{challenge.status.replace('_', ' ')}</span>
          {challenge.category && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{challenge.category}</span>}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{challenge.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {challenge.description}
        </p>

        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={12} />{challenge.org_name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} />{deadline}</span>
          {challenge.prize && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24' }}><Trophy size={12} />{challenge.prize}</span>}
        </div>
      </div>
    </Link>
  );
}
