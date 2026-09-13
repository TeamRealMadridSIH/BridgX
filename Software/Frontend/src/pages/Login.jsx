import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QUICK_USERS = [
  { email: 'asif@bridgex.app',     password: 'pass123', name: 'Asif',         role: 'Solver',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif' },
  { email: 'aysha@bridgex.app',    password: 'pass123', name: 'Aysha',        role: 'Citizen',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aysha' },
  { email: 'nargis@bridgex.app',   password: 'pass123', name: 'Nargis',       role: 'Mentor',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nargis' },
  { email: 'shahid@bridgex.app',   password: 'pass123', name: 'Shahid',       role: 'Solver',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahid' },
  { email: 'mehna@bridgex.app',    password: 'pass123', name: 'Mehna',        role: 'Citizen',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehna' },
  { email: 'shafeeque@bridgex.app',password: 'pass123', name: 'Shafeeque',    role: 'Solver',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shafeeque' },
  { email: 'muhammed@bridgex.app', password: 'pass123', name: 'Muhammed',     role: 'Solver',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhammed' },
  { email: 'muhasir@bridgex.app',  password: 'pass123', name: 'Muhasir',      role: 'Mentor',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muhasir' },
  { email: 'sih@bridgex.app',      password: 'org123',  name: 'SIH',          role: 'Org',      avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=80&h=80&fit=crop' },
  { email: 'isro@bridgex.app',     password: 'org123',  name: 'ISRO',         role: 'Org',      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/ISRO_Logo.svg/80px-ISRO_Logo.svg.png' },
  { email: 'tcs@bridgex.app',      password: 'org123',  name: 'TCS',          role: 'Org',      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/120px-Tata_Consultancy_Services_Logo.svg.png' },
  { email: 'iitb@bridgex.app',     password: 'org123',  name: 'IIT Bombay',   role: 'Org',      avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/80px-IIT_Bombay_Logo.svg.png' },
];

const ROLE_COLOR = { Solver: '#5046e5', Citizen: '#059669', Mentor: '#d97706', Org: '#0891b2' };

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/'); }
    catch (err) { const msg = err.message || 'Login failed'; setError(msg); toast.error(msg); }
    finally { setLoading(false); }
  };

  const quickLogin = async (u) => {
    setLoading(true);
    try { await login(u.email, u.password); toast.success(`Welcome, ${u.name}!`); navigate('/'); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      {/* Left panel */}
      <section className="auth-intro">
        <Link to="/" className="auth-brand">
          <img src="/logo.jpeg" alt="BridgeX" style={{ height: 36, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 20 }}>BridgeX</span>
        </Link>
        <div className="auth-intro-copy">
          <p className="auth-kicker">COLLABORATE FOR CHANGE</p>
          <h1>Turn real problems into shared progress.</h1>
          <p>BridgeX connects people, teams, and organisations to build solutions that matter.</p>
        </div>

        {/* Interactive user picker */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, opacity: 0.6, marginBottom: 12 }}>SIGN IN AS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {QUICK_USERS.map(u => (
              <button
                key={u.email}
                onClick={() => quickLogin(u)}
                disabled={loading}
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                <img src={u.avatar} alt={u.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{u.name}</span>
                <span style={{ fontSize: 10, color: ROLE_COLOR[u.role], background: `${ROLE_COLOR[u.role]}22`, padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>{u.role}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Right panel */}
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-heading">
            <img src="/logo.jpeg" alt="BridgeX" style={{ height: 44, borderRadius: 10, marginBottom: 8 }} />
            <h2>Sign in to BridgeX</h2>
            <p>Enter your credentials or pick an account on the left.</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input">
              <Mail size={17} />
              <input id="login-email" type="email" autoComplete="email" placeholder="you@bridgex.app" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <label htmlFor="login-password">Password</label>
            <div className="auth-input">
              <LockKeyhole size={17} />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
            {error && <p role="alert" className="auth-error">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}
            </button>
          </form>
          <p className="auth-switch">New to BridgeX? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
