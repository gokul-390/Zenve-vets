import React, { useState, useRef, useEffect, useMemo } from 'react';
import StoryViewerModal from './StoryViewerModal';
import PostCard from './PostCard';
import DoctorProfileModal from './DoctorProfileModal';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import { postsApi, storiesApi } from '../api';
import '../csscomponents/FeedContent.css';

const COMMUNITY_CONTENT_UPDATED_EVENT =
  'zenve:community-content-updated';

const notifyCommunityContentUpdated = (type) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(COMMUNITY_CONTENT_UPDATED_EVENT, {
      detail: { type },
    })
  );
};

// Community doctor stories
const COMMUNITY_STORIES = [
  {
    id: 'aarthi',
    name: 'Dr.Aarthi',
    specialty: 'Orthopedic Surgery',
    time: '1h ago',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'aarthi-1',
        storyMedia: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
        caption: 'Post-op recovery going fantastic! This brave Golden Retriever is up and walking comfortably today 🐾❤️',
        time: '1h ago',
      },
      {
        id: 'aarthi-2',
        storyMedia: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
        caption: 'Follow-up gait assessment: complete weight bearing achieved on the left stifle joint 🩺🐶',
        time: '45m ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80',
    caption: 'Post-op recovery going fantastic! This brave Golden Retriever is up and walking comfortably today 🐾❤️',
  },
  {
    id: 'arun',
    name: 'Dr.Arun',
    specialty: 'Veterinary Surgeon',
    time: '2h ago',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'arun-1',
        storyMedia: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
        caption: 'Morning rounds complete at the clinic! Ready for two specialized ultrasound diagnostics today 🩺✨',
        time: '2h ago',
      },
      {
        id: 'arun-2',
        storyMedia: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
        caption: 'Reviewing abdominal sonogram scans with the surgical team prior to procedure 🐾',
        time: '1h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
    caption: 'Morning rounds complete at the clinic! Ready for two specialized ultrasound diagnostics today 🩺✨',
  },
  {
    id: 'priya_123',
    name: 'Dr.Priya',
    specialty: 'Veterinary Dermatology',
    time: '3h ago',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'priya-1',
        storyMedia: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
        caption: 'Allergy screening follow-up: chronic dermatitis symptoms decreased by 85% on the hypoallergenic regimen! 🐶',
        time: '3h ago',
      },
      {
        id: 'priya-2',
        storyMedia: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=80',
        caption: 'Skin cytology sample under oil immersion: zero secondary bacterial flare-ups noted 🔬✨',
        time: '2h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
    caption: 'Allergy screening follow-up: chronic dermatitis symptoms decreased by 85% on the hypoallergenic regimen! 🐶',
  },
  {
    id: 'sweet_heart',
    name: 'sweet_Sneha',
    specialty: 'Animal Rehabilitation',
    time: '4h ago',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'sneha-1',
        storyMedia: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
        caption: 'Hydrotherapy physical therapy session with Milo! Water exercises work wonders for joint mobility 🌊🐕',
        time: '4h ago',
      },
      {
        id: 'sneha-2',
        storyMedia: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80',
        caption: 'Post-swim stretch and massage therapy. Milo was smiling the whole session! 🐾✨',
        time: '3h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80',
    caption: 'Hydrotherapy physical therapy session with Milo! Water exercises work wonders for joint mobility 🌊🐕',
  },
  {
    id: 'nidhi',
    name: 'Dr.Nidhi',
    specialty: 'Small Animal Medicine',
    time: '5h ago',
    img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'nidhi-1',
        storyMedia: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
        caption: 'Routine pediatric checkup & vaccinations done for this gorgeous litter of pups! Healthy & energetic 🐾',
        time: '5h ago',
      },
      {
        id: 'nidhi-2',
        storyMedia: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
        caption: 'Growth chart review with puppy parents — nutrition plan tuned for optimal skeletal growth 🦴🩺',
        time: '4h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
    caption: 'Routine pediatric checkup & vaccinations done for this gorgeous litter of pups! Healthy & energetic 🐾',
  },
  {
    id: 'sanjay',
    name: 'Dr.Sanjay',
    specialty: 'Equine Specialist',
    time: '6h ago',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'sanjay-1',
        storyMedia: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
        caption: 'Equine soundness evaluation at the ranch this afternoon. Always a privilege working with these majestic animals 🐴',
        time: '6h ago',
      },
      {
        id: 'sanjay-2',
        storyMedia: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
        caption: 'Paddock turnout and gait symmetry checks under the afternoon sun 🌾🐴',
        time: '5h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    caption: 'Equine soundness evaluation at the ranch this afternoon. Always a privilege working with these majestic animals 🐴',
  },
  {
    id: 'karthika',
    name: 'Dr.Karthika',
    specialty: 'Avian & Exotic Care',
    time: '7h ago',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    items: [
      {
        id: 'karthika-1',
        storyMedia: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80',
        caption: 'Exotic feather checkup & beak grooming today. Beak conditioning is key for healthy avian nutrition 🦜🩺',
        time: '7h ago',
      },
      {
        id: 'karthika-2',
        storyMedia: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=900&q=80',
        caption: 'Weight monitoring & wing span checkup. Healthy plumage and brilliant appetite! 🦜🌿',
        time: '6h ago',
      },
    ],
    storyMedia: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80',
    caption: 'Exotic feather checkup & beak grooming today. Beak conditioning is key for healthy avian nutrition 🦜🩺',
  },
];

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

  // User's own stories (persisted in localStorage)
  const [userStories, setUserStories] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_user_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Gallery file input ref & modal states for adding a story
  const storyFileInputRef = useRef(null);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [selectedStoryImage, setSelectedStoryImage] = useState(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyToastMessage, setStoryToastMessage] = useState(null);

  // Gallery file input ref & states for creating a post picture
  const postFileInputRef = useRef(null);
  const feedTopRef = useRef(null);
  const [selectedPostImage, setSelectedPostImage] = useState(null);
  const [selectedPostImageName, setSelectedPostImageName] = useState('');
  const [selectedPostTags, setSelectedPostTags] = useState(['#ClinicalCase']);
  const [postToastMessage, setPostToastMessage] = useState(null);

  // User profile & Self-Tagging states
  const currentVetProfile = useMemo(() => {
    try {
      const stored = localStorage.getItem('zenve_custom_vets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {
      // Fallback
    }
    return null;
  }, []);

  const currentUserName = currentVetProfile?.name || 'Dr. You';
  const [isSelfTagged, setIsSelfTagged] = useState(false);
  const [customTags, setCustomTags] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_saved_custom_tags');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState(null);

  // Doctor Profile Modal State (opens on clicking doctor ID / header in posts)
  const [selectedProfileDoctor, setSelectedProfileDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorFollowingMap, setDoctorFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_following_doctors');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleDoctorFollow = (doctorId) => {
    setDoctorFollowingMap((prev) => {
      const next = { ...prev, [doctorId]: !prev[doctorId] };
      try {
        localStorage.setItem('zenve_following_doctors', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save doctor following state to localStorage:', err);
      }
      return next;
    });
  };

  const handleDoctorProfileClick = (doctorId, post) => {
    let doc = DOCTORS_DATABASE[doctorId];

    if (!doc && (doctorId === 'you' || post?.authorId === 'you')) {
      if (currentVetProfile) {
        doc = currentVetProfile;
      }
    }

    if (!doc && post?.selfTaggedDoctor && (doctorId === 'you' || doctorId === post.selfTaggedDoctor?.id)) {
      doc = {
        id: post.selfTaggedDoctor.id || 'you',
        name: post.selfTaggedDoctor.name || currentUserName,
        specialty: post.selfTaggedDoctor.specialty || 'Veterinary Specialist',
        location: 'India',
        img: post.selfTaggedDoctor.img || '/images/doctors/arun.jpg',
        clinic: 'Apex Veterinary Multi-Specialty Clinic',
        education: 'BVSc & AH, MVSc',
        experience: '8+ years clinical experience',
        casesHandled: '540+ cases',
        followers: '1.8k',
        followingCount: '210',
        rating: '4.9 ★',
        about: `${post.selfTaggedDoctor.name || 'Doctor'} is a verified veterinary specialist providing compassionate and evidence-based clinical veterinary care across the Zenve Vet network.`,
        focusAreas: ['Clinical Diagnostics', 'Patient Care', 'Surgical Protocols', 'Animal Welfare'],
      };
    }

    if (!doc) {
      doc = {
        id: doctorId,
        name: post?.authorName || 'Dr. ' + doctorId,
        specialty: post?.authorSpecialty || 'Veterinary Specialist',
        location: post?.authorSpecialty?.split('•')?.[1]?.trim() || 'India',
        img: post?.authorImg || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
        clinic: 'Apex Veterinary Multi-Specialty Clinic',
        education: 'BVSc & AH, MVSc',
        experience: '8+ years clinical experience',
        casesHandled: '540+ cases',
        followers: '1.8k',
        followingCount: '210',
        rating: '4.9 ★',
        about: `${post?.authorName || 'Doctor'} is a verified veterinary specialist providing compassionate and evidence-based clinical veterinary care across the Zenve Vet network.`,
        focusAreas: ['Clinical Diagnostics', 'Patient Care', 'Surgical Protocols', 'Animal Welfare'],
      };
    }

    setSelectedProfileDoctor(doc);
    setIsDoctorModalOpen(true);
  };

  // Story Viewer modal state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [modalStories, setModalStories] = useState([]);

  // Set of story IDs that have been visited/viewed (persisted in localStorage)
  const [viewedStoryIds, setViewedStoryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_viewed_stories');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sort community stories: remaining (unwatched) stories first, watched (viewed) stories at the end
  const sortedCommunityStories = useMemo(() => {
    const unviewed = [];
    const viewed = [];
    COMMUNITY_STORIES.forEach((docStory) => {
      if (viewedStoryIds[docStory.id]) {
        viewed.push(docStory);
      } else {
        unviewed.push(docStory);
      }
    });
    return [...unviewed, ...viewed];
  }, [viewedStoryIds]);

  // Combined active stories: user's stories grouped as 1 person with multiple slides, followed by community doctors
  const userStoryGroup = userStories.length > 0 ? [{
    id: 'user',
    name: 'Your story',
    authorName: 'Dr. You (Your Practice)',
    specialty: 'Veterinary Professional',
    time: userStories[userStories.length - 1]?.time || 'Just now',
    img: userStories[userStories.length - 1]?.storyMedia || userStories[userStories.length - 1]?.img,
    storyMedia: userStories[userStories.length - 1]?.storyMedia || userStories[userStories.length - 1]?.img,
    caption: userStories[userStories.length - 1]?.caption || '',
    items: userStories,
    isUserStory: true,
  }] : [];

  const allActiveStories = useMemo(() => {
    return [...userStoryGroup, ...sortedCommunityStories];
  }, [userStoryGroup, sortedCommunityStories]);

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

  const [feedPosts, setFeedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_community_posts');

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Use sample posts if local data is unavailable.
    }

    return INITIAL_POSTS;
  });

  useEffect(() => {
    notifyCommunityContentUpdated('feed-initialized');
  }, []);

  const handleMarkAsViewed = async (storyId) => {
    setViewedStoryIds((prev) => {
      const next = { ...prev, [storyId]: true };
      try {
        localStorage.setItem('zenve_viewed_stories', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save viewed stories to localStorage:', err);
      }
      return next;
    });
    try {
      await storiesApi.markViewed(storyId);
    } catch {
      // Local mode is supported.
    }
  };

  const handleOpenStory = (indexInActiveList) => {
    const storyList = allActiveStories;
    setModalStories(storyList);
    const story = storyList[indexInActiveList];
    if (story) {
      handleMarkAsViewed(story.id);
    }

    setSelectedStoryIndex(indexInActiveList);
    setIsStoryModalOpen(true);
  };

  const handleTriggerStoryUpload = () => {
    storyFileInputRef.current?.click();
  };

  const handleStoryFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file from your gallery.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const imageResult = readerEvent.target?.result;

      if (imageResult) {
        setSelectedStoryImage(imageResult);
        setStoryCaption('');
        setIsAddStoryModalOpen(true);
      }
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePublishStory = async () => {
    if (!selectedStoryImage) return;

    const newStory = {
      id: `user-story-${Date.now()}`,
      name: 'Your story',
      authorName: 'Dr. You (Your Practice)',
      specialty: 'Veterinary Professional',
      time: 'Just now',
      img: selectedStoryImage,
      storyMedia: selectedStoryImage,
      caption:
        storyCaption.trim() || 'Sharing moments from our practice 🐾',
      isUserStory: true,
      createdAt: Date.now(),
    };

    const updatedUserStories = [newStory, ...userStories];

    setUserStories(updatedUserStories);

    try {
      localStorage.setItem(
        'zenve_user_stories',
        JSON.stringify(updatedUserStories)
      );
    } catch (err) {
      console.warn('Could not save user stories to localStorage:', err);
    }

    notifyCommunityContentUpdated('story-created');

    setIsAddStoryModalOpen(false);
    setSelectedStoryImage(null);
    setStoryCaption('');

    setStoryToastMessage('Story shared successfully! 📸');
    setTimeout(() => setStoryToastMessage(null), 3500);

    setSelectedStoryIndex(0);
    setIsStoryModalOpen(true);

    try {
      await storiesApi.create(newStory);
    } catch (err) {
      console.warn('Stories API sync notice (stored locally):', err.message);
    }
  };

  const handleOpenPostGallery = () => {
    postFileInputRef.current?.click();
  };

  const handlePostImageSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert(
        'Please select an image file (JPEG, PNG, WEBP, etc.) from your gallery.'
      );
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const imageResult = readerEvent.target?.result;

      if (imageResult) {
        setSelectedPostImage(imageResult);
        setSelectedPostImageName(file.name);
      }
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRemovePostImage = () => {
    setSelectedPostImage(null);
    setSelectedPostImageName('');

    if (postFileInputRef.current) {
      postFileInputRef.current.value = '';
    }
  };

  const handleTogglePostTag = (tag) => {
    setSelectedPostTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleToggleSelfTag = () => {
    setIsSelfTagged((prev) => {
      const next = !prev;
      const selfTagLabel = `@${currentUserName}`;
      if (next) {
        setSelectedPostTags((curr) =>
          curr.includes(selfTagLabel) ? curr : [...curr, selfTagLabel]
        );
      } else {
        setSelectedPostTags((curr) =>
          curr.filter((t) => t !== selfTagLabel)
        );
      }
      return next;
    });
  };

  const handleAddCustomTag = () => {
    const raw = newTagInput.trim();
    if (!raw) {
      setIsAddingTag(false);
      return;
    }
    const cleanTag = raw.startsWith('#') || raw.startsWith('@') ? raw : `#${raw.replace(/\s+/g, '')}`;

    if (!customTags.includes(cleanTag)) {
      const updated = [...customTags, cleanTag];
      setCustomTags(updated);
      try {
        localStorage.setItem('zenve_saved_custom_tags', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save custom tags to localStorage:', err);
      }
    }

    if (!selectedPostTags.includes(cleanTag)) {
      setSelectedPostTags((prev) => [...prev, cleanTag]);
    }

    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleDeleteCustomTag = (tagToDelete, e) => {
    if (e) e.stopPropagation();
    const updated = customTags.filter((t) => t !== tagToDelete);
    setCustomTags(updated);
    try {
      localStorage.setItem('zenve_saved_custom_tags', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save custom tags to localStorage:', err);
    }
    setSelectedPostTags((prev) => prev.filter((t) => t !== tagToDelete));
  };

  const handleTogglePostSelfTag = (postId) => {
    let targetAuthor = '';
    let isNowTagged = false;

    setFeedPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const nextSelfTagged = !p.isSelfTagged;
          isNowTagged = nextSelfTagged;
          targetAuthor = p.authorName;

          const selfDoc = nextSelfTagged
            ? {
                id: currentVetProfile?.id || 'you',
                name: currentUserName,
                specialty: currentVetProfile?.specialty || 'Veterinary Professional • Clinical Practice',
                img: currentVetProfile?.img || '/images/doctors/arun.jpg',
              }
            : null;

          let updatedTags = Array.isArray(p.tags) ? [...p.tags] : [];
          const selfTagText = `@${currentUserName}`;
          if (nextSelfTagged && !updatedTags.includes(selfTagText)) {
            updatedTags.push(selfTagText);
          } else if (!nextSelfTagged) {
            updatedTags = updatedTags.filter((t) => t !== selfTagText);
          }

          return {
            ...p,
            isSelfTagged: nextSelfTagged,
            selfTaggedDoctor: selfDoc,
            tags: updatedTags,
          };
        }
        return p;
      });

      try {
        localStorage.setItem('zenve_community_posts', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save posts to localStorage:', err);
      }

      return updated;
    });

    setPostToastMessage(
      isNowTagged
        ? `🏷️ Tagged yourself on ${targetAuthor || 'this'}'s post!`
        : `Removed self tag from ${targetAuthor || 'this'}'s post.`
    );
    setTimeout(() => setPostToastMessage(null), 3000);
  };

  const handlePostButtonClick = async () => {
    if (!selectedPostImage && !postText.trim()) {
      handleOpenPostGallery();
      return;
    }

    const selfDoctorInfo = isSelfTagged
      ? {
          id: currentVetProfile?.id || 'you',
          name: currentUserName,
          specialty:
            currentVetProfile?.specialty ||
            'Veterinary Professional • Clinical Practice',
          img:
            currentVetProfile?.img ||
            '/images/doctors/arun.jpg',
        }
      : null;

    const finalTags =
      selectedPostTags.length > 0
        ? selectedPostTags
        : isSelfTagged
        ? [`@${currentUserName}`, '#ClinicalCase', '#ZenveVet']
        : ['#ZenveVet', '#ClinicalCase', '#VeterinaryNetwork'];

    const newPost = {
      id: `post-${Date.now()}`,
      authorId: 'you',
      authorName: currentUserName,
      authorImg: currentVetProfile?.img || '/images/doctors/arun.jpg',
      authorSpecialty:
        currentVetProfile?.specialty ||
        'Veterinary Professional • Clinical Practice',
      timeAgo: 'Just now',
      caption:
        postText.trim() ||
        'Sharing a clinical case picture from our veterinary practice 🐾',
      mediaUrl:
        selectedPostImage ||
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      videoUrl: null,
      isVideoShort: false,
      likes: 1,
      isSelfTagged: isSelfTagged,
      selfTaggedDoctor: selfDoctorInfo,
      tags: finalTags,
      initialComments: [],
      createdAt: Date.now(),
    };

    const updatedPosts = [newPost, ...feedPosts];

    setFeedPosts(updatedPosts);

    try {
      localStorage.setItem(
        'zenve_community_posts',
        JSON.stringify(updatedPosts)
      );
    } catch (err) {
      console.warn('Could not save post to localStorage:', err);
    }

    notifyCommunityContentUpdated('post-created');

    setPostText('');
    setSelectedPostImage(null);
    setSelectedPostImageName('');
    setIsSelfTagged(false);
    setSelectedPostTags(['#ClinicalCase']);

    if (activeMainTab === 'videos' || feedFilterTab === 'videos') {
      handleTabChange('for-you');
    }

    setPostToastMessage(
      isSelfTagged
        ? `🎉 Picture posted with self tag (${currentUserName})!`
        : '🎉 Picture posted to community feed successfully!'
    );
    setTimeout(() => setPostToastMessage(null), 3500);

    feedTopRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    try {
      await postsApi.create(newPost);
    } catch (err) {
      console.warn('API sync notice (stored locally):', err.message);
    }
  };

  return (
    <div className="zenve-feed-main">
      <section className="zenve-feed-hero">
        <div className="zenve-feed-hero-left">
          <span className="zenve-feed-hero-tag">THE ZENVE VET COMMUNITY</span>
          <h1 className="zenve-feed-hero-title">A world of care. Connected.</h1>
          <p className="zenve-feed-hero-desc">
            Meet your peers. Share your practice. Move veterinary care forward.
          </p>
          <button type="button" className="zenve-feed-hero-cta">
            <span>Make your mark</span>
            <span className="zenve-cta-arrow">↗</span>
          </button>
        </div>

        <div className="zenve-feed-hero-right">
          <div className="zenve-stethoscope-card">
            <div className="svgimg">
              <svg
                viewBox="0 0 100 85"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M24,12a4,4,0,0,0-1,7.86V22a6,6,0,0,1-6,6,6,6,0,0,1-6-6V19h1l1-1V16.41A8,8,0,0,0,18,9V4L17,3H14V5h2V9a6,6,0,0,1-6,6,5.81,5.81,0,0,1-.86-.06A6,6,0,0,1,4,9V5H6V3H3L2,4V9a8.06,8.06,0,0,0,5,7.41V18l1,1H9v3a8,8,0,0,0,16,0V19.86A4,4,0,0,0,24,12Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,24,18Z" />
              </svg>
            </div>
            <span className="zenve-hero-sublabel">BETTER TOGETHER</span>
          </div>
        </div>
      </section>

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

        <input
          type="file"
          ref={storyFileInputRef}
          accept="image/*"
          onChange={handleStoryFileSelected}
          style={{ display: 'none' }}
          id="zenve-gallery-file-input"
        />

        <div className="zenve-stories-row">
          {userStories.length > 0 ? (
            <div className="zenve-story-item">
              <div className="zenve-story-avatar-container">
                <button
                  type="button"
                  className="zenve-story-avatar-btn-wrapper"
                  onClick={() => handleOpenStory(0)}
                  title={`View your story (${userStories.length} ${userStories.length > 1 ? 'stories' : 'story'
                    })`}
                >
                  <div
                    className={`zenve-story-avatar-wrapper ${viewedStoryIds.user ? 'zenve-story-avatar-viewed' : ''
                      }`}
                  >
                    <img
                      src={
                        userStories[userStories.length - 1].storyMedia ||
                        userStories[userStories.length - 1].img
                      }
                      alt="Your story"
                      className="zenve-story-avatar-img"
                    />
                  </div>
                </button>

                <button
                  type="button"
                  className="zenve-story-add-badge"
                  onClick={handleTriggerStoryUpload}
                  title="Add another photo from gallery"
                  aria-label="Add story"
                >
                  +
                </button>
              </div>

              <span
                className={`zenve-story-name ${viewedStoryIds.user ? 'zenve-story-name-viewed' : ''
                  }`}
                onClick={() => handleOpenStory(0)}
              >
                Your story
              </span>
            </div>
          ) : (
            <div className="zenve-story-item">
              <button
                type="button"
                className="zenve-story-avatar-btn zenve-story-add-btn"
                onClick={handleTriggerStoryUpload}
                title="Click to add photo from gallery"
                id="zenve-add-story-btn"
              >
                <span className="zenve-add-story-plus">+</span>
              </button>

              <span
                className="zenve-story-name"
                onClick={handleTriggerStoryUpload}
                style={{ cursor: 'pointer' }}
              >
                Your story
              </span>
            </div>
          )}

          {/* Community Doctor Stories: unwatched first, watched (viewed) stories at the end */}
          {sortedCommunityStories.map((docStory, docIdx) => {
            const storyActiveIndex = userStoryGroup.length + docIdx;
            const isViewed = !!viewedStoryIds[docStory.id];

            return (
              <div key={docStory.id} className="zenve-story-item">
                <button
                  type="button"
                  className="zenve-story-avatar-btn-wrapper"
                  onClick={() => handleOpenStory(storyActiveIndex)}
                  title={`View ${docStory.name}'s story`}
                >
                  <div
                    className={`zenve-story-avatar-wrapper ${isViewed ? 'zenve-story-avatar-viewed' : ''
                      }`}
                  >
                    <img
                      src={docStory.img}
                      alt={docStory.name}
                      className="zenve-story-avatar-img"
                      onError={(event) => {
                        event.target.style.display = 'none';
                        event.target.parentElement.classList.add(
                          'zenve-avatar-fallback'
                        );
                      }}
                    />
                  </div>
                </button>

                <span
                  className={`zenve-story-name ${isViewed ? 'zenve-story-name-viewed' : ''
                    }`}
                  onClick={() => handleOpenStory(storyActiveIndex)}
                >
                  {docStory.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <input
        type="file"
        ref={postFileInputRef}
        accept="image/*"
        onChange={handlePostImageSelected}
        style={{ display: 'none' }}
        id="zenve-post-gallery-file-input"
      />

      <section className="zenve-create-post-card" ref={feedTopRef}>
        <div className="zenve-create-post-top">
          <div
            className="zenve-post-stethoscope-icon"
            title="Share with Zenve community"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F4332"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          </div>

          <input
            type="text"
            className="zenve-post-input"
            placeholder={
              selectedPostImage
                ? 'Write a caption for your picture (optional)...'
                : 'Share a discovery, clinical case photo, or inspiration...'
            }
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handlePostButtonClick();
            }}
          />

          <button
            type="button"
            className="zenve-post-quick-gallery-btn"
            title="Open gallery to select picture"
            onClick={handleOpenPostGallery}
            aria-label="Open gallery"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F4332"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </button>
        </div>

        {selectedPostImage && (
          <div className="zenve-post-image-preview-box">
            <div className="zenve-post-image-preview-inner">
              <div className="zenve-preview-img-container">
                <img
                  src={selectedPostImage}
                  alt="Selected from gallery"
                  className="zenve-post-image-preview-thumbnail"
                />
                {isSelfTagged && (
                  <div className="zenve-preview-selftag-overlay" title={`Tagged: ${currentUserName}`}>
                    <span className="zenve-preview-selftag-icon">🏷️</span>
                    <span>Tagged: {currentUserName}</span>
                  </div>
                )}
              </div>

              <div className="zenve-post-image-preview-details">
                <div className="zenve-post-preview-status-badge">
                  <span className="zenve-preview-dot" />
                  <span>Gallery picture ready to post</span>
                </div>

                <span className="zenve-post-preview-filename">
                  {selectedPostImageName || 'gallery-image.jpg'}
                </span>

                <div className="zenve-post-preview-actions">
                  <button
                    type="button"
                    className="zenve-preview-change-btn"
                    onClick={handleOpenPostGallery}
                    title="Choose a different picture from gallery"
                  >
                    Change picture
                  </button>

                  <button
                    type="button"
                    className="zenve-preview-remove-btn"
                    onClick={handleRemovePostImage}
                    title="Remove picture"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSelfTagged && (
          <div className="zenve-post-self-tag-notification">
            <span className="zenve-self-tag-noti-icon">🏷️</span>
            <span className="zenve-self-tag-noti-text">
              Self-tagged as <strong>{currentUserName}</strong> — viewers can tap the tag on your post to open your verified profile.
            </span>
            <button
              type="button"
              className="zenve-self-tag-noti-remove"
              onClick={handleToggleSelfTag}
              title="Remove self tag"
            >
              ✕
            </button>
          </div>
        )}

        <div className="zenve-create-post-bottom">
          <div className="zenve-post-actions-pills">
            <button
              type="button"
              className={`zenve-post-pill ${selectedPostImage ? 'zenve-post-pill-active' : ''
                }`}
              onClick={handleOpenPostGallery}
              title="Open gallery to select a picture"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>{selectedPostImage ? 'Change Photo' : 'Photo / Gallery'}</span>
            </button>

            {/* Self Tag Option Button */}
            <button
              type="button"
              className={`zenve-post-pill zenve-post-self-tag-pill ${isSelfTagged ? 'zenve-post-pill-active zenve-self-tag-pill-active' : ''
                }`}
              onClick={handleToggleSelfTag}
              title={
                isSelfTagged
                  ? `Tagged as ${currentUserName}. Click to remove self tag`
                  : `Tag yourself (${currentUserName}) on this post`
              }
              id="zenve-post-self-tag-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>{isSelfTagged ? `✓ ${currentUserName}` : 'Tag Myself'}</span>
              {isSelfTagged && <span className="zenve-self-tag-pill-badge">Self</span>}
            </button>

            {/* Standard preset tags */}
            {['#ClinicalCase', '#Surgery', '#AnimalCare'].map((tag) => {
              const isSelected = selectedPostTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  className={`zenve-post-tag-chip ${isSelected ? 'zenve-tag-chip-selected' : ''
                    }`}
                  onClick={() => handleTogglePostTag(tag)}
                  title={`Toggle ${tag}`}
                >
                  {tag}
                </button>
              );
            })}

            {/* Custom user tags with delete option */}
            {customTags.map((tag) => {
              const isSelected = selectedPostTags.includes(tag);

              return (
                <div key={tag} className="zenve-custom-tag-chip-wrap">
                  <button
                    type="button"
                    className={`zenve-post-tag-chip zenve-custom-tag-chip ${isSelected ? 'zenve-tag-chip-selected' : ''
                      }`}
                    onClick={() => handleTogglePostTag(tag)}
                    title={`Toggle ${tag}`}
                  >
                    {tag}
                  </button>
                  <button
                    type="button"
                    className="zenve-custom-tag-delete-btn"
                    onClick={(e) => handleDeleteCustomTag(tag, e)}
                    title={`Delete custom tag ${tag}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {/* Add Custom Tag Form / Trigger */}
            {isAddingTag ? (
              <div className="zenve-post-tag-input-inline">
                <span className="zenve-tag-prefix">#</span>
                <input
                  type="text"
                  className="zenve-inline-tag-input"
                  placeholder="tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    } else if (e.key === 'Escape') {
                      setIsAddingTag(false);
                      setNewTagInput('');
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="zenve-inline-tag-confirm-btn"
                  onClick={handleAddCustomTag}
                  title="Add tag"
                >
                  ✓
                </button>
                <button
                  type="button"
                  className="zenve-inline-tag-cancel-btn"
                  onClick={() => {
                    setIsAddingTag(false);
                    setNewTagInput('');
                  }}
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="zenve-post-tag-chip zenve-post-add-tag-chip"
                onClick={() => setIsAddingTag(true)}
                title="Add custom tag"
              >
                <span className="zenve-add-tag-plus">+</span>
                <span>Tag</span>
              </button>
            )}
          </div>

          <button
            type="button"
            className={`zenve-post-submit-btn ${selectedPostImage ? 'zenve-post-submit-ready' : ''
              }`}
            onClick={handlePostButtonClick}
            title={
              selectedPostImage
                ? 'Post picture to feed'
                : 'Click to select picture from gallery and post'
            }
          >
            <span>{selectedPostImage ? 'Post Picture' : 'Post'}</span>
            <span className="zenve-post-submit-arrow">➔</span>
          </button>
        </div>
      </section>

      <section className="zenve-feed-tabs-bar">
        <div className="zenve-feed-tabs-left">
          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'for-you' ? 'zenve-feed-tab-active' : ''
              }`}
            onClick={() => handleTabChange('for-you')}
          >
            For you
          </button>

          <button
            type="button"
            className={`zenve-feed-tab-btn zenve-feed-tab-shorts ${activeTab === 'videos' ? 'zenve-feed-tab-active' : ''
              }`}
            onClick={() => handleTabChange('videos')}
          >
            <span className="zenve-tab-shorts-icon">▶</span>
            <span>Short videos</span>
            <span className="zenve-shorts-count-pill">
              {feedPosts.filter((post) => post.isVideoShort).length}
            </span>
          </button>

          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'popular' ? 'zenve-feed-tab-active' : ''
              }`}
            onClick={() => handleTabChange('popular')}
          >
            Popular
          </button>

          <button
            type="button"
            className={`zenve-feed-tab-btn ${activeTab === 'following' ? 'zenve-feed-tab-active' : ''
              }`}
            onClick={() => handleTabChange('following')}
          >
            Following
          </button>
        </div>

        <div className="zenve-feed-tabs-right">
          <span className="zenve-community-feed-dot" />
          <span className="zenve-community-feed-label">
            {activeTab === 'videos' || activeMainTab === 'videos'
              ? 'SHORTS FEED'
              : 'COMMUNITY FEED'}
          </span>
        </div>
      </section>

      {(activeTab === 'videos' || activeMainTab === 'videos') && (
        <section className="zenve-shorts-filter-banner">
          <div className="zenve-shorts-banner-left">
            <span className="zenve-shorts-banner-tag">
              <span className="zenve-shorts-live-dot" />
              SHORTS ONLY
            </span>

            <div className="zenve-shorts-banner-text">
              <h3 className="zenve-shorts-banner-title">
                Veterinary Short Videos &amp; Clinical Reels
              </h3>
              <p className="zenve-shorts-banner-desc">
                Showing {feedPosts.filter((post) => post.isVideoShort).length}{' '}
                video shorts. Tap any video or sound button to watch.
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

      {selectedTagFilter && (
        <section className="zenve-shorts-filter-banner zenve-tag-filter-banner">
          <div className="zenve-shorts-banner-left">
            <span className="zenve-shorts-banner-tag">
              <span className="zenve-shorts-live-dot" />
              TAG FILTER
            </span>
            <div className="zenve-shorts-banner-text">
              <h3 className="zenve-shorts-banner-title">
                Showing posts tagged with {selectedTagFilter}
              </h3>
              <p className="zenve-shorts-banner-desc">
                Clinical cases and discussions matching this tag.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="zenve-shorts-show-all-btn"
            onClick={() => setSelectedTagFilter(null)}
          >
            Show All Posts ✕
          </button>
        </section>
      )}

      <section className="zenve-feed-posts-stream">
        {(() => {
          let displayed = feedPosts;

          if (activeTab === 'videos' || activeMainTab === 'videos') {
            displayed = feedPosts.filter((post) => post.isVideoShort);
          } else if (activeTab === 'popular') {
            displayed = [...feedPosts].sort(
              (a, b) => (b.likes || 0) - (a.likes || 0)
            );
          } else if (activeTab === 'following') {
            const followed = feedPosts.filter(
              (post) => doctorFollowingMap[post.authorId]
            );
            displayed = followed.length > 0 ? followed : feedPosts;
          }

          if (selectedTagFilter) {
            displayed = displayed.filter(
              (post) =>
                post.tags &&
                post.tags.some(
                  (t) => t.toLowerCase() === selectedTagFilter.toLowerCase()
                )
            );
          }

          if (displayed.length === 0) {
            return (
              <div className="zenve-empty-tag-posts">
                <span className="zenve-empty-tag-icon">🏷️</span>
                <h4>No posts found for {selectedTagFilter}</h4>
                <p>Be the first to create a post with this tag!</p>
                <button
                  type="button"
                  className="zenve-clear-tag-btn"
                  onClick={() => setSelectedTagFilter(null)}
                >
                  Clear filter
                </button>
              </div>
            );
          }

          return displayed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDoctorClick={(doctorId) =>
                handleDoctorProfileClick(doctorId, post)
              }
              onToggleSelfTag={(postId) => handleTogglePostSelfTag(postId)}
              onTagClick={(tag) => setSelectedTagFilter(tag)}
            />
          ));
        })()}
      </section>

      {isStoryModalOpen && (
        <StoryViewerModal
          key={selectedStoryIndex}
          stories={modalStories.length > 0 ? modalStories : allActiveStories}
          initialStoryIndex={selectedStoryIndex}
          isOpen={isStoryModalOpen}
          onClose={() => {
            setIsStoryModalOpen(false);
            setModalStories([]);
          }}
          onStoryViewed={handleMarkAsViewed}
          onAddStory={handleTriggerStoryUpload}
        />
      )}

      {isAddStoryModalOpen && (
        <div
          className="zenve-add-story-modal-overlay"
          onClick={() => setIsAddStoryModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="zenve-add-story-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="zenve-add-story-modal-header">
              <div className="zenve-add-story-header-text">
                <h3 className="zenve-add-story-title">Add to Story</h3>
                <p className="zenve-add-story-subtitle">
                  Share a photo from your gallery with fellow veterinarians
                </p>
              </div>

              <button
                type="button"
                className="zenve-add-story-close-btn"
                onClick={() => setIsAddStoryModalOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="zenve-add-story-preview-area">
              <img
                src={selectedStoryImage}
                alt="Story Preview"
                className="zenve-add-story-preview-image"
              />

              <button
                type="button"
                className="zenve-add-story-change-btn"
                onClick={handleTriggerStoryUpload}
                title="Pick another photo from gallery"
              >
                <span>📷 Change photo</span>
              </button>
            </div>

            <div className="zenve-add-story-caption-section">
              <label className="zenve-add-story-label">
                Story Caption (Optional)
              </label>

              <textarea
                rows={2}
                className="zenve-add-story-caption-input"
                placeholder="What's happening in your clinic today?"
                value={storyCaption}
                onChange={(event) => setStoryCaption(event.target.value)}
                maxLength={150}
              />

              <div className="zenve-add-story-emojis-row">
                {['🐾', '🩺', '🐕', '🐱', '❤️', '✨', '🐴', '🦜'].map(
                  (emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="zenve-add-story-emoji-chip"
                      onClick={() =>
                        setStoryCaption((previous) => previous + emoji)
                      }
                      title={`Add ${emoji}`}
                    >
                      {emoji}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="zenve-add-story-modal-footer">
              <button
                type="button"
                className="zenve-add-story-cancel-btn"
                onClick={() => {
                  setIsAddStoryModalOpen(false);
                  setSelectedStoryImage(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="zenve-add-story-submit-btn"
                onClick={handlePublishStory}
              >
                <span>Share Story</span>
                <span className="zenve-btn-arrow">↗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {storyToastMessage && (
        <div className="zenve-story-toast-popup">
          <span className="zenve-toast-icon">✓</span>
          <span>{storyToastMessage}</span>
        </div>
      )}

      {postToastMessage && (
        <div className="zenve-story-toast-popup zenve-post-toast-popup">
          <span className="zenve-toast-icon">✓</span>
          <span>{postToastMessage}</span>
        </div>
      )}

      <DoctorProfileModal
        doctor={selectedProfileDoctor}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        isFollowing={
          selectedProfileDoctor
            ? Boolean(doctorFollowingMap[selectedProfileDoctor.id])
            : false
        }
        onToggleFollow={handleToggleDoctorFollow}
      />
    </div>
  );
};

export default FeedContent;