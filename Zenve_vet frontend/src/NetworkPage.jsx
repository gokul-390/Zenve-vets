import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  getAllProfiles,
  getFollowMap,
  toggleFollow as toggleFollowStore,
} from '../data/profilesData';
import { getDoctorImage, getDoctorFallbackImage } from '../utils/doctorImages.js';
import { useTheme } from '../context/ThemeContext';
import VetNetworkProfileModal from './components/VetNetworkProfileModal';
import { SearchIcon, PlusIcon } from './Icons';
import '../csscomponents/NetworkPage.css';

const CITY_OPTIONS = [
  'All Cities',
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Delhi',
  'Kochi',
  'Jaipur',
  'Hyderabad',
  'Chennai',
  'Chandigarh',
  'Ahmedabad',
  'Pune',
  'Guwahati',
  'Kolkata',
  'Surat',
  'Dehradun',
  'Nagpur',
  'Kozhikode',
];

const NAV_TAB_LABELS = {
  all: 'All Specialists',
  'small-animal': 'Small Animal Medicine',
  surgery: 'Veterinary Surgery',
  dermatology: 'Dermatology',
  equine: 'Equine & Livestock',
  imaging: 'Diagnostic Imaging',
  following: 'Following',
};

// Robust helper to extract and format user-created veterinarian profiles
function getUserCreatedProfiles(customVetsProp = []) {
  const list = [];
  const seenIds = new Set();

  const addDoctor = (doc) => {
    if (!doc || typeof doc !== 'object') return;
    const name = doc.name || doc.fullName || 'Dr. Professional';
    const id = doc.id || `user_${name.replace(/\s+/g, '_').toLowerCase()}`;
    if (seenIds.has(id)) return;
    seenIds.add(id);

    const city = doc.city || (doc.location || '').split(',')[0].trim() || 'India';
    const initials =
      doc.initials ||
      name
        .replace(/^Dr\.?\s*/i, '')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'DR';

    list.push({
      ...doc,
      id,
      name,
      city,
      location: doc.location || doc.cityState || `${city}, India`,
      clinic: doc.clinic || doc.workingPlace || 'Independent Clinical Practice',
      specialty: doc.specialty || 'Veterinary Practitioner',
      initials,
      color: doc.color || '#1A3A2A',
      img: getDoctorImage(doc),
      verified: true,
      isCurrentUser: true,
      isVerified: true,
    });
  };

  if (Array.isArray(customVetsProp)) {
    customVetsProp.forEach(addDoctor);
  }

  try {
    const v1 = localStorage.getItem('zenve_custom_vets');
    if (v1) {
      const p1 = JSON.parse(v1);
      if (Array.isArray(p1)) p1.forEach(addDoctor);
    }
  } catch {}

  try {
    const v2 = localStorage.getItem('zenve_custom_profiles');
    if (v2) {
      const p2 = JSON.parse(v2);
      if (Array.isArray(p2)) p2.forEach(addDoctor);
    }
  } catch {}

  return list;
}

export const NetworkPage = ({ onOpenCreateProfile, customVets = [] }) => {
  const themeContext = useTheme();
  const isDark = Boolean(themeContext?.isDark);
  const toggleTheme = themeContext?.toggleTheme;

  // Construct combined profiles with user-created profiles guaranteed at index 0
  const buildProfiles = useCallback(() => {
    const userVets = getUserCreatedProfiles(customVets);
    const communityProfiles = getAllProfiles();
    const userIds = new Set(userVets.map((u) => u.id));
    const filteredCommunity = communityProfiles.filter((p) => !userIds.has(p.id));
    return [...userVets, ...filteredCommunity];
  }, [customVets]);

  const [profiles, setProfiles] = useState(() => buildProfiles());
  const [followingMap, setFollowingMap] = useState(() => getFollowMap());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Single category navigation tab state
  const [activeNavTab, setActiveNavTab] = useState('all');

  // Search & City filter states (duplicate specialty pills removed)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Refresh profiles whenever customVets prop updates
  useEffect(() => {
    setProfiles(buildProfiles());
  }, [buildProfiles]);

  // Sync across tabs/storage events when a user creates or updates a profile
  useEffect(() => {
    const handleUpdate = () => {
      setProfiles(buildProfiles());
    };
    const handleFollowUpdate = (e) => {
      if (e.detail) {
        setFollowingMap((prev) => ({
          ...prev,
          [e.detail.doctorId]: e.detail.isFollowing,
        }));
      } else {
        setFollowingMap(getFollowMap());
      }
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('zenve_profiles_updated', handleUpdate);
    window.addEventListener('zenve_custom_vet_added', handleUpdate);
    window.addEventListener('zenve_follow_updated', handleFollowUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('zenve_profiles_updated', handleUpdate);
      window.removeEventListener('zenve_custom_vet_added', handleUpdate);
      window.removeEventListener('zenve_follow_updated', handleFollowUpdate);
    };
  }, [buildProfiles]);

  const handleToggleFollow = (doctorId) => {
    const newState = toggleFollowStore(doctorId);
    setFollowingMap((prev) => ({ ...prev, [doctorId]: newState }));
  };

  const handleOpenDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseDoctorModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  // Filtered profiles list (unified under activeNavTab, searchQuery, and selectedCity)
  const filteredProfiles = useMemo(() => {
    return profiles.filter((doc) => {
      // 1. Navigation Tab filter (Single category filter bar)
      if (activeNavTab === 'small-animal') {
        const spec = (doc.specialty || '').toLowerCase();
        if (!spec.includes('small animal') && !spec.includes('companion') && !spec.includes('pediatric')) {
          return false;
        }
      }
      if (activeNavTab === 'surgery') {
        const spec = (doc.specialty || '').toLowerCase();
        if (!spec.includes('surgery') && !spec.includes('orthopedic')) {
          return false;
        }
      }
      if (activeNavTab === 'dermatology') {
        const spec = (doc.specialty || '').toLowerCase();
        if (!spec.includes('dermatology') && !spec.includes('skin')) {
          return false;
        }
      }
      if (activeNavTab === 'equine') {
        const spec = (doc.specialty || '').toLowerCase();
        if (!spec.includes('equine') && !spec.includes('livestock') && !spec.includes('wildlife')) {
          return false;
        }
      }
      if (activeNavTab === 'imaging') {
        const spec = (doc.specialty || '').toLowerCase();
        if (!spec.includes('imaging') && !spec.includes('ultrasound') && !spec.includes('critical') && !spec.includes('emergency')) {
          return false;
        }
      }
      if (activeNavTab === 'following' && !followingMap[doc.id]) {
        return false;
      }

      // 2. Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const combined = `${doc.name} ${doc.specialty} ${doc.city} ${doc.location || ''} ${doc.clinic || ''} ${(doc.focusAreas || []).join(' ')}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }

      // 3. City match
      if (selectedCity !== 'All Cities') {
        const docCity = (doc.city || '').toLowerCase();
        const target = selectedCity.toLowerCase();
        if (!docCity.includes(target) && !(doc.location || '').toLowerCase().includes(target)) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, activeNavTab, searchQuery, selectedCity, followingMap]);

  const hasUserProfile = useMemo(() => {
    return profiles.some((p) => p.isCurrentUser);
  }, [profiles]);

  const activeFilterCount =
    (activeNavTab !== 'all' ? 1 : 0) +
    (selectedCity !== 'All Cities' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setActiveNavTab('all');
    setSearchQuery('');
    setSelectedCity('All Cities');
  };

  return (
    <div
      className={`zenve-network-page ${isDark ? 'zenve-network-page--dark' : 'zenve-network-page--light'}`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      {/* 1. Network Page Hero Card */}
      <section className="zenve-network-hero">
        <div className="zenve-network-hero-left">
          <span className="zenve-network-hero-tag">THE ZENVE VET COMMUNITY</span>
          <h1 className="zenve-network-hero-title">A world of care. Connected.</h1>
          <p className="zenve-network-hero-desc">
            Meet your peers. Share your practice. Move veterinary care forward.
          </p>
          <button
            type="button"
            className="zenve-network-hero-cta"
            onClick={onOpenCreateProfile}
          >
            <span>Make your mark</span>
            <span className="zenve-cta-arrow">↗</span>
          </button>
        </div>

        <div className="zenve-network-hero-right">
          <div className="zenve-stethoscope-card">
            <div className="svgimg">
              <svg
                viewBox="0 0 100 85"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M24,12a4,4,0,0,0-1,7.86V22a6,6,0,0,1-6,6,6,6,0,0,1-6-6V19h1l1-1V16.41A8,8,0,0,0,18,9V4L17,3H14V5h2V9a6,6,0,0,1-6,6,5.81,5.81,0,0,1-.86-.06A6,6,0,0,1,4,9V5H6V3H3L2,4V9a8.06,8.06,0,0,0,5,7.41V18l1,1H9v3a8,8,0,0,0,16,0V19.86A4,4,0,0,0,24,12Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,24,18Z" />
              </svg>
            </div>
            <span className="zenve-hero-sublabel">BETTER TOGETHER</span>
          </div>
        </div>
      </section>

      {/* 2. Professional Category Navigation Bar (Single Unified Filter) */}
      <div className="zenve-network-tabs-bar">
        <div className="zenve-network-tabs-left">
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'all' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('all')}
          >
            All Specialists
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'small-animal' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('small-animal')}
          >
            Small Animal Medicine
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'surgery' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('surgery')}
          >
            Veterinary Surgery
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'dermatology' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('dermatology')}
          >
            Dermatology
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'equine' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('equine')}
          >
            Equine &amp; Livestock
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'imaging' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('imaging')}
          >
            Diagnostic Imaging
          </button>
          <button
            type="button"
            className={`zenve-network-tab-btn ${activeNavTab === 'following' ? 'zenve-network-tab-active' : ''}`}
            onClick={() => setActiveNavTab('following')}
          >
            Following
          </button>
        </div>

        <div className="zenve-network-tabs-right">
          {toggleTheme && (
            <button
              type="button"
              className={`zenve-network-theme-toggle ${isDark ? 'zenve-network-theme-toggle--dark' : 'zenve-network-theme-toggle--light'}`}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="zenve-network-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
              <span className="zenve-network-toggle-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          )}
          <span className="zenve-community-feed-dot" />
          <span className="zenve-community-feed-label">Live Vet Network</span>
        </div>
      </div>

      {/* 3. Search & Location Filter Controls */}
      <section className="zenve-network-filter-section">
        <div className="zenve-network-search-row">
          {/* Search Box */}
          <div className="zenve-network-search-box">
            <span className="zenve-network-search-icon">
              <SearchIcon size={18} color="#7D8983" />
            </span>
            <input
              type="text"
              className="zenve-network-search-input"
              placeholder="Search doctors by name, specialty, clinic, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* City / State Dropdown */}
          <div className="zenve-network-select-wrapper">
            <svg
              className="zenve-network-select-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#67786f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <select
              className="zenve-network-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Create profile button */}
          <button
            type="button"
            className="zenve-network-cta-btn"
            onClick={onOpenCreateProfile}
          >
            <PlusIcon size={15} color="#ffffff" />
            <span>Create profile</span>
          </button>
        </div>

        {/* Results summary bar with live profile confirmation */}
        <div className="zenve-network-results-bar">
          <span className="zenve-network-results-count">
            Showing <strong>{filteredProfiles.length}</strong> verified veterinarians across India
            {hasUserProfile && (
              <span className="zenve-network-user-live-indicator" title="Your veterinarian profile is active in the network">
                <span className="zenve-network-user-live-dot" /> Your profile is live
              </span>
            )}
            {activeNavTab !== 'all' && ` • ${NAV_TAB_LABELS[activeNavTab] || activeNavTab}`}
            {selectedCity !== 'All Cities' && ` • ${selectedCity}`}
          </span>

          {activeFilterCount > 0 && (
            <button
              type="button"
              className="zenve-network-reset-btn"
              onClick={resetFilters}
            >
              Reset filters ({activeFilterCount})
            </button>
          )}
        </div>
      </section>

      {/* 4. Vet Network Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <div className={`zenve-network-grid ${isDark ? 'zenve-network-grid--dark' : 'zenve-network-grid--light'}`}>
          {filteredProfiles.map((doctor) => {
            const isFollowing = !!followingMap[doctor.id];
            const isUser = !!doctor.isCurrentUser;

            return (
              <article
                key={doctor.id}
                className={`zenve-network-card ${isUser ? 'zenve-network-card--user' : ''} ${isDark ? 'zenve-network-card--dark' : 'zenve-network-card--light'}`}
              >
                {/* Doctor Avatar Header */}
                <div className="zenve-network-card-header">
                  <div
                    className="zenve-network-avatar-wrap"
                    onClick={() => handleOpenDoctorModal(doctor)}
                    title={`View ${doctor.name}'s profile photo`}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={getDoctorImage(doctor)}
                      alt={doctor.name}
                      className="zenve-network-avatar-img"
                      onError={(e) => {
                        const fallback = getDoctorFallbackImage(doctor);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                    <span className="zenve-network-online-dot" title="Available for consult" />
                  </div>

                  {/* Badges: You / Verified */}
                  <div className="zenve-network-card-badges">
                    {isUser && (
                      <span className="zenve-network-user-badge" title="Your veterinarian profile">
                        <span className="zenve-network-user-badge-dot" /> You
                      </span>
                    )}
                    <span className="zenve-network-verified-badge" title="Zenve Verified Professional">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Doctor Body Information */}
                <div className="zenve-network-card-body">
                  <h2
                    className="zenve-network-doctor-name"
                    onClick={() => handleOpenDoctorModal(doctor)}
                    title={`View ${doctor.name}'s profile`}
                  >
                    {doctor.name}
                  </h2>
                  <p className="zenve-network-specialty">{doctor.specialty}</p>

                  <div className="zenve-network-meta">
                    <span className="zenve-network-location">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{doctor.location || doctor.city || 'India'}</span>
                    </span>

                    {doctor.clinic && (
                      <span className="zenve-network-clinic" title={doctor.clinic}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 21h18M5 21V7l8-4v18M13 7l6 3v11" />
                        </svg>
                        <span>{doctor.clinic}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="zenve-network-card-footer">
                  <button
                    type="button"
                    className="zenve-network-view-btn"
                    onClick={() => handleOpenDoctorModal(doctor)}
                  >
                    <span>View page</span>
                    <span className="zenve-network-view-arrow">↗</span>
                  </button>

                  {isUser ? (
                    <button
                      type="button"
                      className="zenve-network-user-edit-btn"
                      onClick={onOpenCreateProfile}
                      title="Edit your profile information"
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`zenve-network-connect-btn ${isFollowing ? 'zenve-connected' : ''}`}
                      onClick={() => handleToggleFollow(doctor.id)}
                      title={isFollowing ? 'Connected' : 'Connect with doctor'}
                    >
                      {isFollowing ? '✓ Connected' : '+ Connect'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={`zenve-network-empty ${isDark ? 'zenve-network-empty--dark' : 'zenve-network-empty--light'}`}>
          <div className="zenve-network-empty-icon">🩺</div>
          <h3 className="zenve-network-empty-title">No veterinarians found</h3>
          <p className="zenve-network-empty-desc">
            We couldn't find any veterinary doctors matching your current filters. Try selecting "All Specialists" or clearing your search.
          </p>
          <button
            type="button"
            className="zenve-network-empty-btn"
            onClick={resetFilters}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 5. Professional Vet Network Profile Modal View */}
      <VetNetworkProfileModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseDoctorModal}
        isFollowing={selectedDoctor ? !!followingMap[selectedDoctor.id] : false}
        onToggleFollow={handleToggleFollow}
        onEditProfile={onOpenCreateProfile}
      />
    </div>
  );
};

export default NetworkPage;
