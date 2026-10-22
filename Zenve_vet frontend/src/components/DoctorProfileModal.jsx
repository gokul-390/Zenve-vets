import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import '../csscomponents/DoctorProfileModal.css';

export const DoctorProfileModal = ({ doctor, isOpen, onClose, isFollowing, onToggleFollow }) => {
  const [activeTab, setActiveTab] = useState('photos');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [activePhotoPreview, setActivePhotoPreview] = useState(null);
  const [peerFollows, setPeerFollows] = useState({});
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset tab and video playback when opening a new doctor
  useEffect(() => {
    if (isOpen) {
      setActiveTab('photos');
      setPlayingVideoId(null);
      setActivePhotoPreview(null);
    }
  }, [isOpen, doctor?.id]);

  if (!isOpen || !doctor) return null;

  // Retrieve comprehensive data from central database or fall back to passed object
  const detailedDoctor = DOCTORS_DATABASE[doctor.id] || {
    ...doctor,
    posts: doctor.posts || [
      {
        id: `${doctor.id}-post-1`,
        title: 'Clinical Case Update',
        image: doctor.img || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
        caption: `Recent clinical case and diagnostic follow-up by ${doctor.name}. Excellent prognosis and recovery curve observed! 🐾`,
        likes: 310,
        time: 'Today',
        tags: ['#ClinicalCase', '#VeterinaryCare'],
      },
    ],
    videos: doctor.videos || [
      {
        id: `${doctor.id}-video-1`,
        title: 'Clinical Practice & Patient Reel',
        thumbnail: doctor.img || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
        videoUrl: null,
        views: '3.2k views',
        likes: 420,
        duration: '0:18',
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

  const posts = detailedDoctor.posts || [];
  const videos = detailedDoctor.videos || [];
  const followersList = detailedDoctor.followersList || [];

  const handleTogglePeerFollow = (peerId) => {
    setPeerFollows((prev) => ({ ...prev, [peerId]: !prev[peerId] }));
  };

  const handleTogglePlayVideo = (video) => {
    if (playingVideoId === video.id) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(video.id);
    }
  };

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

        {/* Doctor Cover Banner */}
        <div className="zenve-doc-cover-banner">
          <div className="zenve-doc-banner-tag">ZENVE VET VERIFIED</div>
        </div>

        {/* Profile Header */}
        <div className="zenve-doc-profile-header">
          <div className="zenve-doc-avatar-container">
            <img
              src={detailedDoctor.img}
              alt={detailedDoctor.name}
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
              onClick={() => onToggleFollow && onToggleFollow(detailedDoctor.id)}
              title={isFollowing ? 'You are following this doctor' : 'Follow and connect with this doctor'}
            >
              {isFollowing ? '✓ Following' : '+ Connect'}
            </button>
            <button
              type="button"
              className="zenve-doc-msg-btn"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('zenve_open_message', {
                    detail: { doctorId: detailedDoctor.id },
                  })
                );
                if (onClose) onClose();
              }}
              title={`Message ${detailedDoctor.name}`}
            >
              Message
            </button>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="zenve-doc-main-info">
          <div className="zenve-doc-title-row">
            <h2 className="zenve-doc-name">{detailedDoctor.name}</h2>
            <span className="zenve-doc-badge-pill">{detailedDoctor.education || 'BVSc & AH, MVSc'}</span>
          </div>

          <p className="zenve-doc-specialty-text">{detailedDoctor.specialty}</p>

          <div className="zenve-doc-meta-row">
            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{detailedDoctor.location || 'India'}</span>
            </span>

            <span className="zenve-doc-meta-separator">•</span>

            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>{detailedDoctor.clinic || 'Apex Veterinary Multi-Specialty Clinic'}</span>
            </span>

            <span className="zenve-doc-meta-separator">•</span>

            <span className="zenve-doc-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{detailedDoctor.experience || '8+ years clinical experience'}</span>
            </span>
          </div>

          {/* Following indicator banner */}
          {isFollowing && (
            <div className="zenve-doc-following-indicator">
              <span className="zenve-doc-following-indicator-badge">✓ You are following</span>
              <span className="zenve-doc-following-indicator-text">
                You receive new clinical cases, photos, and short videos from {detailedDoctor.name} in your feed.
              </span>
            </div>
          )}
        </div>

        {/* Stats Row with Quick Tab Switching */}
        <div className="zenve-doc-stats-grid">
          <button
            type="button"
            className={`zenve-doc-stat-card ${activeTab === 'photos' ? 'zenve-doc-stat-card-active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <span className="zenve-doc-stat-num">{posts.length}</span>
            <span className="zenve-doc-stat-lbl">📸 Post Photos</span>
          </button>
          <button
            type="button"
            className={`zenve-doc-stat-card ${activeTab === 'videos' ? 'zenve-doc-stat-card-active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <span className="zenve-doc-stat-num">{videos.length}</span>
            <span className="zenve-doc-stat-lbl">🎬 Short Videos</span>
          </button>
          <button
            type="button"
            className={`zenve-doc-stat-card ${activeTab === 'followers' ? 'zenve-doc-stat-card-active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            <span className="zenve-doc-stat-num">{detailedDoctor.followers || '1.8k'}</span>
            <span className="zenve-doc-stat-lbl">👥 Followers</span>
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="zenve-doc-tabs-bar">
          <button
            type="button"
            className={`zenve-doc-tab-btn ${activeTab === 'photos' ? 'zenve-doc-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <span>📸 Post Photos</span>
            <span className="zenve-doc-tab-count">{posts.length}</span>
          </button>
          <button
            type="button"
            className={`zenve-doc-tab-btn ${activeTab === 'videos' ? 'zenve-doc-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <span>🎬 Short Videos</span>
            <span className="zenve-doc-tab-count">{videos.length}</span>
          </button>
          <button
            type="button"
            className={`zenve-doc-tab-btn ${activeTab === 'followers' ? 'zenve-doc-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            <span>👥 Followers</span>
            <span className="zenve-doc-tab-count">{followersList.length}</span>
          </button>
          <button
            type="button"
            className={`zenve-doc-tab-btn ${activeTab === 'about' ? 'zenve-doc-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span>🩺 About &amp; Practice</span>
          </button>
        </div>

        {/* Tab 1: Post Photos */}
        {activeTab === 'photos' && (
          <div className="zenve-doc-tab-content">
            <div className="zenve-doc-tab-heading-row">
              <h3 className="zenve-doc-section-heading">Photos &amp; Clinical Posts</h3>
              <span className="zenve-doc-tab-subtag">{posts.length} posted cases</span>
            </div>

            <div className="zenve-doc-posts-grid">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="zenve-doc-post-card"
                  onClick={() => setActivePhotoPreview(post)}
                >
                  <div className="zenve-doc-post-thumb-wrapper">
                    <img
                      src={post.image}
                      alt={post.title || post.caption}
                      className="zenve-doc-post-thumb"
                    />
                    <div className="zenve-doc-post-overlay">
                      <span className="zenve-doc-post-likes">❤️ {post.likes}</span>
                    </div>
                  </div>
                  <div className="zenve-doc-post-info">
                    <h4 className="zenve-doc-post-title">{post.title || 'Case Photo'}</h4>
                    <p className="zenve-doc-post-caption">{post.caption}</p>
                    <div className="zenve-doc-post-meta">
                      <span className="zenve-doc-post-time">{post.time}</span>
                      {post.tags && post.tags[0] && (
                        <span className="zenve-doc-post-tag">{post.tags[0]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Lightbox Preview Modal */}
            {activePhotoPreview && (
              <div className="zenve-photo-lightbox" onClick={() => setActivePhotoPreview(null)}>
                <div className="zenve-photo-lightbox-card" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="zenve-lightbox-close"
                    onClick={() => setActivePhotoPreview(null)}
                  >
                    ✕
                  </button>
                  <img
                    src={activePhotoPreview.image}
                    alt={activePhotoPreview.title}
                    className="zenve-lightbox-img"
                  />
                  <div className="zenve-lightbox-details">
                    <h4>{activePhotoPreview.title}</h4>
                    <p>{activePhotoPreview.caption}</p>
                    <div className="zenve-lightbox-tags">
                      {(activePhotoPreview.tags || []).map((t, idx) => (
                        <span key={idx} className="zenve-lightbox-tag-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Short Videos */}
        {activeTab === 'videos' && (
          <div className="zenve-doc-tab-content">
            <div className="zenve-doc-tab-heading-row">
              <h3 className="zenve-doc-section-heading">Short Videos &amp; Clinical Reels</h3>
              <span className="zenve-doc-tab-subtag">{videos.length} video shorts</span>
            </div>

            <div className="zenve-doc-videos-grid">
              {videos.map((vid) => {
                const isPlaying = playingVideoId === vid.id;
                return (
                  <div key={vid.id} className="zenve-doc-video-card">
                    <div
                      className="zenve-doc-video-thumb-container"
                      onClick={() => handleTogglePlayVideo(vid)}
                    >
                      {isPlaying ? (
                        <video
                          ref={videoPlayerRef}
                          src={vid.videoUrl}
                          className="zenve-doc-video-player"
                          autoPlay
                          loop
                          controls
                          playsInline
                        />
                      ) : (
                        <>
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="zenve-doc-video-thumb"
                          />
                          <div className="zenve-doc-video-play-overlay">
                            <span className="zenve-doc-video-play-btn">▶</span>
                          </div>
                          <span className="zenve-doc-video-duration">{vid.duration || '0:20'}</span>
                          <span className="zenve-doc-video-reel-tag">SHORT REEL</span>
                        </>
                      )}
                    </div>
                    <div className="zenve-doc-video-info">
                      <h4 className="zenve-doc-video-title">{vid.title}</h4>
                      <p className="zenve-doc-video-caption">{vid.caption}</p>
                      <div className="zenve-doc-video-stats">
                        <span>👁 {vid.views}</span>
                        <span>❤️ {vid.likes} likes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Followers & Network Peers */}
        {activeTab === 'followers' && (
          <div className="zenve-doc-tab-content">
            <div className="zenve-doc-tab-heading-row">
              <h3 className="zenve-doc-section-heading">Followers &amp; Network Peers</h3>
              <span className="zenve-doc-tab-subtag">{detailedDoctor.followers || '1.8k'} network peers</span>
            </div>

            {/* Current user following status banner */}
            <div className="zenve-doc-current-user-follow-card">
              <div className="zenve-doc-user-follow-avatar">
                <img
                  src="https://images.unsplash.com/photo-1594824813686-271790ee1078?auto=format&fit=crop&w=150&h=150&q=80"
                  alt="You"
                />
              </div>
              <div className="zenve-doc-user-follow-info">
                <span className="zenve-doc-user-follow-title">Your Following Status</span>
                <span className="zenve-doc-user-follow-status">
                  {isFollowing ? (
                    <span className="zenve-status-active">✓ You are following {detailedDoctor.name}</span>
                  ) : (
                    <span className="zenve-status-inactive">You are not following {detailedDoctor.name} yet</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className={`zenve-peer-follow-btn ${isFollowing ? 'zenve-peer-following' : ''}`}
                onClick={() => onToggleFollow && onToggleFollow(detailedDoctor.id)}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            </div>

            <div className="zenve-doc-followers-list">
              {followersList.map((peer) => {
                const isPeerFollowed = !!peerFollows[peer.id];
                return (
                  <div key={peer.id} className="zenve-doc-follower-item">
                    <div className="zenve-doc-follower-avatar-wrapper">
                      <img src={peer.avatar} alt={peer.name} className="zenve-doc-follower-avatar" />
                    </div>
                    <div className="zenve-doc-follower-details">
                      <h4 className="zenve-doc-follower-name">{peer.name}</h4>
                      <p className="zenve-doc-follower-spec">{peer.specialty}</p>
                      <span className="zenve-doc-follower-mutual">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        {peer.mutualCount} mutual veterinary connections
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`zenve-peer-follow-btn ${isPeerFollowed ? 'zenve-peer-following' : ''}`}
                      onClick={() => handleTogglePeerFollow(peer.id)}
                    >
                      {isPeerFollowed ? '✓ Connected' : '+ Connect'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: About & Practice */}
        {activeTab === 'about' && (
          <div className="zenve-doc-tab-content">
            {/* About Section */}
            <div className="zenve-doc-section">
              <h3 className="zenve-doc-section-heading">About Doctor</h3>
              <p className="zenve-doc-about-p">
                {detailedDoctor.about ||
                  `Specializing in advanced care with extensive expertise in diagnosis, clinical management, and animal welfare. Passionate about evidence-based veterinary medicine, mentorship, and collaborating with fellow doctors across the Zenve Vet community.`}
              </p>
            </div>

            {/* Focus Areas */}
            <div className="zenve-doc-section">
              <h3 className="zenve-doc-section-heading">Specialized Services &amp; Focus</h3>
              <div className="zenve-doc-skills-pills">
                {(detailedDoctor.focusAreas || [
                  detailedDoctor.specialty,
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
        )}
      </div>
    </div>
  );
};

export default DoctorProfileModal;
