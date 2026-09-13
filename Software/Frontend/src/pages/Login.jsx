import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/'); }
    catch (err) { const message = err.response?.data?.error || err.message || 'Login failed'; setError(message); toast.error(message); }
    finally { setLoading(false); }
  };

  return <main className="auth-page">
    <section className="auth-intro">
      <Link to="/login" className="auth-brand"><span>BX</span> BridgeX</Link>
      <div className="auth-intro-copy"><p className="auth-kicker">COLLABORATE FOR CHANGE</p><h1>Turn real problems into shared progress.</h1><p>BridgeX connects people, teams, and organisations to build solutions that matter.</p></div>
      <div className="auth-highlight"><ShieldCheck size={20} /><span><b>Built for meaningful work</b>Find a challenge, form a team, and move ideas forward.</span></div>
    </section>
    <section className="auth-panel"><div className="auth-card">
      <div className="auth-card-heading"><p className="auth-kicker">WELCOME BACK</p><h2>Sign in to BridgeX</h2><p>Enter your details to continue.</p></div>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="login-email">Email address</label>
        <div className="auth-input"><Mail size={17} /><input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required /></div>
        <label htmlFor="login-password">Password</label>
        <div className="auth-input"><LockKeyhole size={17} /><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <p role="alert" className="auth-error">{error}</p>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}</button>
      </form>
      <div className="auth-demo"><div><b>Try the demo</b><span>Use a ready-made solver account.</span></div><button type="button" onClick={() => setForm({ email: 'asif@bridgex.app', password: 'pass123' })}>Use demo</button></div>
      <p className="auth-switch">New to BridgeX? <Link to="/register">Create an account</Link></p>
    </div></section>
  </main>;
}
