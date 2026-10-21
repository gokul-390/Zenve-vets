import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SearchIcon, MessagesIcon } from './Icons';
import DoctorProfileModal from './DoctorProfileModal';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import { VETERINARIANS } from '../data/veterinarians';
import '../csscomponents/MessagesPage.css';

// Base directory of community veterinarians
const ALL_DIRECTORY_DOCTORS = [
  {
    id: 'aarthi',
    name: 'Dr. Aarthi',
    specialty: 'Orthopedic Surgery',
    location: 'Bengaluru, Karnataka',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    clinic: 'Bengaluru Pet Orthopedics & Trauma Centre',
    online: true,
    lastSeen: 'Active now',
  },
  {
    id: 'arun',
    name: 'Dr. Arun Mehta',
    specialty: 'Veterinary Surgery',
    location: 'Mumbai, Maharashtra',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    clinic: 'Apex Veterinary Multi-Specialty & Trauma Hospital',
    online: true,
    lastSeen: 'Active now',
  },
  {
    id: 'priya',
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    location: 'Kochi, Kerala',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    clinic: 'Coastal Veterinary Specialty & Allergy Clinic',
    online: true,
    lastSeen: 'Active now',
  },
  {
    id: 'sanjay',
    name: 'Dr. Sanjay Verma',
    specialty: 'Equine Specialist',
    location: 'Jaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: true,
    clinic: 'Rajputana Equine Hospital & Stud Health Care',
    online: false,
    lastSeen: '25m ago',
  },
  {
    id: 'sweet_heart',
    name: 'sweet_Sneha',
    specialty: 'Animal Rehabilitation',
    location: 'Delhi NCR',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: false,
    clinic: 'Paws & Motion Rehabilitation Center',
    online: true,
    lastSeen: 'Active now',
  },
  {
    id: 'nidhi',
    name: 'Dr. Nidhi Sharma',
    specialty: 'Small Animal Internal Medicine',
    location: 'New Delhi',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: true,
    defaultFollowing: false,
    clinic: 'CarePet Internal Medicine Practice',
    online: false,
    lastSeen: '2h ago',
  },
  {
    id: 'karthika',
    name: 'Dr. Karthika Raman',
    specialty: 'Avian & Exotic Care',
    location: 'Bengaluru, Karnataka',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    clinic: 'Wings & Beaks Exotic Pet Hospital',
    online: false,
    lastSeen: 'Yesterday',
  },
  {
    id: 'vikram',
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Sports Medicine',
    location: 'Jaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    clinic: 'Royal Equine Soundness Institute',
    online: true,
    lastSeen: 'Active now',
  },
  {
    id: 'ananya',
    name: 'Dr. Ananya Sen',
    specialty: 'Feline Internal Medicine',
    location: 'Kolkata, West Bengal',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    isFollower: false,
    defaultFollowing: false,
    clinic: 'Kolkata Feline Specialty Center',
    online: false,
    lastSeen: '3h ago',
  },
];

// Initial conversation seeds for all community veterinarians
const INITIAL_CONVERSATIONS = {
  aarthi: [
    {
      id: 'msg-a1',
      sender: 'them',
      text: 'Hello Doctor! The post-operative recovery on that German Shepherd TPLO case is progressing wonderfully. Early weight bearing achieved smoothly!',
      time: '10:45 AM',
    },
    {
      id: 'msg-a2',
      sender: 'me',
      text: 'That is fantastic news Dr. Aarthi! Was there any joint effusion noted during the 2-week checkup?',
      time: '10:48 AM',
    },
    {
      id: 'msg-a3',
      sender: 'them',
      text: 'Minimal effusion, patient is very comfortable on carprofen and restricted leash walks. Happy to share radiograph views if helpful!',
      time: '10:52 AM',
    },
  ],
  arun: [
    {
      id: 'msg-ar1',
      sender: 'them',
      text: 'Good afternoon! Are you attending the upcoming Veterinary Surgery Summit in Mumbai next month?',
      time: 'Yesterday',
    },
    {
      id: 'msg-ar2',
      sender: 'me',
      text: 'Yes Dr. Arun, I am presenting a short clinical abstract on emergency laparoscopic procedures.',
      time: 'Yesterday',
    },
    {
      id: 'msg-ar3',
      sender: 'them',
      text: 'Excellent! Let us catch up during the morning surgical panel coffee break.',
      time: 'Yesterday',
    },
  ],
  priya: [
    {
      id: 'msg-p1',
      sender: 'them',
      text: 'Greetings! Following up on the sublingual allergen immunotherapy regimen: symptoms decreased by 85% in our chronic atopy patient.',
      time: '2 days ago',
    },
    {
      id: 'msg-p2',
      sender: 'me',
      text: 'Splendid results Dr. Priya! Did you need to combine it with any topical ceramide barrier therapy?',
      time: '2 days ago',
    },
    {
      id: 'msg-p3',
      sender: 'them',
      text: 'Yes, weekly lipid spot-ons helped significantly with transepidermal water loss. Delighted to share the cytology protocol!',
      time: 'Yesterday',
    },
  ],
  sanjay: [
    {
      id: 'msg-s1',
      sender: 'them',
      text: 'Hello Dr.! Reviewing the equine gait kinematics video from yesterday. Stride symmetry looks very consistent.',
      time: '3 days ago',
    },
    {
      id: 'msg-s2',
      sender: 'me',
      text: 'Glad to hear! How was the left hindlimb flexion angle at full trot?',
      time: '3 days ago',
    },
    {
      id: 'msg-s3',
      sender: 'them',
      text: 'Dynamic flexion showed no signs of fetlock joint resistance. Soundness is fully restored for training!',
      time: '2 days ago',
    },
  ],
  sweet_heart: [
    {
      id: 'msg-sw1',
      sender: 'them',
      text: 'Hello colleague! Bruno the golden retriever completed his first underwater treadmill rehabilitation session today.',
      time: '11:15 AM',
    },
    {
      id: 'msg-sw2',
      sender: 'me',
      text: 'Wonderful! Did he tolerate the water buoyancy well for hip extension?',
      time: '11:20 AM',
    },
    {
      id: 'msg-sw3',
      sender: 'them',
      text: 'Tolerated it smoothly! Hydrotherapy reduces 60% of joint strain while rebuilding quadriceps tone.',
      time: '11:25 AM',
    },
  ],
  nidhi: [
    {
      id: 'msg-n1',
      sender: 'them',
      text: 'Good morning Doctor! The canine pediatric vaccination and wellness protocol was updated with the latest WSAVA guidelines.',
      time: 'Yesterday',
    },
    {
      id: 'msg-n2',
      sender: 'me',
      text: 'Thank you Dr. Nidhi! Are you adopting the earlier parvo booster timing for high-risk breeds?',
      time: 'Yesterday',
    },
  ],
  karthika: [
    {
      id: 'msg-k1',
      sender: 'them',
      text: 'Namaste Doctor! Just stabilized an African Grey parrot with metabolic bone disease and hypocalcemia. Dietary correction underway!',
      time: 'Yesterday',
    },
  ],
  vikram: [
    {
      id: 'msg-v1',
      sender: 'them',
      text: 'Greetings colleague! Finished distal tarsal arthroscopy on our thoroughbred endurance racer. Cartilage looks very viable.',
      time: '3 days ago',
    },
  ],
  ananya: [
    {
      id: 'msg-an1',
      sender: 'them',
      text: 'Hello Doctor! Managing a geriatric feline with stage 2 CKD. Transitioned to wet renal diet with enteric phosphorus binder.',
      time: '4 days ago',
    },
  ],
};

// Smart Contextual Doctor Auto-Reply Generator
// Generates realistic, authentic clinical responses tailored specifically to what the user wrote and quoted
const generateDoctorReply = (doctor, userText, quotedMsg) => {
  const text = (userText || '').toLowerCase();
  const docName = doctor?.name ? doctor.name.split(' ')[0] : 'Doctor';
  const prefix = quotedMsg
    ? `Regarding your point ("${quotedMsg.text.length > 32 ? quotedMsg.text.slice(0, 32) + '...' : quotedMsg.text}"): `
    : '';

  // 1. Orthopedics / Surgery / TPLO / Recovery / Fracture
  if (
    text.includes('surgery') ||
    text.includes('tplo') ||
    text.includes('fracture') ||
    text.includes('bone') ||
    text.includes('ligament') ||
    text.includes('joint')
  ) {
    if (doctor.id === 'aarthi' || doctor.id === 'arun') {
      return `${prefix}In this clinical scenario, strict post-operative stability and gradual controlled ambulation are key. I recommend a 4-week radiograph review to verify bridging callus before advancing leash activity.`;
    }
    return `${prefix}Surgical candidate assessment looks appropriate. Pre-anesthetic screening, blood panel, and orthogonal radiographs will give us the clearest baseline for surgical planning.`;
  }

  // 2. Recovery / Pain / Limp / Healing / Swelling
  if (
    text.includes('recovery') ||
    text.includes('pain') ||
    text.includes('limp') ||
    text.includes('swell') ||
    text.includes('wound') ||
    text.includes('heal')
  ) {
    return `${prefix}For pain management and tissue healing, multimodal analgesia (NSAIDs + gabapentin) with cold compression for the first 48 hours works effectively. Let me know if swelling or guarding persists!`;
  }

  // 3. Dermatology / Skin / Itch / Allergy / Cytology
  if (
    text.includes('skin') ||
    text.includes('itch') ||
    text.includes('allergy') ||
    text.includes('rash') ||
    text.includes('ear') ||
    text.includes('coat')
  ) {
    if (doctor.id === 'priya') {
      return `${prefix}In canine atopic dermatitis, addressing secondary Malassezia or bacterial overgrowth with cytology tape strips is the first step. Topical lipid ceramides will also restore the epidermal barrier.`;
    }
    return `${prefix}Skin flare-ups often respond best to a step-wise approach: skin cytology first, followed by hypoallergenic dietary trials if environmental atopy is suspected.`;
  }

  // 4. Equine / Horse / Gait / Hoof / Soundness
  if (
    text.includes('horse') ||
    text.includes('equine') ||
    text.includes('gait') ||
    text.includes('hoof') ||
    text.includes('soundness') ||
    text.includes('trot')
  ) {
    if (doctor.id === 'sanjay' || doctor.id === 'vikram') {
      return `${prefix}Hoof balance and footing resistance make a tremendous difference. Dynamic flexion tests coupled with high-speed video capture will pinpoint whether the restriction is tarsal or proximal.`;
    }
    return `${prefix}Equine soundness requires close evaluation of stride propulsion and heel-to-toe landing. Happy to review any slow-motion trot recordings you have.`;
  }

  // 5. Rehab / Aquatic / Hydrotherapy / Exercise
  if (
    text.includes('rehab') ||
    text.includes('hydro') ||
    text.includes('water') ||
    text.includes('swim') ||
    text.includes('exercise') ||
    text.includes('treadmill')
  ) {
    return `${prefix}Hydrotherapy offers fantastic low-impact buoyancy! We start with warm water immersion at tarsus level, gradually increasing resistance to rebuild muscle tone without articular compression.`;
  }

  // 6. Medication / Dose / Antibiotic / Treatment
  if (
    text.includes('dose') ||
    text.includes('dosage') ||
    text.includes('med') ||
    text.includes('drug') ||
    text.includes('antibiotic') ||
    text.includes('tablet')
  ) {
    return `${prefix}Standard therapeutic dosing should be weight-calibrated with baseline hepatic/renal panels verified. Monitor the patient's appetite and hydration closely during the initial 72 hours.`;
  }

  // 7. Case consultation / Referral / Meeting / Second Opinion
  if (
    text.includes('consult') ||
    text.includes('refer') ||
    text.includes('case') ||
    text.includes('opinion') ||
    text.includes('review')
  ) {
    return `${prefix}I would be delighted to consult with you on this patient! Please feel free to share the case summary, lab panels, or imaging studies, and I will review them thoroughly between rounds.`;
  }

  // 8. Greetings
  if (
    text.includes('hello') ||
    text.includes('hi') ||
    text.includes('hey') ||
    text.includes('good morning') ||
    text.includes('good afternoon') ||
    text.includes('greetings')
  ) {
    return `Hello colleague! Always a pleasure connecting on Zenve. How is your clinical schedule going, and how can I collaborate with you today?`;
  }

  // 9. Thanks / Compliments
  if (
    text.includes('thank') ||
    text.includes('thanks') ||
    text.includes('appreciate') ||
    text.includes('great') ||
    text.includes('awesome')
  ) {
    return `You are very welcome! Always glad to exchange veterinary insights with dedicated colleagues. Keep me posted on any developments!`;
  }

  // 10. Default Specialty-Informed Reply
  const specialtySnippets = {
    aarthi: 'Thank you for reaching out! In my orthopedic experience, careful rehabilitation combined with joint stabilization yields the most consistent long-term outcome.',
    arun: 'Thanks for the message! We utilize a similar diagnostic protocol in our surgical trauma unit. Precision and pre-op prep are paramount.',
    priya: 'Appreciate your note! Maintaining skin barrier health alongside targeted cytology makes all the difference in chronic veterinary cases.',
    sanjay: 'Good day, Doctor! Hoof balance and surface firmness play such a pivotal role in equine soundness. Thanks for sharing your clinical thoughts!',
    sweet_heart: 'Thanks for messaging! Regular aquatic workouts alleviate joint pressure while building lasting core stability for recovering patients.',
    nidhi: 'Greetings Doctor! Preventive screening and proactive clinical protocols set the tone for lifelong patient health. Glad to connect on Zenve!',
    karthika: 'Thank you Doctor! Avian and exotic medicine always benefits from peer collaboration. Looking forward to discussing case nuances with you.',
    vikram: 'Appreciate your note, colleague! In equine sports medicine, early biomechanical intervention prevents chronic pathology. Glad to connect!',
    ananya: 'Warm regards! Feline internal medicine requires that delicate balance of nutrition and gentle clinical management. Great connecting with you!',
  };

  const defaultDocReply =
    specialtySnippets[doctor.id] ||
    `Thank you for reaching out, Doctor! I have received your message and will review the clinical details in depth between rounds.`;

  return `${prefix}${defaultDocReply}`;
};

export const MessagesPage = ({ initialDoctorId, onDoctorChanged }) => {
  // Read and maintain following state in sync with localStorage
  const [followingMap, setFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_following_doctors');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    // Initial defaults for followed doctors
    const initial = {};
    ALL_DIRECTORY_DOCTORS.forEach((d) => {
      if (d.defaultFollowing) initial[d.id] = true;
    });
    return initial;
  });

  // Conversations history stored in state & localStorage
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_chat_messages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_CONVERSATIONS;
  });

  // Selected active chat doctor ID (defaults to initialDoctorId or 'aarthi')
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => initialDoctorId || 'aarthi');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Contact list filter tab: 'all' | 'followers' | 'following'
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  // Input composer text
  const [messageInput, setMessageInput] = useState('');

  // Replying to a specific message state ("message feld click with message is own reply msg")
  const [replyingTo, setReplyingTo] = useState(null);

  // Typing indicator
  const [isTyping, setIsTyping] = useState(false);

  // Profile modal state
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Sync selected doctor with prop if changed from outside
  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
  }, [initialDoctorId]);

  // Listen for global custom event 'zenve_open_message'
  useEffect(() => {
    const handleOpenMessageEvent = (e) => {
      if (e.detail?.doctorId) {
        setSelectedDoctorId(e.detail.doctorId);
        if (onDoctorChanged) onDoctorChanged(e.detail.doctorId);
      }
    };
    window.addEventListener('zenve_open_message', handleOpenMessageEvent);
    return () => window.removeEventListener('zenve_open_message', handleOpenMessageEvent);
  }, [onDoctorChanged]);

  // Auto scroll to bottom of chat history when messages change or typing toggles
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, selectedDoctorId, isTyping]);

  // Persist followingMap to localStorage
  const handleToggleFollow = (doctorId) => {
    setFollowingMap((prev) => {
      const updated = { ...prev, [doctorId]: !prev[doctorId] };
      try {
        localStorage.setItem('zenve_following_doctors', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save following state:', err);
      }
      return updated;
    });
  };

  // Find selected doctor object
  const selectedDoctor = useMemo(() => {
    return ALL_DIRECTORY_DOCTORS.find((d) => d.id === selectedDoctorId) || ALL_DIRECTORY_DOCTORS[0];
  }, [selectedDoctorId]);

  // Whether user follows the currently selected doctor
  const isFollowingSelected = !!followingMap[selectedDoctor.id];

  // Current chat messages for active doctor
  const activeChatMessages = conversations[selectedDoctor.id] || [];

  // Filtered contacts based on search and active tab
  const { followerContacts, otherDirectoryContacts } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = ALL_DIRECTORY_DOCTORS.filter((doc) => {
      // Tab filter
      const isFollowing = !!followingMap[doc.id];
      if (activeFilterTab === 'followers' && !doc.isFollower) return false;
      if (activeFilterTab === 'following' && !isFollowing) return false;

      // Search query filter
      if (!q) return true;
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q) ||
        doc.clinic.toLowerCase().includes(q)
      );
    });

    // Group into followed/followers vs other community members
    const followers = [];
    const others = [];

    filtered.forEach((doc) => {
      const isFollowing = !!followingMap[doc.id];
      if (isFollowing || doc.isFollower || (conversations[doc.id] && conversations[doc.id].length > 0)) {
        followers.push(doc);
      } else {
        others.push(doc);
      }
    });

    return { followerContacts: followers, otherDirectoryContacts: others };
  }, [searchQuery, activeFilterTab, followingMap, conversations]);

  // Handle clicking a message to reply to it ("message feld click with message is own reply msg")
  const handleSelectMessageToReply = (msg) => {
    if (!msg) return;
    const senderName = msg.sender === 'me' ? 'You' : (selectedDoctor?.name || 'Doctor');
    setReplyingTo({
      id: msg.id,
      sender: msg.sender,
      senderName,
      text: msg.text,
    });
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Send message action with contextual reply logic
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || messageInput).trim();
    if (!text || !selectedDoctor) return;

    // Check constraint: "following persons only send msg and reply msg"
    if (!isFollowingSelected) {
      alert(`You must follow ${selectedDoctor.name} to send messages and receive replies.`);
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentQuoted = replyingTo;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: timeString,
      replyTo: currentQuoted
        ? {
            id: currentQuoted.id,
            senderName: currentQuoted.senderName,
            text: currentQuoted.text,
          }
        : null,
    };

    setReplyingTo(null);

    const updatedDoctorMessages = [...activeChatMessages, newMsg];
    const updatedConversations = {
      ...conversations,
      [selectedDoctor.id]: updatedDoctorMessages,
    };

    setConversations(updatedConversations);
    try {
      localStorage.setItem('zenve_chat_messages', JSON.stringify(updatedConversations));
    } catch (err) {
      console.warn('Could not save message to localStorage:', err);
    }

    setMessageInput('');

    // Trigger realistic reply from the doctor ("reply msg")
    setIsTyping(true);
    const replyDelay = 1200 + Math.random() * 800; // 1.2s - 2.0s

    setTimeout(() => {
      setIsTyping(false);
      const contextualReply = generateDoctorReply(selectedDoctor, text, currentQuoted);

      const replyNow = new Date();
      const replyTime = replyNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: contextualReply,
        time: replyTime,
        replyTo: currentQuoted
          ? {
              id: currentQuoted.id,
              senderName: currentQuoted.senderName,
              text: currentQuoted.text,
            }
          : null,
      };

      setConversations((prev) => {
        const nextChat = [...(prev[selectedDoctor.id] || []), replyMsg];
        const nextAll = { ...prev, [selectedDoctor.id]: nextChat };
        try {
          localStorage.setItem('zenve_chat_messages', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    }, replyDelay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openProfile = (doc) => {
    setProfileDoctor(doc);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="zenve-messages-container">
      {/* ── Left Rail: Contacts & Search ─────────────────────────────── */}
      <aside className="zenve-messages-sidebar" aria-label="Messages contacts and search">
        <div className="zenve-messages-sidebar-header">
          <div className="zenve-messages-title-row">
            <h2 className="zenve-messages-title">
              <MessagesIcon size={20} color="#3D0D18" />
              <span>Messages</span>
            </h2>
            <span className="zenve-messages-count-badge">
              {Object.keys(followingMap).filter((k) => followingMap[k]).length} Following
            </span>
          </div>

          {/* Search Box ("search using search my followers and other name persons") */}
          <div className="zenve-messages-search-box">
            <SearchIcon size={14} color="#84938b" />
            <input
              type="text"
              className="zenve-messages-search-input"
              placeholder="Search followers, doctors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search my followers and other persons"
            />
            {searchQuery && (
              <button
                type="button"
                className="zenve-messages-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="zenve-messages-filter-tabs">
          <button
            type="button"
            className={`zenve-messages-tab-btn ${activeFilterTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('all')}
          >
            All Contacts
          </button>
          <button
            type="button"
            className={`zenve-messages-tab-btn ${activeFilterTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('followers')}
          >
            My Followers
          </button>
          <button
            type="button"
            className={`zenve-messages-tab-btn ${activeFilterTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('following')}
          >
            Following
          </button>
        </div>

        {/* Contacts List */}
        <div className="zenve-messages-list">
          {/* 1. Followers & Active Contacts */}
          {followerContacts.length > 0 && (
            <>
              <div className="zenve-messages-section-label">
                {searchQuery ? 'My Network Matches' : 'Followers & Connected Doctors'}
              </div>
              {followerContacts.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                const isFollowing = !!followingMap[doc.id];
                const chat = conversations[doc.id] || [];
                const lastMsg = chat[chat.length - 1];

                return (
                  <div
                    key={doc.id}
                    className={`zenve-contact-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="zenve-contact-avatar-wrap">
                      <img src={doc.img} alt={doc.name} className="zenve-contact-avatar-img" />
                      {doc.online && <span className="zenve-online-dot" title="Online" />}
                    </div>

                    <div className="zenve-contact-info">
                      <div className="zenve-contact-top-row">
                        <span className="zenve-contact-name">{doc.name}</span>
                        <span className="zenve-contact-time">
                          {lastMsg ? lastMsg.time : doc.lastSeen}
                        </span>
                      </div>
                      <div className="zenve-contact-bottom-row">
                        <p className="zenve-contact-preview">
                          {lastMsg
                            ? `${lastMsg.sender === 'me' ? 'You: ' : ''}${lastMsg.text}`
                            : doc.specialty}
                        </p>
                        <span
                          className={`zenve-contact-status-chip ${
                            isFollowing ? 'zenve-status-following' : 'zenve-status-not-following'
                          }`}
                        >
                          {isFollowing ? 'Following' : doc.isFollower ? 'Follower' : 'Connect'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* 2. Other Community Members from Search */}
          {otherDirectoryContacts.length > 0 && (
            <>
              <div className="zenve-messages-section-label" style={{ marginTop: '12px' }}>
                Other Doctors in Community
              </div>
              {otherDirectoryContacts.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                const isFollowing = !!followingMap[doc.id];

                return (
                  <div
                    key={doc.id}
                    className={`zenve-contact-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="zenve-contact-avatar-wrap">
                      <img src={doc.img} alt={doc.name} className="zenve-contact-avatar-img" />
                      {doc.online && <span className="zenve-online-dot" />}
                    </div>

                    <div className="zenve-contact-info">
                      <div className="zenve-contact-top-row">
                        <span className="zenve-contact-name">{doc.name}</span>
                        <span className="zenve-contact-time">{doc.location.split(',')[0]}</span>
                      </div>
                      <div className="zenve-contact-bottom-row">
                        <p className="zenve-contact-preview">{doc.specialty}</p>
                        <span className="zenve-contact-status-chip zenve-status-not-following">
                          {isFollowing ? 'Following' : 'Follow to msg'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {followerContacts.length === 0 && otherDirectoryContacts.length === 0 && (
            <div className="zenve-contacts-empty">
              No contacts found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </aside>

      {/* ── Right: Chat Conversation Pane ───────────────────────────── */}
      <main className="zenve-messages-chat-pane" aria-label="Conversation view">
        {selectedDoctor ? (
          <>
            {/* Chat Header */}
            <div className="zenve-chat-header">
              <div className="zenve-chat-header-user">
                <img
                  src={selectedDoctor.img}
                  alt={selectedDoctor.name}
                  className="zenve-chat-header-avatar"
                  onClick={() => openProfile(selectedDoctor)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <h3
                    className="zenve-chat-header-name"
                    onClick={() => openProfile(selectedDoctor)}
                    style={{ cursor: 'pointer' }}
                  >
                    {selectedDoctor.name}
                    <span className="zenve-chat-header-verified" title="Verified Veterinarian">
                      ✓
                    </span>
                  </h3>
                  <p className="zenve-chat-header-sub">
                    <span>{selectedDoctor.specialty}</span>
                    <span>•</span>
                    <span style={{ color: selectedDoctor.online ? '#16a34a' : '#889890' }}>
                      {selectedDoctor.online ? 'Online now' : selectedDoctor.lastSeen}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: View Profile & Follow Toggle */}
              <div className="zenve-chat-header-actions">
                <button
                  type="button"
                  className="zenve-view-profile-btn"
                  onClick={() => openProfile(selectedDoctor)}
                  title="View full doctor profile"
                >
                  View Profile ↗
                </button>
                <button
                  type="button"
                  className={`zenve-follow-toggle-btn ${
                    isFollowingSelected ? 'following' : 'not-following'
                  }`}
                  onClick={() => handleToggleFollow(selectedDoctor.id)}
                  title={isFollowingSelected ? 'Click to Unfollow' : 'Follow to enable messaging'}
                >
                  {isFollowingSelected ? '✓ Following' : '+ Follow to Msg'}
                </button>
              </div>
            </div>

            {/* Messages Thread Flow */}
            <div className="zenve-chat-history">
              <div className="zenve-chat-encrypted-notice">
                🔒 ZenveVet Professional Consultation • Direct Peer Encryption
              </div>

              {activeChatMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                const isReplyingToThis = replyingTo?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`zenve-chat-bubble-wrap ${isMe ? 'sent' : 'received'} ${
                      isReplyingToThis ? 'zenve-bubble-selected-reply' : ''
                    }`}
                    onClick={() => handleSelectMessageToReply(msg)}
                    title="Click this message to reply to it"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSelectMessageToReply(msg);
                    }}
                  >
                    {/* Quoted Reply Reference Box */}
                    {msg.replyTo && (
                      <div className="zenve-chat-quoted-box">
                        <div className="zenve-quoted-author">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 17 4 12 9 7" />
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                          </svg>
                          <span>{msg.replyTo.senderName}</span>
                        </div>
                        <p className="zenve-quoted-text">{msg.replyTo.text}</p>
                      </div>
                    )}

                    <div className={`zenve-chat-bubble ${isMe ? 'sent' : 'received'}`}>
                      <span>{msg.text}</span>
                      <button
                        type="button"
                        className="zenve-bubble-reply-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMessageToReply(msg);
                        }}
                        title="Reply to message"
                        aria-label="Reply to message"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 17 4 12 9 7" />
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                        </svg>
                        <span>Reply</span>
                      </button>
                    </div>

                    <div className="zenve-chat-meta">
                      <span>{msg.time}</span>
                      {isMe && <span className="zenve-chat-check">✓✓</span>}
                      <span className="zenve-click-hint">💬 Click to reply</span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator while doctor prepares reply */}
              {isTyping && (
                <div className="zenve-typing-indicator" aria-label="Doctor is typing">
                  <span className="zenve-typing-dot" />
                  <span className="zenve-typing-dot" />
                  <span className="zenve-typing-dot" />
                  <span className="zenve-typing-label">
                    {selectedDoctor.name.split(' ')[0]} is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested quick case consultation prompts */}
            {isFollowingSelected && (
              <div className="zenve-quick-prompts-row">
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleSendMessage('Hello Doctor, could I consult with you regarding a clinical case?')
                  }
                >
                  🩺 Clinical case consultation
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleSendMessage('Excellent case presentation on your feed! What was the post-op protocol?')
                  }
                >
                  👏 Compliment case post
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleSendMessage('Are you available for a peer referral in your specialty?')
                  }
                >
                  🤝 Refer a patient
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleSendMessage('Could you share your diagnostic protocol and radiographs for this?')
                  }
                >
                  📸 Diagnostic review
                </button>
              </div>
            )}

            {/* Bottom: Input Composer OR Follow Notice ("following persons only send msg and reply msg") */}
            {isFollowingSelected ? (
              <div className="zenve-chat-composer-wrapper">
                {/* Active Replying Bar Preview */}
                {replyingTo && (
                  <div className="zenve-chat-replying-bar">
                    <div className="zenve-replying-bar-left">
                      <div className="zenve-replying-bar-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 17 4 12 9 7" />
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                        </svg>
                      </div>
                      <div className="zenve-replying-bar-text">
                        <span className="zenve-replying-bar-author">
                          Replying to {replyingTo.senderName}
                        </span>
                        <span className="zenve-replying-bar-snippet">
                          {replyingTo.text}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="zenve-replying-bar-close"
                      onClick={handleCancelReply}
                      title="Cancel reply"
                      aria-label="Cancel reply"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="zenve-chat-composer">
                  <div className="zenve-chat-input-wrap">
                    <input
                      ref={chatInputRef}
                      type="text"
                      className="zenve-chat-input"
                      placeholder={
                        replyingTo
                          ? `Write a reply to ${replyingTo.senderName}...`
                          : `Write a message to ${selectedDoctor.name}...`
                      }
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    type="button"
                    className="zenve-chat-send-btn"
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim() || isTyping}
                    title="Send message (Enter)"
                    aria-label="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="zenve-chat-restricted-banner">
                <div className="zenve-restricted-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h4 className="zenve-restricted-title">Direct Messaging Restricted</h4>
                <p className="zenve-restricted-desc">
                  To protect our veterinary community from unsolicited spam, you can only send and
                  receive messages with persons you follow. Follow <strong>{selectedDoctor.name}</strong> to
                  send a message and receive replies.
                </p>
                <button
                  type="button"
                  className="zenve-restricted-follow-btn"
                  onClick={() => handleToggleFollow(selectedDoctor.id)}
                >
                  <span>+ Follow {selectedDoctor.name}</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="zenve-chat-no-selection">
            <div className="zenve-chat-no-selection-icon">
              <MessagesIcon size={32} color="#3D0D18" />
            </div>
            <h3 className="zenve-chat-no-selection-title">Select a Conversation</h3>
            <p className="zenve-chat-no-selection-desc">
              Search your followers or community veterinarians on the left to start a professional
              clinical discussion.
            </p>
          </div>
        )}
      </main>

      {/* Doctor Profile Modal Integration */}
      {isProfileModalOpen && profileDoctor && (
        <DoctorProfileModal
          doctor={DOCTORS_DATABASE[profileDoctor.id] || profileDoctor}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          isFollowing={!!followingMap[profileDoctor.id]}
          onToggleFollow={() => handleToggleFollow(profileDoctor.id)}
        />
      )}
    </div>
  );
};

export default MessagesPage;
