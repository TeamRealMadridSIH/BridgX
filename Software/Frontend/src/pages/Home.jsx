import { useEffect, useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, ChevronRight, FileText, GraduationCap, Lightbulb, MapPin, MessageCircle, Send, ThumbsUp, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PROBLEMS } from '../mock/problems';
import Dashboard from './Dashboard';

const fallback = [
  { id: 'flooding', title: 'How can we reduce urban flooding during heavy rain?', category: 'Environment', priority: 'High Priority', location: 'Thiruvananthapuram, Kerala', image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=900&q=80', votes: 248, comments: 43, people: 12 },
  { id: 'plastic', title: 'Plastic Waste Collection and Recycling in Coastal Areas', category: 'Sustainability', priority: 'Active', location: 'Kozhikode, Kerala', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80', votes: 187, comments: 29, people: 8 },
  { id: 'solar', title: 'Affordable Solar Solutions for Rural Households', category: 'Energy', priority: 'New', location: 'Palakkad, Kerala', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80', votes: 126, comments: 16, people: 6 },
];
function ChallengeCard({ item, apiProblem }) { const title = apiProblem?.title || item.title; const category = apiProblem?.category || item.category;
  return <Link to={apiProblem ? `/problems/${apiProblem.id}` : '/challenges'} className="challenge-card"><img src={apiProblem?.image_url || item.image} alt="" /><div className="challenge-copy"><div><span className="tag green">{category}</span><span className="tag coral">{item.priority}</span></div><h3>{title}</h3><p><MapPin size={12} /> {apiProblem?.location || item.location}</p><div className="challenge-meta"><span><ThumbsUp size={13} /> {apiProblem?.upvotes ?? item.votes}</span><span><MessageCircle size={13} /> {item.comments}</span><span><Users size={13} /> {item.people} solving</span></div></div></Link>;
}
export default function Home() {
  const { user } = useAuth(); const [problems, setProblems] = useState([]);
  useEffect(() => { setProblems(PROBLEMS.slice(0, 3)); }, []);
  if (user) return <Dashboard />;
  return <main className="home"><section className="hero"><div className="hero-copy"><p className="eyebrow">A COLLABORATIVE INNOVATION PLATFORM</p><h1>Real Problems.<br />Collaborative Minds.<br /><span>Lasting Impact.</span></h1><p className="hero-text">A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.</p><div className="hero-buttons"><Link to={user ? '/post-problem' : '/register'} className="btn btn-primary">Get Started <ArrowRight size={16} /></Link><a href="#how-it-works" className="btn btn-light">Learn More</a></div></div><div className="hero-art" aria-hidden="true"><div className="sun"><Lightbulb /></div><div className="orb"></div><div className="globe">✦</div><div className="person one"></div><div className="person two"></div><div className="leaf left">❧</div><div className="leaf right">❧</div><div className="art-card building"><Building2 /></div><div className="art-card cap"><GraduationCap /></div></div></section>
    <section className="stats-strip"><div><FileText /><b>1,248</b><span>Community Challenges</span></div><div><Users /><b>5,620</b><span>Community Members</span></div><div><GraduationCap /><b>320</b><span>University Partners</span></div><div><Building2 /><b>178</b><span>Industry Partners</span></div></section>
    <section id="how-it-works" className="how section"><h2>How It Works</h2><div className="steps"><div><i><FileText /></i><b>1. Report</b><p>A societal challenge</p></div><ChevronRight /><div><i><Users /></i><b>2. Collaborate</b><p>Get insights & build teams</p></div><ChevronRight /><div><i><Wrench /></i><b>3. Solve</b><p>Propose and develop solutions</p></div><ChevronRight /><div><i><CheckCircle2 /></i><b>4. Create Impact</b><p>Turn ideas into real change</p></div></div></section>
    <section className="section trending"><div className="section-head"><div><p className="eyebrow">DISCOVER OPPORTUNITIES</p><h2>Trending Challenges</h2></div><Link to="/challenges">View All <ArrowRight size={15} /></Link></div><div className="challenge-grid">{fallback.map((item, i) => <ChallengeCard key={item.id} item={item} apiProblem={problems[i]} />)}</div></section>
    <section className="cta-section"><div><span className="round-icon"><Send /></span><h2>Have a challenge worth solving?</h2><p>Bring your community’s problem to the people, institutions and partners who can make an impact.</p></div><Link to={user ? '/post-problem' : '/register'} className="btn btn-primary">Post a Challenge <ArrowRight size={16} /></Link></section></main>;
}
