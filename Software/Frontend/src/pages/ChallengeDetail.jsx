import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CHALLENGES, APPLICATIONS, WORKSPACES } from '../mock/data';
import toast from 'react-hot-toast';

export default function ChallengeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const c = CHALLENGES.find(c => c.id === parseInt(id));
    if (c) {
      const apps = APPLICATIONS.filter(a => a.challenge_id === c.id);
      setChallenge({ ...c, applications: apps });
    }
    setLoading(false);
  }, [id]);

  const handleApply = async () => {
    const newApp = { id: Date.now(), challenge_id: parseInt(id), applicant_id: user.id, name: user.name, avatar: user.avatar, role: user.role, proposal, status: 'pending', created_at: new Date().toISOString() };
    APPLICATIONS.push(newApp);
    setChallenge(prev => ({ ...prev, applications: [...(prev.applications || []), newApp] }));
    toast.success('Application submitted!');
    setShowApply(false);
    setProposal('');
  };

  const handleRespond = async (appId, action) => {
    APPLICATIONS.forEach(a => { if (a.id === appId) a.status = action; });
    if (action === 'accepted') {
      const ws = { id: Date.now(), problem_id: null, challenge_id: parseInt(id), github_repo: null, name: challenge.title, created_at: new Date().toISOString(), members: [{ id: user.id, name: user.name, avatar: user.avatar, role: user.role }] };
      WORKSPACES.push(ws);
      toast.success('Application accepted! Workspace created.');
      navigate(`/workspace/${ws.id}`);
    } else {
      toast.success(`Application ${action}`);
      setChallenge(prev => ({ ...prev, applications: prev.applications.map(a => a.id === appId ? { ...a, status: action } : a) }));
    }
  };

  if (loading) return <div className="page" style={{ color: 'var(--muted)' }}>Loading...</div>;
  if (!challenge) return <div className="page">Challenge not found</div>;

  const isOrg = user?.id === challenge.org_id;
  const canApply = user && !isOrg && challenge.status === 'open';
  const hasApplied = challenge.applications?.some(a => a.applicant_id === user?.id);

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <span className={`badge badge-${challenge.status}`}>{challenge.status.replace('_', ' ')}</span>
          {canApply && !hasApplied && (
            <button className="btn btn-primary" onClick={() => setShowApply(true)}>Apply Now</button>
          )}
          {hasApplied && <span className="badge badge-pending">Applied</span>}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>{challenge.title}</h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{challenge.description}</p>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} />{challenge.org_name}</span>
          {challenge.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} />Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>}
          {challenge.prize && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24' }}><Trophy size={13} />{challenge.prize}</span>}
        </div>
      </div>

      {/* Applications (visible to org) */}
      {isOrg && challenge.applications?.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Applications ({challenge.applications.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {challenge.applications.map(app => (
              <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{app.name?.[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{app.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{app.role}</div>
                    </div>
                    <span className={`badge badge-${app.status}`} style={{ marginLeft: 'auto' }}>{app.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{app.proposal}</p>
                </div>
                {app.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#4ade80' }} onClick={() => handleRespond(app.id, 'accepted')}><CheckCircle size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => handleRespond(app.id, 'rejected')}><XCircle size={14} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showApply && (
        <div className="modal-overlay" onClick={() => setShowApply(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Apply for Challenge</h2>
            <div className="form-group">
              <label>Your Proposal</label>
              <textarea rows={5} placeholder="Describe your approach, team, and why you're the right fit..." value={proposal} onChange={e => setProposal(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleApply} style={{ flex: 1, justifyContent: 'center' }}>Submit Application</button>
              <button className="btn btn-outline" onClick={() => setShowApply(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
