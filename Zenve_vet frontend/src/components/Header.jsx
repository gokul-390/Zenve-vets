import React, { useState, useRef, useEffect } from 'react';
import { ZenveLogo, SearchIcon, PlusIcon, ChevronDownIcon, NotificationIcon } from './Icons';
import '../csscomponents/Header.css';
import image from '../assets/image.jpg';
import { COUNTRIES } from '../data/countries';
import { useTheme } from '../context/ThemeContext';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Dr. Aarthi sent a clinical update',
    description: 'Minimal effusion, patient is very comfortable on carprofen and restricted leash walks.',
    time: '5m ago',
    unread: true,
    type: 'message',
    doctorId: 'aarthi',
  },
  {
    id: 'n2',
    title: 'New Clinical Case Published',
    description: 'Dr. Arun Mehta shared "Emergency Laparoscopic Intervention in Canine Splenic Torsion".',
    time: '45m ago',
    unread: true,
    type: 'case',
  },
  {
    id: 'n3',
    title: 'New Peer Follower',
    description: 'Dr. Priya Nair started following your veterinary surgery network.',
    time: '2h ago',
    unread: true,
    type: 'follower',
  },
  {
    id: 'n4',
    title: 'Veterinary Summit Registration',
    description: 'Registration opens tomorrow for the National Veterinary Multi-Specialty Conference.',
    time: '1d ago',
    unread: false,
    type: 'event',
  },
];

/* ── Theme Toggle Button ─────────────────────────────────── */
const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={`zenve-theme-toggle ${isDark ? 'zenve-theme-toggle--dark' : 'zenve-theme-toggle--light'}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="zenve-theme-toggle-track">
        <span className="zenve-theme-toggle-thumb">
          {isDark ? (
            // Moon icon
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
            </svg>
          ) : (
            // Sun icon
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
};

export const Header = ({ onCreateProfile }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default: INDIA
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [imgError, setImgError] = useState(false);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const dropdownRef = useRef(null); 
  const notificationsRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.doctorId) {
      window.dispatchEvent(
        new CustomEvent('zenve_open_message', { detail: { doctorId: item.doctorId } })
      );
      setIsNotificationsOpen(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered countries based on search inside dropdown
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setFilterQuery('');
  };

  return (
    <header className="zenve-header">
      {/* Left: Brand Identity */}
      <div className="zenve-header-brand">
        <div className="zenve-logo-container">
          {!imgError ? (
            <img
              src={image}
              alt="ZENVE VET Logo"
              className="zenve-logo-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <ZenveLogo size={36} />
          )}
        </div>
        <div className="zenve-brand-text">
          <div className="zenve-brand-title">
            <span>ZENVE VET</span>
            <sup className="zenve-trademark">TM</sup>
          </div>
          <span className="zenve-brand-subtitle">THE PROFESSIONAL NETWORK</span>
        </div>
      </div>

      {/* Center: Global Search Bar with Country Selector */}
      <div className="zenve-header-search-wrapper">
        <div className="zenve-search-bar">
          <span className="zenve-search-icon">
            <SearchIcon size={18} color="#7D8983" />
          </span>
          <input
            type="text"
            className="zenve-search-input"
            placeholder={
              selectedCountry.code === 'ALL'
                ? 'Search doctors, specialties worldwide...'
                : `Search doctors, specialties in ${selectedCountry.name}...`
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="zenve-search-divider" />

          {/* Interactive Country Selector */}
          <div className="zenve-country-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`zenve-country-selector ${isDropdownOpen ? 'zenve-country-selector-active' : ''}`}
              title="Select country"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
            >
              <span className="zenve-country-flag">{selectedCountry.flag}</span>
              <span className="zenve-country-text">{selectedCountry.label}</span>
              <span className={`zenve-country-chevron ${isDropdownOpen ? 'zenve-chevron-open' : ''}`}>
                <ChevronDownIcon size={12} color="#7D8983" />
              </span>
            </button>

            {/* Country Dropdown Menu */}
            {isDropdownOpen && (
              <div className="zenve-country-dropdown-menu">
                <div className="zenve-country-search-box">
                  <span className="zenve-country-search-icon">
                    <SearchIcon size={14} color="#8A9690" />
                  </span>
                  <input
                    type="text"
                    className="zenve-country-filter-input"
                    placeholder="Search country..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    autoFocus
                  />
                  {filterQuery && (
                    <button
                      type="button"
                      className="zenve-filter-clear-btn"
                      onClick={() => setFilterQuery('')}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="zenve-country-list">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => {
                      const isSelected = selectedCountry.code === country.code;
                      return (
                        <button
                          key={country.code}
                          type="button"
                          className={`zenve-country-option ${isSelected ? 'zenve-country-option-selected' : ''}`}
                          onClick={() => handleSelectCountry(country)}
                        >
                          <span className="zenve-option-flag">{country.flag}</span>
                          <span className="zenve-option-name">{country.name}</span>
                          <span className="zenve-option-code">{country.code}</span>
                          {isSelected && (
                            <span className="zenve-option-check">✓</span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="zenve-country-no-results">
                      No countries match "{filterQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & Community Status */}
      <div className="zenve-header-actions">
        <div className="zenve-community-badge">
          <span className="zenve-status-dot" />
          <span className="zenve-community-text">Open community</span>
        </div>

        {/* Notification Bell Icon & Interactive Dropdown */}
        <div className="zenve-notification-wrapper" ref={notificationsRef}>
          <button
            type="button"
            className={`zenve-notification-btn ${isNotificationsOpen ? 'active' : ''}`}
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <NotificationIcon size={19} color="currentColor" />
            {unreadCount > 0 && (
              <span className="zenve-notification-badge" aria-label={`${unreadCount} unread notifications`}>
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="zenve-notifications-dropdown" role="dialog" aria-label="Notifications panel">
              <div className="zenve-notifications-header">
                <div className="zenve-notifications-title-row">
                  <h4 className="zenve-notifications-title">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="zenve-notifications-unread-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="zenve-notifications-mark-read"
                    onClick={handleMarkAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="zenve-notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`zenve-notification-item ${item.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(item)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="zenve-notification-icon-wrap">
                        {item.type === 'message' ? (
                          <span className="zenve-notif-type-icon msg">💬</span>
                        ) : item.type === 'case' ? (
                          <span className="zenve-notif-type-icon case">🩺</span>
                        ) : item.type === 'follower' ? (
                          <span className="zenve-notif-type-icon user">👤</span>
                        ) : (
                          <span className="zenve-notif-type-icon alert">🔔</span>
                        )}
                      </div>
                      <div className="zenve-notification-content">
                        <p className="zenve-notification-item-title">{item.title}</p>
                        <p className="zenve-notification-item-desc">{item.description}</p>
                        <span className="zenve-notification-time">{item.time}</span>
                      </div>
                      {item.unread && <span className="zenve-notification-dot" />}
                    </div>
                  ))
                ) : (
                  <div className="zenve-notifications-empty">
                    No new notifications right now
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <ThemeToggleButton />

        <button
          type="button"
          className="zenve-create-profile-btn"
          onClick={onCreateProfile}
        >
          <PlusIcon size={15} color="white" />
          <span>Create your profile</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
