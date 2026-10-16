import React from 'react';
import { ArrowUpRight, ArrowRight, Users } from 'lucide-react';
import heroImage from '../assets/Member-benefits.jpg';
import '../csscomponents/MemberBenefitsPage.css';

// Custom vector icons tailored to match the Zenve brand aesthetic
const GlobeIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const PeersIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const KnowledgeIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
    <path d="M2 13h20" />
  </svg>
);

const VoiceIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <polygon points="16 10 22 6 22 18 16 14" />
  </svg>
);

const FutureIdeasIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const RoomToGrowIcon = ({ size = 26, color = '#B38F00' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M12 11v10" />
    <path d="M8 21h8" />
    <path d="M6 16c2-1 4-1 6 0" />
    <path d="M12 16c2-1 4-1 6 0" />
  </svg>
);

export const MemberBenefitsPage = ({ onOpenCreateProfile }) => {
  const benefitsList = [
    {
      id: 'page',
      icon: <GlobeIcon />,
      title: 'A page that is entirely you',
      description:
        'A shareable professional presence with your story, specialty, clinical journal and community contributions.',
    },
    {
      id: 'peers',
      icon: <PeersIcon />,
      title: 'Peers beyond your postcode',
      description:
        'Discover doctors across India, make connections and bring new perspectives into your practice.',
    },
    {
      id: 'knowledge',
      icon: <KnowledgeIcon />,
      title: 'Knowledge that travels',
      description:
        'Share de-identified cases, discuss clinical questions and learn through thoughtful conversations.',
    },
    {
      id: 'voice',
      icon: <VoiceIcon />,
      title: 'Your voice, in every format',
      description:
        'Publish photos, stories and short videos that bring your practice and ideas to life.',
    },
    {
      id: 'ideas',
      icon: <FutureIdeasIcon />,
      title: 'Ideas with a future',
      description:
        'Explore innovation scholarship, technology guidance and pilot pathways. Selection and support are subject to program criteria.',
    },
    {
      id: 'growth',
      icon: <RoomToGrowIcon />,
      title: 'Room to grow',
      description:
        'Discover potential mentorship, research collaboration and professional visibility through the Zenve community. Program opportunities are not guaranteed.',
    },
  ];

  return (
    <div className="zenve-benefits-container">
      {/* 1. Hero Banner: THE ZENVE ADVANTAGE */}
      <section
        className="zenve-Member-benefits"
        style={{
          backgroundImage: `linear-gradient(105deg,
           rgba(84, 19, 27, 0.80) 0%, 
           rgba(84, 19, 27, 0.68) 45%,
           rgba(84, 19, 27, 0.45) 75%, 
           rgba(84, 19, 27, 0.55) 100%),  
           url(${heroImage})`,
        }}
      >
        <div className="zenve-Member-benefits-content">
          <span className="zenve-benefits-eyebrow">THE ZENVE ADVANTAGE</span>

          <h1 className="zenve-Member-benefits-title">
            More than a network.
            <br />
            A place to become.
          </h1>

          <p className="zenve-Member-benefits-subtitle">
            Bring your expertise. Find your people.
            <br />
            Create what comes next for animal health.
          </p>

          <button
            type="button"
            className="zenve-Member-benefits-btn"
            onClick={onOpenCreateProfile}
          >
            <span>Create your free page</span>
            <ArrowUpRight size={18} className="zenve-benefits-btn-arrow" />
          </button>
        </div>
      </section>

      {/* 2. Middle Section: YOUR MEMBERSHIP, REIMAGINED */}
      <section className="zenve-benefits-header-section">
        <span className="zenve-benefits-gold-tag">YOUR MEMBERSHIP, REIMAGINED</span>
        <h2 className="zenve-benefits-main-title">
          Space for your work.
          <br />
          Support for your ambition.
        </h2>
        <p className="zenve-benefits-tagline">
          ₹0 membership · No login required
        </p>
      </section>

      {/* 3. 6 Benefits Grid with Icons */}
      <section className="zenve-benefits-grid" aria-label="Zenve Member Benefits">
        {benefitsList.map((item) => (
          <div key={item.id} className="zenve-benefit-card">
            <div className="zenve-benefit-icon-wrapper" aria-hidden="true">
              {item.icon}
            </div>
            <h3 className="zenve-benefit-card-title">{item.title}</h3>
            <p className="zenve-benefit-card-desc">{item.description}</p>
          </div>
        ))}
      </section>

      {/* 4. Bottom Centered Call to Action */}
      <section className="zenve-benefits-footer-cta">
        <h2 className="zenve-benefits-cta-heading">
          Your work deserves a wider world.
        </h2>
        <div className="zenve-benefits-cta-btn-wrapper">
          <button
            type="button"
            className="zenve-benefits-join-btn"
            onClick={onOpenCreateProfile}
          >
            <Users size={18} className="zenve-benefits-join-icon" />
            <span>Join the community</span>
            <ArrowRight size={16} className="zenve-benefits-join-arrow" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default MemberBenefitsPage;
