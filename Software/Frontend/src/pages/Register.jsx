import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'citizen', label: '🏘️ Citizen', desc: 'Post real problems you face' },
  { value: 'solver', label: '⚡ Solver', desc: 'Find and solve problems' },
  { value: 'mentor', label: '🎓 Mentor', desc: 'Guide teams and projects' },
  { value: 'organization', label: '🏢 Organization', desc: 'Post curated challenges' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Welcome to BridgeX!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'radial-gradient(ellipse at top, #1a0a3a 0%, var(--bg) 60%)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.jpeg" alt="BridgeX" style={{ height: 48, borderRadius: 10, margin: '0 auto 12px', display: 'block' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Join BridgeX</h1>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>Bridging real problems with real people</p>
        </div>

        <div className="card glow">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>

            <div className="form-group">
              <label>I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                {ROLES.map(r => (
                  <div key={r.value} onClick={() => setForm({ ...form, role: r.value })}
                    style={{
                      padding: '12px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                      border: `2px solid ${form.role === r.value ? 'var(--purple)' : 'var(--border)'}`,
                      background: form.role === r.value ? 'rgba(124,58,237,0.15)' : 'var(--bg2)'
                    }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--purple2)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
