import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Send,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Share2,
} from 'lucide-react';
import {
  getFollowedDoctors,
  sendSharedItemToDoctor,
  navigateToDoctorChat,
} from '../utils/shareUtils';
import '../csscomponents/SharePostModal.css';

export const SharePostModal = ({ isOpen, onClose, item }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('following'); // 'following' | 'all'
  const [customNote, setCustomNote] = useState('');
  const [sentMap, setSentMap] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [recentlySentDoctor, setRecentlySentDoctor] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const doctorsList = useMemo(() => {
    if (!isOpen) return [];
    return getFollowedDoctors();
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const isVideo = !!(item.videoUrl || item.isVideoShort);
  const mediaUrl =
    item.mediaUrl ||
    item.poster ||
    item.img ||
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80';

  const authorName =
    item.authorName || item.author?.name || item.author || 'Dr. Specialist';
  const authorImg =
    item.authorImg || item.author?.avatar || item.img || '/images/doctors/arun.jpg';
  const captionText =
    item.caption || item.description || item.title || 'Veterinary clinical case';

  const filteredDoctors = doctorsList.filter((doc) => {
    if (activeTab === 'following' && !doc.isFollowing) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.specialty?.toLowerCase().includes(q);
      const matchLoc = doc.location?.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchLoc) return false;
    }
    return true;
  });

  const followingCount = doctorsList.filter((d) => d.isFollowing).length;

  const handleSendToDoctor = (doc) => {
    if (sentMap[doc.id]) return;

    sendSharedItemToDoctor(doc.id, item, customNote);

    setSentMap((prev) => ({ ...prev, [doc.id]: true }));
    setRecentlySentDoctor(doc);
  };

  const handleOpenChatWithDoctor = (docId) => {
    navigateToDoctorChat(docId);
    onClose();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post-${item.id || Date.now()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="zenve-share-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share post with colleagues"
    >
      <div
        className="zenve-share-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="zenve-share-modal-header">
          <div className="zenve-share-title-row">
            <div className="zenve-share-icon-wrap">
              <Send size={18} color="#0F4332" />
            </div>
            <div>
              <h3 className="zenve-share-modal-title">Share with Colleagues</h3>
              <p className="zenve-share-modal-sub">
                Send this case to following doctors in Messages
              </p>
            </div>
          </div>
          <button
            type="button"
            className="zenve-share-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="zenve-share-preview-card">
          <div className="zenve-share-preview-thumb-wrap">
            <img
              src={mediaUrl}
              alt={captionText}
              className="zenve-share-preview-thumb"
            />
            {isVideo && (
              <span className="zenve-share-video-badge">▶ REEL</span>
            )}
          </div>
          <div className="zenve-share-preview-details">
            <div className="zenve-share-preview-author-row">
              <img
                src={authorImg}
                alt={authorName}
                className="zenve-share-preview-author-avatar"
              />
              <span className="zenve-share-preview-author-name">
                {authorName}
              </span>
              <span className="zenve-share-preview-verified">✓</span>
            </div>
            <p className="zenve-share-preview-caption">{captionText}</p>
          </div>
        </div>

        {/* Optional Custom Message Note */}
        <div className="zenve-share-custom-note-wrap">
          <input
            type="text"
            className="zenve-share-note-input"
            placeholder="Add a clinical thought or note (optional)..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />
        </div>

        {/* Filter Tabs & Search */}
        <div className="zenve-share-filter-bar">
          <div className="zenve-share-tabs">
            <button
              type="button"
              className={`zenve-share-tab-btn ${
                activeTab === 'following' ? 'zenve-share-tab-active' : ''
              }`}
              onClick={() => setActiveTab('following')}
            >
              Following ({followingCount})
            </button>
            <button
              type="button"
              className={`zenve-share-tab-btn ${
                activeTab === 'all' ? 'zenve-share-tab-active' : ''
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Doctors ({doctorsList.length})
            </button>
          </div>

          <div className="zenve-share-search-box">
            <Search size={14} className="zenve-share-search-icon" />
            <input
              type="text"
              className="zenve-share-search-input"
              placeholder="Search by name, specialty, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="zenve-share-search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Recently Sent Toast Notice Banner */}
        {recentlySentDoctor && (
          <div className="zenve-share-success-banner">
            <span className="zenve-share-success-icon">✓</span>
            <span className="zenve-share-success-text">
              Shared with <strong>{recentlySentDoctor.name}</strong> in Messages!
            </span>
            <button
              type="button"
              className="zenve-share-open-chat-cta"
              onClick={() => handleOpenChatWithDoctor(recentlySentDoctor.id)}
            >
              <span>Open Chat</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}

        {/* Following Doctors List */}
        <div className="zenve-share-doctors-list">
          {filteredDoctors.length === 0 ? (
            <div className="zenve-share-empty">
              <span className="zenve-share-empty-icon">👥</span>
              <p>No matching doctors found</p>
              {activeTab === 'following' && (
                <button
                  type="button"
                  className="zenve-share-switch-tab-btn"
                  onClick={() => setActiveTab('all')}
                >
                  View all community doctors
                </button>
              )}
            </div>
          ) : (
            filteredDoctors.map((doc) => {
              const isSent = !!sentMap[doc.id];

              return (
                <div key={doc.id} className="zenve-share-doc-item">
                  <div className="zenve-share-doc-avatar-wrap">
                    <img
                      src={doc.img}
                      alt={doc.name}
                      className="zenve-share-doc-avatar"
                    />
                    {doc.online && (
                      <span className="zenve-share-online-dot" title="Active now" />
                    )}
                  </div>

                  <div className="zenve-share-doc-info">
                    <div className="zenve-share-doc-name-row">
                      <span className="zenve-share-doc-name">{doc.name}</span>
                      {doc.isFollowing && (
                        <span className="zenve-share-following-tag">
                          Following
                        </span>
                      )}
                    </div>
                    <span className="zenve-share-doc-sub">
                      {doc.specialty} • {doc.location}
                    </span>
                  </div>

                  <div className="zenve-share-doc-actions">
                    <button
                      type="button"
                      className={`zenve-share-send-btn ${
                        isSent ? 'zenve-share-btn-sent' : ''
                      }`}
                      onClick={() => handleSendToDoctor(doc)}
                    >
                      {isSent ? (
                        <>
                          <Check size={14} />
                          <span>Sent</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send</span>
                        </>
                      )}
                    </button>

                    {isSent && (
                      <button
                        type="button"
                        className="zenve-share-chat-shortcut-btn"
                        onClick={() => handleOpenChatWithDoctor(doc.id)}
                        title={`Open chat with ${doc.name}`}
                      >
                        <MessageSquare size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="zenve-share-modal-footer">
          <button
            type="button"
            className="zenve-share-copy-link-btn"
            onClick={handleCopyLink}
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Post Link'}</span>
          </button>

          <button
            type="button"
            className="zenve-share-go-messages-btn"
            onClick={() => {
              navigateToDoctorChat(
                recentlySentDoctor ? recentlySentDoctor.id : 'aarthi'
              );
              onClose();
            }}
          >
            <MessageSquare size={14} />
            <span>Go to Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
