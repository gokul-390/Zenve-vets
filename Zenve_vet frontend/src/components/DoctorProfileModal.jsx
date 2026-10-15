import React, { useEffect } from 'react';
import '../csscomponents/DoctorProfileModal.css';

export const DoctorProfileModal = ({ doctor, isOpen, onClose, isFollowing, onToggleFollow }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  return (
    <div className="zenve-doc-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="zenve-doc-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="zenve-doc-modal-close"
          onClick={onClose}
          aria-label="Close profile"
        >
          ✕
        </button>

        {/* Doctor Banner & Header */}
        <div className="zenve-doc-cover-banner">
          <div className="zenve-doc-banner-tag">ZENVE VET VERIFIED</div>
        </div>

        <div className="zenve-doc-profile-header">
          <div className="zenve-doc-avatar-container">
            <img
              src={doctor.img}
              alt={doctor.name}
              className="zenve-doc-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="zenve-doc-online-dot" title="Available for consult" />
          </div>

          <div className="zenve-doc-actions-top">
            <button
              type="button"
              className={`zenve-doc-connect-btn ${isFollowing ? 'zenve-doc-connect-active' : ''}`}
              onClick={() => onToggleFollow && onToggleFollow(doctor.id)}
            >
              {isFollowing ? '✓ Connected' : '+ Connect'}
            </button>
            <button
              type="button"
              className="zenve-doc-msg-btn"
              onClick={() => alert(`Opening direct message consultation with ${doctor.name}...`)}
            >
              Message
            </button>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="zenve-doc-main-info">
          <div className="zenve-doc-title-row">
            <h2 className="zenve-doc-name">{doctor.name}</h2>
            <span className="zenve-doc-badge-pill">BVSc &amp; AH, MVSc</span>
          </div>

          <p className="zenve-doc-specialty-text">{doctor.specialty}</p>

          <div className="zenve-doc-meta-row">
            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{doctor.location || 'India'}</span>
            </span>

            <span className="zenve-doc-meta-separator">•</span>

            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>{doctor.clinic || 'Apex Veterinary Multi-Specialty Clinic'}</span>
            </span>

            <span className="zenve-doc-meta-separator">•</span>

            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{doctor.experience || '8+ years experience'}</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="zenve-doc-stats-grid">
          <div className="zenve-doc-stat-card">
            <span className="zenve-doc-stat-num">{doctor.casesHandled || '520+'}</span>
            <span className="zenve-doc-stat-lbl">Cases Treated</span>
          </div>
          <div className="zenve-doc-stat-card">
            <span className="zenve-doc-stat-num">{doctor.followers || '1.8k'}</span>
            <span className="zenve-doc-stat-lbl">Network Peers</span>
          </div>
          <div className="zenve-doc-stat-card">
            <span className="zenve-doc-stat-num">{doctor.rating || '4.9 ★'}</span>
            <span className="zenve-doc-stat-lbl">Care Rating</span>
          </div>
        </div>

        {/* About Section */}
        <div className="zenve-doc-section">
          <h3 className="zenve-doc-section-heading">About Doctor</h3>
          <p className="zenve-doc-about-p">
            {doctor.about ||
              `Specializing in advanced care with extensive expertise in diagnosis, clinical management, and animal welfare. Passionate about evidence-based veterinary medicine, mentorship, and collaborating with fellow doctors across the Zenve Vet community.`}
          </p>
        </div>

        {/* Focus Areas */}
        <div className="zenve-doc-section">
          <h3 className="zenve-doc-section-heading">Specialized Services &amp; Focus</h3>
          <div className="zenve-doc-skills-pills">
            {(doctor.focusAreas || [
              doctor.specialty,
              'Clinical Diagnostics',
              'Preventive Care',
              'Emergency Medicine',
              'Patient Rehabilitation',
            ]).map((focus, idx) => (
              <span key={idx} className="zenve-doc-skill-pill">
                {focus}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
