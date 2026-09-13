import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImagePlus, MapPin } from 'lucide-react';
import { PROBLEMS } from '../mock/problems';

const CATEGORIES = ['water', 'roads', 'healthcare', 'farming', 'education', 'other'];

export default function PostProblem() {
  const [form, setForm] = useState({ title: '', description: '', category: 'other', location: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newProblem = { id: Date.now(), ...form, upvotes: 0, status: 'open', author_id: null, author_name: 'You', author_avatar: null, solver_id: null, created_at: new Date().toISOString() };
    PROBLEMS.unshift(newProblem);
    toast.success('Problem posted!');
    navigate(`/problems/${newProblem.id}`);
    setLoading(false);
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Post a Problem</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Describe the real problem you're facing. Be specific — it helps solvers understand and act.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Problem Title *</label>
            <input placeholder="e.g. No clean water supply in our village for 3 months" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Describe the Problem *</label>
            <textarea rows={5} placeholder="Explain the problem in detail — what's happening, who's affected, how long it's been going on..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><MapPin size={13} style={{ verticalAlign: 'middle' }} /> Location</label>
              <input placeholder="City, State or Area" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label><ImagePlus size={13} style={{ verticalAlign: 'middle' }} /> Image URL (optional)</label>
            <input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          </div>

          {form.image_url && (
            <img src={form.image_url} alt="preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} onError={e => e.target.style.display = 'none'} />
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Posting...' : 'Post Problem'}
          </button>
        </form>
      </div>
    </div>
  );
}
