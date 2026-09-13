import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { NOTIFICATIONS } from '../mock/data';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_ICONS = { solve_request: '🔧', accepted: '✅', application: '📋', solved: '🏆', default: '🔔' };

export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (user) setNotifs(NOTIFICATIONS[user.id] || []);
  }, [user]);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={22} style={{ color: 'var(--purple2)' }} /> Notifications
        </h1>
        {notifs.some(n => !n.read) && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}><CheckCheck size={14} /> Mark all read</button>
        )}
      </div>
      {notifs.length === 0 ? (
        <div className="empty-state"><Bell size={48} /><p>No notifications yet</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', opacity: n.read ? 0.6 : 1, borderLeft: n.read ? '3px solid var(--border)' : '3px solid var(--purple)' }}>
              <span style={{ fontSize: 22 }}>{TYPE_ICONS[n.type] || TYPE_ICONS.default}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14 }}>{n.message}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
