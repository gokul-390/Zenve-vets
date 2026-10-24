import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import { getDoctorImage, getDoctorFallbackImage } from '../utils/doctorImages.js';
import { useTheme } from '../context/ThemeContext';
import '../csscomponents/VetNetworkProfileModal.css';

export const VetNetworkProfileModal = ({
  doctor,
  isOpen,
  onClose,
  isFollowing = false,
  onToggleFollow,
  onEditProfile,
}) => {
  const themeContext = useTheme();
  const isDark = Boolean(themeContext?.isDark);

  const [activeTab, setActiveTab] = useState('about');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [activePhotoPreview, setActivePhotoPreview] = useState(null);
  const [peerFollows, setPeerFollows] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (activePhotoPreview) {
          setActivePhotoPreview(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activePhotoPreview]);

  // Reset tab on opening a new doctor
  useEffect(() => {
    if (isOpen) {
      setActiveTab('about');
      setPlayingVideoId(null);
      setActivePhotoPreview(null);
    }
  }, [isOpen, doctor?.id]);

  if (!isOpen || !doctor) return null;

  // Retrieve comprehensive data from central database or build professional defaults
  const detailedDoctor = DOCTORS_DATABASE[doctor.id] || {
    ...doctor,
    education: doctor.education || 'BVSc & AH, MVSc',
    experience: doctor.experience || '8+ years clinical experience',
    casesHandled: doctor.casesHandled || '240+ cases',
    followers: doctor.followers || '1.7k',
    rating: doctor.rating || '4.9 ★',
    about:
      doctor.about ||
      'Dedicated veterinary specialist with deep expertise in compassionate diagnostic evaluation, clinical therapeutics, and comprehensive animal patient wellness.',
    focusAreas: doctor.focusAreas && doctor.focusAreas.length > 0
      ? doctor.focusAreas
      : [doctor.specialty || 'General Practice', 'Clinical Diagnostics', 'Patient Rehabilitation', 'Preventive Care'],
    posts: doctor.posts || [
      {
        id: `${doctor.id}-post-1`,
        title: 'Clinical Diagnostic Follow-up',
        image: doctor.img || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
        caption: `Recent clinical case evaluation and patient rehabilitation protocol by ${doctor.name}. Excellent prognosis and positive recovery curve observed. 🐾`,
        likes: 310,
        time: 'Today',
        tags: ['#ClinicalCase', '#VeterinaryCare', '#PatientWellness'],
      },
      {
        id: `${doctor.id}-post-2`,
        title: 'Surgical & Diagnostic Workflow',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
        caption: `Routine pre-operative diagnostic imaging and clinical staging for soft tissue evaluation. All parameters stable.`,
        likes: 425,
        time: '3 days ago',
        tags: ['#Diagnostics', '#VeterinaryMedicine'],
      },
    ],
    videos: doctor.videos || [
      {
        id: `${doctor.id}-video-1`,
        title: 'Diagnostic Care Moments & Workflow',
        thumbnail: doctor.img || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
        videoUrl: null,
        views: '2.8k views',
        likes: 380,
        duration: '0:24',
        caption: `Clinical care moments and diagnostic workflow with ${doctor.name} 🩺`,
      },
    ],
    followersList: doctor.followersList || [
      {
        id: 'arun',
        name: 'Dr. Arun Mehta',
        specialty: 'Veterinary Surgery • Mumbai',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80',
        mutualCount: 12,
      },
      {
        id: 'priya',
        name: 'Dr. Priya Nair',
        specialty: 'Veterinary Dermatology • Kochi',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
        mutualCount: 8,
      },
    ],
  };

  const isUser = !!detailedDoctor.isCurrentUser;
  const posts = detailedDoctor.posts || [];
  const videos = detailedDoctor.videos || [];
  const followersList = detailedDoctor.followersList || [];
  const focusAreas = detailedDoctor.focusAreas || [];

  const handleMessage = () => {
    window.dispatchEvent(
      new CustomEvent('zenve_open_message', {
        detail: { doctorId: detailedDoctor.id },
      })
    );
    if (onClose) onClose();
  };

  const handleTogglePeer = (peerId) => {
    setPeerFollows((prev) => ({ ...prev, [peerId]: !prev[peerId] }));
  };

  return (
    <div
      className={`vnpm-overlay ${isDark ? 'vnpm-overlay--dark' : 'vnpm-overlay--light'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`vnpm-card ${isDark ? 'vnpm-card--dark' : 'vnpm-card--light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="vnpm-close-btn"
          onClick={onClose}
          aria-label="Close profile"
          title="Close (Esc)"
        >
          ✕
        </button>

        {/* 1. Executive Medical Cover Banner */}
        <div className="vnpm-cover-banner">
          <div className="vnpm-cover-badges">
            {isUser && (
              <span className="vnpm-badge-you">
                <span className="vnpm-dot-live" /> Your Profile
              </span>
            )}
            <span className="vnpm-badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              Zenve Verified
            </span>
            <span className="vnpm-badge-status">
              <span className="vnpm-dot-online" /> Available
            </span>
          </div>
        </div>

        {/* 2. Profile Header with Avatar & Actions */}
        <div className="vnpm-profile-header">
          {/* Avatar Container */}
          <div
            className="vnpm-avatar-wrap"
            onClick={() => {
              const modalImg = getDoctorImage(detailedDoctor);
              setActivePhotoPreview({
                image: modalImg,
                title: detailedDoctor.name,
                caption: `${detailedDoctor.specialty} • ${detailedDoctor.clinic || 'Veterinary Specialist'}`,
              });
            }}
            title="Click to view full photo"
          >
            <img
              src={getDoctorImage(detailedDoctor)}
              alt={detailedDoctor.name}
              className="vnpm-avatar-img"
              onError={(e) => {
                const fallback = getDoctorFallbackImage(detailedDoctor);
                if (e.currentTarget.src !== fallback) {
                  e.currentTarget.src = fallback;
                }
              }}
            />
            <span className="vnpm-avatar-status-dot" title="Available for consultation" />
          </div>

          {/* Action Buttons */}
          <div className="vnpm-actions-bar">
            {isUser ? (
              <button
                type="button"
                className="vnpm-btn-edit"
                onClick={() => {
                  if (onClose) onClose();
                  if (onEditProfile) onEditProfile();
                }}
                title="Edit your profile details"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={`vnpm-btn-connect ${isFollowing ? 'vnpm-btn-connect--active' : ''}`}
                  onClick={() => onToggleFollow && onToggleFollow(detailedDoctor.id)}
                  title={isFollowing ? 'Following doctor' : 'Connect with doctor'}
                >
                  {isFollowing ? '✓ Following' : '+ Connect'}
                </button>
                <button
                  type="button"
                  className="vnpm-btn-msg"
                  onClick={handleMessage}
                  title={`Send direct message to ${detailedDoctor.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Message</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. Doctor Information Block */}
        <div className="vnpm-main-info">
          <div className="vnpm-name-row">
            <h2 className="vnpm-doctor-name">{detailedDoctor.name}</h2>
            <span className="vnpm-edu-pill">{detailedDoctor.education}</span>
          </div>

          <p className="vnpm-specialty-title">{detailedDoctor.specialty}</p>

          <div className="vnpm-meta-row">
            <span className="vnpm-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{detailedDoctor.location || detailedDoctor.city || 'India'}</span>
            </span>

            <span className="vnpm-meta-sep">•</span>

            <span className="vnpm-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l8-4v18M13 7l6 3v11" />
              </svg>
              <span>{detailedDoctor.clinic || 'Veterinary Clinical Center'}</span>
            </span>

            <span className="vnpm-meta-sep">•</span>

            <span className="vnpm-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{detailedDoctor.experience}</span>
            </span>
          </div>

          {/* Following Alert */}
          {isFollowing && !isUser && (
            <div className="vnpm-following-alert">
              <span className="vnpm-following-check">✓</span>
              <span>You are connected with {detailedDoctor.name}. Their updates appear in your network feed.</span>
            </div>
          )}
        </div>

        {/* 4. Streamlined Metric Bar */}
        <div className="vnpm-metrics-strip">
          <div className="vnpm-metric-cell">
            <span className="vnpm-metric-val">{posts.length}</span>
            <span className="vnpm-metric-lbl">Clinical Posts</span>
          </div>
          <div className="vnpm-metric-cell">
            <span className="vnpm-metric-val">{detailedDoctor.casesHandled || '200+'}</span>
            <span className="vnpm-metric-lbl">Cases Handled</span>
          </div>
          <div className="vnpm-metric-cell">
            <span className="vnpm-metric-val">{detailedDoctor.followers || '1.7k'}</span>
            <span className="vnpm-metric-lbl">Followers</span>
          </div>
          <div className="vnpm-metric-cell">
            <span className="vnpm-metric-val">{detailedDoctor.rating || '4.9 ★'}</span>
            <span className="vnpm-metric-lbl">Peer Rating</span>
          </div>
        </div>

        {/* 5. Navigation Tabs */}
        <div className="vnpm-tabs-bar">
          <button
            type="button"
            className={`vnpm-tab-btn ${activeTab === 'about' ? 'vnpm-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            🩺 About &amp; Practice
          </button>
          <button
            type="button"
            className={`vnpm-tab-btn ${activeTab === 'photos' ? 'vnpm-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📸 Clinical Posts <span className="vnpm-tab-count">{posts.length}</span>
          </button>
          <button
            type="button"
            className={`vnpm-tab-btn ${activeTab === 'videos' ? 'vnpm-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            🎬 Short Videos <span className="vnpm-tab-count">{videos.length}</span>
          </button>
          <button
            type="button"
            className={`vnpm-tab-btn ${activeTab === 'followers' ? 'vnpm-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            👥 Peer Network <span className="vnpm-tab-count">{followersList.length}</span>
          </button>
        </div>

        {/* 6. Tab Content Area */}
        <div className="vnpm-tab-body">
          {/* TAB 1: ABOUT & PRACTICE */}
          {activeTab === 'about' && (
            <div className="vnpm-about-section">
              <div className="vnpm-section-block">
                <h4 className="vnpm-block-title">Professional Background</h4>
                <p className="vnpm-about-text">{detailedDoctor.about}</p>
              </div>

              {focusAreas.length > 0 && (
                <div className="vnpm-section-block">
                  <h4 className="vnpm-block-title">Clinical Focus Areas &amp; Specialties</h4>
                  <div className="vnpm-focus-pills">
                    {focusAreas.map((area, idx) => (
                      <span key={idx} className="vnpm-focus-pill">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="vnpm-section-block">
                <h4 className="vnpm-block-title">Practice &amp; Facility Details</h4>
                <div className="vnpm-practice-card">
                  <div className="vnpm-practice-row">
                    <span className="vnpm-practice-key">Clinic / Facility:</span>
                    <span className="vnpm-practice-val">{detailedDoctor.clinic}</span>
                  </div>
                  <div className="vnpm-practice-row">
                    <span className="vnpm-practice-key">Location:</span>
                    <span className="vnpm-practice-val">{detailedDoctor.location || detailedDoctor.city}</span>
                  </div>
                  <div className="vnpm-practice-row">
                    <span className="vnpm-practice-key">Clinical Experience:</span>
                    <span className="vnpm-practice-val">{detailedDoctor.experience}</span>
                  </div>
                  <div className="vnpm-practice-row">
                    <span className="vnpm-practice-key">Consultation:</span>
                    <span className="vnpm-practice-val vnpm-text-emerald">Active In-Person &amp; Network Inquiries</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL POSTS & PHOTOS */}
          {activeTab === 'photos' && (
            <div className="vnpm-posts-section">
              {posts.length > 0 ? (
                <div className="vnpm-posts-grid">
                  {posts.map((post) => (
                    <article key={post.id} className="vnpm-post-card">
                      <div
                        className="vnpm-post-media-wrap"
                        onClick={() =>
                          setActivePhotoPreview({
                            image: post.image,
                            title: post.title,
                            caption: post.caption,
                          })
                        }
                        title="Click to expand case photo"
                      >
                        <img src={post.image} alt={post.title} className="vnpm-post-img" />
                        <span className="vnpm-post-likes-badge">❤️ {post.likes}</span>
                      </div>
                      <div className="vnpm-post-content">
                        <h5 className="vnpm-post-title">{post.title}</h5>
                        <p className="vnpm-post-caption">{post.caption}</p>
                        {post.tags && (
                          <div className="vnpm-post-tags">
                            {post.tags.map((tag, i) => (
                              <span key={i} className="vnpm-post-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="vnpm-empty-box">No clinical posts published yet.</div>
              )}
            </div>
          )}

          {/* TAB 3: SHORT VIDEOS */}
          {activeTab === 'videos' && (
            <div className="vnpm-videos-section">
              {videos.length > 0 ? (
                <div className="vnpm-videos-grid">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="vnpm-video-card"
                      onClick={() => setPlayingVideoId(playingVideoId === vid.id ? null : vid.id)}
                    >
                      <div className="vnpm-video-thumb-wrap">
                        <img src={vid.thumbnail} alt={vid.title} className="vnpm-video-img" />
                        <div className="vnpm-video-overlay">
                          <span className="vnpm-video-play-btn">▶</span>
                        </div>
                        <span className="vnpm-video-duration">{vid.duration}</span>
                      </div>
                      <div className="vnpm-video-meta">
                        <h5 className="vnpm-video-title">{vid.title}</h5>
                        <span className="vnpm-video-views">{vid.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vnpm-empty-box">No short videos available.</div>
              )}
            </div>
          )}

          {/* TAB 4: PEER NETWORK */}
          {activeTab === 'followers' && (
            <div className="vnpm-followers-section">
              <div className="vnpm-followers-list">
                {followersList.map((peer) => {
                  const isPeerFollowed = peerFollows[peer.id];
                  return (
                    <div key={peer.id} className="vnpm-peer-item">
                      <img src={peer.avatar} alt={peer.name} className="vnpm-peer-avatar" />
                      <div className="vnpm-peer-info">
                        <h5 className="vnpm-peer-name">{peer.name}</h5>
                        <p className="vnpm-peer-spec">{peer.specialty}</p>
                        {peer.mutualCount && (
                          <span className="vnpm-peer-mutual">{peer.mutualCount} mutual connections</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`vnpm-peer-btn ${isPeerFollowed ? 'vnpm-peer-btn--active' : ''}`}
                        onClick={() => handleTogglePeer(peer.id)}
                      >
                        {isPeerFollowed ? 'Following' : '+ Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. Full Photo Lightbox (Preserves full aspect ratio with object-fit: contain) */}
      {activePhotoPreview && (
        <div
          className="vnpm-lightbox-overlay"
          onClick={() => setActivePhotoPreview(null)}
          role="dialog"
          aria-label="Photo Preview"
        >
          <div className="vnpm-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vnpm-lightbox-close"
              onClick={() => setActivePhotoPreview(null)}
              aria-label="Close photo"
            >
              ✕
            </button>
            <div className="vnpm-lightbox-img-wrap">
              <img
                src={activePhotoPreview.image}
                alt={activePhotoPreview.title}
                className="vnpm-lightbox-img"
              />
            </div>
            <div className="vnpm-lightbox-caption-box">
              <h4 className="vnpm-lightbox-title">{activePhotoPreview.title}</h4>
              {activePhotoPreview.caption && (
                <p className="vnpm-lightbox-caption">{activePhotoPreview.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetNetworkProfileModal;
