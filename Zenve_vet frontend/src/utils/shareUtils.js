// Utility functions for sharing posts and video shorts with following doctors and community groups

export const DIRECTORY_DOCTORS = [
  {
    id: 'aarthi',
    name: 'Dr. Aarthi',
    specialty: 'Orthopedic Surgery',
    location: 'Bengaluru, Karnataka',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    online: true,
  },
  {
    id: 'arun',
    name: 'Dr. Arun Mehta',
    specialty: 'Veterinary Surgery',
    location: 'Mumbai, Maharashtra',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    online: true,
  },
  {
    id: 'priya',
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    location: 'Kochi, Kerala',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    online: true,
  },
  {
    id: 'sanjay',
    name: 'Dr. Sanjay Verma',
    specialty: 'Equine Specialist',
    location: 'Jaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    online: false,
  },
  {
    id: 'sweet_heart',
    name: 'sweet_Sneha',
    specialty: 'Animal Rehabilitation',
    location: 'Delhi NCR',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: false,
    online: true,
  },
  {
    id: 'nidhi',
    name: 'Dr. Nidhi Sharma',
    specialty: 'Small Animal Internal Medicine',
    location: 'New Delhi',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: false,
    online: false,
  },
  {
    id: 'karthika',
    name: 'Dr. Karthika Raman',
    specialty: 'Avian & Exotic Care',
    location: 'Bengaluru, Karnataka',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    online: false,
  },
  {
    id: 'vikram',
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Sports Medicine',
    location: 'Jaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    online: true,
  },
  {
    id: 'ananya',
    name: 'Dr. Ananya Sen',
    specialty: 'Feline Internal Medicine',
    location: 'Kolkata, West Bengal',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    online: false,
  },
];

// Helper to normalize doctor IDs (e.g. 'priya_123' -> 'priya')
export const normalizeDoctorId = (id) => {
  if (!id) return 'aarthi';
  if (id.startsWith('priya')) return 'priya';
  if (id.startsWith('aarthi')) return 'aarthi';
  if (id.startsWith('arun')) return 'arun';
  if (id.startsWith('sanjay')) return 'sanjay';
  if (id.startsWith('nidhi')) return 'nidhi';
  if (id.startsWith('karthika')) return 'karthika';
  if (id.startsWith('sweet')) return 'sweet_heart';
  return id;
};

// Retrieve following doctors combined with custom created doctors
export const getFollowedDoctors = () => {
  let followingMap = {};
  try {
    const saved = localStorage.getItem('zenve_following_doctors');
    if (saved) {
      followingMap = JSON.parse(saved);
    }
  } catch {
    followingMap = {};
  }

  // Also include custom profiles from localStorage
  let customDoctors = [];
  try {
    const customSaved = localStorage.getItem('zenve_custom_vets');
    if (customSaved) {
      const parsed = JSON.parse(customSaved);
      if (Array.isArray(parsed)) {
        customDoctors = parsed.map((doc) => ({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          location: doc.location || 'India',
          img: doc.img,
          isFollower: false,
          defaultFollowing: true,
          online: true,
        }));
      }
    }
  } catch {}

  const allCombined = [...DIRECTORY_DOCTORS, ...customDoctors];

  return allCombined.map((doc) => {
    const isFollowing =
      followingMap[doc.id] !== undefined
        ? !!followingMap[doc.id]
        : !!doc.defaultFollowing;

    return {
      ...doc,
      isFollowing,
    };
  }).sort((a, b) => {
    if (a.isFollowing && !b.isFollowing) return -1;
    if (!a.isFollowing && b.isFollowing) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Send shared post or video to a doctor's chat in Messages
export const sendSharedItemToDoctor = (doctorId, item, customMessage = '') => {
  const normId = normalizeDoctorId(doctorId);

  let conversations = {};
  try {
    const saved = localStorage.getItem('zenve_chat_messages');
    if (saved) {
      conversations = JSON.parse(saved);
    }
  } catch {
    conversations = {};
  }

  const doctorMessages = Array.isArray(conversations[normId])
    ? [...conversations[normId]]
    : [];

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isVideo = !!(item.videoUrl || item.isVideoShort);

  const sharedData = {
    id: item.id || `post-${Date.now()}`,
    type: isVideo ? 'video' : 'post',
    authorName: item.authorName || item.author?.name || item.author || 'Dr. Specialist',
    authorSpecialty: item.authorSpecialty || item.author?.specialty || item.specialtyTag || 'Veterinary Specialist',
    authorImg: item.authorImg || item.author?.avatar || item.img || '/images/doctors/arun.jpg',
    mediaUrl: item.mediaUrl || item.poster || item.img || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
    videoUrl: item.videoUrl || null,
    caption: item.caption || item.description || item.title || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    likes: item.likes || item.likesCount || 0,
    timestamp: Date.now(),
  };

  const newMsg = {
    id: `msg-shared-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: 'me',
    text: customMessage.trim() || `Shared a ${isVideo ? 'clinical video short' : 'post'} by ${sharedData.authorName}`,
    time: timeStr,
    sharedPost: sharedData,
  };

  doctorMessages.push(newMsg);
  conversations[normId] = doctorMessages;

  try {
    localStorage.setItem('zenve_chat_messages', JSON.stringify(conversations));
  } catch (err) {
    console.warn('Could not save shared message:', err);
  }

  // Dispatch custom events for reactive UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('zenve_chat_messages_updated', {
        detail: { doctorId: normId, newMsg },
      })
    );
  }

  return newMsg;
};

// Navigate to Messages page with active doctor selected
export const navigateToDoctorChat = (doctorId) => {
  const normId = normalizeDoctorId(doctorId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('zenve_open_message', {
        detail: { doctorId: normId },
      })
    );
  }
};
