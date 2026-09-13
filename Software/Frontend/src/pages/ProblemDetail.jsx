import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import { PROBLEMS } from '../mock/data';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProblemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = PROBLEMS.find(p => p.id === parseInt(id));
    setProblem(found || null);
    setLoading(false);
  }, [id]);

  const fetchProblem = () => {};

  const handleUpvote = () => setProblem(p => ({ ...p, upvotes: (p.upvotes || 0) + 1 }));

  const handleRequestSolve = () => { toast.success('Request sent!'); setShowRequestModal(false); setMessage(''); };

  const handleMarkSolved = () => { setProblem(p => ({ ...p, status: 'solved' })); toast.success('Marked as solved! 🎉'); };

  if (loading) return <div className="page" style={{ color: 'var(--muted)' }}>Loading...</div>;
  if (!problem) return <div className="page">Problem not found</div>;

  const isAuthor = user?.id === problem.author_id;
  const isSolver = user && !isAuthor && problem.status === 'open';

  return (
    <div className="page challenge-detail" style={{ maxWidth: 850 }}>
      <Link to="/challenges" className="back-link">← Back to Challenges</Link>
      <div className="card challenge-detail-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <span className={`badge badge-${problem.status}`}>{problem.status.replace('_', ' ')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {isAuthor && problem.status === 'in_progress' && (
              <button className="btn btn-ghost btn-sm" onClick={handleMarkSolved}><CheckCircle size={14} /> Mark Solved</button>
            )}
            {isSolver && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowRequestModal(true)}>Offer to Solve</button>
            )}
          </div>
        </div>

        <img src={problem.image_url || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1300&q=80'} alt="" className="challenge-banner" />

        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>{problem.title}</h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{problem.description}</p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="avatar" style={{ width: 24, height: 24, fontSize: 11 }}>{problem.author_name?.[0]}</div>
            {problem.author_name}
          </span>
          {problem.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{problem.location}</span>}
          {problem.category && <span style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple2)', padding: '2px 10px', borderRadius: 50, fontWeight: 600 }}>{problem.category}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{new Date(problem.created_at).toLocaleDateString()}</span>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={handleUpvote}><ThumbsUp size={14} /> {problem.upvotes} Upvotes</button>
        <div className="detail-tabs"><b>Overview</b><span>Discussion</span><span>Solutions</span><span>Team</span></div>
        <div className="detail-information"><h2>About the Challenge</h2><p>{problem.description}</p><h2>Impact</h2><div><b>12,000+<small>people affected</small></b><b>₹5 Cr+<small>estimated annual loss</small></b><b>Environmental<small>impact on local ecosystems</small></b></div></div>
      </div>

      {/* Solve Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Offer to Solve</h2>
            <div className="form-group">
              <label>Your approach / message</label>
              <textarea rows={4} placeholder="Describe how you plan to solve this problem..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleRequestSolve} style={{ flex: 1, justifyContent: 'center' }}>Send Request</button>
              <button className="btn btn-outline" onClick={() => setShowRequestModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
