import React, { useState } from 'react';
import '../csscomponents/RightSidebar.css';

export const RightSidebar = ({ onOpenCreateProfile }) => {
  const [followingMap, setFollowingMap] = useState({});

  const doctors = [
    {
      id: 'arun',
      name: 'Dr. Arun Mehta',
      specialty: 'Veterinary Surgery',
      location: 'Mumbai',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      id: 'priya',
      name: 'Dr. Priya Nair',
      specialty: 'Veterinary Dermatology',
      location: 'Kochi',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      id: 'vikram',
      name: 'Dr. Vikram Singh',
      specialty: 'Equine Medicine',
      location: 'Jaipur',
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ];

  const advantages = [
    {
      id: 'page',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C49338" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: 'Your own professional page',
      description: 'A place for your work, your voice, your professional identity.',
    },
    {
      id: 'network',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C49338" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <circle cx="18" cy="11" r="3" />
          <path d="M18 17a3 3 0 0 1 3 3v1" />
        </svg>
      ),
      title: 'Meaningful connections',
      description: 'Discover peers beyond your clinic and your city.',
    },
    {
      id: 'growth',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C49338" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
      title: 'Grow with possibility',
      description: 'Mentorship, research and innovation pathways.',
    },
  ];

  const toggleFollow = (id) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="zenve-right-sidebar" aria-label="People to know and advantages">
      {/* 1. People to Know */}
      <section className="zenve-aside-block">
        <div className="zenve-aside-header">
          <span className="zenve-aside-tag">PEOPLE TO KNOW</span>
          <a href="#view-all" className="zenve-aside-link">
            <span>View all</span>
            <span className="zenve-aside-link-arrow">↗</span>
          </a>
        </div>

        <div className="zenve-doctor-list">
          {doctors.map((doctor) => {
            const isFollowing = !!followingMap[doctor.id];
            return (
              <div key={doctor.id} className="zenve-doctor-card">
                <div className="zenve-doctor-avatar-wrapper">
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="zenve-doctor-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <div className="zenve-doctor-info">
                  <h3 className="zenve-doctor-name">{doctor.name}</h3>
                  <p className="zenve-doctor-specialty">{doctor.specialty}</p>
                  <span className="zenve-doctor-location">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{doctor.location}</span>
                  </span>
                </div>

                <button
                  type="button"
                  className={`zenve-doctor-follow-btn ${isFollowing ? 'zenve-doctor-following' : ''}`}
                  onClick={() => toggleFollow(doctor.id)}
                  title={isFollowing ? 'Following' : 'Connect'}
                >
                  {isFollowing ? '✓' : '+'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. The Zenve Advantage */}
      <section className="zenve-aside-block zenve-advantage-block">
        <div className="zenve-aside-header">
          <span className="zenve-aside-tag">THE ZENVE ADVANTAGE</span>
          <span className="zenve-advantage-sparkle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25352D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
          </span>
        </div>

        <div className="zenve-advantage-list">
          {advantages.map((item) => (
            <div
              key={item.id}
              className="zenve-advantage-card"
              onClick={onOpenCreateProfile}
              role="button"
              tabIndex={0}
            >
              <div className="zenve-advantage-icon-box">
                {item.icon}
              </div>
              <div className="zenve-advantage-text">
                <h4 className="zenve-advantage-title">{item.title}</h4>
                <p className="zenve-advantage-desc">{item.description}</p>
              </div>
              <div className="zenve-advantage-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9EA7A2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
