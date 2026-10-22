import React from 'react';
import {
  FeedIcon,
  VetNetworkIcon,
  ClinicalCasesIcon,
  ShortVideosIcon,
  MessagesIcon,
  SearchIcon,
  MemberBenefitsIcon,
  AdvertiseIcon,
} from './Icons';
import '../csscomponents/Sidebar.css';

export const Sidebar = ({ activeTab = 'feed', onSelectTab, onOpenCreateProfile }) => {
  const currentTab = activeTab;

  const navItems = [
    { id: 'feed', label: 'Feed', icon: FeedIcon },
    { id: 'network', label: 'Vet network', icon: VetNetworkIcon },
    { id: 'clinical', label: 'Clinical cases', icon: ClinicalCasesIcon },
    { id: 'videos', label: 'Short videos', icon: ShortVideosIcon },
    { id: 'messages', label: 'Messages', icon: MessagesIcon },
    { id: 'search', label: 'Search', icon: SearchIcon },
    { id: 'benefits', label: 'Member benefits', icon: MemberBenefitsIcon },
    { id: 'advertise', label: 'Advertise', icon: AdvertiseIcon },
  ];

  const handleItemClick = (id) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
  };

  return (
    <aside className="zenve-sidenav" aria-label="Main Navigation">
      {/* Top Header Group */}
      <div className="zenve-sidenav-header">
        <span className="zenve-sidenav-section-title">YOUR PROFESSIONAL WORLD</span>
        <h1 className="zenve-sidenav-headline">
          Great minds.
          <br />
          Healthier tomorrows.
        </h1>
      </div>

      {/* Main Navigation List */}
      <nav className="zenve-nav-list">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`zenve-nav-item ${isActive ? 'zenve-nav-item-active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="zenve-nav-icon">
                <IconComponent
                  size={20}
                  color="currentColor"
                />
              </span>
              <span className="zenve-nav-label">{item.label}</span>
              {isActive && <span className="zenve-active-pill" />}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <hr className="zenve-sidenav-divider" />

      {/* DISCOVER & GROW Category */}
      <div className="zenve-sidenav-discover-section">
        <span className="zenve-sidenav-section-title">DISCOVER &amp; GROW</span>

        <div className="zenve-discover-links">
          <a
            href="#innovation"
            className="zenve-discover-link-item"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick('benefits');
            }}
          >
            <span className="zenve-discover-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </span>
            <span className="zenve-discover-link-label">Innovation &amp; scholarships</span>
            <span className="zenve-discover-link-arrow">↗</span>
          </a>

          <a
            href="#mentorship"
            className="zenve-discover-link-item"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick('clinical');
            }}
          >
            <span className="zenve-discover-link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </span>
            <span className="zenve-discover-link-label">Expert mentorship</span>
            <span className="zenve-discover-link-arrow">↗</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
