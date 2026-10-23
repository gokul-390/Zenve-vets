import React, { useState, useEffect } from 'react';
import '../csscomponents/VetProfileModal.css';

export const VetProfileModal = ({
  doctor,
  isOpen,
  onClose,
  connectionStatus,
  onToggleConnect,
  isFollowing,
  onToggleFollow,
}) => {
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPhotoPreview(false);
    }
  }, [isOpen, doctor?.id]);

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

  const isConnected = connectionStatus === 'connected';
  const isPending = connectionStatus === 'pending';

  return (
    <div
      className="zenve-vmodal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${doctor.name} Profile`}
    >
      <div className="zenve-vmodal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="zenve-vmodal-close"
          onClick={onClose}
          aria-label="Close profile"
        >
          ✕
        </button>

        {/* Doctor Cover Banner */}
        <div className="zenve-vmodal-banner">
          <div className="zenve-vmodal-banner-badge">
            <span className="zenve-vmodal-sparkle">✦</span>
            <span>{doctor.isVerified ? 'ZENVE VET VERIFIED' : 'COMMUNITY VET PAGE'}</span>
          </div>
          <div className="zenve-vmodal-banner-clinic">
            {doctor.clinic}
          </div>
        </div>

        {/* Profile Header & Avatar Row */}
        <div className="zenve-vmodal-header">
          <div
            className="zenve-vmodal-avatar-box"
            onClick={() => {
              if (doctor.img) setShowPhotoPreview(true);
            }}
            title={doctor.img ? `Click to view ${doctor.name}'s photo` : doctor.name}
            style={{ cursor: doctor.img ? 'pointer' : 'default' }}
          >
            <img
              src={doctor.img}
              alt={doctor.name}
              className="zenve-vmodal-avatar-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="zenve-vmodal-online-dot" title="Available for consult" />
          </div>

          <div className="zenve-vmodal-actions-top">
            {/* Connect / Pending / Connected Button */}
            <button
              type="button"
              className={`zenve-vmodal-btn-connect ${
                isConnected
                  ? 'zenve-vmodal-btn-connected'
                  : isPending
                  ? 'zenve-vmodal-btn-pending'
                  : 'zenve-vmodal-btn-primary'
              }`}
              onClick={() => onToggleConnect && onToggleConnect(doctor.id)}
            >
              {isConnected && '✓ Connected'}
              {isPending && '⏳ Pending'}
              {!isConnected && !isPending && '+ Connect'}
            </button>

            {/* Follow Toggle */}
            <button
              type="button"
              className={`zenve-vmodal-btn-follow ${isFollowing ? 'zenve-vmodal-btn-following' : ''}`}
              onClick={() => onToggleFollow && onToggleFollow(doctor.id)}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>

            {/* Message Button */}
            <button
              type="button"
              className="zenve-vmodal-btn-msg"
              onClick={() => alert(`Initiating direct consultation channel with ${doctor.name}...`)}
            >
              Message
            </button>
          </div>
        </div>

        {/* Main Info */}
        <div className="zenve-vmodal-info-section">
          <div className="zenve-vmodal-title-row">
            <h2 className="zenve-vmodal-name">{doctor.name}</h2>
            {doctor.isVerified ? (
              <span className="zenve-vmodal-verified-badge" title="Verified Veterinarian">
                ✓
              </span>
            ) : (
              <span className="zenve-vet-badge-you" title="Your Community Page">
                YOUR PAGE
              </span>
            )}
            {doctor.degrees && (
              <span className="zenve-vmodal-degree-pill">{doctor.degrees}</span>
            )}
          </div>

          <p className="zenve-vmodal-specialty">{doctor.specialty}</p>

          <div className="zenve-vmodal-meta-row">
            <span className="zenve-vmodal-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{doctor.location}</span>
            </span>

            <span className="zenve-vmodal-meta-sep">•</span>

            <span className="zenve-vmodal-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>{doctor.clinic}</span>
            </span>

            <span className="zenve-vmodal-meta-sep">•</span>

            <span className="zenve-vmodal-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{doctor.experience} experience</span>
            </span>
          </div>

          {/* Mutual Connections Banner in Modal */}
          {doctor.mutualConnectionsText && (
            <div className="zenve-vmodal-mutual-box">
              <div className="zenve-vmodal-mutual-avatars">
                {(doctor.mutualAvatars || []).map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="Mutual connection"
                    className="zenve-vmodal-mutual-avatar"
                  />
                ))}
              </div>
              <div className="zenve-vmodal-mutual-text">
                <span className="zenve-vmodal-mutual-label">Mutual Network:</span>{' '}
                {doctor.mutualConnectionsText}
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="zenve-vmodal-stats-grid">
          <div className="zenve-vmodal-stat-card">
            <span className="zenve-vmodal-stat-val">{doctor.casesHandled || '650+'}</span>
            <span className="zenve-vmodal-stat-lbl">Cases Treated</span>
          </div>
          <div className="zenve-vmodal-stat-card">
            <span className="zenve-vmodal-stat-val">{doctor.followers || '2.0k'}</span>
            <span className="zenve-vmodal-stat-lbl">Network Peers</span>
          </div>
          <div className="zenve-vmodal-stat-card">
            <span className="zenve-vmodal-stat-val">{doctor.rating || '4.9 ★'}</span>
            <span className="zenve-vmodal-stat-lbl">Care Rating</span>
          </div>
        </div>

        {/* About Section */}
        <div className="zenve-vmodal-section">
          <h3 className="zenve-vmodal-section-title">About Doctor</h3>
          <p className="zenve-vmodal-about-text">
            {doctor.about || doctor.description}
          </p>
        </div>

        {/* Focus Areas */}
        <div className="zenve-vmodal-section">
          <h3 className="zenve-vmodal-section-title">Specialized Services &amp; Focus</h3>
          <div className="zenve-vmodal-tags-row">
            {(doctor.focusAreas || [doctor.specialty]).map((area, idx) => (
              <span key={idx} className="zenve-vmodal-tag">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Photo Lightbox Preview Modal */}
        {showPhotoPreview && doctor.img && (
          <div
            className="zenve-photo-lightbox"
            onClick={() => setShowPhotoPreview(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="zenve-photo-lightbox-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="zenve-lightbox-close"
                onClick={() => setShowPhotoPreview(false)}
                aria-label="Close photo preview"
              >
                ✕
              </button>
              <div className="zenve-lightbox-img-wrapper">
                <img
                  src={doctor.img}
                  alt={doctor.name}
                  className="zenve-lightbox-img"
                />
              </div>
              <div className="zenve-lightbox-details">
                <h4>{doctor.name}</h4>
                <p>{doctor.specialty} • {doctor.clinic || 'Independent Practice'} • {doctor.location || 'India'}</p>
                <div className="zenve-lightbox-tags">
                  <span className="zenve-lightbox-tag-pill">#Veterinarian</span>
                  <span className="zenve-lightbox-tag-pill">{doctor.specialty}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetProfileModal;
