import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../utils/soundManager';
import { postsApi } from '../api';
import '../csscomponents/PostCard.css';

export const PostCard = ({ post, onDoctorClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 120);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState(post.initialComments || [
    { id: 1, author: 'Dr. Arjun Mehta', text: 'Incredible recovery curve! Well done.' },
    { id: 2, author: 'Dr. Priya Nair', text: 'Splendid clinical execution.' },
  ]);

  const videoRef = useRef(null);

  // Synchronize sound state with soundManager
  useEffect(() => {
    const unsubscribe = soundManager.subscribe((activeId) => {
      const active = activeId === post.id;
      setIsSoundOn(active);
      if (videoRef.current) {
        videoRef.current.muted = !active;
      }
    });
    return unsubscribe;
  }, [post.id]);

  useEffect(() => {
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo) {
        currentVideo.pause();
      }
    };
  }, []);

  const handleLikeToggle = async () => {
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikesCount((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await postsApi.like(post.id);
    } catch (err) {
      console.warn('API like sync notice:', err.message);
    }
  };

  const handleDoubleTap = async () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      try {
        await postsApi.like(post.id);
      } catch (err) {
        console.warn('API like sync notice:', err.message);
      }
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleTogglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        console.warn('Video playback error or blocked:', err);
      });
    }
  };

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const willBeSoundOn = !isSoundOn;
      videoRef.current.muted = !willBeSoundOn;
      setIsSoundOn(willBeSoundOn);
      if (willBeSoundOn) {
        soundManager.toggleSound(post.id, post.audioTheme || 'calm');
      } else {
        soundManager.stopSound();
      }
    } else {
      soundManager.toggleSound(post.id, post.audioTheme || 'calm');
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const commentText = commentInput.trim();
    if (!commentText) return;

    const newComment = { id: Date.now(), author: 'You', text: commentText };
    setCommentsList((prev) => [...prev, newComment]);
    setCommentInput('');
    setShowComments(true);

    try {
      await postsApi.addComment(post.id, { text: commentText });
    } catch (err) {
      console.warn('API comment sync notice:', err.message);
    }
  };

  return (
    <article className="zenve-post-card">
      {/* 1. Post Header */}
      <div className="zenve-post-header">
        <div
          className="zenve-post-author"
          onClick={() => onDoctorClick && onDoctorClick(post.authorId)}
          role="button"
          tabIndex={0}
        >
          <div className="zenve-post-author-avatar-ring">
            <img
              src={post.authorImg}
              alt={post.authorName}
              className="zenve-post-author-avatar"
            />
          </div>
          <div className="zenve-post-author-details">
            <div className="zenve-post-author-name-row">
              <span className="zenve-post-author-name">{post.authorName}</span>
              <span className="zenve-post-verified-badge" title="Verified Veterinarian">✓</span>
            </div>
            <span className="zenve-post-author-meta">
              {post.authorSpecialty} • {post.timeAgo}
            </span>
          </div>
        </div>

        <button type="button" className="zenve-post-options-btn" title="Post options">
          •••
        </button>
      </div>

      {/* 2. Post Media Container */}
      <div
        className="zenve-post-media-box"
        onDoubleClick={handleDoubleTap}
        onClick={post.videoUrl && !hasVideoError ? handleTogglePlay : undefined}
      >
        {post.videoUrl && !hasVideoError ? (
          <div className="zenve-post-video-container">
            <video
              ref={videoRef}
              src={post.videoUrl}
              poster={post.mediaUrl}
              className="zenve-post-media-video"
              loop
              playsInline
              muted={!isSoundOn}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasVideoError(true)}
            />

            {/* Center Play Button Overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                className="zenve-video-center-play-btn"
                onClick={handleTogglePlay}
                aria-label="Play shorts video"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            )}

            {/* Video Playback Progress Bar */}
            <div className="zenve-video-progress-bar">
              <div
                className="zenve-video-progress-fill"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="zenve-post-media-img"
          />
        )}

        {/* Double-tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="zenve-double-tap-heart">
            ❤️
          </div>
        )}

        {/* Instagram Reels / Short Badge & Sound Button */}
        {post.isVideoShort && (
          <>
            <button
              type="button"
              className="zenve-reel-badge"
              onClick={handleTogglePlay}
              title={isPlaying ? 'Pause video short' : 'Play video short'}
            >
              <span className="zenve-reel-icon">{isPlaying ? '❚❚' : '▶'}</span>
              <span>{isPlaying ? 'PLAYING SHORT' : 'SHORT REEL'}</span>
            </button>

            {/* Instagram Click-Only Sound Button */}
            <button
              type="button"
              className={`zenve-instagram-sound-btn ${isSoundOn ? 'zenve-sound-on' : ''}`}
              onClick={handleSoundToggle}
              title={isSoundOn ? 'Mute audio' : 'Unmute audio'}
              aria-label="Toggle sound"
            >
              {isSoundOn ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span className="zenve-sound-waves">
                    <span className="zenve-wave-bar" />
                    <span className="zenve-wave-bar" />
                    <span className="zenve-wave-bar" />
                  </span>
                </>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>

            {/* Floating Audio Ticker */}
            <div className="zenve-audio-ticker-pill">
              <span className="zenve-audio-note">♫</span>
              <span className="zenve-audio-name">{post.audioTitle || 'Original Audio'}</span>
            </div>
          </>
        )}
      </div>

      {/* 3. Engagement Action Bar */}
      <div className="zenve-post-actions-bar">
        <div className="zenve-post-actions-left">
          {/* Like Button */}
          <button
            type="button"
            className={`zenve-post-action-btn ${isLiked ? 'zenve-liked-btn' : ''}`}
            onClick={handleLikeToggle}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? '#E11D48' : 'none'} stroke={isLiked ? '#E11D48' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            className="zenve-post-action-btn"
            onClick={() => setShowComments((prev) => !prev)}
            title="Comments"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="zenve-post-action-btn"
            onClick={() => alert(`Copied link to ${post.authorName}'s post!`)}
            title="Share post"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>

          {/* Shorts Video Button on card */}
          {post.isVideoShort && (
            <button
              type="button"
              className="zenve-shorts-video-btn-pill"
              onClick={handleTogglePlay}
              title={isPlaying ? "Pause shorts video" : "Play shorts video"}
            >
              <span className="zenve-shorts-pill-play">{isPlaying ? '❚❚' : '▶'}</span>
              <span>{isPlaying ? 'Pause video' : 'Shorts video'}</span>
            </button>
          )}
        </div>

        {/* Bookmark / Save Button */}
        <button
          type="button"
          className={`zenve-post-action-btn ${isSaved ? 'zenve-saved-btn' : ''}`}
          onClick={() => setIsSaved((prev) => !prev)}
          title={isSaved ? 'Remove from saved' : 'Save post'}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill={isSaved ? '#0C4331' : 'none'} stroke={isSaved ? '#0C4331' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* 4. Likes Count */}
      <div className="zenve-post-likes">
        <span>{likesCount.toLocaleString()} likes</span>
      </div>

      {/* 5. Caption & Tags */}
      <div className="zenve-post-caption-box">
        <span className="zenve-post-caption-author">{post.authorName}</span>{' '}
        <span className="zenve-post-caption-content">{post.caption}</span>
        {post.tags && (
          <div className="zenve-post-tags">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="zenve-post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. Comments Section */}
      <div className="zenve-post-comments-wrapper">
        {commentsList.length > 0 && !showComments && (
          <button
            type="button"
            className="zenve-view-comments-btn"
            onClick={() => setShowComments(true)}
          >
            View all {commentsList.length} comments
          </button>
        )}

        {showComments && (
          <div className="zenve-comments-expanded-list">
            {commentsList.map((c) => (
              <div key={c.id} className="zenve-comment-item">
                <span className="zenve-comment-author">{c.author}</span>
                <span className="zenve-comment-text">{c.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add a comment form */}
        <form onSubmit={handleAddComment} className="zenve-add-comment-form">
          <input
            type="text"
            placeholder="Add a clinical thought or comment..."
            className="zenve-add-comment-input"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          {commentInput.trim() && (
            <button type="submit" className="zenve-post-comment-btn">
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

export default PostCard;
