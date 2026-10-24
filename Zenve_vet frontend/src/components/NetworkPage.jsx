import React, { useState, useMemo, useEffect } from 'react';
import {
  getAllProfiles,
  getFollowMap,
  toggleFollow as toggleFollowStore,
} from '../data/profilesData';
import { getDoctorImage, getDoctorFallbackImage } from '../utils/doctorImages.js';
import { useTheme } from '../context/ThemeContext';
import DoctorProfileModal from './DoctorProfileModal';
import { SearchIcon, PlusIcon } from './Icons';
import '../csscomponents/NetworkPage.css';

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'Small Animal Medicine',
  'Veterinary Surgery',
  'Veterinary Dermatology',
  'Equine Medicine',
  'Diagnostic Imaging',
  'Livestock Health',
  'Wildlife Medicine',
  'Animal Nutrition',
  'Veterinary Dentistry',
  'Emergency & Critical Care',
  'Preventive Medicine',
  'Veterinary Research',
  'Veterinary Pathology',
];

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

export const NetworkPage = ({ onOpenCreateProfile, customVets = [] }) => {
  const themeContext = useTheme();
  const isDark = Boolean(themeContext?.isDark);
  const toggleTheme = themeContext?.toggleTheme;
  const [profiles, setProfiles] = useState(() => {
    const all = getAllProfiles();
    let extra = customVets;
    if (!extra || extra.length === 0) {
      try {
        const stored = localStorage.getItem('zenve_custom_vets');
        if (stored) extra = JSON.parse(stored);
      } catch {
        extra = [];
      }
    }
    if (Array.isArray(extra) && extra.length > 0) {
      const existingIds = new Set(all.map((p) => p.id));
      const formatted = extra
        .filter((v) => !existingIds.has(v.id))
        .map((v) => ({
          ...v,
          city: v.city || (v.location || '').split(',')[0].trim() || 'India',
          initials:
            v.initials ||
            (v.name
              ? v.name
                  .replace(/^Dr\.?\s*/i, '')
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'DV'),
          color: v.color || '#DCE9E0',
          img: getDoctorImage(v),
          verified: v.verified !== undefined ? v.verified : true,
        }));
      return [...formatted, ...all];
    }
    return all.map((p) => ({ ...p, img: getDoctorImage(p) }));
  });
  const [followingMap, setFollowingMap] = useState(() => getFollowMap());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync customVets prop updates with guaranteed photos
  useEffect(() => {
    if (customVets && customVets.length > 0) {
      setProfiles((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const formatted = customVets
          .filter((v) => !existingIds.has(v.id))
          .map((v) => ({
            ...v,
            city: v.city || (v.location || '').split(',')[0].trim() || 'India',
            initials:
              v.initials ||
              (v.name
                ? v.name
                    .replace(/^Dr\.?\s*/i, '')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'DV'),
            color: v.color || '#DCE9E0',
            img: getDoctorImage(v),
            verified: v.verified !== undefined ? v.verified : true,
          }));
        return [...formatted, ...prev];
      });
    }
  }, [customVets]);

  // Ensure any existing stored profiles in browser localStorage get permanent photos
  useEffect(() => {
    try {
      const keys = ['zenve_custom_vets', 'zenve_custom_profiles'];
      keys.forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let changed = false;
            const sanitized = parsed.map((v) => {
              const currentImg = v.img;
              const validImg = getDoctorImage(v);
              if (!currentImg || currentImg !== validImg) {
                changed = true;
                return { ...v, img: validImg };
              }
              return v;
            });
            if (changed) {
              localStorage.setItem(key, JSON.stringify(sanitized));
            }
          }
        }
      });
    } catch {
      // ignore storage errors
    }
  }, []);

  // Navigation tab bar state (Pure Vet Network Categories)
  const [activeNavTab, setActiveNavTab] = useState('all');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Sync when profiles or follow state change globally
  useEffect(() => {
    const handleProfilesUpdate = () => {
      setProfiles(getAllProfiles());
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

    window.addEventListener('zenve_profiles_updated', handleProfilesUpdate);
    window.addEventListener('zenve_follow_updated', handleFollowUpdate);
    return () => {
      window.removeEventListener('zenve_profiles_updated', handleProfilesUpdate);
      window.removeEventListener('zenve_follow_updated', handleFollowUpdate);
    };
  }, []);

  const handleToggleFollow = (doctorId) => {
    const newState = toggleFollowStore(doctorId);
    setFollowingMap((prev) => ({ ...prev, [doctorId]: newState }));
  };

  const handleOpenDoctorModal = (doctor) => {
    setSelectedDoctor({
      ...doctor,
      img: getDoctorImage(doctor),
    });
    setIsModalOpen(true);
  };

  const handleCloseDoctorModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  // Filtered Vet Network profiles list
  const filteredProfiles = useMemo(() => {
    return profiles.filter((doc) => {
      // 1. Navigation Tab filter (Professional Vet Network Categories)
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

      // 3. Specialty match
      if (selectedSpecialty !== 'All Specialties') {
        const docSpecialty = (doc.specialty || '').toLowerCase();
        const target = selectedSpecialty.toLowerCase();
        if (!docSpecialty.includes(target) && !target.includes(docSpecialty)) {
          const matchFocus = (doc.focusAreas || []).some((f) =>
            f.toLowerCase().includes(target)
          );
          if (!matchFocus) return false;
        }
      }

      // 4. City match
      if (selectedCity !== 'All Cities') {
        const docCity = (doc.city || '').toLowerCase();
        const target = selectedCity.toLowerCase();
        if (!docCity.includes(target) && !(doc.location || '').toLowerCase().includes(target)) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, activeNavTab, searchQuery, selectedSpecialty, selectedCity, followingMap]);

  const activeFilterCount =
    (activeNavTab !== 'all' ? 1 : 0) +
    (selectedSpecialty !== 'All Specialties' ? 1 : 0) +
    (selectedCity !== 'All Cities' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setActiveNavTab('all');
    setSearchQuery('');
    setSelectedSpecialty('All Specialties');
    setSelectedCity('All Cities');
  };

  return (
    <div
      className={`zenve-network-page ${isDark ? 'zenve-network-page--dark' : 'zenve-network-page--light'}`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      {/* 1. Network Page Hero Card (Pink #DA2A51) */}
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

      {/* 2. Professional Vet Network Category Navigation Bar */}
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

      {/* 3. Interactive Search & Filter Controls */}
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

        {/* Specialty Filter Pills */}
        <div className="zenve-network-specialty-scroll">
          {SPECIALTY_OPTIONS.map((specialty) => {
            const isSelected = selectedSpecialty === specialty;
            return (
              <button
                key={specialty}
                type="button"
                className={`zenve-specialty-pill ${isSelected ? 'zenve-specialty-pill-active' : ''}`}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </button>
            );
          })}
        </div>

        {/* Results summary bar */}
        <div className="zenve-network-results-bar">
          <span className="zenve-network-results-count">
            Showing <strong>{filteredProfiles.length}</strong> verified veterinarians across India
            {selectedSpecialty !== 'All Specialties' && ` • ${selectedSpecialty}`}
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

            return (
              <article
                key={doctor.id}
                className={`zenve-network-card ${isDark ? 'zenve-network-card--dark' : 'zenve-network-card--light'}`}
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

                  {/* Verified Badge */}
                  <div className="zenve-network-card-badges">
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
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <span>{doctor.clinic}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="zenve-network-card-footer">
                  <button
                    type="button"
                    className="zenve-network-view-btn"
                    onClick={() => handleOpenDoctorModal(doctor)}
                  >
                    <span>View page</span>
                    <span className="zenve-network-view-arrow">↗</span>
                  </button>

                  <button
                    type="button"
                    className={`zenve-network-connect-btn ${isFollowing ? 'zenve-connected' : ''}`}
                    onClick={() => handleToggleFollow(doctor.id)}
                    title={isFollowing ? 'Connected' : 'Connect with doctor'}
                  >
                    {isFollowing ? '✓ Connected' : '+ Connect'}
                  </button>
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

      {/* 5. Full Doctor Profile Modal View */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseDoctorModal}
        isFollowing={selectedDoctor ? !!followingMap[selectedDoctor.id] : false}
        onToggleFollow={handleToggleFollow}
      />
    </div>
  );
};

export default NetworkPage;
