import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, GitBranch, Users, ExternalLink, Code2, Box, PenTool, Globe, Terminal, Database, Layers, ChevronRight, Plus, Hash, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WORKSPACES, MESSAGES } from '../mock/data';
import toast from 'react-hot-toast';

const CLOUD_TOOLS = [
  { group: 'Code & Dev', tools: [
    { name: 'VS Code', sub: 'vscode.dev', icon: <Code2 size={18} />, color: '#007ACC', bg: '#e8f4fd', url: 'https://vscode.dev' },
    { name: 'GitHub', sub: 'github.com', icon: <GitBranch size={18} />, color: '#24292e', bg: '#f0f0f0', url: 'https://github.com' },
    { name: 'Replit', sub: 'replit.com', icon: <Terminal size={18} />, color: '#F26207', bg: '#fff3e8', url: 'https://replit.com' },
    { name: 'CodeSandbox', sub: 'codesandbox.io', icon: <Hash size={18} />, color: '#151515', bg: '#f5f5f5', url: 'https://codesandbox.io' },
  ]},
  { group: 'Design & 3D', tools: [
    { name: 'Figma', sub: 'figma.com', icon: <PenTool size={18} />, color: '#F24E1E', bg: '#fff0ec', url: 'https://figma.com' },
    { name: 'Blender', sub: 'blender.org', icon: <Box size={18} />, color: '#EA7600', bg: '#fff4e6', url: 'https://www.blender.org/download/' },
    { name: 'Spline', sub: '3D in browser', icon: <Layers size={18} />, color: '#6c47ff', bg: '#f0ecff', url: 'https://spline.design' },
    { name: 'Canva', sub: 'canva.com', icon: <Globe size={18} />, color: '#00C4CC', bg: '#e6fafa', url: 'https://canva.com' },
  ]},
  { group: 'Data & AI', tools: [
    { name: 'Colab', sub: 'Google Colab', icon: <Cpu size={18} />, color: '#F9AB00', bg: '#fffbe6', url: 'https://colab.research.google.com' },
    { name: 'Kaggle', sub: 'kaggle.com', icon: <Database size={18} />, color: '#20BEFF', bg: '#e6f9ff', url: 'https://kaggle.com' },
  ]},
];

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [showGithub, setShowGithub] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const bottomRef = useRef();

  const myWorkspaces = WORKSPACES.filter(w => w.members.some(m => m.id === user?.id));

  useEffect(() => {
    if (!id) {
      if (myWorkspaces.length) navigate(`/workspace/${myWorkspaces[0].id}`, { replace: true });
      return;
    }
    const wsId = parseInt(id);
    const ws = WORKSPACES.find(w => w.id === wsId);
    setWorkspace(ws || null);
    setMessages(MESSAGES[wsId] || []);
  }, [id, user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = { _id: `m${Date.now()}`, workspaceId: id, senderId: user.id, senderName: user.name, senderAvatar: user.avatar, text: text.trim(), createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  const linkGithub = () => {
    setWorkspace(prev => ({ ...prev, github_repo: githubRepo }));
    toast.success('GitHub repo linked!');
    setShowGithub(false);
  };

  if (!user) return null;

  if (!id && myWorkspaces.length === 0) return (
    <div className="ws-loading">
      <p>You don't have any workspaces yet.</p>
      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>A workspace is created when a solve request is accepted.</p>
    </div>
  );

  if (!workspace) return <div className="ws-loading">Workspace not found</div>;

  return (
    <div className="ws-shell">
      <aside className="ws-sidebar">
        <div className="ws-sidebar-top">
          <div className="ws-sidebar-label">WORKSPACE</div>
          <div className="ws-ws-id">#{workspace.id}</div>
        </div>
        <div className="ws-sidebar-section">
          <div className="ws-sidebar-label"><Users size={11} /> Members</div>
          {workspace.members?.map(m => (
            <div key={m.id} className="ws-member">
              <div className="ws-member-avatar">{m.avatar ? <img src={m.avatar} alt="" /> : m.name?.[0]}</div>
              <div><div className="ws-member-name">{m.name}</div><div className="ws-member-role">{m.role}</div></div>
              <span className="ws-online-dot" />
            </div>
          ))}
        </div>
        <div className="ws-sidebar-section">
          <div className="ws-sidebar-label"><GitBranch size={11} /> Repository</div>
          {workspace.github_repo ? (
            <a href={`https://github.com/${workspace.github_repo}`} target="_blank" rel="noreferrer" className="ws-repo-link">
              <GitBranch size={13} /><span>{workspace.github_repo}</span><ExternalLink size={11} />
            </a>
          ) : (
            <button className="ws-link-repo-btn" onClick={() => setShowGithub(true)}><Plus size={13} /> Link GitHub Repo</button>
          )}
        </div>
        <div className="ws-sidebar-section" style={{ marginTop: 'auto' }}>
          <button className="ws-tools-shortcut" onClick={() => setActiveTab('tools')}>
            <Layers size={14} /> Open Cloud Tools <ChevronRight size={13} />
          </button>
        </div>
      </aside>

      <div className="ws-main">
        <div className="ws-tabs">
          <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>💬 Team Chat</button>
          <button className={activeTab === 'tools' ? 'active' : ''} onClick={() => setActiveTab('tools')}>🛠️ Cloud Tools</button>
        </div>

        {activeTab === 'chat' && (
          <div className="ws-chat">
            <div className="ws-messages">
              {messages.length === 0 && <div className="ws-chat-empty"><span>👋</span><p>No messages yet. Say hello to your team!</p></div>}
              {messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={i} className={`ws-msg ${isMe ? 'mine' : ''}`}>
                    <div className="ws-msg-avatar">{msg.senderAvatar ? <img src={msg.senderAvatar} alt="" /> : msg.senderName?.[0]}</div>
                    <div className="ws-msg-body">
                      {!isMe && <span className="ws-msg-name">{msg.senderName}</span>}
                      <div className="ws-msg-bubble">{msg.text}</div>
                      <span className="ws-msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="ws-compose">
              <input placeholder="Type a message…" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button className="btn btn-primary" onClick={sendMessage} disabled={!text.trim()}><Send size={15} /></button>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="ws-tools-panel">
            <div className="ws-tools-header"><h2>Cloud Tools</h2><p>Open these directly in your browser — no install needed.</p></div>
            {CLOUD_TOOLS.map(group => (
              <div key={group.group} className="ws-tool-group">
                <div className="ws-tool-group-label">{group.group}</div>
                <div className="ws-tool-grid">
                  {group.tools.map(tool => (
                    <a key={tool.name} href={tool.url} target="_blank" rel="noreferrer" className="ws-tool-card">
                      <div className="ws-tool-icon" style={{ background: tool.bg, color: tool.color }}>{tool.icon}</div>
                      <div className="ws-tool-info"><strong>{tool.name}</strong><span>{tool.sub}</span></div>
                      <ExternalLink size={13} className="ws-tool-arrow" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGithub && (
        <div className="modal-overlay" onClick={() => setShowGithub(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Link GitHub Repository</h2>
            <div className="form-group"><label>Repository (owner/repo)</label><input placeholder="e.g. username/bridgex-solution" value={githubRepo} onChange={e => setGithubRepo(e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={linkGithub} style={{ flex: 1, justifyContent: 'center' }}>Link Repository</button>
              <button className="btn btn-outline" onClick={() => setShowGithub(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
