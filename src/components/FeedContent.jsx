import React, { useState } from 'react';
import StoryViewerModal from './StoryViewerModal';
import PostCard from './PostCard';
import { postsApi } from '../api';
import '../csscomponents/FeedContent.css';

export const FeedContent = ({ onOpenCreateProfile, activeMainTab = 'feed', onSelectMainTab }) => {
  const [feedFilterTab, setFeedFilterTab] = useState('for-you');
  const [activePostType, setActivePostType] = useState('photo');
  const [postText, setPostText] = useState('');

  // Keep feed tab in sync with left sidebar navigation
  const activeTab = activeMainTab === 'videos' ? 'videos' : feedFilterTab;

  const handleTabChange = (tabId) => {
    setFeedFilterTab(tabId);
    if (tabId === 'videos') {
      if (onSelectMainTab) onSelectMainTab('videos');
    } else {
      if (onSelectMainTab && activeMainTab === 'videos') onSelectMainTab('feed');
    }
  };

  // Story Viewer modal state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Set of story IDs that have been visited/viewed
  const [viewedStoryIds, setViewedStoryIds] = useState({});

  const stories = [
    {
      id: 'your-story',
      isUser: true,
      name: 'Your story',
    },
    {
      id: 'aarthi',
      name: 'Dr.Aarthi',
      specialty: 'Orthopedic Surgery',
      time: '1h ago',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
      caption: 'Post-op recovery going fantastic! This brave Golden Retriever is up and walking comfortably today 🐾❤️',
    },
    {
      id: 'arun',
      name: 'Dr.Arun',
      specialty: 'Veterinary Surgeon',
      time: '2h ago',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      caption: 'Morning rounds complete at the clinic! Ready for two specialized ultrasound diagnostics today 🩺✨',
    },
    {
      id: 'priya_123',
      name: 'Dr.Priya',
      specialty: 'Veterinary Dermatology',
      time: '3h ago',
      img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
      caption: 'Allergy screening follow-up: chronic dermatitis symptoms decreased by 85% on the hypoallergenic regimen! 🐶',
    },
    {
      id: 'sweet_heart',
      name: 'sweet_Sneha',
      specialty: 'Animal Rehabilitation',
      time: '4h ago',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
      caption: 'Hydrotherapy physical therapy session with Milo! Water exercises work wonders for joint mobility 🌊🐕',
    },
    {
      id: 'nidhi',
      name: 'Dr.Nidhi',
      specialty: 'Small Animal Medicine',
      time: '5h ago',
      img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
      caption: 'Routine pediatric checkup & vaccinations done for this gorgeous litter of pups! Healthy & energetic 🐾',
    },
    {
      id: 'sanjay',
      name: 'Dr.Sanjay',
      specialty: 'Equine Specialist',
      time: '6h ago',
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
      caption: 'Equine soundness evaluation at the ranch this afternoon. Always a privilege working with these majestic animals 🐴',
    },
    {
      id: 'karthika',
      name: 'Dr.Karthika',
      specialty: 'Avian & Exotic Care',
      time: '7h ago',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
      storyMedia: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80',
      caption: 'Exotic feather checkup & beak grooming today. Beak conditioning is key for healthy avian nutrition 🦜🩺',
    },
  ];

  // 7 Doctor Posts with Video Shorts & Sound Toggle
  const INITIAL_POSTS = [
    {
      id: 'post-1',
      authorId: 'aarthi',
      authorName: 'Dr. Aarthi',
      authorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Orthopedic Surgery • Bengaluru',
      timeAgo: '1 hour ago',
      caption:
        'Successful TPLO knee stabilization on this 4-year-old German Shepherd. Early ambulation protocol initiated with excellent gait recovery.',
      mediaUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
      isVideoShort: false,
      likes: 342,
      tags: ['#OrthopedicSurgery', '#VeterinaryMedicine', '#CanineHealth', '#ZenveVet'],
      initialComments: [
        { id: 101, author: 'Dr. Arun', text: 'Splendid plate positioning! How long was the recovery?' },
        { id: 102, author: 'Dr. Priya', text: 'Remarkable alignment, great job Dr. Aarthi!' },
      ],
    },
    {
      id: 'post-2',
      authorId: 'sweet_heart',
      authorName: 'sweet_Sneha',
      authorImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Animal Rehabilitation • Delhi NCR',
      timeAgo: '2 hours ago',
      caption:
        'Hydrotherapy day with sweet Bruno! Swimming takes all pressure off joints while strengthening core spinal stabilizers. Sound ON to hear Bruno splash! 🌊🐕',
      mediaUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
      videoUrl: '/assets/community-moment-OzvSkOwI.webm',
      isVideoShort: true,
      audioTitle: '♫ Happy Paws Melodies • sweet_Sneha',
      audioTheme: 'playful',
      likes: 914,
      tags: ['#Hydrotherapy', '#RehabReels', '#SoundOn', '#VetShorts'],
      initialComments: [
        { id: 201, author: 'Dr. Nidhi', text: 'Look at that tail wagging! Pure joy.' },
        { id: 202, author: 'Dr. Sanjay', text: 'Water buoyancy is truly therapeutic.' },
      ],
    },
    {
      id: 'post-3',
      authorId: 'arun',
      authorName: 'Dr. Arun',
      authorImg: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Veterinary Surgeon • Mumbai',
      timeAgo: '4 hours ago',
      caption:
        'Oral surgery and periodontal treatment completed for this brave rescue dog. Dental health directly prevents secondary cardiac and renal burdens.',
      mediaUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      isVideoShort: false,
      likes: 218,
      tags: ['#VetDental', '#SurgeryCases', '#OralCare', '#MumbaiVets'],
      initialComments: [
        { id: 301, author: 'Dr. Aarthi', text: 'Essential work. Clean recovery ahead!' },
      ],
    },
    {
      id: 'post-4',
      authorId: 'priya_123',
      authorName: 'Dr. Priya',
      authorImg: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Veterinary Dermatology • Kochi',
      timeAgo: '5 hours ago',
      caption:
        'Feline dermatology case checkup: Leo’s chronic pruritus and skin lesions have completely healed. Tap audio button to hear his peaceful purrs 🐱✨',
      mediaUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
      videoUrl: '/__l5e/assets-v1/917a25fc-5887-4372-ba01-7e6d08a13e4a/demo-video-2.webm',
      isVideoShort: true,
      audioTitle: '♫ Relaxing Feline Vibes • Dr. Priya',
      audioTheme: 'calm',
      likes: 678,
      tags: ['#Dermatology', '#CatCare', '#SoundOn', '#ZenveVetReels'],
      initialComments: [
        { id: 401, author: 'sweet_Sneha', text: 'Healthy coat and a peaceful heart!' },
      ],
    },
    {
      id: 'post-5',
      authorId: 'nidhi',
      authorName: 'Dr. Nidhi',
      authorImg: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Small Animal Medicine • Hyderabad',
      timeAgo: '7 hours ago',
      caption:
        'Pediatric wellness examination for 6 golden retriever puppies! Heart sounds clear, healthy coat, and bright puppy curiosity. Starting life strong!',
      mediaUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
      isVideoShort: false,
      likes: 540,
      tags: ['#PuppyCare', '#PediatricVet', '#AnimalWellness', '#ZenveCommunity'],
      initialComments: [
        { id: 501, author: 'Dr. Karthika', text: 'Cutest patient lineup ever!' },
      ],
    },
    {
      id: 'post-6',
      authorId: 'sanjay',
      authorName: 'Dr. Sanjay',
      authorImg: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Equine Specialist • Jaipur',
      timeAgo: '9 hours ago',
      caption:
        'Gait kinematics and stride symmetry analysis on an Arabian stallion. Sound ON to hear the hoofbeats rhythm across the paddock track 🐴🌾',
      mediaUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
      videoUrl: '/__l5e/assets-v1/777ea1ef-de4b-4958-b8f2-6ef1387ad2b0/demo-video-1.webm',
      isVideoShort: true,
      audioTitle: '♫ Hoofbeats & Wind • Dr. Sanjay',
      audioTheme: 'equine',
      likes: 890,
      tags: ['#EquineMedicine', '#HorseReel', '#SoundTrack', '#EquineOrthopedics'],
      initialComments: [
        { id: 601, author: 'Dr. Arun', text: 'Breathtaking rhythm and symmetry.' },
      ],
    },
    {
      id: 'post-7',
      authorId: 'karthika',
      authorName: 'Dr. Karthika',
      authorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Avian & Exotic Care • Bengaluru',
      timeAgo: '11 hours ago',
      caption:
        'Comprehensive wellness check for this splendid Scarlet Macaw. Feather luster indicates optimal nutritional balance and mental stimulation! 🦜',
      mediaUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80',
      isVideoShort: false,
      likes: 412,
      tags: ['#AvianMedicine', '#ExoticVet', '#MacawCare', '#BirdHealth'],
      initialComments: [
        { id: 701, author: 'Dr. Nidhi', text: 'Those plumage colors are majestic!' },
      ],
    },
  ];

  const [feedPosts, setFeedPosts] = useState(INITIAL_POSTS);

  const handleMarkAsViewed = (storyId) => {
    setViewedStoryIds((prev) => ({ ...prev, [storyId]: true }));
  };

  // Open specific person's story and mark it as viewed
  const handleOpenStory = (indexInActiveList) => {
    const activeList = stories.filter((s) => !s.isUser);
    const story = activeList[indexInActiveList];
    if (story) {
      handleMarkAsViewed(story.id);
    }
    setSelectedStoryIndex(indexInActiveList);
    setIsStoryModalOpen(true);
  };

  // Handle new post created from the top post creation card
  const handleCreateNewPost = async () => {
    if (!postText.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: 'you',
      authorName: 'Dr. You (Your Practice)',
      authorImg: 'https://images.unsplash.com/photo-1594824813686-271790ee1078?auto=format&fit=crop&w=150&h=150&q=80',
      authorSpecialty: 'Veterinary Professional',
      timeAgo: 'Just now',
      caption: postText.trim(),
      mediaUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      videoUrl: activePostType === 'video' ? '/assets/community-moment-OzvSkOwI.webm' : null,
      isVideoShort: activePostType === 'video',
      audioTitle: activePostType === 'video' ? '♫ Original Clinic Audio' : null,
      audioTheme: 'calm',
      likes: 1,
      tags: ['#ZenveVet', '#ClinicalCase', '#VeterinaryNetwork'],
      initialComments: [],
    };

    setFeedPosts([newPost, ...feedPosts]);
    setPostText('');

    try {
      await postsApi.create(newPost);
    } catch (err) {
      console.warn('API sync notice (stored locally):', err.message);
    }
  };

  return (
    <div className="zenve-feed-main">
      {/* 1. Hero Card */}
      <section className="zenve-feed-hero">
        <div className="zenve-feed-hero-left">
          <span className="zenve-feed-hero-tag">THE ZENVE VET COMMUNITY</span>
          <h1 className="zenve-feed-hero-title">A world of care. Connected.</h1>
          <p className="zenve-feed-hero-desc">
            Meet your peers. Share your practice. Move veterinary care forward.
          </p>
          <button
            type="button"
            className="zenve-feed-hero-cta"
            onClick={onOpenCreateProfile}
          >
            <span>Make your mark</span>
            <span className="zenve-cta-arrow">↗</span>
          </button>
        </div>

        <div className="zenve-feed-hero-right">
          <div className="zenve-stethoscope-card">
            <svg
              width="80"
              height="70"
              viewBox="0 0 100 85"
              fill="none"
              stroke="#E2BA6D"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M25 15V32C25 45 35 55 50 55C65 55 75 45 75 32V15" />
              <path d="M50 55V72C50 78 55 82 62 82H75" />
              <circle cx="78" cy="82" r="5" fill="#E2BA6D" />
              <circle cx="25" cy="15" r="4" fill="#E2BA6D" />
              <circle cx="75" cy="15" r="4" fill="#E2BA6D" />
            </svg>
            <span className="zenve-hero-sublabel">BETTER TOGETHER</span>
          </div>
        </div>
      </section>

      {/* 2. Moments from the community (Stories) */}
      <section className="zenve-stories-section">
        <div className="zenve-section-top">
          <h2 className="zenve-stories-heading">Moments from the community</h2>
          <button
            type="button"
            className="zenve-stories-link"
            onClick={() => handleOpenStory(0)}
            title="View all community stories"
          >
            <span>STORIES</span>
            <span className="zenve-link-arrow">↗</span>
          </button>
        </div>

        <div className="zenve-stories-row">
          {stories.map((story) => {
            // Calculate active index (excluding 'your-story')
            const activeIndex = stories
              .filter((s) => !s.isUser)
              .findIndex((s) => s.id === story.id);

            const isViewed = !!viewedStoryIds[story.id];

            return (
              <div key={story.id} className="zenve-story-item">
                {story.isUser ? (
                  <button
                    type="button"
                    className="zenve-story-avatar-btn zenve-story-add-btn"
                    onClick={onOpenCreateProfile}
                    title="Add your story"
                  >
                    <span className="zenve-add-story-plus">+</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="zenve-story-avatar-btn-wrapper"
                    onClick={() => handleOpenStory(activeIndex)}
                    title={`View ${story.name}'s story`}
                  >
                    <div
                      className={`zenve-story-avatar-wrapper ${
                        isViewed ? 'zenve-story-avatar-viewed' : ''
                      }`}
                    >
                      <img
                        src={story.img}
                        alt={story.name}
                        className="zenve-story-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('zenve-avatar-fallback');
                        }}
                      />
                    </div>
                  </button>
                )}
                <span
                  className={`zenve-story-name ${isViewed ? 'zenve-story-name-viewed' : ''}`}
                  onClick={() => !story.isUser && handleOpenStory(activeIndex)}
                >
                  {story.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Post Creation Card */}
      <section className="zenve-create-post-card">
        <div className="zenve-create-post-top">
          <div className="zenve-post-stethoscope-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>
          <input
            type="text"
            className="zenve-post-input"
            placeholder="Share a discovery, a case, a little inspiration..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateNewPost();
            }}
          />
          <button
            type="button"
            className="zenve-post-edit-btn"
            title="Write long post"
            onClick={handleCreateNewPost}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
        </div>

        <div className="zenve-create-post-bottom">
          <div className="zenve-post-actions-pills">
            <button
              type="button"
              className={`zenve-post-pill ${activePostType === 'photo' ? 'zenve-post-pill-active' : ''}`}
              onClick={() => setActivePostType('photo')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span>Photo / Post</span>
            </button>

            <button
              type="button"
              className={`zenve-post-pill ${activePostType === 'clinical' ? 'zenve-post-pill-active' : ''}`}
              onClick={() => setActivePostType('clinical')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
                <rect x="3.5" y="6.5" width="17" height="13.5" rx="2.5" />
                <path d="M12 10.5V15.5M9.5 13H14.5" />
              </svg>
              <span>Clinical case</span>
            </button>

            <button
              type="button"
              className={`zenve-post-pill ${activePostType === 'story' ? 'zenve-post-pill-active' : ''}`}
              onClick={() => setActivePostType('story')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Story</span>
            </button>

            <button
              type="button"
              className={`zenve-post-pill ${activePostType === 'video' ? 'zenve-post-pill-active' : ''}`}
              onClick={() => setActivePostType('video')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="14" height="12" rx="2" />
                <polygon points="22 8 16 12 22 16 22 8" />
              </svg>
              <span>Short video</span>
            </button>

            <button
              type="button"
              className={`zenve-post-pill ${activePostType === 'ai' ? 'zenve-post-pill-active' : ''}`}
              onClick={() => setActivePostType('ai')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
              </svg>
              <span>AI case assistant</span>
            </button>
          </div>

          <button
            type="button"
            className="zenve-post-submit-btn"
            onClick={handleCreateNewPost}
          >
            <span>Post</span>
            <span className="zenve-post-submit-arrow">↗</span>
          </button>
        </div>
      </section>

      {/* 4. Feed Filter Tabs */}
      <section className="zenve-feed-tabs-bar">
        <div className="zenve-feed-tabs-left">
          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'for-you' ? 'zenve-feed-tab-active' : ''}`}
            onClick={() => handleTabChange('for-you')}
          >
            For you
          </button>
          <button
            type="button"
            className={`zenve-feed-tab-btn zenve-feed-tab-shorts ${activeTab === 'videos' ? 'zenve-feed-tab-active' : ''}`}
            onClick={() => handleTabChange('videos')}
          >
            <span className="zenve-tab-shorts-icon">▶</span>
            <span>Short videos</span>
            <span className="zenve-shorts-count-pill">
              {feedPosts.filter((p) => p.isVideoShort).length}
            </span>
          </button>
          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'popular' ? 'zenve-feed-tab-active' : ''}`}
            onClick={() => handleTabChange('popular')}
          >
            Popular
          </button>
          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'following' ? 'zenve-feed-tab-active' : ''}`}
            onClick={() => handleTabChange('following')}
          >
            Following
          </button>
        </div>

        <div className="zenve-feed-tabs-right">
          <span className="zenve-community-feed-dot" />
          <span className="zenve-community-feed-label">
            {activeTab === 'videos' || activeMainTab === 'videos' ? 'SHORTS FEED' : 'COMMUNITY FEED'}
          </span>
        </div>
      </section>

      {/* 4.5 Shorts Filter Banner if Shorts video button active */}
      {(activeTab === 'videos' || activeMainTab === 'videos') && (
        <section className="zenve-shorts-filter-banner">
          <div className="zenve-shorts-banner-left">
            <span className="zenve-shorts-banner-tag">
              <span className="zenve-shorts-live-dot" />
              SHORTS ONLY
            </span>
            <div className="zenve-shorts-banner-text">
              <h3 className="zenve-shorts-banner-title">Veterinary Short Videos &amp; Clinical Reels</h3>
              <p className="zenve-shorts-banner-desc">
                Showing {feedPosts.filter((p) => p.isVideoShort).length} video shorts posted by verified doctors. Tap any video or sound button to watch.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="zenve-shorts-show-all-btn"
            onClick={() => handleTabChange('for-you')}
          >
            Show All Posts ✕
          </button>
        </section>
      )}

      {/* 5. Instagram-Style Posts Stream for the 7 Doctors & Video Shorts */}
      <section className="zenve-feed-posts-stream">
        {(activeTab === 'videos' || activeMainTab === 'videos'
          ? feedPosts.filter((p) => p.isVideoShort)
          : feedPosts
        ).map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDoctorClick={(doctorId) => {
              const idx = stories
                .filter((s) => !s.isUser)
                .findIndex((s) => s.id === doctorId);
              if (idx !== -1) {
                handleOpenStory(idx);
              }
            }}
          />
        ))}
      </section>

      {/* 6. Interactive Story Viewer Modal */}
      {isStoryModalOpen && (
        <StoryViewerModal
          key={selectedStoryIndex}
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          onStoryViewed={handleMarkAsViewed}
        />
      )}
    </div>
  );
};

export default FeedContent;
