import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Users,
  X,
  Lock,
  CheckCircle2,
} from 'lucide-react';

import heroImage from '../assets/Member-benefits-dark.jpg';
import heroImageDark from '../assets/Member-benefits-dark.jpg';
import { useTheme } from '../context/ThemeContext';
import CreateProfileModal from './CreateProfileModal';
import VetProfileModal from './VetProfileModal';
import '../csscomponents/MemberBenefitsPage.css';

// Custom vector icons tailored to match the Zenve brand aesthetic
const GlobeIcon = ({ size = 26, color = 'currentColor' }) => (
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

const PeersIcon = ({ size = 26, color = 'currentColor' }) => (
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

const KnowledgeIcon = ({ size = 26, color = 'currentColor' }) => (
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

const VoiceIcon = ({ size = 26, color = 'currentColor' }) => (
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

const FutureIdeasIcon = ({ size = 26, color = 'currentColor' }) => (
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

const RoomToGrowIcon = ({ size = 26, color = 'currentColor' }) => (
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

export const MemberBenefitsPage = ({
  onOpenCreateProfile,
  onSelectTab,
  onNavigateToFeed,
  onNavigateToNetwork,
  onNavigateToMessages,
  onOpenLogin,
  isLoggedIn: propIsLoggedIn,
  user: propUser,
}) => {
  const themeContext = useTheme();
  const isDark = Boolean(themeContext?.isDark);

  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const [token, setToken] = useState(() => {
    try {
      return typeof window !== 'undefined'
        ? localStorage.getItem('zenve_token')
        : null;
    } catch {
      return null;
    }
  });

  const [storedUser, setStoredUser] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const user = localStorage.getItem('zenve_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const [storedProfile, setStoredProfile] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;

      const stored = localStorage.getItem('zenve_custom_vets');

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }

      return null;
    } catch {
      return null;
    }
  });

  // Sync state when localStorage changes or the window regains focus.
  useEffect(() => {
    const syncState = () => {
      try {
        if (typeof window === 'undefined') return;

        setToken(localStorage.getItem('zenve_token'));

        const user = localStorage.getItem('zenve_user');
        setStoredUser(user ? JSON.parse(user) : null);

        const vets = localStorage.getItem('zenve_custom_vets');

        if (vets) {
          const parsed = JSON.parse(vets);

          if (Array.isArray(parsed) && parsed.length > 0) {
            setStoredProfile(parsed[0]);
          } else {
            setStoredProfile(null);
          }
        } else {
          setStoredProfile(null);
        }
      } catch (error) {
        console.warn('Storage sync issue:', error);
      }
    };

    window.addEventListener('storage', syncState);
    window.addEventListener('focus', syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('focus', syncState);
    };
  }, []);

  // Close the login prompt when Escape is pressed.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isLoginPromptOpen) {
        setIsLoginPromptOpen(false);
      }
    };

    if (isLoginPromptOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoginPromptOpen]);

  // Check whether the user has already created a profile.
  const checkHasProfile = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const vets = localStorage.getItem('zenve_custom_vets');

        if (vets) {
          const parsed = JSON.parse(vets);

          if (Array.isArray(parsed) && parsed.length > 0) {
            return true;
          }
        }

        const user = localStorage.getItem('zenve_user');

        if (user) {
          const parsedUser = JSON.parse(user);

          if (
            parsedUser &&
            (parsedUser.profileCreated ||
              parsedUser.name ||
              parsedUser.fullName ||
              parsedUser.doctor)
          ) {
            return true;
          }
        }
      }

      if (storedProfile) return true;

      if (
        propUser &&
        (propUser.name ||
          propUser.fullName ||
          propUser.specialty ||
          propUser.doctor)
      ) {
        return true;
      }

      return false;
    } catch {
      return Boolean(storedProfile);
    }
  }, [storedProfile, propUser]);

  const hasCreatedProfile = Boolean(storedProfile || checkHasProfile());

  const isLoggedIn = Boolean(
    propIsLoggedIn !== undefined
      ? propIsLoggedIn
      : propUser ||
      (token && token.trim() !== '') ||
      storedUser ||
      storedProfile ||
      hasCreatedProfile
  );

  const activeProfile = storedProfile;

  const openProfileCreationForm = useCallback(() => {
    if (typeof onOpenCreateProfile === 'function') {
      onOpenCreateProfile();
    } else {
      setIsCreateProfileOpen(true);
    }
  }, [onOpenCreateProfile]);

  // Navigate to the user's existing professional profile.
  const navigateToProfile = useCallback(() => {
    if (typeof onNavigateToNetwork === 'function') {
      onNavigateToNetwork();
      return;
    }

    if (typeof onSelectTab === 'function') {
      onSelectTab('network');
      return;
    }

    const navButtons = document.querySelectorAll(
      '.zenve-nav-item, .zenve-sidenav button, aside button, nav button'
    );

    for (const button of navButtons) {
      const text = button.textContent?.toLowerCase() || '';

      if (text.includes('vet network') || text.includes('network')) {
        button.click();
        return;
      }
    }

    if (activeProfile) {
      setIsViewProfileOpen(true);
      return;
    }

    window.dispatchEvent(
      new CustomEvent('zenve:switch-tab', { detail: 'network' })
    );
  }, [onNavigateToNetwork, onSelectTab, activeProfile]);

  const navigateToMessages = useCallback(() => {
    if (typeof onNavigateToMessages === 'function') {
      onNavigateToMessages();
      return;
    }

    if (typeof onSelectTab === 'function') {
      onSelectTab('messages');
      return;
    }

    const navButtons = document.querySelectorAll(
      '.zenve-nav-item, .zenve-sidenav button, aside button, nav button'
    );

    for (const button of navButtons) {
      const text = button.textContent?.toLowerCase().trim() || '';

      if (text.includes('messages') || text.includes('message')) {
        button.click();
        return;
      }
    }

    window.dispatchEvent(
      new CustomEvent('zenve:switch-tab', { detail: 'messages' })
    );
  }, [onNavigateToMessages, onSelectTab]);

  const navigateToCommunity = useCallback(() => {
    if (typeof onNavigateToFeed === 'function') {
      onNavigateToFeed();
      return;
    }

    if (typeof onSelectTab === 'function') {
      onSelectTab('feed');
      return;
    }

    const navButtons = document.querySelectorAll(
      '.zenve-nav-item, .zenve-sidenav button, aside button, nav button'
    );

    for (const button of navButtons) {
      const text = button.textContent?.toLowerCase() || '';

      if (text.includes('feed')) {
        button.click();
        return;
      }
    }

    for (const button of navButtons) {
      const text = button.textContent?.toLowerCase() || '';

      if (text.includes('vet network') || text.includes('network')) {
        button.click();
        return;
      }
    }

    window.dispatchEvent(
      new CustomEvent('zenve:switch-tab', { detail: 'feed' })
    );
  }, [onNavigateToFeed, onSelectTab]);

  const handleCreateProfileClick = () => {
    if (checkHasProfile()) {
      navigateToProfile();
    } else {
      openProfileCreationForm();
    }
  };

  const handleJoinCommunityClick = () => {
    if (checkHasProfile()) {
      navigateToMessages();
    } else {
      openProfileCreationForm();
    }
  };

  const handleProfileCreated = (newDoctor) => {
    const updated = [newDoctor];

    setStoredProfile(newDoctor);

    try {
      localStorage.setItem(
        'zenve_custom_vets',
        JSON.stringify(updated)
      );

      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    setIsCreateProfileOpen(false);
  };

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
    <div className={`zenve-benefits-container ${isDark ? 'zenve-dark-theme' : ''}`}>
      <section
        className={`zenve-Member-benefits ${isDark ? 'zenve-dark-hero' : ''}`}
        style={{
          '--hero-image': `url(${heroImage})`,
          '--hero-image-dark': `url(${heroImageDark})`,
        }}
      >
        <div className="zenve-Member-benefits-bg" aria-hidden="true" />
        <div className="zenve-Member-benefits-content">
          <span className="zenve-benefits-eyebrow">
            THE ZENVE ADVANTAGE
          </span>

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
            onClick={handleCreateProfileClick}
            aria-label="Create Your Free Profile"
          >
            <span>Create Your Free Profile</span>
            <ArrowUpRight
              size={18}
              className="zenve-benefits-btn-arrow"
            />
          </button>
        </div>
      </section>

      <section className="zenve-benefits-header-section">
        <span className="zenve-benefits-gold-tag">
          YOUR MEMBERSHIP, REIMAGINED
        </span>

        <h2 className="zenve-benefits-main-title">
          Space for your work.
          <br />
          Support for your ambition.
        </h2>

        <p className="zenve-benefits-tagline">
          ₹0 membership · No login required
        </p>
      </section>

      <section
        className="zenve-benefits-grid"
        aria-label="Zenve Member Benefits"
      >
        {benefitsList.map((item) => (
          <div key={item.id} className="zenve-benefit-card">
            <div
              className="zenve-benefit-icon-wrapper"
              aria-hidden="true"
            >
              {item.icon}
            </div>

            <h3 className="zenve-benefit-card-title">
              {item.title}
            </h3>

            <p className="zenve-benefit-card-desc">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="zenve-benefits-footer-cta">
        <h2 className="zenve-benefits-cta-heading">
          Your work deserves a wider world.
        </h2>

        <div className="zenve-benefits-cta-btn-wrapper">
          <button
            type="button"
            className="zenve-benefits-join-btn"
            onClick={handleJoinCommunityClick}
            aria-label="Join the Community"
          >
            <Users
              size={18}
              className="zenve-benefits-join-icon"
            />
            <span>Join the Community</span>
            <ArrowRight
              size={16}
              className="zenve-benefits-join-arrow"
            />
          </button>
        </div>
      </section>

      {/* Profile creation modal */}
      <CreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        onProfileCreated={handleProfileCreated}
      />

      {/* Existing professional profile modal */}
      {isViewProfileOpen && activeProfile && (
        <VetProfileModal
          doctor={activeProfile}
          isOpen={isViewProfileOpen}
          onClose={() => setIsViewProfileOpen(false)}
          connectionStatus="not_connected"
          isFollowing={false}
        />
      )}

      {/* Login prompt modal */}
      {isLoginPromptOpen && (
        <div
          className="zenve-modal-overlay zenve-benefits-modal-overlay"
          onClick={() => setIsLoginPromptOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Join the Community - Sign In"
        >
          <div
            className="zenve-login-prompt-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="zenve-modal-close zenve-login-modal-close"
              onClick={() => setIsLoginPromptOpen(false)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="zenve-login-prompt-header">
              <div className="zenve-login-prompt-badge">
                <Lock size={13} />
                <span>MEMBER ACCESS</span>
              </div>

              <h2 className="zenve-login-prompt-title">
                Join the Community
              </h2>

              <p className="zenve-login-prompt-subtitle">
                Connect with verified veterinary specialists, discuss
                clinical cases, and collaborate across India.
              </p>
            </div>

            <div className="zenve-login-prompt-body">
              <div className="zenve-login-prompt-notice">
                <p>
                  Please sign in with your verified practitioner account
                  to participate in community discussions, connect with
                  colleagues, and publish clinical observations.
                </p>
              </div>

              <div className="zenve-login-prompt-features">
                <div className="zenve-login-feature-item">
                  <CheckCircle2
                    size={16}
                    className="zenve-login-feature-check"
                  />
                  <span>
                    Peer-to-peer discussions on challenging diagnostics
                    &amp; surgeries
                  </span>
                </div>

                <div className="zenve-login-feature-item">
                  <CheckCircle2
                    size={16}
                    className="zenve-login-feature-check"
                  />
                  <span>
                    Verified professional badge across the Zenve network
                  </span>
                </div>

                <div className="zenve-login-feature-item">
                  <CheckCircle2
                    size={16}
                    className="zenve-login-feature-check"
                  />
                  <span>
                    Personal public veterinary page to share your
                    clinical story
                  </span>
                </div>
              </div>

              <div className="zenve-login-prompt-actions">
                <button
                  type="button"
                  className="zenve-login-prompt-btn-primary"
                  onClick={() => {
                    setIsLoginPromptOpen(false);
                    openProfileCreationForm();
                  }}
                >
                  <span>Sign In / Create Profile</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="zenve-login-prompt-btn-secondary"
                  onClick={() => setIsLoginPromptOpen(false)}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberBenefitsPage;