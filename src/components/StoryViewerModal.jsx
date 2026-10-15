import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../csscomponents/StoryViewerModal.css';

export const StoryViewerModal = ({
  stories,
  initialStoryIndex = 0,
  isOpen,
  onClose,
  onStoryViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const progressRef = useRef(0);

  // Story data items (excluding 'your-story' add button)
  const activeStories = stories.filter((s) => !s.isUser);
  const currentStory = activeStories[currentIndex] || activeStories[0];

  const handleNext = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    if (currentIndex < activeStories.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (onStoryViewed && activeStories[nextIdx]) {
        onStoryViewed(activeStories[nextIdx].id);
      }
    } else {
      onClose();
    }
  }, [currentIndex, activeStories, onClose, onStoryViewed]);

  const handlePrev = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (onStoryViewed && activeStories[prevIdx]) {
        onStoryViewed(activeStories[prevIdx].id);
      }
    }
  }, [currentIndex, activeStories, onStoryViewed]);

  // Story auto-progress timer (5 seconds per story)
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const intervalTime = 40; // ms
    const duration = 5000; // ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      const nextProgress = progressRef.current + step;

      if (nextProgress >= 100) {
        clearInterval(timer);
        progressRef.current = 0;
        setProgress(0);
        handleNext();
      } else {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Handle emoji quick reactions
  const handleSendReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    handleSendReaction('💬');
    setReplyText('');
  };

  if (!isOpen || !currentStory) return null;

  return (
    <div className="zenve-story-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* Close Button on top right */}
      <button
        type="button"
        className="zenve-story-top-close"
        onClick={onClose}
        aria-label="Close stories"
      >
        ✕
      </button>

      {/* Main Story Container Card */}
      <div
        className="zenve-story-card"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Progress Indicators */}
        <div className="zenve-story-progress-bar">
          {activeStories.map((s, idx) => {
            let width = 0;
            if (idx < currentIndex) width = 100;
            else if (idx === currentIndex) width = progress;

            return (
              <div key={s.id} className="zenve-progress-track">
                <div
                  className="zenve-progress-fill"
                  style={{ width: `${width}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header (Doctor Info) */}
        <div className="zenve-story-header">
          <div className="zenve-story-author">
            <img
              src={currentStory.img}
              alt={currentStory.name}
              className="zenve-story-author-img"
            />
            <div className="zenve-story-author-info">
              <span className="zenve-story-author-name">{currentStory.name}</span>
              <span className="zenve-story-meta">
                {currentStory.specialty || 'Veterinary Surgeon'} • {currentStory.time || '3h ago'}
              </span>
            </div>
          </div>

          <div className="zenve-story-header-actions">
            <button
              type="button"
              className="zenve-story-pause-btn"
              onClick={() => setIsPaused((prev) => !prev)}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? '▶' : '⏸'}
            </button>
            <button
              type="button"
              className="zenve-story-close-btn"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Story Media (Image / Story Content) */}
        <div className="zenve-story-media-container">
          <img
            src={currentStory.storyMedia || currentStory.img}
            alt={`${currentStory.name}'s story`}
            className="zenve-story-media-image"
          />

          {/* Semi-transparent gradient overlay */}
          <div className="zenve-story-gradient-bottom" />

          {/* Left / Right Click Tap Zones */}
          <div
            className="zenve-tap-zone zenve-tap-zone-left"
            onClick={handlePrev}
            title="Previous story"
          />
          <div
            className="zenve-tap-zone zenve-tap-zone-right"
            onClick={handleNext}
            title="Next story"
          />

          {/* Caption Text */}
          <div className="zenve-story-caption-box">
            <p className="zenve-story-caption-text">
              {currentStory.caption || 'Sharing our latest case recovery and clinical moments with the Zenve Vet community! 🐾❤️'}
            </p>
          </div>

          {/* Floating Emoji Reaction Animations */}
          <div className="zenve-floating-emojis-container">
            {floatingEmojis.map((item) => (
              <span key={item.id} className="zenve-floating-emoji">
                {item.emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Story Footer: Quick Reactions & Message Input */}
        <div className="zenve-story-footer">
          <form onSubmit={handleSendReply} className="zenve-story-reply-form">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.name}...`}
              className="zenve-story-reply-input"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            />
            {replyText && (
              <button type="submit" className="zenve-story-send-btn">
                Send
              </button>
            )}
          </form>

          <div className="zenve-story-quick-reactions">
            <button
              type="button"
              className="zenve-story-reaction-btn"
              onClick={() => handleSendReaction('❤️')}
              title="Love"
            >
              ❤️
            </button>
            <button
              type="button"
              className="zenve-story-reaction-btn"
              onClick={() => handleSendReaction('🐾')}
              title="Paws"
            >
              🐾
            </button>
            <button
              type="button"
              className="zenve-story-reaction-btn"
              onClick={() => handleSendReaction('🩺')}
              title="Stethoscope"
            >
              🩺
            </button>
            <button
              type="button"
              className="zenve-story-reaction-btn"
              onClick={() => handleSendReaction('👏')}
              title="Applaud"
            >
              👏
            </button>
          </div>
        </div>

        {/* Desktop Prev / Next Side Arrow Buttons */}
        {currentIndex > 0 && (
          <button
            type="button"
            className="zenve-story-nav-btn zenve-story-nav-prev"
            onClick={handlePrev}
            aria-label="Previous story"
          >
            ‹
          </button>
        )}
        {currentIndex < activeStories.length - 1 && (
          <button
            type="button"
            className="zenve-story-nav-btn zenve-story-nav-next"
            onClick={handleNext}
            aria-label="Next story"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryViewerModal;
