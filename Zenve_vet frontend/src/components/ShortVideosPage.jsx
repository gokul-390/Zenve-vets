import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SHORT_VIDEOS_DATA, VIDEO_CATEGORIES, QUALITY_OPTIONS, getQualityVideoUrl } from '../data/shortVideosData';
import '../csscomponents/ShortVideosPage.css';

export const ShortVideosPage = ({ onSelectTab, onOpenCreateProfile }) => {
  // ── State Management ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState(() => {
    try {
      return localStorage.getItem('zenve_shorts_sort_by') || 'popular';
    } catch {
      return 'popular';
    }
  });
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('zenve_shorts_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  }); // 'large' | 'grid' | 'compact' | 'list'
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Quality selector state (144p to 4K, default 1080p)
  const [videoQuality, setVideoQuality] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_video_quality');
      return saved || '1080p';
    } catch {
      return '1080p';
    }
  });
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);

  // Likes & Saves persisted in localStorage
  const [likedVideosMap, setLikedVideosMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_liked_videos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [savedVideosMap, setSavedVideosMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_saved_videos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [followingMap, setFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_following_doctors');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal Player State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoIndex, setModalVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [modalDrawerTab, setModalDrawerTab] = useState('pearls'); // 'pearls' | 'comments'
  const [newCommentText, setNewCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dynamic comments state mapping per video
  const [customCommentsMap, setCustomCommentsMap] = useState({});

  // ── Uploaded Reels persisted in localStorage ──
  const [uploadedVideos, setUploadedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_uploaded_shorts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combine user-uploaded clinical reels with pre-curated procedures
  const allReelVideos = useMemo(() => {
    return [...uploadedVideos, ...SHORT_VIDEOS_DATA];
  }, [uploadedVideos]);

  // ── Upload Reel Studio State ──
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadVideoFile, setUploadVideoFile] = useState(null);
  const [uploadVideoUrl, setUploadVideoUrl] = useState('');
  const [uploadThumbnail, setUploadThumbnail] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Surgery');
  const [uploadSpecialty, setUploadSpecialty] = useState('Chief Orthopedic Surgeon');
  const [uploadQuality, setUploadQuality] = useState('4K');
  const [uploadPearls, setUploadPearls] = useState('');
  const [uploadTags, setUploadTags] = useState(['#ClinicalPearl', '#VeterinarySurgery', '#CaseStudy']);
  const [uploadTagInput, setUploadTagInput] = useState('');
  const [uploadDuration, setUploadDuration] = useState('0:45');
  const [uploadDurationSec, setUploadDurationSec] = useState(45);
  const [uploadDoctorName, setUploadDoctorName] = useState('Dr. You');
  const [uploadDoctorClinic, setUploadDoctorClinic] = useState('Zenve Specialist Hospital & Surgery Centre');
  const [uploadDoctorLocation, setUploadDoctorLocation] = useState('Bengaluru, Karnataka');
  const [uploadConsentChecked, setUploadConsentChecked] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);

  const uploadVideoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleTogglePreviewPlay = (e) => {
    if (e) e.stopPropagation();
    if (uploadVideoRef.current) {
      if (uploadVideoRef.current.paused) {
        uploadVideoRef.current.play().catch(() => {});
        setIsPreviewPlaying(true);
      } else {
        uploadVideoRef.current.pause();
        setIsPreviewPlaying(false);
      }
    }
  };

  const modalVideoRef = useRef(null);
  const pageContainerRef = useRef(null);

  // ── Scroll Listener for Back-to-Top Button ──
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Toast Notification Helper ──
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // ── Sort & View Handlers ──
  const SORT_LABELS = {
    popular: 'Most Viewed',
    likes: 'Most Appreciated',
    comments: 'Most Discussed',
    recent: 'Recently Shared',
    oldest: 'Oldest First',
    'duration-asc': 'Quick Pearls (< 45s)',
    'duration-desc': 'In-Depth Cases (> 45s)',
    'title-asc': 'Title (A → Z)',
    'title-desc': 'Title (Z → A)',
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    try {
      localStorage.setItem('zenve_shorts_sort_by', newSort);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    showToast(`Sorted by ${SORT_LABELS[newSort] || newSort}`);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    try {
      localStorage.setItem('zenve_shorts_view_mode', newMode);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    const modeLabels = {
      large: 'Large Grid (2-3 Columns)',
      grid: 'Standard Grid (4 Columns)',
      compact: 'Compact Grid (5-6 Columns)',
      list: 'Detailed List View',
    };
    showToast(`Layout: ${modeLabels[newMode] || newMode}`);
  };

  // ── Toggle Like ──
  const handleToggleLike = (e, videoId) => {
    e.stopPropagation();
    setLikedVideosMap((prev) => {
      const isCurrentlyLiked = !!prev[videoId];
      const updated = { ...prev, [videoId]: !isCurrentlyLiked };
      try {
        localStorage.setItem('zenve_liked_videos', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      if (!isCurrentlyLiked) {
        showToast('Added to your Liked Clinical Videos ❤️');
      }
      return updated;
    });
  };

  // ── Toggle Save / Bookmark ──
  const handleToggleSave = (e, videoId) => {
    e.stopPropagation();
    setSavedVideosMap((prev) => {
      const isCurrentlySaved = !!prev[videoId];
      const updated = { ...prev, [videoId]: !isCurrentlySaved };
      try {
        localStorage.setItem('zenve_saved_videos', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      showToast(isCurrentlySaved ? 'Removed from saved' : 'Saved to your Clinical Library 🔖');
      return updated;
    });
  };

  // ── Toggle Doctor Follow ──
  const handleToggleFollow = (e, doctorId) => {
    e.stopPropagation();
    setFollowingMap((prev) => {
      const isFollowing = !!prev[doctorId];
      const updated = { ...prev, [doctorId]: !isFollowing };
      try {
        localStorage.setItem('zenve_following_doctors', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      showToast(isFollowing ? 'Unfollowed doctor' : 'Following doctor for case updates ✨');
      return updated;
    });
  };

  // ── Share Action ──
  const handleShare = (e, video) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#shorts-${video.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Clinical video link copied to clipboard! 📋');
      }).catch(() => {
        showToast('Link ready to share: ' + shareUrl);
      });
    } else {
      showToast('Link ready to share!');
    }
  };

  // ── Active Quality Object ──
  const currentQualityObj = useMemo(() => {
    return QUALITY_OPTIONS.find((q) => q.id === videoQuality) || QUALITY_OPTIONS[1];
  }, [videoQuality]);

  // ── Switch Video Quality (144p to 4K) ──
  const handleSelectQuality = (qualityObj) => {
    const video = modalVideoRef.current;
    const savedTime = video ? video.currentTime : 0;
    const wasPlaying = video ? !video.paused : true;

    setVideoQuality(qualityObj.id);
    try {
      localStorage.setItem('zenve_video_quality', qualityObj.id);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    showToast(`Streaming quality set to ${qualityObj.label} (${qualityObj.resolution}) ✨`);
    setIsQualityMenuOpen(false);

    // Maintain current playback position smoothly
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = savedTime;
        if (wasPlaying) {
          modalVideoRef.current.play().catch(() => {});
        }
      }
    }, 60);
  };

  // ── Upload Video Processing ──
  const processVideoFile = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      showToast('Please select a valid clinical video file (MP4, WebM, MOV)');
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadVideoFile(file);
    setUploadVideoUrl(url);

    const tempVid = document.createElement('video');
    tempVid.preload = 'metadata';
    tempVid.src = url;
    tempVid.onloadedmetadata = () => {
      const dur = Math.round(tempVid.duration) || 45;
      setUploadDurationSec(dur);
      const mins = Math.floor(dur / 60);
      const secs = Math.floor(dur % 60);
      setUploadDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      tempVid.currentTime = Math.min(1, dur / 2);
    };
    tempVid.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempVid.videoWidth || 720;
        canvas.height = tempVid.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(tempVid, 0, 0, canvas.width, canvas.height);
        setUploadThumbnail(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        setUploadThumbnail('https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80');
      }
    };
    showToast(`Loaded video: ${file.name} 🎬`);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const handleLoadSampleProcedure = (type = 'emergency') => {
    setUploadVideoFile(null);
    setIsPreviewPlaying(true);
    if (type === 'ultrasound') {
      setUploadVideoUrl('/videos/clinical-ultrasound-feline.webm');
      setUploadThumbnail('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80');
      setUploadTitle('Feline Cardiac Echocardiography: Left Atrial Spontaneous Contrast (SEC) Loop');
      setUploadCategory('Imaging');
      setUploadSpecialty('Veterinary Cardiology & Diagnostic Imaging');
      setUploadDuration('0:15');
      setUploadDurationSec(15);
      setUploadQuality('1080p');
      setUploadDoctorName('Dr. Sneha Reddy');
      setUploadDoctorClinic('Zenve Advanced Imaging & Cardiac Centre');
      setUploadDoctorLocation('Delhi NCR');
      setUploadPearls('B-mode echocardiographic loop demonstrating spontaneous smoke contrast in the left atrium, indicating severe blood stasis and urgent thromboembolism prophylaxis.');
      setUploadTags(['#Echocardiography', '#FelineCardiology', '#DiagnosticUltrasound', '#VetImaging']);
      setUploadConsentChecked(true);
      showToast('Loaded clinical cardiac echocardiogram sample ✨');
    } else {
      setUploadVideoUrl('/videos/clinical-procedure-emergency.webm');
      setUploadThumbnail('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80');
      setUploadTitle('Canine Acute Trauma Resuscitation: Emergency Vascular Access & Airway Stabilization');
      setUploadCategory('Emergency');
      setUploadSpecialty('Senior Veterinary Trauma Surgeon');
      setUploadDuration('1:00');
      setUploadDurationSec(60);
      setUploadQuality('1080p');
      setUploadDoctorName('Dr. Fathima Rahman');
      setUploadDoctorClinic('Kozhikode Veterinary Trauma Hospital');
      setUploadDoctorLocation('Kozhikode, Kerala');
      setUploadPearls('High-acuity ABCDE trauma resuscitation protocol: rapid vascular access, continuous capnography monitoring, and point-of-care patient stabilization under sterile operating suite conditions.');
      setUploadTags(['#EmergencyVet', '#ClinicalTrauma', '#CriticalCare', '#SurgicalAirway', '#VetMed']);
      setUploadConsentChecked(true);
      showToast('Loaded clinical emergency trauma procedure sample ✨');
    }
  };

  const handleAddTag = (tagText) => {
    const clean = tagText.trim().startsWith('#') ? tagText.trim() : `#${tagText.trim()}`;
    if (clean.length > 1 && !uploadTags.includes(clean)) {
      setUploadTags((prev) => [...prev, clean]);
      setUploadTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setUploadTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handlePublishReel = (e) => {
    e.preventDefault();
    if (!uploadVideoUrl) {
      showToast('Please upload or select a clinical video file');
      return;
    }
    if (!uploadTitle.trim()) {
      showToast('Please enter a clinical case title');
      return;
    }
    if (!uploadConsentChecked) {
      showToast('Please certify de-identification & peer consent');
      return;
    }

    const doctorAvatar =
      uploadDoctorName.includes('Fathima')
        ? '/images/doctors/fathima.jpg'
        : uploadDoctorName.includes('Sneha')
        ? '/images/doctors/sneha.jpg'
        : uploadDoctorName.includes('Arun')
        ? '/images/doctors/arun.jpg'
        : '/images/doctors/aarthi.jpg';

    const newReel = {
      id: `sv-user-${Date.now()}`,
      title: uploadTitle.trim(),
      category: uploadCategory,
      specialtyTag: uploadSpecialty,
      duration: uploadDuration,
      durationSec: uploadDurationSec,
      views: '1',
      viewsRaw: 1,
      likes: 0,
      commentsCount: 0,
      sharesCount: 0,
      defaultQuality: uploadQuality,
      thumbnail: uploadThumbnail || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      videoUrl: uploadVideoUrl,
      author: {
        id: 'user-doctor',
        name: uploadDoctorName,
        degrees: 'BVSc & AH, MVSc',
        specialty: uploadSpecialty,
        clinic: uploadDoctorClinic,
        location: uploadDoctorLocation,
        avatar: doctorAvatar,
        isVerified: true,
      },
      clinicalPearls: uploadPearls.trim() || 'De-identified clinical demonstration showing operative surgical technique and diagnostic accuracy.',
      tags: uploadTags.length > 0 ? uploadTags : ['#ClinicalReel', '#CaseStudy'],
      date: 'Just now',
      hoursAgo: 0,
      timestamp: Date.now(),
      publishedAt: new Date().toISOString(),
      featured: true,
      isUserUploaded: true,
      comments: [],
    };

    setUploadedVideos((prev) => {
      const updated = [newReel, ...prev];
      try {
        const toSave = updated.map((v) => ({
          ...v,
          thumbnail: v.thumbnail && v.thumbnail.startsWith('data:')
            ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
            : v.thumbnail,
        }));
        localStorage.setItem('zenve_uploaded_shorts', JSON.stringify(toSave));
      } catch (err) {
        console.warn('Storage warning', err);
      }
      return updated;
    });

    setIsUploadModalOpen(false);
    setSortBy('recent'); // Automatically sort by recent so it's Card #1
    showToast('Clinical Reel published to Zenve Vet™ Network! 🚀');

    // Reset fields
    setUploadTitle('');
    setUploadPearls('');
    setUploadVideoFile(null);
    setUploadVideoUrl('');
    setUploadThumbnail('');
  };

  const handleDeleteUploadedReel = (e, reelId) => {
    e.stopPropagation();
    setUploadedVideos((prev) => {
      const updated = prev.filter((v) => v.id !== reelId);
      try {
        localStorage.setItem('zenve_uploaded_shorts', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error', err);
      }
      return updated;
    });
    showToast('Uploaded clinical reel removed');
  };

  // ── Filter & Sort Pipeline (100% Precise & Reactive) ──
  const filteredVideos = useMemo(() => {
    return allReelVideos.filter((video) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (video.category !== selectedCategory) {
          return false;
        }
      }

      // Search match (title, surgeon name, tags, pearls)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesDoctor = video.author.name.toLowerCase().includes(query);
        const matchesSpecialty = video.author.specialty.toLowerCase().includes(query);
        const matchesTags = video.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesPearls = video.clinicalPearls.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDoctor && !matchesSpecialty && !matchesTags && !matchesPearls) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // 1. Most Viewed: Highest raw view count first
      if (sortBy === 'popular') {
        const diff = (b.viewsRaw || 0) - (a.viewsRaw || 0);
        if (diff !== 0) return diff;
        return (b.timestamp || 0) - (a.timestamp || 0);
      }

      // 2. Most Appreciated: Highest likes first (includes active user likes dynamically)
      if (sortBy === 'likes') {
        const likesA = (a.likes || 0) + (likedVideosMap[a.id] ? 1 : 0);
        const likesB = (b.likes || 0) + (likedVideosMap[b.id] ? 1 : 0);
        const diff = likesB - likesA;
        if (diff !== 0) return diff;
        return (b.viewsRaw || 0) - (a.viewsRaw || 0);
      }

      // 3. Most Discussed: Highest peer comment count first (includes user posted comments)
      if (sortBy === 'comments') {
        const commentsA = (a.commentsCount || 0) + (customCommentsMap[a.id]?.length || 0);
        const commentsB = (b.commentsCount || 0) + (customCommentsMap[b.id]?.length || 0);
        const diff = commentsB - commentsA;
        if (diff !== 0) return diff;
        return (b.viewsRaw || 0) - (a.viewsRaw || 0);
      }

      // 4. Recently Shared: Newest cases first (e.g. 2h ago before 6d ago)
      if (sortBy === 'recent') {
        if (b.timestamp !== undefined && a.timestamp !== undefined) {
          const diff = b.timestamp - a.timestamp;
          if (diff !== 0) return diff;
        }
        return (a.hoursAgo || 0) - (b.hoursAgo || 0);
      }

      // 5. Oldest First: Earliest archived cases first (e.g. 6d ago before 2h ago)
      if (sortBy === 'oldest') {
        if (a.timestamp !== undefined && b.timestamp !== undefined) {
          const diff = a.timestamp - b.timestamp;
          if (diff !== 0) return diff;
        }
        return (b.hoursAgo || 0) - (a.hoursAgo || 0);
      }

      // 6. Quick Pearls: Shortest duration in seconds first
      if (sortBy === 'duration-asc') {
        const diff = (a.durationSec || 0) - (b.durationSec || 0);
        if (diff !== 0) return diff;
        return (b.viewsRaw || 0) - (a.viewsRaw || 0);
      }

      // 7. In-Depth Cases: Longest duration in seconds first
      if (sortBy === 'duration-desc') {
        const diff = (b.durationSec || 0) - (a.durationSec || 0);
        if (diff !== 0) return diff;
        return (b.viewsRaw || 0) - (a.viewsRaw || 0);
      }

      // 8. Title A → Z: Natural case-insensitive alphabetical
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true });
      }

      // 9. Title Z → A: Reverse alphabetical
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title, undefined, { sensitivity: 'base', numeric: true });
      }

      return 0;
    });
  }, [allReelVideos, searchQuery, selectedCategory, sortBy, likedVideosMap, customCommentsMap]);

  // ── Open Fullscreen Reel Modal ──
  const openModal = (video) => {
    const idx = filteredVideos.findIndex((v) => v.id === video.id);
    setModalVideoIndex(idx >= 0 ? idx : 0);
    setIsModalOpen(true);
    setIsPlaying(true);
    setProgressPercent(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
  };

  const handleNextVideo = React.useCallback(() => {
    if (modalVideoIndex < filteredVideos.length - 1) {
      setModalVideoIndex((prev) => prev + 1);
      setProgressPercent(0);
      setIsPlaying(true);
    }
  }, [modalVideoIndex, filteredVideos.length]);

  const handlePrevVideo = React.useCallback(() => {
    if (modalVideoIndex > 0) {
      setModalVideoIndex((prev) => prev - 1);
      setProgressPercent(0);
      setIsPlaying(true);
    }
  }, [modalVideoIndex]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handlePrevVideo();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleNextVideo, handlePrevVideo]);

  // Synchronize HTML5 video playback and autoplay policy
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isModalOpen) return;

    video.muted = isMuted;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay restricted by browser policy; muting and retrying:', err);
          video.muted = true;
          setIsMuted(true);
          video.play().catch((e) => console.warn('Muted play error:', e));
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, isModalOpen, modalVideoIndex, isMuted]);

  // Synchronize dynamic mute toggle
  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle Video Time Update for Scrubber
  const handleTimeUpdate = () => {
    if (modalVideoRef.current && modalVideoRef.current.duration) {
      const pct = (modalVideoRef.current.currentTime / modalVideoRef.current.duration) * 100;
      setProgressPercent(pct);
    }
  };

  // Post a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const currentVid = filteredVideos[modalVideoIndex];
    if (!currentVid) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: 'Dr. You (Your Practice)',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    setCustomCommentsMap((prev) => {
      const existing = prev[currentVid.id] || currentVid.comments || [];
      return {
        ...prev,
        [currentVid.id]: [newComment, ...existing],
      };
    });

    setNewCommentText('');
    showToast('Peer clinical comment posted! 💬');
  };

  const activeModalVideo = filteredVideos[modalVideoIndex];
  const activeComments = activeModalVideo
    ? (customCommentsMap[activeModalVideo.id] || activeModalVideo.comments || [])
    : [];

  return (
    <div className="zenve-shorts-page" ref={pageContainerRef}>
      {/* ── Hero Banner ── */}
      <section className="zenve-shorts-hero">
        <div className="zenve-shorts-hero-content">
          <div className="zenve-shorts-tagline-badge">
            <span className="zenve-live-pulse-dot" />
            <span>CLINICAL REELS &amp; SURGICAL SHORTS</span>
          </div>
          <h1 className="zenve-shorts-title">
            Precision in Motion. <span>Knowledge in Seconds.</span>
          </h1>
          <p className="zenve-shorts-subtitle">
            Explore de-identified clinical procedures, diagnostic pearls, ultrasound loops, and operative techniques shared by vetted veterinary specialists across India and worldwide.
          </p>

          <div className="zenve-shorts-stats-row">
            <div className="zenve-stat-chip">
              <span className="zenve-stat-num">{allReelVideos.length}</span>
              <span>Curated Clinical Cases</span>
            </div>
            <div className="zenve-stat-chip">
              <span className="zenve-stat-num">18</span>
              <span>Verified Surgeons &amp; Clinicians</span>
            </div>
            <div className="zenve-stat-chip">
              <span className="zenve-stat-num">100%</span>
              <span>Peer-Reviewed Discussion</span>
            </div>
            <button
              type="button"
              className="zenve-stat-chip zenve-hero-upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title="Share and publish your clinical video reel"
            >
              📹 + Upload Clinical Reel
            </button>
            {typeof onOpenCreateProfile === 'function' && (
              <button
                type="button"
                className="zenve-stat-chip zenve-hero-cta-btn"
                onClick={onOpenCreateProfile}
              >
                + Join as Verified Surgeon
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Control Bar: Search & Category Pills ── */}
      <section className="zenve-shorts-controls">
        <div className="zenve-controls-top-row">
          {/* Search bar */}
          <div className="zenve-shorts-search-wrapper">
            <span className="zenve-shorts-search-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="zenve-shorts-search-input"
              placeholder="Search surgical technique, condition, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="zenve-search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & View Actions */}
          <div className="zenve-controls-actions">
            <div className="zenve-sort-wrapper">
              <span className="zenve-sort-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M6 12h12M10 18h4" />
                </svg>
              </span>
              <select
                className="zenve-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                aria-label="Sort clinical videos by"
              >
                <option value="popular">🔥 Most Viewed</option>
                <option value="likes">❤️ Most Appreciated</option>
                <option value="comments">💬 Most Discussed</option>
                <option value="recent">⏱️ Recently Shared</option>
                <option value="oldest">📅 Oldest First</option>
                <option value="duration-asc">⚡ Quick Pearls (&lt; 45s)</option>
                <option value="duration-desc">🎓 In-Depth Cases (&gt; 45s)</option>
                <option value="title-asc">🔤 Title (A → Z)</option>
                <option value="title-desc">🔤 Title (Z → A)</option>
              </select>
              <span className="zenve-sort-chevron" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {/* View Mode Toggle Group (Large, Standard, Compact, List) */}
            <div className="zenve-view-toggle-group" role="group" aria-label="Select grid layout view">
              <button
                type="button"
                className={`zenve-view-btn ${viewMode === 'large' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('large')}
                title="Large Grid View (2-3 columns, expanded pearls)"
                aria-label="Large Grid View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="18" rx="2" />
                  <rect x="13" y="3" width="8" height="18" rx="2" />
                </svg>
                <span>Large</span>
              </button>

              <button
                type="button"
                className={`zenve-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('grid')}
                title="Standard Grid View (4 columns)"
                aria-label="Standard Grid View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span>Standard</span>
              </button>

              <button
                type="button"
                className={`zenve-view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('compact')}
                title="Compact Grid View (5-6 columns, dense view)"
                aria-label="Compact Grid View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="5" height="8" rx="1" />
                  <rect x="9.5" y="3" width="5" height="8" rx="1" />
                  <rect x="17" y="3" width="5" height="8" rx="1" />
                  <rect x="2" y="13" width="5" height="8" rx="1" />
                  <rect x="9.5" y="13" width="5" height="8" rx="1" />
                  <rect x="17" y="13" width="5" height="8" rx="1" />
                </svg>
                <span>Compact</span>
              </button>

              <button
                type="button"
                className={`zenve-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('list')}
                title="Detailed List / Feed View"
                aria-label="Detailed List View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <rect x="3" y="4" width="3" height="4" rx="0.5" />
                  <rect x="3" y="10" width="3" height="4" rx="0.5" />
                  <rect x="3" y="16" width="3" height="4" rx="0.5" />
                </svg>
                <span>List</span>
              </button>
            </div>

            {/* ── Ultra-Premium Upload Clinical Reel Button ── */}
            <button
              type="button"
              className="zenve-upload-reel-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload and Share Clinical Reel"
              id="upload-clinical-reel-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="3" ry="3" />
                <line x1="8.5" y1="9" x2="8.5" y2="15" />
                <line x1="5.5" y1="12" x2="11.5" y2="12" />
              </svg>
              <span>+ Upload Reel</span>
            </button>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="zenve-category-pills-row">
          {VIDEO_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`zenve-category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="zenve-cat-count-badge">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Active Results Info ── */}
      <div className="zenve-active-filters-info">
        <span className="zenve-results-counter">
          Showing <strong>{filteredVideos.length}</strong> clinical video reels
          {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
          <span className="zenve-active-sort-tag">
            • Sorted by: <strong>{SORT_LABELS[sortBy] || sortBy}</strong>
          </span>
          <span className="zenve-active-layout-tag">
            • {viewMode === 'large' ? 'Large Grid (2-3 Cols)' : viewMode === 'compact' ? 'Compact Grid (5-6 Cols)' : viewMode === 'list' ? 'Detailed List View' : 'Standard Grid (4 Cols)'}
          </span>
        </span>
      </div>

      {/* ── Short Videos Gallery (Dynamic Grid or List View) ── */}
      <section className={`zenve-shorts-grid view-${viewMode}`} aria-label="Clinical Short Videos Gallery">
        {filteredVideos.map((video) => {
          const isLiked = !!likedVideosMap[video.id];
          const isSaved = !!savedVideosMap[video.id];
          const isHovered = hoveredCardId === video.id;

          // Detailed List / Feed View Card
          if (viewMode === 'list') {
            return (
              <article
                key={video.id}
                className={`zenve-short-list-card ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredCardId(video.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => openModal(video)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') openModal(video);
                }}
                aria-label={`${video.title} by ${video.author.name}`}
              >
                {/* Left Media Reel Preview (9:16 portrait) */}
                <div className="zenve-list-card-media">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="zenve-card-poster-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {isHovered && video.videoUrl && (
                    <video
                      src={video.videoUrl}
                      className="zenve-card-hover-video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                    />
                  )}
                  <div className="zenve-card-overlay-top" />
                  <div className="zenve-card-overlay-bottom" />

                  <div className="zenve-list-media-top-badges">
                    <span className="zenve-card-category-tag">{video.category}</span>
                    <span
                      className={`zenve-card-duration-badge ${sortBy === 'duration-asc' || sortBy === 'duration-desc' ? 'is-active-sort-metric' : ''}`}
                      title={`Video duration: ${video.duration}`}
                    >
                      <span className="zenve-duration-icon-container" aria-hidden="true">
                        <svg className="zenve-play-arrow" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                        <span className="zenve-soundwave-bars">
                          <span className="zenve-sound-bar" />
                          <span className="zenve-sound-bar" />
                          <span className="zenve-sound-bar" />
                        </span>
                      </span>
                      <span className="zenve-duration-value">{video.duration}</span>
                    </span>
                  </div>

                  <div className="zenve-card-center-play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>

                  <div className="zenve-list-media-bottom-badge">
                    <span className="zenve-card-quality-tag">{video.defaultQuality || '1080p'}</span>
                  </div>
                </div>

                {/* Right Content Dossier */}
                <div className="zenve-list-card-content">
                  <div className="zenve-list-card-header">
                    <div className="zenve-list-spec-badge-group">
                      <span className="zenve-list-spec-tag">{video.specialtyTag}</span>
                      <span className={`zenve-list-date-tag ${sortBy === 'recent' || sortBy === 'oldest' ? 'is-active-sort-metric' : ''}`}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-1px', marginRight: '4px' }}>
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{video.date || 'Recent Case'}</span>
                      </span>
                    </div>

                    <div className="zenve-list-quick-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`zenve-card-rail-btn ${isLiked ? 'is-liked' : ''}`}
                        onClick={(e) => handleToggleLike(e, video.id)}
                        title={isLiked ? 'Liked' : 'Like video'}
                        aria-label="Like video"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={`zenve-card-rail-btn ${isSaved ? 'is-saved' : ''}`}
                        onClick={(e) => handleToggleSave(e, video.id)}
                        title={isSaved ? 'Saved to library' : 'Save to library'}
                        aria-label="Save to library"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="zenve-card-rail-btn"
                        onClick={(e) => handleShare(e, video)}
                        title="Share video link"
                        aria-label="Share video link"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <h3 className={`zenve-list-card-title ${sortBy === 'title-asc' || sortBy === 'title-desc' ? 'is-active-sort-metric' : ''}`}>
                    {video.title}
                  </h3>

                  {/* Author Bio Row */}
                  <div
                    className="zenve-list-author-row"
                    onClick={(e) => {
                      if (typeof onSelectTab === 'function') {
                        e.stopPropagation();
                        onSelectTab('network');
                      }
                    }}
                    title="View Specialist Directory"
                    style={{ cursor: typeof onSelectTab === 'function' ? 'pointer' : 'default' }}
                  >
                    <img
                      src={video.author.avatar}
                      alt={video.author.name}
                      className="zenve-card-author-avatar"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/doctors/priya.jpg';
                      }}
                    />
                    <div className="zenve-list-author-meta">
                      <div className="zenve-card-author-name">
                        {video.author.name}
                        {video.author.isVerified && (
                          <span className="zenve-verified-check" title="Verified Specialist">✓</span>
                        )}
                        <span className="zenve-list-doc-degree">• {video.author.degrees}</span>
                      </div>
                      <div className="zenve-card-author-spec">
                        {video.author.clinic} — {video.author.location}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`zenve-reel-follow-btn ${followingMap[video.author.id] ? 'following' : ''}`}
                      onClick={(e) => handleToggleFollow(e, video.author.id)}
                      aria-pressed={!!followingMap[video.author.id]}
                      title={followingMap[video.author.id] ? `Following ${video.author.name}` : `Follow ${video.author.name}`}
                    >
                      {followingMap[video.author.id] ? '✓ Following' : '+ Follow'}
                    </button>
                  </div>

                  {/* Clinical Pearl Box */}
                  <div className="zenve-list-pearl-box">
                    <div className="zenve-list-pearl-label">
                      <span>💡 Surgical &amp; Diagnostic Takeaway:</span>
                    </div>
                    <p className="zenve-list-pearl-text">{video.clinicalPearls}</p>
                  </div>

                  {/* Tags & Footer */}
                  <div className="zenve-list-card-footer">
                    <div className="zenve-list-tags-row">
                      {video.tags.map((tag) => (
                        <span key={tag} className="zenve-list-tag-pill">{tag}</span>
                      ))}
                    </div>

                    <div className="zenve-list-footer-right">
                      <div className="zenve-card-metrics-row">
                        <span
                          className={`zenve-card-metric-item ${sortBy === 'popular' ? 'is-active-sort-metric' : ''}`}
                          title={`Total Views: ${video.viewsRaw?.toLocaleString() || video.views}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>{video.views}</span>
                        </span>
                        <span
                          className={`zenve-card-metric-item ${sortBy === 'likes' ? 'is-active-sort-metric' : ''}`}
                          title={`Specialist Likes: ${(video.likes + (isLiked ? 1 : 0)).toLocaleString()}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill={isLiked || sortBy === 'likes' ? '#ff4757' : 'none'} stroke={isLiked || sortBy === 'likes' ? '#ff4757' : 'currentColor'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <span>{video.likes + (isLiked ? 1 : 0)}</span>
                        </span>
                        <span
                          className={`zenve-card-metric-item ${sortBy === 'comments' ? 'is-active-sort-metric' : ''}`}
                          title={`Clinical Comments: ${(video.commentsCount + (customCommentsMap[video.id]?.length || 0)).toLocaleString()}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>{video.commentsCount + (customCommentsMap[video.id]?.length || 0)}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="zenve-list-watch-cta"
                        onClick={() => openModal(video)}
                      >
                        <span>Watch Reel</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          }

          // Grid View Cards (Large, Standard 4-Col, Compact 5-6 Col)
          return (
            <article
              key={video.id}
              className={`zenve-short-card ${isHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredCardId(video.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => openModal(video)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openModal(video);
              }}
              aria-label={`${video.title} by ${video.author.name}`}
            >
              {/* Media Wrap with Poster Image & Hover Video */}
              <div className="zenve-card-media-wrap">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="zenve-card-poster-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Looping preview on hover */}
                {isHovered && video.videoUrl && (
                  <video
                    src={video.videoUrl}
                    className="zenve-card-hover-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                  />
                )}
              </div>

              {/* Gradient Vignettes */}
              <div className="zenve-card-overlay-top" />
              <div className="zenve-card-overlay-bottom" />

              {/* Top Header inside Card (Multi-Row Guaranteed Alignment) */}
              <div className="zenve-card-top-header">
                {/* Row 1: Category on left, Quality Tag & Duration on right */}
                <div className="zenve-card-top-bar">
                  <span className="zenve-card-category-tag">{video.category}</span>
                  <div className="zenve-card-top-right">
                    <span className="zenve-card-quality-tag">{video.defaultQuality || '1080p'}</span>
                    <span
                      className={`zenve-card-duration-badge ${sortBy === 'duration-asc' || sortBy === 'duration-desc' ? 'is-active-sort-metric' : ''}`}
                      title={`Video duration: ${video.duration}`}
                    >
                      <span className="zenve-duration-icon-container" aria-hidden="true">
                        <svg className="zenve-play-arrow" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                        <span className="zenve-soundwave-bars">
                          <span className="zenve-sound-bar" />
                          <span className="zenve-sound-bar" />
                          <span className="zenve-sound-bar" />
                        </span>
                      </span>
                      <span className="zenve-duration-value">{video.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Row 2: Sort Highlight Badge when sorted by Recently Shared or Oldest */}
                {(sortBy === 'recent' || sortBy === 'oldest') && (
                  <div className="zenve-card-sort-row">
                    <span className="zenve-card-date-badge is-active-sort-metric" title={`Published ${video.date}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{video.date}</span>
                    </span>
                  </div>
                )}

                {video.isUserUploaded && sortBy !== 'recent' && sortBy !== 'oldest' && (
                  <div className="zenve-card-sort-row">
                    <span className="zenve-user-reel-badge" title="Your uploaded clinical reel">
                      ★ Your Reel
                    </span>
                  </div>
                )}
              </div>

              {/* Center Floating Glowing Play Icon */}
              <div className="zenve-card-center-play">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>

              {/* Quick Action Rail (Slide In on Hover) */}
              <div className="zenve-card-action-rail">
                {video.isUserUploaded && (
                  <button
                    type="button"
                    className="zenve-card-rail-btn zenve-delete-reel-btn"
                    onClick={(e) => handleDeleteUploadedReel(e, video.id)}
                    title="Delete your uploaded clinical reel"
                    aria-label="Delete uploaded reel"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  className={`zenve-card-rail-btn ${isLiked ? 'is-liked' : ''}`}
                  onClick={(e) => handleToggleLike(e, video.id)}
                  title={isLiked ? 'Liked' : 'Like video'}
                  aria-label="Like video"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`zenve-card-rail-btn ${isSaved ? 'is-saved' : ''}`}
                  onClick={(e) => handleToggleSave(e, video.id)}
                  title={isSaved ? 'Saved to library' : 'Save to library'}
                  aria-label="Save to library"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="zenve-card-rail-btn"
                  onClick={(e) => handleShare(e, video)}
                  title="Share video link"
                  aria-label="Share video link"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>

              {/* Bottom Content inside Card */}
              <div className="zenve-card-bottom-info">
                {/* Author row */}
                <div
                  className="zenve-card-author-row"
                  onClick={(e) => {
                    if (typeof onSelectTab === 'function') {
                      e.stopPropagation();
                      onSelectTab('network');
                    }
                  }}
                  title="View Specialist Directory"
                  style={{ cursor: typeof onSelectTab === 'function' ? 'pointer' : 'default' }}
                >
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    className="zenve-card-author-avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/doctors/priya.jpg';
                    }}
                  />
                  <div className="zenve-card-author-text">
                    <span className="zenve-card-author-name">
                      {video.author.name}
                      {video.author.isVerified && (
                        <span className="zenve-verified-check" title="Verified Specialist">✓</span>
                      )}
                    </span>
                    <span className="zenve-card-author-spec">
                      {video.author.specialty}
                    </span>
                  </div>
                </div>

                {/* Video Title */}
                <h3 className={`zenve-card-video-title ${sortBy === 'title-asc' || sortBy === 'title-desc' ? 'is-active-sort-metric' : ''}`}>
                  {video.title}
                </h3>

                {/* Metrics */}
                <div className="zenve-card-metrics-row">
                  <span
                    className={`zenve-card-metric-item ${sortBy === 'popular' ? 'is-active-sort-metric' : ''}`}
                    title={`Total Views: ${video.viewsRaw?.toLocaleString() || video.views}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>{video.views}</span>
                  </span>

                  <span
                    className={`zenve-card-metric-item ${sortBy === 'likes' ? 'is-active-sort-metric' : ''}`}
                    title={`Specialist Likes: ${(video.likes + (isLiked ? 1 : 0)).toLocaleString()}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={isLiked || sortBy === 'likes' ? '#ff4757' : 'none'} stroke={isLiked || sortBy === 'likes' ? '#ff4757' : 'currentColor'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{video.likes + (isLiked ? 1 : 0)}</span>
                  </span>

                  <span
                    className={`zenve-card-metric-item ${sortBy === 'comments' ? 'is-active-sort-metric' : ''}`}
                    title={`Clinical Comments: ${(video.commentsCount + (customCommentsMap[video.id]?.length || 0)).toLocaleString()}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{video.commentsCount + (customCommentsMap[video.id]?.length || 0)}</span>
                  </span>
                </div>

                {/* Clinical Pearl Peek on Hover (Permanently visible in Large Grid) */}
                <div className="zenve-card-pearl-badge">
                  💡 <strong>Pearl:</strong> {video.clinicalPearls.slice(0, 85)}...
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── Empty State ── */}
      {filteredVideos.length === 0 && (
        <div className="zenve-shorts-empty-state">
          <p className="zenve-shorts-empty-title">No clinical videos found matching your filter.</p>
          <p style={{ margin: '0 0 16px 0', fontSize: '13.5px' }}>Try adjusting your search keywords or choosing a different clinical category.</p>
          <button
            type="button"
            className="zenve-category-pill active"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ── Floating Back to Top Button ── */}
      {showScrollTop && (
        <button
          type="button"
          className="zenve-scroll-top-btn"
          onClick={scrollToTop}
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="zenve-shorts-toast" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Fullscreen Interactive Reel Player Modal ── */}
      {isModalOpen && activeModalVideo && (
        <div
          className="zenve-shorts-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            className="zenve-modal-close-btn"
            onClick={closeModal}
            title="Close reel player (Esc)"
            aria-label="Close reel player"
          >
            ✕
          </button>

          <div
            className="zenve-shorts-modal-stage"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Video Arrow */}
            <button
              type="button"
              className="zenve-modal-nav-arrow"
              onClick={handlePrevVideo}
              disabled={modalVideoIndex === 0}
              title="Previous Video (Arrow Up / Left)"
              aria-label="Previous Video"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Vertical Reel Phone Frame */}
            <div className="zenve-reel-phone-frame">
              {/* Progress Bar Scrubber */}
              <div
                className="zenve-reel-progress-track"
                onClick={(e) => {
                  if (modalVideoRef.current && modalVideoRef.current.duration) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const fraction = clickX / rect.width;
                    modalVideoRef.current.currentTime = fraction * modalVideoRef.current.duration;
                  }
                }}
              >
                <div
                  className="zenve-reel-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Video Element with Dynamic Resolution (144p to 4K) */}
              <video
                ref={modalVideoRef}
                src={getQualityVideoUrl(activeModalVideo.videoUrl, videoQuality)}
                poster={activeModalVideo.thumbnail}
                className="zenve-reel-video-element"
                autoPlay={isPlaying}
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={() => setIsPlaying((p) => !p)}
              />

              {/* Center Play Overlay when Paused */}
              {!isPlaying && (
                <div
                  className="zenve-reel-center-play-overlay"
                  onClick={() => setIsPlaying(true)}
                  title="Click to play"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </div>
              )}

              {/* Reel Top Bar with Specialty & Quality Selector */}
              <div className="zenve-reel-top-controls">
                <span className="zenve-reel-category-pill">
                  {activeModalVideo.specialtyTag}
                </span>

                <div className="zenve-reel-top-right-group">
                  {/* Quality Selector Button (144p to 4K) */}
                  <button
                    type="button"
                    className="zenve-reel-quality-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQualityMenuOpen((prev) => !prev);
                    }}
                    title="Change picture quality (144p to 4K)"
                    aria-label="Change video resolution"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>{currentQualityObj.badge}</span>
                  </button>

                  {/* Quality Dropdown Menu */}
                  {isQualityMenuOpen && (
                    <div
                      className="zenve-quality-menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="zenve-quality-menu-header">
                        <span>Streaming Quality</span>
                        <span>144p - 4K</span>
                      </div>
                      {QUALITY_OPTIONS.map((opt) => {
                        const isSel = videoQuality === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={`zenve-quality-option-row ${isSel ? 'is-selected' : ''}`}
                            onClick={() => handleSelectQuality(opt)}
                          >
                            <div className="zenve-quality-left-label">
                              <span className="zenve-quality-title">{opt.label}</span>
                              <span className="zenve-quality-desc">{opt.desc}</span>
                            </div>
                            {isSel && <span className="zenve-quality-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    className="zenve-reel-sound-toggle"
                    onClick={() => setIsMuted((m) => !m)}
                    title={isMuted ? 'Unmute audio' : 'Mute audio'}
                    aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                  >
                    {isMuted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Side Action Bar */}
              <div className="zenve-reel-action-bar">
                {/* Like */}
                <div className="zenve-reel-action-unit">
                  <button
                    type="button"
                    className={`zenve-reel-circle-btn ${likedVideosMap[activeModalVideo.id] ? 'is-active-like' : ''}`}
                    onClick={(e) => handleToggleLike(e, activeModalVideo.id)}
                    title="Like video"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={likedVideosMap[activeModalVideo.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <span className="zenve-reel-action-label">
                    {activeModalVideo.likes + (likedVideosMap[activeModalVideo.id] ? 1 : 0)}
                  </span>
                </div>

                {/* Comments Drawer Toggle */}
                <div className="zenve-reel-action-unit">
                  <button
                    type="button"
                    className="zenve-reel-circle-btn"
                    onClick={() => setModalDrawerTab('comments')}
                    title="View comments"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <span className="zenve-reel-action-label">
                    {(activeModalVideo.commentsCount || 0) + (customCommentsMap[activeModalVideo.id]?.length || 0)}
                  </span>
                </div>

                {/* Bookmark */}
                <div className="zenve-reel-action-unit">
                  <button
                    type="button"
                    className={`zenve-reel-circle-btn ${savedVideosMap[activeModalVideo.id] ? 'is-active-save' : ''}`}
                    onClick={(e) => handleToggleSave(e, activeModalVideo.id)}
                    title="Save to Clinical Library"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill={savedVideosMap[activeModalVideo.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <span className="zenve-reel-action-label">Save</span>
                </div>

                {/* Share */}
                <div className="zenve-reel-action-unit">
                  <button
                    type="button"
                    className="zenve-reel-circle-btn"
                    onClick={(e) => handleShare(e, activeModalVideo)}
                    title="Share video"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                  <span className="zenve-reel-action-label">Share</span>
                </div>

                {/* Quality */}
                <div className="zenve-reel-action-unit">
                  <button
                    type="button"
                    className="zenve-reel-circle-btn"
                    onClick={() => setIsQualityMenuOpen((p) => !p)}
                    title="Change picture quality (144p to 4K)"
                    style={{
                      border: '1.5px solid rgba(201, 151, 56, 0.7)',
                      color: '#f7d58b',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {currentQualityObj.badge}
                  </button>
                  <span className="zenve-reel-action-label">Quality</span>
                </div>
              </div>

              {/* Bottom Metadata inside Player */}
              <div className="zenve-reel-bottom-meta">
                <div className="zenve-reel-author-card">
                  <img
                    src={activeModalVideo.author.avatar}
                    alt={activeModalVideo.author.name}
                    className="zenve-reel-avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/doctors/priya.jpg';
                    }}
                  />
                  <div className="zenve-reel-author-details">
                    <span className="zenve-reel-author-name">
                      {activeModalVideo.author.name}
                      <span className="zenve-verified-check">✓</span>
                    </span>
                    <span className="zenve-reel-author-clinic">
                      {activeModalVideo.author.clinic}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`zenve-reel-follow-btn ${followingMap[activeModalVideo.author.id] ? 'following' : ''}`}
                    onClick={(e) => handleToggleFollow(e, activeModalVideo.author.id)}
                    aria-pressed={!!followingMap[activeModalVideo.author.id]}
                    title={followingMap[activeModalVideo.author.id] ? `Following ${activeModalVideo.author.name}` : `Follow ${activeModalVideo.author.name}`}
                  >
                    {followingMap[activeModalVideo.author.id] ? '✓ Following' : '+ Follow'}
                  </button>
                </div>

                <p className="zenve-reel-title-text">{activeModalVideo.title}</p>

                <div className="zenve-reel-tags-wrap">
                  {activeModalVideo.tags.map((tag) => (
                    <span key={tag} className="zenve-reel-tag-item">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Video Arrow */}
            <button
              type="button"
              className="zenve-modal-nav-arrow"
              onClick={handleNextVideo}
              disabled={modalVideoIndex === filteredVideos.length - 1}
              title="Next Video (Arrow Down / Right)"
              aria-label="Next Video"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Right Side Drawer: Clinical Pearls & Discussion */}
            <aside className="zenve-modal-side-drawer">
              <div className="zenve-drawer-header">
                <div className="zenve-drawer-tabs">
                  <button
                    type="button"
                    className={`zenve-drawer-tab-btn ${modalDrawerTab === 'pearls' ? 'active' : ''}`}
                    onClick={() => setModalDrawerTab('pearls')}
                  >
                    Clinical Pearls
                  </button>
                  <button
                    type="button"
                    className={`zenve-drawer-tab-btn ${modalDrawerTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setModalDrawerTab('comments')}
                  >
                    Discussion ({(activeModalVideo.commentsCount || 0) + (customCommentsMap[activeModalVideo.id]?.length || 0)})
                  </button>
                </div>
              </div>

              <div className="zenve-drawer-body">
                {modalDrawerTab === 'pearls' ? (
                  <div>
                    <div className="zenve-pearl-card-box">
                      <div className="zenve-pearl-box-title">
                        <span>💡 Surgical Takeaway</span>
                      </div>
                      <p className="zenve-pearl-box-text">
                        {activeModalVideo.clinicalPearls}
                      </p>
                    </div>

                    <div className="zenve-pearl-card-box">
                      <div className="zenve-pearl-box-title">
                        <span>🩺 Surgeon Details</span>
                      </div>
                      <p className="zenve-pearl-box-text">
                        <strong>{activeModalVideo.author.name}</strong>
                        <br />
                        <span style={{ fontSize: '12px', color: '#687770' }}>
                          {activeModalVideo.author.degrees}
                        </span>
                        <br />
                        <span style={{ fontSize: '12px', color: '#687770' }}>
                          {activeModalVideo.author.location}
                        </span>
                      </p>
                    </div>

                    <div className="zenve-pearl-card-box">
                      <div className="zenve-pearl-box-title">
                        <span>🛡️ Ethical Statement</span>
                      </div>
                      <p className="zenve-pearl-box-text" style={{ fontSize: '12px', color: '#687770' }}>
                        De-identified clinical material shared under owner surgical consent for continuing veterinary medical education and scientific peer review.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="zenve-drawer-comments-list">
                    {activeComments.map((cm) => (
                      <div key={cm.id} className="zenve-drawer-comment-item">
                        <div className="zenve-comment-avatar">
                          {cm.author.slice(3, 5).toUpperCase()}
                        </div>
                        <div className="zenve-comment-content">
                          <div className="zenve-comment-author-name">
                            <span>{cm.author}</span>
                            <span className="zenve-comment-time">{cm.time}</span>
                          </div>
                          <p className="zenve-comment-text">{cm.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Input Footer */}
              {modalDrawerTab === 'comments' && (
                <form className="zenve-drawer-comment-footer" onSubmit={handleAddComment}>
                  <input
                    type="text"
                    className="zenve-comment-input"
                    placeholder="Add peer clinical note..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button type="submit" className="zenve-comment-send-btn">
                    Post
                  </button>
                </form>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* ── Ultra-Premium Upload Clinical Reel Studio Modal ── */}
      {isUploadModalOpen && (
        <div
          className="zenve-upload-modal-backdrop"
          onClick={() => setIsUploadModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
        >
          <div
            className="zenve-upload-modal-stage"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="zenve-upload-modal-header">
              <div className="zenve-upload-header-left">
                <div className="zenve-upload-pill-badge">
                  <span className="zenve-live-pulse-dot" />
                  <span>CLINICAL REEL STUDIO • VERIFIED SPECIALIST</span>
                </div>
                <h2 id="upload-modal-title" className="zenve-upload-modal-title">
                  Share Clinical Procedure or Diagnostic Reel
                </h2>
                <p className="zenve-upload-modal-subtitle">
                  Broadcast de-identified 9:16 vertical technique videos (&lt; 60s) to veterinary clinicians and surgeons.
                </p>
              </div>

              <button
                type="button"
                className="zenve-upload-modal-close"
                onClick={() => setIsUploadModalOpen(false)}
                title="Close studio (Esc)"
                aria-label="Close studio"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: 2-Column Studio */}
            <form onSubmit={handlePublishReel} className="zenve-upload-form">
              <div className="zenve-upload-modal-body">
                {/* Left Column: 9:16 Media Zone & Live Preview */}
                <div className="zenve-upload-left-pane">
                  <div className="zenve-upload-pane-heading">
                    <span>1. Procedure Video (9:16)</span>
                    {uploadDuration && (
                      <span className="zenve-upload-duration-pill">⏱️ {uploadDuration}</span>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="video/mp4,video/webm,video/quicktime,video/mov"
                    style={{ display: 'none' }}
                  />

                  {uploadVideoUrl ? (
                    <div className="zenve-upload-live-preview-box">
                      <div
                        className="zenve-upload-preview-phone"
                        onClick={handleTogglePreviewPlay}
                        title="Click to play / pause procedure video"
                      >
                        {/* Authentic Phone Speaker & Camera Notch */}
                        <div className="zenve-upload-phone-notch">
                          <span className="zenve-phone-speaker-bar" />
                          <span className="zenve-phone-camera-lens" />
                        </div>

                        {/* Top and Bottom Vignettes for High Contrast Overlays */}
                        <div className="zenve-upload-phone-vignette-top" />
                        <div className="zenve-upload-phone-vignette-bottom" />

                        {/* Video Element (Covers 100% of 9:16 Stage) */}
                        <video
                          ref={uploadVideoRef}
                          src={uploadVideoUrl}
                          className="zenve-upload-preview-video"
                          autoPlay
                          loop
                          muted={isPreviewMuted}
                          playsInline
                        />

                        {/* Center Play Icon when Paused */}
                        {!isPreviewPlaying && (
                          <div className="zenve-upload-preview-center-play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="6,3 20,12 6,21" />
                            </svg>
                          </div>
                        )}

                        {/* Top badges preview: Category on Left, Uniform Gold Duration on Right */}
                        <div className="zenve-upload-preview-top-bar">
                          <span className="zenve-card-category-tag">{uploadCategory}</span>
                          <span className="zenve-card-duration-badge">
                            <span className="zenve-duration-icon-container">
                              <svg className="zenve-play-arrow" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                              <span className="zenve-soundwave-bars">
                                <span className="zenve-sound-bar" />
                                <span className="zenve-sound-bar" />
                                <span className="zenve-sound-bar" />
                              </span>
                            </span>
                            <span className="zenve-duration-value">{uploadDuration}</span>
                          </span>
                        </div>

                        {/* Sound toggle on preview */}
                        <button
                          type="button"
                          className="zenve-upload-preview-mute-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewMuted((m) => !m);
                          }}
                          title={isPreviewMuted ? 'Unmute video audio' : 'Mute video audio'}
                          aria-label={isPreviewMuted ? 'Unmute video' : 'Mute video'}
                        >
                          {isPreviewMuted ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="1" y1="1" x2="23" y2="23" />
                              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                              <line x1="12" y1="19" x2="12" y2="23" />
                              <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                          )}
                        </button>

                        {/* Bottom caption overlay */}
                        <div className="zenve-upload-preview-bottom-caption">
                          <div className="zenve-upload-preview-doc-name">
                            <span>{uploadDoctorName}</span>
                            <span className="zenve-upload-verified-tick" title="Verified Specialist">✓</span>
                          </div>
                          <div className="zenve-upload-preview-title">{uploadTitle || 'Case Title Preview...'}</div>
                        </div>
                      </div>

                      {/* File Action Row */}
                      <div className="zenve-upload-file-meta-row">
                        <span className="zenve-upload-file-name" title={uploadVideoFile?.name || 'Active Clinical Reel'}>
                          🎬 {uploadVideoFile ? uploadVideoFile.name : (uploadTitle ? 'Loaded Clinical Reel' : 'Active Video')}
                        </span>
                        <button
                          type="button"
                          className="zenve-upload-change-file-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`zenve-upload-dropzone ${isDragOver ? 'is-dragover' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="zenve-upload-dropzone-icon">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 7l-7 5 7 5V7z" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          <circle cx="8.5" cy="12" r="2.5" />
                        </svg>
                      </div>
                      <div className="zenve-upload-dropzone-title">
                        Choose Clinical Video File
                      </div>
                      <p className="zenve-upload-dropzone-desc">
                        Drag &amp; drop or click to browse files from your device
                      </p>
                      <div className="zenve-upload-specs-tags">
                        <span>MP4 / WebM / MOV</span>
                        <span>9:16 Portrait</span>
                        <span>Up to 4K</span>
                        <span>Max 60s</span>
                      </div>

                      <div className="zenve-upload-dropzone-cta">
                        <span>Browse Video Files</span>
                      </div>
                    </div>
                  )}

                  {/* 1-Click Clinical Procedure Auto-Fill Buttons */}
                  <div className="zenve-upload-samples-container">
                    <button
                      type="button"
                      className="zenve-upload-sample-btn zenve-sample-btn-primary"
                      onClick={() => handleLoadSampleProcedure('emergency')}
                      title="Load authentic clinical emergency trauma resuscitation procedure"
                    >
                      <span>🩺 Load Clinical Emergency Trauma Procedure</span>
                    </button>
                    <button
                      type="button"
                      className="zenve-upload-sample-btn zenve-sample-btn-secondary"
                      onClick={() => handleLoadSampleProcedure('ultrasound')}
                      title="Load authentic feline cardiac echocardiogram diagnostic loop"
                    >
                      <span>🔬 Load Diagnostic Ultrasound / Echo Loop</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Case Dossier & Clinical Information */}
                <div className="zenve-upload-right-pane">
                  <div className="zenve-upload-pane-heading">
                    <span>2. Case Dossier &amp; Clinical Details</span>
                    <span className="zenve-upload-required-note">* Required fields</span>
                  </div>

                  {/* Case Title */}
                  <div className="zenve-upload-field-group">
                    <label className="zenve-upload-label" htmlFor="upload-title-input">
                      <span>Clinical Case Title *</span>
                      <span className="zenve-upload-char-count">{uploadTitle.length}/100</span>
                    </label>
                    <input
                      id="upload-title-input"
                      type="text"
                      className="zenve-upload-input"
                      placeholder="e.g. Canine Cruciate Ligament Recovery: 16-Week Dynamic Stability"
                      maxLength={100}
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Category Pill Selector */}
                  <div className="zenve-upload-field-group">
                    <label className="zenve-upload-label">
                      <span>Primary Clinical Specialty *</span>
                    </label>
                    <div className="zenve-upload-cat-pills">
                      {['Surgery', 'Emergency', 'Imaging', 'Rehab', 'Dentistry', 'Exotics', 'Equine'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`zenve-upload-cat-pill ${uploadCategory === cat ? 'is-selected' : ''}`}
                          onClick={() => setUploadCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two column: Subspecialty & Quality */}
                  <div className="zenve-upload-row-two-cols">
                    <div className="zenve-upload-field-group">
                      <label className="zenve-upload-label" htmlFor="upload-spec-input">
                        <span>Specialty Sub-Track</span>
                      </label>
                      <input
                        id="upload-spec-input"
                        type="text"
                        className="zenve-upload-input"
                        placeholder="e.g. Orthopedic Surgery & Sports Medicine"
                        value={uploadSpecialty}
                        onChange={(e) => setUploadSpecialty(e.target.value)}
                      />
                    </div>

                    <div className="zenve-upload-field-group">
                      <label className="zenve-upload-label" htmlFor="upload-quality-select">
                        <span>Video Streaming Quality</span>
                      </label>
                      <select
                        id="upload-quality-select"
                        className="zenve-upload-select"
                        value={uploadQuality}
                        onChange={(e) => setUploadQuality(e.target.value)}
                      >
                        <option value="4K">4K Ultra HD (2160p)</option>
                        <option value="1080p">1080p Full HD</option>
                        <option value="720p">720p HD</option>
                      </select>
                    </div>
                  </div>

                  {/* Surgeon Info */}
                  <div className="zenve-upload-row-two-cols">
                    <div className="zenve-upload-field-group">
                      <label className="zenve-upload-label" htmlFor="upload-doc-input">
                        <span>Surgeon / Author Name</span>
                      </label>
                      <input
                        id="upload-doc-input"
                        type="text"
                        className="zenve-upload-input"
                        value={uploadDoctorName}
                        onChange={(e) => setUploadDoctorName(e.target.value)}
                      />
                    </div>

                    <div className="zenve-upload-field-group">
                      <label className="zenve-upload-label" htmlFor="upload-clinic-input">
                        <span>Hospital / Institution</span>
                      </label>
                      <input
                        id="upload-clinic-input"
                        type="text"
                        className="zenve-upload-input"
                        value={uploadDoctorClinic}
                        onChange={(e) => setUploadDoctorClinic(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Clinical Pearls Textarea */}
                  <div className="zenve-upload-field-group">
                    <label className="zenve-upload-label" htmlFor="upload-pearls-input">
                      <span>💡 Diagnostic / Surgical Pearl (Peer Learning)</span>
                    </label>
                    <textarea
                      id="upload-pearls-input"
                      rows={3}
                      className="zenve-upload-textarea"
                      placeholder="Share the crucial surgical nuance, anatomical landmark, or diagnostic metric clinicians should observe..."
                      value={uploadPearls}
                      onChange={(e) => setUploadPearls(e.target.value)}
                    />
                  </div>

                  {/* Tags */}
                  <div className="zenve-upload-field-group">
                    <label className="zenve-upload-label">
                      <span>Tags &amp; Keywords</span>
                    </label>
                    <div className="zenve-upload-tags-wrap">
                      {uploadTags.map((t) => (
                        <span key={t} className="zenve-upload-tag-chip">
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            title="Remove tag"
                            className="zenve-tag-remove-x"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="zenve-upload-tag-input-row">
                      <input
                        type="text"
                        className="zenve-upload-input zenve-tag-text-input"
                        placeholder="Add hashtag (e.g. #TPLO) and press Enter"
                        value={uploadTagInput}
                        onChange={(e) => setUploadTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(uploadTagInput);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="zenve-add-tag-btn"
                        onClick={() => handleAddTag(uploadTagInput)}
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  {/* De-identification & Ethics Checkbox */}
                  <div className="zenve-upload-consent-box">
                    <label className="zenve-upload-checkbox-label">
                      <input
                        type="checkbox"
                        checked={uploadConsentChecked}
                        onChange={(e) => setUploadConsentChecked(e.target.checked)}
                        className="zenve-upload-checkbox"
                        required
                      />
                      <span className="zenve-upload-checkbox-text">
                        <strong>Clinical Ethics &amp; De-Identification Guarantee:</strong> I confirm this clinical footage is de-identified (patient PII removed, client consent secured) and complies with peer veterinary educational standards.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="zenve-upload-modal-footer">
                <button
                  type="button"
                  className="zenve-upload-cancel-btn"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  className="zenve-upload-submit-btn"
                >
                  <span>Publish Clinical Reel</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortVideosPage;
