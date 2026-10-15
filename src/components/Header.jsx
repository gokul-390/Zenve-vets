import React, { useState, useRef, useEffect } from 'react';
import { ZenveLogo, SearchIcon, PlusIcon, ChevronDownIcon } from './Icons';
import '../csscomponents/Header.css';
import image from '../assets/image.jpg';
import { COUNTRIES } from '../data/countries';

export const Header = ({ onCreateProfile }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default: INDIA
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [imgError, setImgError] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
