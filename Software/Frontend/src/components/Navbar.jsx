import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Home, Laptop, Menu, MessageCircle, Search, UserRound, Users, X } from 'lucide-react';

export default function Navbar({ notifCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); const location = useLocation(); const [open, setOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };
  const topName = 'BridgeX';

  const profileLinks = [[Home, 'Home', '/'], [Search, 'Explorer', '/explore'], [Users, 'Community', '/challenges'], [Laptop, 'Workspace', '/workspace'], [Bell, 'Notifications', '/notifications'], [MessageCircle, 'Messages', '/messages'], [UserRound, 'My profile', '/me']];
  const mobileLinks = [[Home, 'Home', '/'], [Search, 'Explore', '/explore'], [Users, 'Community', '/challenges'], [Laptop, 'Workspace', '/workspace'], [UserRound, 'Profile', '/me']];
  return <>
  <nav className="topbar">
    <Link to="/" className="brand"><img src="/logo.jpeg" alt="BridgeX" className="brand-logo" /></Link>
    <div className="nav-actions">{user ? <><div className="nav-search"><Search size={14} /><input aria-label="Search" placeholder="Search challenges, universities, industry..." /></div><Link to="/notifications" className="icon-button"><Bell size={17} />{notifCount > 0 && <i>{notifCount}</i>}</Link><Link to="/messages" className="icon-button" aria-label="Messages"><MessageCircle size={17} /></Link></> : <><Link to="/login" className="btn btn-light btn-sm">Login</Link><Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link></>}<button className="menu-button" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </nav>
  {user && <aside className="profile-sidebar" aria-label="Main navigation"><p>MAIN MENU</p>{profileLinks.map(([Icon, label, to]) => <Link key={to} to={to} className={(to === '/me' && location.pathname === '/me') || (to !== '/me' && location.pathname === to) ? 'active' : ''}><Icon size={15} />{label}</Link>)}</aside>}
  {user && <nav className="profile-mobile-menu" aria-label="Mobile main menu">{mobileLinks.map(([Icon, label, to]) => <Link key={to} to={to} className={(to === '/me' && location.pathname === '/me') || (to !== '/me' && location.pathname === to) ? 'active' : ''}><Icon size={19} /><span>{label}</span></Link>)}</nav>}
  </>;
}
