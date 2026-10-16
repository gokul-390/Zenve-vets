import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import '../csscomponents/StoryViewerModal.css';

export const StoryViewerModal = ({
  stories = [],
  initialStoryIndex = 0,
  isOpen,
  onClose,
  onStoryViewed,
  onAddStory,
}) => {
  // Normalize stories so that multiple items for the same ID/person are grouped into one person page
  const normalizedPersons = useMemo(() => {
    const map = new Map();

    stories.forEach((s) => {
      if (!s) return;
      // Unique grouping key:
      const groupKey = s.isUserStory || s.id === 'user' ? 'user' : (s.id || s.name || 'doctor');

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          id: groupKey,
          name: s.name,
          authorName: s.authorName || s.name,
          specialty: s.specialty,
          img: s.img,
          isUserStory: !!s.isUserStory,
          items: [],
        });
      }

      const person = map.get(groupKey);

      // If story object already contains an items/slides array:
      if (Array.isArray(s.items) && s.items.length > 0) {
        s.items.forEach((item, itemIdx) => {
          person.items.push({
            id: item.id || `${groupKey}-slide-${person.items.length + itemIdx}`,
            storyMedia: item.storyMedia || item.img || s.storyMedia || s.img,
            caption: item.caption || s.caption || '',
            time: item.time || s.time || 'Moments ago',
          });
        });
      } else {
        // Flat story item:
        person.items.push({
          id: s.itemId || s.storyId || s.id || `${groupKey}-slide-${person.items.length}`,
          storyMedia: s.storyMedia || s.img,
          caption: s.caption || '',
          time: s.time || 'Moments ago',
        });
      }
    });

    // Ensure every person has at least 1 item
    return Array.from(map.values()).map((p) => {
      if (p.items.length === 0) {
        p.items.push({
          id: `${p.id}-default`,
          storyMedia: p.img,
          caption: '',
          time: 'Moments ago',
        });
      }
      return p;
    });
  }, [stories]);

  const totalPersons = normalizedPersons.length;

  const [currentPersonIndex, setCurrentPersonIndex] = useState(() => {
    return Math.max(0, Math.min(initialStoryIndex, totalPersons - 1));
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [slideDirection, setSlideDirection] = useState('next');

  const progressRef = useRef(0);

  useEffect(() => {
    const validIdx = Math.max(0, Math.min(initialStoryIndex, totalPersons - 1));
    setCurrentPersonIndex(validIdx);
    setCurrentSlideIndex(0);
    progressRef.current = 0;
    setProgress(0);
  }, [initialStoryIndex, totalPersons]);

  const currentPerson = normalizedPersons[currentPersonIndex] || normalizedPersons[0];
  const currentSlide = currentPerson?.items?.[currentSlideIndex] || currentPerson?.items?.[0];

  const prevPerson = currentPersonIndex > 0 ? normalizedPersons[currentPersonIndex - 1] : null;
  const nextPerson = currentPersonIndex < totalPersons - 1 ? normalizedPersons[currentPersonIndex + 1] : null;

  // Next action: advance slide within current person, or advance to next person
  const handleNext = useCallback(() => {
    if (!currentPerson) return;
    progressRef.current = 0;
    setProgress(0);

    if (currentSlideIndex < currentPerson.items.length - 1) {
      // Advance to next story slide of the SAME person
      setSlideDirection('next');
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Finished all slides of current person -> advance to next person
      if (currentPersonIndex < normalizedPersons.length - 1) {
        setSlideDirection('next');
        const nextPersonIdx = currentPersonIndex + 1;
        setCurrentPersonIndex(nextPersonIdx);
        setCurrentSlideIndex(0);
        if (onStoryViewed && normalizedPersons[nextPersonIdx]) {
          onStoryViewed(normalizedPersons[nextPersonIdx].id);
        }
      } else {
        // Last person finished
        onClose();
      }
    }
  }, [currentPerson, currentSlideIndex, currentPersonIndex, normalizedPersons, onClose, onStoryViewed]);

  // Previous action: go back a slide within current person, or go to previous person's last slide
  const handlePrev = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);

    if (currentSlideIndex > 0) {
      // Go back to previous story slide of the SAME person
      setSlideDirection('prev');
      setCurrentSlideIndex((prev) => prev - 1);
    } else {
      // Go to previous person's last story slide
      if (currentPersonIndex > 0) {
        setSlideDirection('prev');
        const prevPersonIdx = currentPersonIndex - 1;
        const prevP = normalizedPersons[prevPersonIdx];
        setCurrentPersonIndex(prevPersonIdx);
        setCurrentSlideIndex(prevP ? prevP.items.length - 1 : 0);
        if (onStoryViewed && prevP) {
          onStoryViewed(prevP.id);
        }
      }
    }
  }, [currentSlideIndex, currentPersonIndex, normalizedPersons, onStoryViewed]);

  // Direct jump to previous person (used when clicking side preview card)
  const handleJumpToPrevPerson = () => {
    if (currentPersonIndex > 0) {
      progressRef.current = 0;
      setProgress(0);
      setSlideDirection('prev');
      const prevIdx = currentPersonIndex - 1;
      setCurrentPersonIndex(prevIdx);
      setCurrentSlideIndex(0);
      if (onStoryViewed && normalizedPersons[prevIdx]) {
        onStoryViewed(normalizedPersons[prevIdx].id);
      }
    }
  };

  // Direct jump to next person (used when clicking side preview card)
  const handleJumpToNextPerson = () => {
    if (currentPersonIndex < normalizedPersons.length - 1) {
      progressRef.current = 0;
      setProgress(0);
      setSlideDirection('next');
      const nextIdx = currentPersonIndex + 1;
      setCurrentPersonIndex(nextIdx);
      setCurrentSlideIndex(0);
      if (onStoryViewed && normalizedPersons[nextIdx]) {
        onStoryViewed(normalizedPersons[nextIdx].id);
      }
    } else {
      onClose();
    }
  };

  // Story auto-progress timer (5 seconds per slide)
  useEffect(() => {
    if (!isOpen || isPaused || !currentPerson) return;

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
  }, [isOpen, isPaused, currentPersonIndex, currentSlideIndex, currentPerson, handleNext]);

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

  if (!isOpen || !currentPerson || !currentSlide) return null;

  const totalSlides = currentPerson.items.length;

  return (
    <div className="zenve-story-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* Top Header Row with Person & Slide Pagination */}
      <div className="zenve-story-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="zenve-story-person-indicator">
          <span className="zenve-story-person-pill">
            {currentPerson.authorName || currentPerson.name}
            {totalSlides > 1 && ` • ${currentSlideIndex + 1}/${totalSlides}`}
          </span>
          <span className="zenve-story-current-name">
            {currentPersonIndex + 1} of {totalPersons}
          </span>
        </div>

        <button
          type="button"
          className="zenve-story-top-close"
          onClick={onClose}
          aria-label="Close stories"
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Main Multi-Person Story Stage (floating buttons removed) */}
      <div className="zenve-story-stage" onClick={(e) => e.stopPropagation()}>
        {/* Previous Person Story Preview Card (Desktop) */}
        {prevPerson ? (
          <div
            className="zenve-story-side-preview zenve-story-prev-preview"
            onClick={handleJumpToPrevPerson}
            title={`Go back to ${prevPerson.name}'s story`}
            role="button"
            tabIndex={0}
          >
            <img
              src={prevPerson.items?.[0]?.storyMedia || prevPerson.img}
              alt={prevPerson.name}
              className="zenve-side-preview-img"
            />
            <div className="zenve-side-preview-overlay">
              <div className="zenve-side-avatar-ring">
                <img src={prevPerson.img} alt={prevPerson.name} className="zenve-side-avatar" />
              </div>
              <span className="zenve-side-name">{prevPerson.name}</span>
              <span className="zenve-side-action">‹ Previous Person</span>
            </div>
          </div>
        ) : (
          <div className="zenve-story-side-placeholder" />
        )}

        {/* Main Active Story Card */}
        <div
          key={`${currentPerson.id}-${currentSlideIndex}`}
          className={`zenve-story-card zenve-story-slide-${slideDirection}`}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Multi-segment Progress Bars for Current Person */}
          <div className="zenve-story-progress-bar">
            {currentPerson.items.map((slide, sIdx) => {
              let fillWidth = '0%';
              if (sIdx < currentSlideIndex) {
                fillWidth = '100%';
              } else if (sIdx === currentSlideIndex) {
                fillWidth = `${progress}%`;
              } else {
                fillWidth = '0%';
              }

              return (
                <div key={slide.id || sIdx} className="zenve-progress-track">
                  <div
                    className="zenve-progress-fill"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Story Header: Doctor / Author Info */}
          <div className="zenve-story-header">
            <div className="zenve-story-author">
              <div className="zenve-story-author-avatar-ring">
                <img
                  src={currentPerson.img}
                  alt={currentPerson.name}
                  className="zenve-story-author-img"
                />
              </div>
              <div className="zenve-story-author-info">
                <div className="zenve-story-author-title-row">
                  <span className="zenve-story-author-name">
                    {currentPerson.authorName || currentPerson.name}
                  </span>
                  <span className="zenve-story-author-badge" title="Verified Veterinarian">✓</span>
                </div>
                <span className="zenve-story-meta">
                  {currentPerson.specialty || 'Veterinary Professional'} • {currentSlide.time || currentPerson.time || 'Moments ago'}
                </span>
              </div>
            </div>

            <div className="zenve-story-header-actions">
              {onAddStory && (
                <button
                  type="button"
                  className="zenve-story-header-add-btn"
                  onClick={() => {
                    onClose();
                    onAddStory();
                  }}
                  title="Add another story from gallery"
                >
                  +
                </button>
              )}
              <button
                type="button"
                className="zenve-story-pause-btn"
                onClick={() => setIsPaused((prev) => !prev)}
                title={isPaused ? 'Resume story' : 'Pause story'}
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
              src={currentSlide.storyMedia || currentSlide.img || currentPerson.img}
              alt={`${currentPerson.name}'s story`}
              className="zenve-story-media-image"
            />

            <div className="zenve-story-gradient-bottom" />

            {/* Left / Right Tap Zones to navigate between slides */}
            <div
              className="zenve-tap-zone zenve-tap-zone-left"
              onClick={handlePrev}
              title="Previous story slide"
            />
            <div
              className="zenve-tap-zone zenve-tap-zone-right"
              onClick={handleNext}
              title="Next story slide"
            />

            {/* Next Person Prompt Pill on bottom corner if on last slide */}
            {nextPerson && currentSlideIndex === totalSlides - 1 && (
              <div className="zenve-story-next-prompt" onClick={handleJumpToNextPerson}>
                <span>Next story: <strong>{nextPerson.name}</strong></span>
                <span className="zenve-next-prompt-arrow">›</span>
              </div>
            )}

            {/* Caption Text */}
            <div className="zenve-story-caption-box">
              <p className="zenve-story-caption-text">
                {currentSlide.caption || 'Sharing our latest case recovery and clinical moments with the Zenve Vet community! 🐾❤️'}
              </p>
            </div>

            {/* Floating Emoji Reactions */}
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
                placeholder={`Reply to ${currentPerson.name}...`}
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
              {['❤️', '🐾', '🩺', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="zenve-story-reaction-btn"
                  onClick={() => handleSendReaction(emoji)}
                  title={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next Person Story Preview Card (Desktop) */}
        {nextPerson ? (
          <div
            className="zenve-story-side-preview zenve-story-next-preview"
            onClick={handleJumpToNextPerson}
            title={`View ${nextPerson.name}'s story next`}
            role="button"
            tabIndex={0}
          >
            <img
              src={nextPerson.items?.[0]?.storyMedia || nextPerson.img}
              alt={nextPerson.name}
              className="zenve-side-preview-img"
            />
            <div className="zenve-side-preview-overlay">
              <div className="zenve-side-avatar-ring">
                <img src={nextPerson.img} alt={nextPerson.name} className="zenve-side-avatar" />
              </div>
              <span className="zenve-side-name">{nextPerson.name}</span>
              <span className="zenve-side-action">Next Person ›</span>
            </div>
          </div>
        ) : (
          <div className="zenve-story-side-placeholder" />
        )}
      </div>
    </div>
  );
};

export default StoryViewerModal;
