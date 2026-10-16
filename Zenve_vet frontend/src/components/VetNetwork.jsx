import React, { useState, useMemo } from 'react';
import { VETERINARIANS } from '../data/veterinarians';
import VetCard from './VetCard';
import VetProfileModal from './VetProfileModal';
import { SearchIcon } from './Icons';
import '../csscomponents/VetNetwork.css';

export const VetNetwork = ({ customVets = [], onOpenCreateProfile }) => {
  // Active Tab: 'suggested' | 'connections' | 'following'
  const [activeTab, setActiveTab] = useState('suggested');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Optional category filter pill
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Welcome banner dismiss state
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Combine custom user-created veterinarians with mock VETERINARIANS
  const allVeterinarians = useMemo(() => {
    let saved = customVets;
    if (!saved || saved.length === 0) {
      try {
        const stored = localStorage.getItem('zenve_custom_vets');
        if (stored) saved = JSON.parse(stored);
      } catch {
        saved = [];
      }
    }
    // Retain only single active user profile (latest)
    const validSaved = Array.isArray(saved) && saved.length > 0 ? [saved[0]] : [];
    const combined = [...validSaved, ...VETERINARIANS];
    const seen = new Set();
    return combined.filter((doc) => {
      if (seen.has(doc.id)) return false;
      seen.add(doc.id);
      return true;
    });
  }, [customVets]);

  // Find the user's latest custom profile if any
  const latestCustomVet = useMemo(() => {
    return allVeterinarians.find((doc) => doc.isCurrentUser);
  }, [allVeterinarians]);

  // User connection and following action overrides
  const [connectionOverrides, setConnectionOverrides] = useState({});
  const [followingOverrides, setFollowingOverrides] = useState({});

  const getConnectionStatus = React.useCallback(
    (doc) => {
      if (!doc) return 'not_connected';
      if (connectionOverrides[doc.id] !== undefined) {
        return connectionOverrides[doc.id];
      }
      return doc.initialStatus || (doc.isCurrentUser ? 'not_connected' : 'not_connected');
    },
    [connectionOverrides]
  );

  const getIsFollowing = React.useCallback(
    (doc) => {
      if (!doc) return false;
      if (followingOverrides[doc.id] !== undefined) {
        return followingOverrides[doc.id];
      }
      return !!doc.initialFollowing;
    },
    [followingOverrides]
  );

  // Modal profile state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Available specialty filter tags
  const specialtyCategories = [
    { id: 'all', label: 'All Specialties' },
    { id: 'Surgery', label: 'Surgery' },
    { id: 'Dermatology', label: 'Dermatology' },
    { id: 'Cardiology', label: 'Cardiology' },
    { id: 'Equine', label: 'Equine' },
    { id: 'Rehabilitation', label: 'Rehabilitation' },
    { id: 'Medicine', label: 'Medicine' },
    { id: 'Exotics', label: 'Avian & Exotic' },
  ];

  // Handler: Toggle connect status (Connect -> Pending -> Connected -> not_connected)
  const handleConnectClick = (id) => {
    setConnectionOverrides((prev) => {
      const doc = allVeterinarians.find((d) => d.id === id);
      const current =
        prev[id] !== undefined
          ? prev[id]
          : doc
          ? doc.initialStatus || 'not_connected'
          : 'not_connected';

      let next;
      if (current === 'not_connected') {
        next = 'pending';
      } else if (current === 'pending') {
        next = 'connected';
      } else {
        next = 'not_connected';
      }
      return { ...prev, [id]: next };
    });
  };

  // Handler: Toggle follow status
  const handleToggleFollow = (id) => {
    setFollowingOverrides((prev) => {
      const doc = allVeterinarians.find((d) => d.id === id);
      const current =
        prev[id] !== undefined
          ? prev[id]
          : !!(doc && doc.initialFollowing);
      return { ...prev, [id]: !current };
    });
  };

  // Handler: Open Doctor Profile modal
  const handleOpenProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // Compute counts for tab badges & hero stat boxes
  const counts = useMemo(() => {
    // Only verified specialists from the directory (excluding unverified user profile)
    const verified = allVeterinarians.filter(
      (d) => d.isVerified && !d.isCurrentUser
    ).length;
    const suggested = allVeterinarians.filter(
      (d) => d.isCurrentUser || getConnectionStatus(d) !== 'connected'
    ).length;
    const connections = allVeterinarians.filter(
      (d) => !d.isCurrentUser && getConnectionStatus(d) === 'connected'
    ).length;
    const following = allVeterinarians.filter(
      (d) => !d.isCurrentUser && getIsFollowing(d)
    ).length;
    return { verified, suggested, connections, following };
  }, [allVeterinarians, getConnectionStatus, getIsFollowing]);

  // Filter veterinarians based on activeTab, category, and search query
  const filteredDoctors = useMemo(() => {
    // 1. Tab filtering
    let baseList = [];
    if (activeTab === 'suggested') {
      baseList = allVeterinarians.filter(
        (doc) => doc.isCurrentUser || getConnectionStatus(doc) !== 'connected' || doc.initialStatus === 'not_connected'
      );
    } else if (activeTab === 'connections') {
      baseList = allVeterinarians.filter(
        (doc) => !doc.isCurrentUser && getConnectionStatus(doc) === 'connected'
      );
    } else if (activeTab === 'following') {
      baseList = allVeterinarians.filter(
        (doc) => !doc.isCurrentUser && getIsFollowing(doc)
      );
    }

    // 2. Specialty Category filtering
    if (selectedCategory !== 'all') {
      baseList = baseList.filter(
        (doc) =>
          doc.specialtyCategory === selectedCategory ||
          (doc.specialty && doc.specialty.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // 3. Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      baseList = baseList.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.location.toLowerCase().includes(q) ||
          doc.clinic.toLowerCase().includes(q) ||
          (doc.description && doc.description.toLowerCase().includes(q)) ||
          (doc.about && doc.about.toLowerCase().includes(q)) ||
          (doc.focusAreas && doc.focusAreas.some((fa) => fa.toLowerCase().includes(q)))
      );
    }

    return baseList;
  }, [allVeterinarians, activeTab, selectedCategory, searchQuery, getConnectionStatus, getIsFollowing]);

  return (
    <div className="zenve-network-page">
      {/* 1. Header & Hero Banner */}
      <section className="zenve-network-hero">
        <div className="zenve-network-hero-left">
          <span className="zenve-network-hero-tag">PEER-TO-PEER DIRECTORY</span>
          <h1 className="zenve-network-title">Vet Network</h1>
          <p className="zenve-network-desc">
            Connect with verified veterinary specialists, surgeons, and clinicians across the community. Expand your clinical circle, collaborate on challenging cases, and move veterinary healthcare forward.
          </p>
        </div>

        <div className="zenve-network-hero-stats">
          <div className="zenve-network-stat-box">
            <span className="zenve-network-stat-number">{counts.verified}</span>
            <span className="zenve-network-stat-label">Verified Specialists</span>
          </div>
          <div className="zenve-network-stat-box">
            <span className="zenve-network-stat-number">{counts.connections}</span>
            <span className="zenve-network-stat-label">Your Connections</span>
          </div>
          <div className="zenve-network-stat-box">
            <span className="zenve-network-stat-number">{counts.following}</span>
            <span className="zenve-network-stat-label">Following</span>
          </div>
        </div>
      </section>

      {/* Newly Published Profile Alert Banner */}
      {latestCustomVet && showWelcomeBanner && (
        <div className="zenve-network-welcome-banner">
          <div className="zenve-network-welcome-left">
            <span className="zenve-network-welcome-badge">✦ YOUR PAGE IS LIVE</span>
            <h3 className="zenve-network-welcome-title">
              Welcome to the Vet Network, {latestCustomVet.name}!
            </h3>
            <p className="zenve-network-welcome-desc">
              Your professional page is active with specialty <strong>{latestCustomVet.specialty}</strong> in <strong>{latestCustomVet.location}</strong> at <strong>{latestCustomVet.clinic}</strong>. Your profile card is displayed below.
            </p>
          </div>
          <div className="zenve-network-welcome-actions">
            <button
              type="button"
              className="zenve-network-welcome-btn"
              onClick={() => handleOpenProfile(latestCustomVet)}
            >
              <span>View My Profile</span>
              <span>↗</span>
            </button>
            <button
              type="button"
              className="zenve-network-welcome-close"
              onClick={() => setShowWelcomeBanner(false)}
              aria-label="Dismiss notice"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Search & Controls Bar */}
      <div className="zenve-network-search-card">
        <div className="zenve-network-search-input-wrap">
          <span className="zenve-network-search-icon">
            <SearchIcon size={18} color="#798680" />
          </span>
          <input
            type="text"
            className="zenve-network-search-input"
            placeholder="Search veterinarians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search veterinarians"
          />
          {searchQuery && (
            <button
              type="button"
              className="zenve-network-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {onOpenCreateProfile && (
          <button
            type="button"
            className="zenve-network-join-btn"
            onClick={onOpenCreateProfile}
          >
            <span>+ Join Network</span>
          </button>
        )}
      </div>

      {/* 3. Navigation Tabs Bar */}
      <div className="zenve-network-tabs-bar">
        <div className="zenve-network-tabs-list" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'suggested'}
            className={`zenve-network-tab ${activeTab === 'suggested' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveTab('suggested')}
          >
            <span>Suggested</span>
            <span className="zenve-network-tab-badge">{counts.suggested}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'connections'}
            className={`zenve-network-tab ${activeTab === 'connections' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            <span>Connections</span>
            <span className="zenve-network-tab-badge">{counts.connections}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'following'}
            className={`zenve-network-tab ${activeTab === 'following' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <span>Following</span>
            <span className="zenve-network-tab-badge">{counts.following}</span>
          </button>
        </div>

        <div className="zenve-network-count-summary">
          <span className="zenve-network-dot" />
          <span className="zenve-network-count-text">
            Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          </span>
        </div>
      </div>

      {/* 4. Specialty Category Filter Pills */}
      <div className="zenve-network-filters-row">
        <span className="zenve-network-filter-label">Filter:</span>
        <div className="zenve-network-pills-scroll">
          {specialtyCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`zenve-network-pill ${
                selectedCategory === cat.id ? 'zenve-network-pill-active' : ''
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Veterinarian Cards Grid */}
      <section className="zenve-network-grid" aria-label="Veterinarians list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <VetCard
              key={doctor.id}
              doctor={doctor}
              connectionStatus={getConnectionStatus(doctor)}
              onConnectClick={handleConnectClick}
              onViewProfile={handleOpenProfile}
              isFollowing={getIsFollowing(doctor)}
              onToggleFollow={handleToggleFollow}
            />
          ))
        ) : (
          <div className="zenve-network-empty-state">
            <div className="zenve-network-empty-icon">🩺</div>
            <h3 className="zenve-network-empty-title">
              {searchQuery
                ? `No veterinarians found matching "${searchQuery}"`
                : activeTab === 'connections'
                ? 'No connected veterinarians yet'
                : activeTab === 'following'
                ? 'Not following any veterinarians yet'
                : 'No veterinarians found'}
            </h3>
            <p className="zenve-network-empty-desc">
              {searchQuery
                ? 'Try checking for typos or searching by specialty (e.g. Surgery, Dermatology) or city (e.g. Mumbai, Bengaluru).'
                : activeTab === 'connections'
                ? 'Connect with doctors in the Suggested tab to build your collaborative peer network.'
                : activeTab === 'following'
                ? 'Star doctors in Suggested to follow their clinical cases and community updates.'
                : 'Check back soon as new practitioners join Zenvevet.'}
            </p>
            {searchQuery ? (
              <button
                type="button"
                className="zenve-network-reset-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Search &amp; Filters
              </button>
            ) : activeTab !== 'suggested' ? (
              <button
                type="button"
                className="zenve-network-reset-btn"
                onClick={() => setActiveTab('suggested')}
              >
                Explore Suggested Doctors
              </button>
            ) : null}
          </div>
        )}
      </section>

      {/* 6. Veterinarian Profile Details Modal */}
      {selectedDoctor && (
        <VetProfileModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDoctor(null);
          }}
          connectionStatus={getConnectionStatus(selectedDoctor)}
          onToggleConnect={handleConnectClick}
          isFollowing={getIsFollowing(selectedDoctor)}
          onToggleFollow={handleToggleFollow}
        />
      )}
    </div>
  );
};

export default VetNetwork;
