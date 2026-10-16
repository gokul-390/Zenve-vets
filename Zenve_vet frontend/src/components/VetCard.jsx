import React from 'react';
import '../csscomponents/VetCard.css';

export const VetCard = ({
  doctor,
  connectionStatus = 'not_connected',
  onConnectClick,
  onViewProfile,
  isFollowing = false,
  onToggleFollow,
}) => {
  const isConnected = connectionStatus === 'connected';
  const isPending = connectionStatus === 'pending';

  return (
    <article className="zenve-vet-card" aria-label={`Profile card for ${doctor.name}`}>
      {/* Card Header & Avatar */}
      <div className="zenve-vet-card-top">
        <div
          className="zenve-vet-avatar-wrapper"
          onClick={() => onViewProfile(doctor)}
          role="button"
          tabIndex={0}
          title={`View ${doctor.name}'s profile`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onViewProfile(doctor);
          }}
        >
          <img
            src={doctor.img}
            alt={doctor.name}
            className="zenve-vet-avatar-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="zenve-vet-status-dot" title="Active on Zenvevet" />
        </div>

        {/* Quick Follow / Star button or You indicator */}
        {doctor.isCurrentUser ? (
          <span className="zenve-vet-badge-you" title="This is your public professional page">
            YOUR PAGE
          </span>
        ) : (
          <button
            type="button"
            className={`zenve-vet-follow-btn ${isFollowing ? 'zenve-vet-following' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(doctor.id);
            }}
            title={isFollowing ? 'Unfollow doctor' : 'Follow doctor'}
            aria-label={isFollowing ? 'Unfollow doctor' : 'Follow doctor'}
          >
            {isFollowing ? '★' : '☆'}
          </button>
        )}
      </div>

      {/* Main Info */}
      <div className="zenve-vet-card-body">
        {/* Name & Verified Badge */}
        <div className="zenve-vet-name-row">
          <h3
            className="zenve-vet-name"
            onClick={() => onViewProfile(doctor)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onViewProfile(doctor);
            }}
          >
            {doctor.name}
          </h3>
          {doctor.isVerified && (
            <span className="zenve-vet-verified-badge" title="Verified Veterinarian">
              ✓
            </span>
          )}
        </div>

        {/* Specialization Badge */}
        <div className="zenve-vet-specialty-container">
          <span className="zenve-vet-specialty">{doctor.specialty}</span>
        </div>

        {/* Clinic & Location */}
        <div className="zenve-vet-location-row">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="zenve-vet-pin-icon"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="zenve-vet-location-text">{doctor.location}</span>
        </div>

        {/* Clinic affiliation */}
        <div className="zenve-vet-clinic-row">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="zenve-vet-clinic-icon"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span className="zenve-vet-clinic-text">{doctor.clinic}</span>
        </div>

        {/* Short Professional Description */}
        <p className="zenve-vet-description">
          {doctor.description || doctor.about}
        </p>

        {/* Mutual Connections */}
        <div className="zenve-vet-mutual-section">
          <div className="zenve-vet-mutual-avatars">
            {(doctor.mutualAvatars || []).map((avatarUrl, i) => (
              <img
                key={i}
                src={avatarUrl}
                alt="Mutual peer"
                className="zenve-vet-mutual-avatar"
              />
            ))}
          </div>
          <span className="zenve-vet-mutual-text">
            {doctor.mutualConnectionsText || `${doctor.mutualCount || 3} mutual connections`}
          </span>
        </div>
      </div>

      {/* Action Buttons: Connect & View Profile */}
      <div className="zenve-vet-card-footer">
        <button
          type="button"
          className="zenve-vet-view-btn"
          onClick={() => onViewProfile(doctor)}
        >
          <span>View Profile</span>
          <span className="zenve-vet-btn-arrow">↗</span>
        </button>

        <button
          type="button"
          className={`zenve-vet-connect-btn ${
            doctor.isCurrentUser
              ? 'zenve-vet-connect-connected'
              : isConnected
              ? 'zenve-vet-connect-connected'
              : isPending
              ? 'zenve-vet-connect-pending'
              : 'zenve-vet-connect-default'
          }`}
          onClick={() => {
            if (doctor.isCurrentUser) {
              onViewProfile(doctor);
            } else {
              onConnectClick(doctor.id);
            }
          }}
          title={
            doctor.isCurrentUser
              ? 'Your professional page'
              : isConnected
              ? 'Connected with doctor'
              : isPending
              ? 'Connection invitation pending'
              : 'Send connection request'
          }
        >
          {doctor.isCurrentUser && '✓ Your Page'}
          {!doctor.isCurrentUser && isConnected && '✓ Connected'}
          {!doctor.isCurrentUser && isPending && '⏳ Pending'}
          {!doctor.isCurrentUser && !isConnected && !isPending && '+ Connect'}
        </button>
      </div>
    </article>
  );
};

export default VetCard;
