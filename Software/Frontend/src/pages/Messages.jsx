import { useState, useEffect, useRef } from 'react';
import { Search, Send, Hash, Users, Circle, MessageCircle, ArrowLeft } from 'lucide-react';
import { WORKSPACES, MESSAGES } from '../mock/data';
import { USERS } from '../mock/users';
import { useAuth } from '../context/AuthContext';

function Avatar({ src, name, size = 36, online }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--grad)', overflow: 'hidden', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.38 }}>
        {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name?.[0]?.toUpperCase()}
      </div>
      {online !== undefined && (
        <span style={{ position: 'absolute', bottom: 1, right: 1, width: size * 0.28, height: size * 0.28, borderRadius: '50%', background: online ? '#22c55e' : '#94a3b8', border: '2px solid #fff' }} />
      )}
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('workspace'); // 'workspace' | 'dm'
  const [selectedWs, setSelectedWs] = useState(null);
  const [selectedDm, setSelectedDm] = useState(null);
  const [wsMessages, setWsMessages] = useState(MESSAGES);
  const [dmMessages, setDmMessages] = useState({});
  const [unread, setUnread] = useState({});
  const [text, setText] = useState('');
  const bottomRef = useRef();

  const myWorkspaces = WORKSPACES.filter(w => w.members.some(m => m.id === user?.id));
  // All users except self for DMs
  const dmUsers = USERS.filter(u => u.id !== user?.id && u.role !== 'organization');

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedWs, selectedDm, wsMessages, dmMessages]);

  const activeWorkspace = WORKSPACES.find(w => w.id === selectedWs);
  const activeDmUser = USERS.find(u => u.id === selectedDm);

  const currentMessages = activeType === 'workspace'
    ? (wsMessages[selectedWs] || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : (dmMessages[selectedDm] || []);

  const send = (e) => {
    e?.preventDefault();
    if (!text.trim() || !(activeType === 'workspace' ? selectedWs : selectedDm)) return;
    const msg = { _id: `m${Date.now()}`, senderId: user.id, senderName: user.name, senderAvatar: user.avatar, text: text.trim(), createdAt: new Date().toISOString() };
    if (activeType === 'workspace') {
      setWsMessages(prev => ({ ...prev, [selectedWs]: [...(prev[selectedWs] || []), msg] }));
    } else {
      setDmMessages(prev => ({ ...prev, [selectedDm]: [...(prev[selectedDm] || []), msg] }));
    }
    setUnread(prev => ({ ...prev, [`${activeType}-${activeType === 'workspace' ? selectedWs : selectedDm}`]: false }));
    setText('');
  };

  const selectConversation = (type, id) => {
    setActiveType(type);
    if (type === 'workspace') setSelectedWs(id);
    else setSelectedDm(id);
    setUnread(prev => ({ ...prev, [`${type}-${id}`]: false }));
  };

  const filteredWs = myWorkspaces.filter(w => w.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredDm = dmUsers.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  const headerName = activeType === 'workspace' ? activeWorkspace?.name : activeDmUser?.name;
  const headerSub = activeType === 'workspace'
    ? `${activeWorkspace?.members?.length || 0} members`
    : activeDmUser?.role;

  return (
    <div className={`msg-shell ${(activeType === 'workspace' ? selectedWs : selectedDm) ? 'conversation-open' : ''}`}>
      {/* ── Left sidebar ── */}
      <aside className="msg-sidebar">
        <div className="msg-sidebar-top">
          <div className="msg-search">
            <Search size={13} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" />
          </div>
        </div>

        {/* Workspace channels */}
        <div className="msg-section">
          <div className="msg-section-label"><Hash size={11} /> Groups</div>
          {filteredWs.length === 0 && <p className="msg-empty-hint">No groups yet</p>}
          {filteredWs.map(w => {
            const last = (wsMessages[w.id] || []).slice(-1)[0];
            const hasUnread = unread[`workspace-${w.id}`];
            return (
              <button key={w.id} className={`msg-item ${activeType === 'workspace' && selectedWs === w.id ? 'active' : ''}`}
                onClick={() => selectConversation('workspace', w.id)}>
                <div className="msg-item-icon"><Hash size={14} /></div>
                <div className="msg-item-body">
                  <span className="msg-item-name">{w.name}</span>
                  {last && <span className="msg-item-preview">{last.senderName}: {last.text}</span>}
                </div>
                {last && hasUnread && <span className="msg-unread-dot" />}
              </button>
            );
          })}
        </div>

        {/* Direct messages */}
        <div className="msg-section">
          <div className="msg-section-label"><Users size={11} /> Chats</div>
          {filteredDm.map(u => {
            const msgs = dmMessages[u.id] || [];
            const last = msgs.slice(-1)[0];
            const isActive = activeType === 'dm' && selectedDm === u.id;
            return (
              <button key={u.id} className={`msg-item ${isActive ? 'active' : ''}`}
                onClick={() => selectConversation('dm', u.id)}>
                <Avatar src={u.avatar} name={u.name} size={30} online={u.id % 3 !== 0} />
                <div className="msg-item-body">
                  <span className="msg-item-name">{u.name}</span>
                  <span className="msg-item-preview">{last ? last.text : u.role}</span>
                </div>
                {unread[`dm-${u.id}`] && <span className="msg-unread-dot" />}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="msg-main">
        {/* Header */}
        {(activeType === 'workspace' ? selectedWs : selectedDm) ? (
          <>
            <div className="msg-header">
              <button
                type="button"
                className="msg-back-btn"
                aria-label="Back to conversations"
                onClick={() => { setSelectedWs(null); setSelectedDm(null); }}
              ><ArrowLeft size={17} /></button>
              {activeType === 'workspace'
                ? <div className="msg-header-icon"><Hash size={16} /></div>
                : <Avatar src={activeDmUser?.avatar} name={activeDmUser?.name} size={34} online />
              }
              <div>
                <div className="msg-header-name">{headerName}</div>
                <div className="msg-header-sub">
                  {activeType === 'dm' && <Circle size={8} fill="#22c55e" color="#22c55e" style={{ marginRight: 4 }} />}
                  {headerSub}
                </div>
              </div>
              {activeType === 'workspace' && (
                <div className="msg-header-members">
                  {activeWorkspace?.members?.slice(0, 4).map(m => (
                    <div key={m.id} className="msg-header-avatar">
                      {m.avatar ? <img src={m.avatar} alt="" /> : m.name?.[0]}
                    </div>
                  ))}
                  {(activeWorkspace?.members?.length || 0) > 4 && (
                    <div className="msg-header-avatar more">+{activeWorkspace.members.length - 4}</div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="msg-thread">
              {currentMessages.length === 0 && (
                <div className="msg-thread-empty">
                  {activeType === 'workspace'
                    ? <><Hash size={32} /><p>Start the conversation in <b>{headerName}</b></p></>
                    : <><Avatar src={activeDmUser?.avatar} name={activeDmUser?.name} size={56} /><p>This is the beginning of your DM with <b>{activeDmUser?.name}</b></p></>
                  }
                </div>
              )}
              {currentMessages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                const prev = currentMessages[i - 1];
                const grouped = prev?.senderId === msg.senderId && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 120000;
                return (
                  <div key={msg._id} className={`msg-row ${isMe ? 'mine' : ''} ${grouped ? 'grouped' : ''}`}>
                    {!grouped
                      ? <Avatar src={msg.senderAvatar} name={msg.senderName} size={34} />
                      : <div style={{ width: 34, flexShrink: 0 }} />
                    }
                    <div className="msg-row-body">
                      {!grouped && (
                        <div className="msg-row-meta">
                          <span className="msg-row-name">{isMe ? 'You' : msg.senderName}</span>
                          <span className="msg-row-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      <div className={`msg-bubble ${isMe ? 'mine' : ''}`}>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Compose */}
            <form className="msg-compose" onSubmit={send}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={activeType === 'workspace' ? `Message #${headerName}` : `Message ${headerName}`}
              />
              <button className="msg-send-btn" type="submit" disabled={!text.trim()}>
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="msg-thread-empty" style={{ flex: 1 }}>
            <MessageCircle size={40} />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
