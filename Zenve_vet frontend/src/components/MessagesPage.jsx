import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, Settings, Users, UserPlus, Trash2, Globe, Lock, Share2, Check, Info, ShieldCheck, Pin, FileText, Paperclip, Smile, Copy, Edit2, MoreVertical, Download, CornerUpLeft, ArrowUpRight } from 'lucide-react';
import { SearchIcon, MessagesIcon } from './Icons';
import DoctorProfileModal from './DoctorProfileModal';
import CreateProfileModal from './CreateProfileModal';
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

// Default Pre-Configured Communities (Public = All Users, Private = Followers Only)
// Each community has a permanent unique invite code and specialized clinical guidelines
export const DEFAULT_COMMUNITIES = [
  {
    id: 'comm-public-clinical',
    inviteCode: 'ZN-IND-9021',
    name: 'Zenve All-India Clinical Forum',
    type: 'public', // 'public' | 'private'
    category: 'General Surgery & Medicine',
    description: 'Pan-India veterinary clinical collective for open multi-center case differential, diagnostic imaging opinions, and evidence-based pharmacotherapy discussions across all 28 states.',
    avatar: '🌐',
    bannerColor: '#1D3B2F',
    adminId: 'council',
    createdBy: 'Zenve Medical Council',
    createdAt: 'Active today',
    invitedMemberIds: [],
    removedMemberIds: [],
    guidelines: [
      {
        id: 1,
        title: 'Patient & Client Anonymization',
        desc: 'Redact pet guardian names, mobile numbers, and patient microchip records from all radiographic DICOM stills, CT/MRI reconstructions, and laboratory panels prior to uploading.',
      },
      {
        id: 2,
        title: 'Evidence-Based Drug Protocols',
        desc: 'Adhere to WSAVA and ICAR antibiotic stewardship dosages. Specify patient weight, renal/hepatic biomarkers, and culture sensitivities when discussing therapeutics.',
      },
      {
        id: 3,
        title: 'Emergency Consult Prioritization',
        desc: 'Flag critical trauma, GDV, and poisonings with #UrgentDifferential so on-duty surgical and critical care specialists receive immediate multi-specialty triage alerts.',
      },
    ],
  },
  {
    id: 'comm-private-followers',
    inviteCode: 'ZN-PVT-4481',
    name: 'Followers Private Circle',
    type: 'private', // 'public' | 'private'
    category: 'Exclusive Practice Network',
    description: 'Private veterinary peer network reserved exclusively for your verified followers. Confidential second opinions, surgical debriefs, and practice management strategies.',
    avatar: '🔒',
    bannerColor: '#3D0D18',
    adminId: 'me',
    createdBy: 'You (Dr. Practitioner)',
    createdAt: 'Active today',
    invitedMemberIds: [],
    removedMemberIds: [],
    guidelines: [
      {
        id: 1,
        title: 'Strict Circle Confidentiality',
        desc: 'All surgical recordings, histology cytology interpretations, and practice revenue discussions shared in this circle are strictly confidential and exclusive to approved followers.',
      },
      {
        id: 2,
        title: 'Longitudinal Post-Op Follow-Up',
        desc: 'Share serial postoperative milestone logs (Day 3, Day 7, Day 21) to facilitate collaborative recovery tracking and complications analysis with fellow colleagues.',
      },
      {
        id: 3,
        title: 'Direct Clinician Mentorship',
        desc: 'Engage in open peer mentorship regarding tricky client consultations, anesthesia monitoring equipment selections, and specialized surgical instrumentation techniques.',
      },
    ],
  },
];

// WhatsApp Group Participant Distinct Name Colors
const WA_DOCTOR_COLORS = [
  '#0284c7', // Sky Blue
  '#e542a3', // Pink
  '#7c3aed', // Purple
  '#d97706', // Amber
  '#0d9488', // Teal
  '#ea580c', // Orange
  '#16a34a', // Emerald
  '#dc2626', // Red
];

export const getDoctorColor = (identifier) => {
  if (!identifier) return '#0284c7';
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % WA_DOCTOR_COLORS.length;
  return WA_DOCTOR_COLORS[index];
};

// WhatsApp Interactive Emoji Categories
export const EMOJI_TABS = [
  {
    id: 'smileys',
    label: '😀',
    title: 'Smileys & Feelings',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😜', '🤔', '🤫', '🤐', '😴', '🥳', '😎', '🤩', '😏', '😬', '😮', '🥺', '😭', '🙌', '👏', '🤝', '🙏'],
  },
  {
    id: 'animals',
    label: '🐾',
    title: 'Animals & Pets',
    emojis: ['🐶', '🐱', '🐾', '🦴', '🐕', '🐩', '🐈', '🐴', '🐎', '🐮', '🐷', '🐰', '🐹', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🦜', '🦚', '🐢', '🐍', '🦎', '🐙', '🐠', '🐬', '🐳', '🦮', '🐕‍🦺', '🦔', '🦤'],
  },
  {
    id: 'clinical',
    label: '🩺',
    title: 'Veterinary & Clinical',
    emojis: ['🩺', '💊', '💉', '🩹', '🩸', '🔬', '📋', '📝', '📊', '📈', '🩻', '🧪', '🧼', '🧬', '🧫', '🧯', '🏥', '🚑', '🧤', '🥼', '🧴', '🌡️', '🦷', '👁️', '👂', '🧠', '🫀', '🫁', '🐕', '🐈', '🐾'],
  },
  {
    id: 'reactions',
    label: '👍',
    title: 'Reactions & Symbols',
    emojis: ['👍', '👎', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '✅', '⚠️', '🚨', '🎯', '📍', '💡', '⭐', '✨', '⚡', '🔥', '🎉', '🎊', '💪', '✌️', '🤞', '👌', '🤝', '💬', '📢', '🔒', '🌐'],
  },
];

// Seed Messages for Communities
export const INITIAL_COMMUNITY_MESSAGES = {
  'comm-public-clinical': [
    {
      id: 'cm-1',
      senderId: 'aarthi',
      senderName: 'Dr. Aarthi',
      senderSpecialty: 'Orthopedic Surgery',
      senderImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Namaste everyone! Presenting a 3-year-old Indie dog with grade 3 bilateral medial patellar luxation. Sulcoplasty and tibial tuberosity transposition completed.',
      time: '09:30 AM',
      isMe: false,
    },
    {
      id: 'cm-2',
      senderId: 'arun',
      senderName: 'Dr. Arun Mehta',
      senderSpecialty: 'Veterinary Surgery',
      senderImg: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Terrific case Dr. Aarthi! Did you utilize a tension-band wire technique for the tuberosity fixation?',
      time: '09:45 AM',
      isMe: false,
    },
    {
      id: 'cm-3',
      senderId: 'me',
      senderName: 'You (Dr. Practitioner)',
      senderSpecialty: 'Veterinary Surgeon',
      senderImg: '',
      text: 'Following with interest! Looking forward to reviewing the 6-week post-op radiograph series.',
      time: '10:02 AM',
      isMe: true,
    },
  ],
  'comm-private-followers': [
    {
      id: 'cm-p1',
      senderId: 'priya',
      senderName: 'Dr. Priya Nair',
      senderSpecialty: 'Veterinary Dermatology',
      senderImg: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Welcome to our private follower circle! Here we share sensitive consultation doubts, referral requests, and complex cytology readings.',
      time: 'Yesterday',
      isMe: false,
    },
    {
      id: 'cm-p2',
      senderId: 'sanjay',
      senderName: 'Dr. Sanjay Verma',
      senderSpecialty: 'Equine Specialist',
      senderImg: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=150&h=150&q=80',
      text: 'Glad to connect in this private network with followers. Recommending a multi-center collaborative study on seasonal pasture myopathy.',
      time: '10:15 AM',
      isMe: false,
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

// Module-level click interceptor to catch "Join the Community" CTA clicks anywhere across pages
if (typeof document !== 'undefined') {
  document.addEventListener(
    'click',
    (e) => {
      const joinBtn = e.target?.closest?.('.zenve-benefits-join-btn');
      if (joinBtn) {
        try {
          sessionStorage.setItem('zenve_open_community_view', 'true');
        } catch {}
      }
    },
    true
  );
}

// Comprehensive helper to verify if the user has created a profile or is authenticated/logged in
export const checkUserHasProfileOrIsLoggedIn = () => {
  try {
    if (typeof window === 'undefined') return false;

    // 1. Check custom vets (array or object)
    const customVets = localStorage.getItem('zenve_custom_vets');
    if (customVets) {
      try {
        const parsed = JSON.parse(customVets);
        if (Array.isArray(parsed) && parsed.length > 0) return true;
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return true;
      } catch {
        if (customVets.trim().length > 2) return true;
      }
    }

    // 2. Check custom profiles (from profilesData.js CUSTOM_PROFILES_KEY)
    const customProfiles = localStorage.getItem('zenve_custom_profiles');
    if (customProfiles) {
      try {
        const parsed = JSON.parse(customProfiles);
        if (Array.isArray(parsed) && parsed.length > 0) return true;
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) return true;
      } catch {}
    }

    // 3. Check zenve_user (checked by MemberBenefitsPage.jsx)
    const user = localStorage.getItem('zenve_user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (
          parsedUser &&
          (parsedUser.profileCreated ||
            parsedUser.name ||
            parsedUser.fullName ||
            parsedUser.doctor ||
            parsedUser.email ||
            parsedUser.id ||
            parsedUser._id ||
            parsedUser.specialty ||
            (typeof parsedUser === 'object' && Object.keys(parsedUser).length > 0))
        ) {
          return true;
        }
      } catch {
        if (user.trim().length > 2) return true;
      }
    }

    // 4. Check auth token (isLoggedIn check)
    const token = localStorage.getItem('zenve_token') || localStorage.getItem('token');
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      return true;
    }

    // 5. Check other common profile/user keys
    const altKeys = [
      'zenve_profile',
      'zenve_doctor_profile',
      'zenve_current_user',
      'zenve_auth_user',
      'zenve_user_profile',
      'user_profile',
      'user',
      'zenve_doctor',
      'zenve_vet_profile',
      'doctor_profile',
    ];
    for (const key of altKeys) {
      const val = localStorage.getItem(key);
      if (val && val !== 'null' && val !== 'undefined') {
        try {
          const parsed = JSON.parse(val);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            return true;
          }
        } catch {
          if (typeof val === 'string' && val.trim().length > 0) return true;
        }
      }
    }

    // 6. Check boolean login flags
    if (
      localStorage.getItem('zenve_is_logged_in') === 'true' ||
      localStorage.getItem('isLoggedIn') === 'true'
    ) {
      return true;
    }

    // 7. Check sessionStorage fallbacks
    const sessionKeys = [
      'zenve_custom_vets',
      'zenve_custom_profiles',
      'zenve_user',
      'zenve_token',
      'zenve_profile',
    ];
    for (const key of sessionKeys) {
      const val = sessionStorage.getItem(key);
      if (val && val !== 'null' && val !== 'undefined' && val.trim() !== '') {
        return true;
      }
    }

    // 8. Check window global flags if any
    if (window.__ZENVE_USER__ || window.__ZENVE_PROFILE__) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const MessagesPage = ({ initialDoctorId, onDoctorChanged }) => {
  // Profile check: only show messages when user has created a profile or is logged in
  const [hasProfile, setHasProfile] = useState(() => checkUserHasProfileOrIsLoggedIn());
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);

  useEffect(() => {
    const handleProfileChange = () => {
      setHasProfile(checkUserHasProfileOrIsLoggedIn());
    };

    // Re-verify immediately on mount
    handleProfileChange();

    window.addEventListener('storage', handleProfileChange);
    window.addEventListener('focus', handleProfileChange);
    window.addEventListener('zenve_profile_updated', handleProfileChange);
    window.addEventListener('zenve_profiles_updated', handleProfileChange);
    window.addEventListener('zenve_custom_vets_changed', handleProfileChange);
    window.addEventListener('zenve:switch-tab', handleProfileChange);
    window.addEventListener('zenve_open_community', handleProfileChange);
    window.addEventListener('zenve_open_message', handleProfileChange);

    return () => {
      window.removeEventListener('storage', handleProfileChange);
      window.removeEventListener('focus', handleProfileChange);
      window.removeEventListener('zenve_profile_updated', handleProfileChange);
      window.removeEventListener('zenve_profiles_updated', handleProfileChange);
      window.removeEventListener('zenve_custom_vets_changed', handleProfileChange);
      window.removeEventListener('zenve:switch-tab', handleProfileChange);
      window.removeEventListener('zenve_open_community', handleProfileChange);
      window.removeEventListener('zenve_open_message', handleProfileChange);
    };
  }, []);

  const handleProfileCreated = (newVet) => {
    try {
      // 1. Update zenve_custom_vets
      const stored = localStorage.getItem('zenve_custom_vets');
      let current = [];
      if (stored) {
        try {
          current = JSON.parse(stored);
        } catch {}
      }
      const updated = [newVet, ...(Array.isArray(current) ? current : [])];
      localStorage.setItem('zenve_custom_vets', JSON.stringify(updated));

      // 2. Update zenve_custom_profiles (used across profilesData.js)
      try {
        const storedProfiles = localStorage.getItem('zenve_custom_profiles');
        let currentProfiles = [];
        if (storedProfiles) {
          try {
            currentProfiles = JSON.parse(storedProfiles);
          } catch {}
        }
        localStorage.setItem(
          'zenve_custom_profiles',
          JSON.stringify([newVet, ...(Array.isArray(currentProfiles) ? currentProfiles : [])])
        );
      } catch {}

      // 3. Sync zenve_user so MemberBenefitsPage and other pages know the user is logged in
      const userData = {
        profileCreated: true,
        name: newVet.name || newVet.fullName || 'Veterinarian',
        fullName: newVet.name || newVet.fullName || 'Veterinarian',
        doctor: newVet.name || newVet.fullName || 'Veterinarian',
        specialty: newVet.specialty || 'General Practice',
        ...newVet,
      };
      localStorage.setItem('zenve_user', JSON.stringify(userData));

      // 4. Dispatch events for instant cross-tab and cross-component updates
      window.dispatchEvent(new Event('zenve_profile_updated'));
      window.dispatchEvent(new CustomEvent('zenve_profiles_updated', { detail: newVet }));
      window.dispatchEvent(new Event('zenve_custom_vets_changed'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
    setHasProfile(true);
    setIsCreateProfileModalOpen(false);
  };

  // Read and maintain following state in sync with localStorage
  const [followingMap, setFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_following_doctors');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch { }
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
    } catch { }
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

  // --- COMMUNITY FEATURE STATE ---
  // Mode switcher: 'chats' (Direct Messages) vs 'community' (Community Groups)
  // Default to 'chats', but switch to 'community' if user clicked "Join the Community"
  const [viewMode, setViewMode] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('zenve_open_community_view') === 'true') {
        sessionStorage.removeItem('zenve_open_community_view');
        return 'community';
      }
    } catch {}
    return 'chats';
  });

  // Search query for community groups
  const [communitySearchQuery, setCommunitySearchQuery] = useState('');

  // Communities list (persisted in localStorage)
  const [communities, setCommunities] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_communities_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => {
            const defaultMatch = DEFAULT_COMMUNITIES.find((d) => d.id === c.id);
            return {
              ...c,
              inviteCode:
                c.inviteCode ||
                defaultMatch?.inviteCode ||
                `ZN-${(c.category || 'VET').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
              description: c.description || defaultMatch?.description || '',
              guidelines:
                c.guidelines && c.guidelines.length > 0
                  ? c.guidelines
                  : defaultMatch?.guidelines || [
                      {
                        id: 1,
                        title: 'Clinical Anonymization',
                        desc: 'Mask all patient and owner identifying records before posting diagnostic media.',
                      },
                      {
                        id: 2,
                        title: 'Evidence-Based Practice',
                        desc: 'Cite standard peer-reviewed protocols and pharmaceutical dosages.',
                      },
                      {
                        id: 3,
                        title: 'Collegial Collaboration',
                        desc: 'Foster respectful, constructive differential discussions to elevate clinical care.',
                      },
                    ],
              adminId:
                c.adminId ||
                (c.createdBy?.includes('You') || c.id === 'comm-private-followers' ? 'me' : 'council'),
              invitedMemberIds: Array.isArray(c.invitedMemberIds) ? c.invitedMemberIds : [],
              removedMemberIds: Array.isArray(c.removedMemberIds) ? c.removedMemberIds : [],
            };
          });
        }
      }
    } catch {}
    return DEFAULT_COMMUNITIES;
  });

  // Track unread/unseen messages per community. Badge ONLY appears if count > 0!
  const [unseenCommunityCounts, setUnseenCommunityCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_unseen_comm_counts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const totalUnseenCommunityCount = useMemo(() => {
    return Object.values(unseenCommunityCounts || {}).reduce(
      (acc, count) => acc + (Number(count) || 0),
      0
    );
  }, [unseenCommunityCounts]);

  // Active community ID
  const [activeCommunityId, setActiveCommunityId] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_active_community_id');
      if (saved) return saved;
    } catch {}
    return 'comm-public-clinical';
  });

  // Community messages history
  const [communityMessages, setCommunityMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_community_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMUNITY_MESSAGES;
  });

  // Community filter tab: 'all' | 'public' | 'private'
  const [communityFilterTab, setCommunityFilterTab] = useState('all');

  // Toggle slide-down members drawer in active community
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);

  // Create Community Modal state
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommType, setNewCommType] = useState('public'); // 'public' | 'private'
  const [newCommCategory, setNewCommCategory] = useState('General Surgery & Medicine');
  const [newCommDesc, setNewCommDesc] = useState('');

  // Group Admin & Community Management Modal state (Popup form matching executive design)
  const [isManageCommunityModalOpen, setIsManageCommunityModalOpen] = useState(false);
  const [manageModalActiveTab, setManageModalActiveTab] = useState('details'); // 'details' | 'members' | 'invite'
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [inviteSearchQuery, setInviteSearchQuery] = useState('');

  // Community Profile Drawer, Quick Share, and Pinned Notice states
  const [showCommProfileDrawer, setShowCommProfileDrawer] = useState(false);
  const [copiedCommLink, setCopiedCommLink] = useState(false);
  const [copiedCodeOnly, setCopiedCodeOnly] = useState(false);
  const [isCommNoticeDismissed, setIsCommNoticeDismissed] = useState(false);

  // Backward-compatible alias for legacy modal references
  const isAdminSettingsModalOpen = isManageCommunityModalOpen && manageModalActiveTab === 'details';
  const setIsAdminSettingsModalOpen = (open) => {
    if (open) {
      setManageModalActiveTab('details');
      setIsManageCommunityModalOpen(true);
    } else {
      setIsManageCommunityModalOpen(false);
    }
  };
  const isInviteDoctorModalOpen = isManageCommunityModalOpen && manageModalActiveTab === 'invite';
  const setIsInviteDoctorModalOpen = (open) => {
    if (open) {
      setManageModalActiveTab('invite');
      setIsManageCommunityModalOpen(true);
    } else {
      setIsManageCommunityModalOpen(false);
    }
  };

  const [editCommName, setEditCommName] = useState('');
  const [editCommCategory, setEditCommCategory] = useState('General Surgery & Medicine');
  const [editCommDesc, setEditCommDesc] = useState('');
  const [editCommType, setEditCommType] = useState('public');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isManageCommunityModalOpen) setIsManageCommunityModalOpen(false);
        if (isCreateCommunityModalOpen) setIsCreateCommunityModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManageCommunityModalOpen, isCreateCommunityModalOpen]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isManageCommunityModalOpen || isCreateCommunityModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isManageCommunityModalOpen, isCreateCommunityModalOpen]);

  // Community chat composer input
  const [communityInput, setCommunityInput] = useState('');
  const communityEndRef = useRef(null);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Message Editing, Deleting, Emoji Picker & File Attachment states
  const [editingMessage, setEditingMessage] = useState(null); // { id, text, context }
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, context, isMe, text }
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // 'community' | 'direct' | null
  const [activeEmojiTab, setActiveEmojiTab] = useState('smileys');
  const [commAttachment, setCommAttachment] = useState(null);
  const [directAttachment, setDirectAttachment] = useState(null);
  const commFileInputRef = useRef(null);
  const directFileInputRef = useRef(null);

  // Close menus & emoji popover on background click
  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveMenuMsgId(null);
      setShowEmojiPicker(null);
    };
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  // File upload handler
  const handleFileUpload = (e, context) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();

    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      const sizeFormatted = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.round(file.size / 1024) + ' KB';

      const attachmentObj = {
        name: file.name,
        size: sizeFormatted,
        type: file.type,
        dataUrl,
        isImage,
      };

      if (context === 'community') {
        setCommAttachment(attachmentObj);
      } else {
        setDirectAttachment(attachmentObj);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save edited message
  const handleSaveEdit = (context, msgId, newText) => {
    const trimmed = (newText || '').trim();
    if (!trimmed) return;

    if (context === 'community') {
      setCommunityMessages((prev) => {
        const list = prev[activeCommunityId] || [];
        const updated = list.map((m) =>
          m.id === msgId ? { ...m, text: trimmed, isEdited: true } : m
        );
        const nextAll = { ...prev, [activeCommunityId]: updated };
        try {
          localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    } else {
      setConversations((prev) => {
        const list = prev[selectedDoctorId] || [];
        const updated = list.map((m) =>
          m.id === msgId ? { ...m, text: trimmed, isEdited: true } : m
        );
        const nextAll = { ...prev, [selectedDoctorId]: updated };
        try {
          localStorage.setItem('zenve_chat_messages', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    }
    setEditingMessage(null);
  };

  // WhatsApp Rule: "Delete for everyone" is only permitted within 1 hour of sending
  const isMessageWithinOneHour = (msg) => {
    if (!msg) return false;
    // 1. Check explicit createdAt timestamp
    if (typeof msg.createdAt === 'number' && !isNaN(msg.createdAt) && msg.createdAt > 0) {
      const age = Date.now() - msg.createdAt;
      return age >= 0 && age <= 60 * 60 * 1000;
    }
    // 2. Check id if it contains a Date.now() timestamp (e.g., 'msg-1730000000000' or 'cmsg-1730000000000')
    if (typeof msg.id === 'string') {
      const match = msg.id.match(/\d{12,}/);
      if (match) {
        const ts = parseInt(match[0], 10);
        if (!isNaN(ts) && ts > 1600000000000) {
          const age = Date.now() - ts;
          return age >= 0 && age <= 60 * 60 * 1000;
        }
      }
    }
    // 3. Fallback: Parse time string if it contains HH:MM today
    if (typeof msg.time === 'string' && msg.time !== 'Yesterday') {
      const timeMatch = msg.time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
      if (timeMatch) {
        const now = new Date();
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const meridiem = timeMatch[3];
        if (meridiem) {
          if (meridiem.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
        const msgDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        let msgTs = msgDate.getTime();
        if (msgTs > now.getTime() && msgTs - now.getTime() < 120000) {
          msgTs = now.getTime();
        }
        const age = Date.now() - msgTs;
        return age >= 0 && age <= 60 * 60 * 1000;
      }
    }
    return false;
  };

  // Delete message for everyone (replaces content with WhatsApp deletion notice)
  const handleDeleteForEveryone = (context, msgId) => {
    if (context === 'community') {
      setCommunityMessages((prev) => {
        const list = prev[activeCommunityId] || [];
        const updated = list.map((m) =>
          m.id === msgId
            ? {
                ...m,
                isDeletedForEveryone: true,
                text: 'This message was deleted',
                attachment: null,
              }
            : m
        );
        const nextAll = { ...prev, [activeCommunityId]: updated };
        try {
          localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    } else {
      setConversations((prev) => {
        const list = prev[selectedDoctorId] || [];
        const updated = list.map((m) =>
          m.id === msgId
            ? {
                ...m,
                isDeletedForEveryone: true,
                text: 'This message was deleted',
                attachment: null,
              }
            : m
        );
        const nextAll = { ...prev, [selectedDoctorId]: updated };
        try {
          localStorage.setItem('zenve_chat_messages', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    }
    setDeleteTarget(null);
  };

  // Delete message for me only (removes from active view)
  const handleDeleteForMe = (context, msgId) => {
    if (context === 'community') {
      setCommunityMessages((prev) => {
        const list = prev[activeCommunityId] || [];
        const updated = list.filter((m) => m.id !== msgId);
        const nextAll = { ...prev, [activeCommunityId]: updated };
        try {
          localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    } else {
      setConversations((prev) => {
        const list = prev[selectedDoctorId] || [];
        const updated = list.filter((m) => m.id !== msgId);
        const nextAll = { ...prev, [selectedDoctorId]: updated };
        try {
          localStorage.setItem('zenve_chat_messages', JSON.stringify(nextAll));
        } catch {}
        return nextAll;
      });
    }
    setDeleteTarget(null);
  };

  // Sync selected doctor with prop if changed from outside
  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
  }, [initialDoctorId]);

  // Clear replying context whenever switching doctor, active community, or viewMode
  useEffect(() => {
    setReplyingTo(null);
  }, [selectedDoctorId, activeCommunityId, viewMode]);

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

  // Only open Community if user specifically clicks the Member Benefits CTA button
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // NEVER trigger if clicking anything inside the Messages page (chat messages, bubbles, inputs, etc.)
      if (e.target?.closest?.('.zenve-messages-container')) return;

      // Only check the dedicated Member Benefits "Join the Community" button
      const joinBtn = e.target?.closest?.('.zenve-benefits-join-btn');
      if (joinBtn) {
        setViewMode('community');
      }
    };
    const handleOpenCommunity = (e) => {
      setViewMode('community');
      if (e.detail?.communityId) {
        setActiveCommunityId(e.detail.communityId);
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('zenve_open_community', handleOpenCommunity);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('zenve_open_community', handleOpenCommunity);
    };
  }, []);

  // Fit messages page to viewport and prevent outer page scrolling
  useEffect(() => {
    document.body.classList.add('zenve-messages-mode');
    return () => {
      document.body.classList.remove('zenve-messages-mode');
    };
  }, []);

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

  // Combine directory doctors with any user-created custom vets
  const allAvailableDoctors = useMemo(() => {
    let custom = [];
    try {
      const stored = localStorage.getItem('zenve_custom_vets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) custom = parsed;
        else if (parsed && typeof parsed === 'object') custom = [parsed];
      }
    } catch {}
    if (custom.length === 0) {
      try {
        const stored2 = localStorage.getItem('zenve_custom_profiles');
        if (stored2) {
          const parsed2 = JSON.parse(stored2);
          if (Array.isArray(parsed2)) custom = parsed2;
          else if (parsed2 && typeof parsed2 === 'object') custom = [parsed2];
        }
      } catch {}
    }

    const existingIds = new Set(ALL_DIRECTORY_DOCTORS.map((d) => d.id));
    const formattedCustom = custom
      .filter((v) => v && (v.id || v.name || v.fullName))
      .map((v, idx) => ({
        id: v.id || `custom-vet-${idx}`,
        name: v.name || v.fullName || 'Dr. Custom',
        specialty: v.specialty || 'General Veterinary Practice',
        location: v.location || v.city || 'India',
        img: v.img || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
        isFollower: true,
        defaultFollowing: false,
        clinic: v.clinic || v.workingPlace || 'Veterinary Hospital',
        online: true,
        lastSeen: 'Active now',
      }))
      .filter((v) => !existingIds.has(v.id));

    return [...ALL_DIRECTORY_DOCTORS, ...formattedCustom];
  }, [hasProfile]);

  // Find selected doctor object
  const selectedDoctor = useMemo(() => {
    return allAvailableDoctors.find((d) => d.id === selectedDoctorId) || allAvailableDoctors[0];
  }, [selectedDoctorId, allAvailableDoctors]);

  // Whether user follows the currently selected doctor
  const isFollowingSelected = !!followingMap[selectedDoctor.id];

  // Current chat messages for active doctor
  const activeChatMessages = conversations[selectedDoctor.id] || [];

  // Filtered contacts based on search and active tab
  const { followerContacts, otherDirectoryContacts } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = allAvailableDoctors.filter((doc) => {
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
  }, [searchQuery, activeFilterTab, followingMap, conversations, allAvailableDoctors]);

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
      chatInputRef.current.focus({ preventScroll: true });
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Send message action with contextual reply logic
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || messageInput).trim();
    if (!text && !directAttachment) return;
    if (!selectedDoctor) return;

    // Check constraint: "following persons only send msg and reply msg"
    if (!isFollowingSelected) {
      alert(`You must follow ${selectedDoctor.name} to send messages and receive replies.`);
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentQuoted = replyingTo;
    const currentAttachment = directAttachment ? { ...directAttachment } : null;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: text || (currentAttachment ? `[${currentAttachment.name}]` : ''),
      time: timeString,
      createdAt: Date.now(),
      attachment: currentAttachment,
      replyTo: currentQuoted
        ? {
            id: currentQuoted.id,
            senderName: currentQuoted.senderName,
            text: currentQuoted.text,
          }
        : null,
    };

    setReplyingTo(null);
    setDirectAttachment(null);
    setShowEmojiPicker(null);

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
        } catch { }
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

  // --- COMMUNITY CALCULATIONS & HANDLERS ---
  // All platform users (all registered doctors)
  const allPlatformUsers = useMemo(() => ALL_DIRECTORY_DOCTORS, []);

  // Follower doctors only (doctors who follow the user / default followed)
  const followerDoctors = useMemo(() => {
    return ALL_DIRECTORY_DOCTORS.filter((d) => d.isFollower || !!followingMap[d.id]);
  }, [followingMap]);

  // Currently active community
  const activeCommunity = useMemo(() => {
    return (
      communities.find((c) => c.id === activeCommunityId) ||
      communities[0] ||
      DEFAULT_COMMUNITIES[0]
    );
  }, [communities, activeCommunityId]);

  // Check if current user is the Group Admin of the active community
  const isCurrentUserAdmin = useMemo(() => {
    if (!activeCommunity) return false;
    return Boolean(
      activeCommunity.adminId === 'me' ||
      activeCommunity.createdBy?.includes('You') ||
      activeCommunity.id === 'comm-private-followers'
    );
  }, [activeCommunity]);

  // Privacy Rule: Public = All Users, Private = Followers + Invited. Filter out removed members.
  const currentCommunityMembers = useMemo(() => {
    if (!activeCommunity) return allPlatformUsers;
    const removedSet = new Set(activeCommunity.removedMemberIds || []);
    const invitedSet = new Set(activeCommunity.invitedMemberIds || []);

    let baseList = [];
    if (activeCommunity.type === 'public') {
      baseList = allPlatformUsers;
    } else {
      // Private community: followers + any doctors invited by the group admin
      baseList = allPlatformUsers.filter(
        (d) => followerDoctors.some((f) => f.id === d.id) || invitedSet.has(d.id)
      );
    }

    // Filter out any members removed by group admin
    return baseList.filter((d) => !removedSet.has(d.id));
  }, [activeCommunity, allPlatformUsers, followerDoctors]);

  // Platform doctors available for the Admin to invite
  const doctorsAvailableToInvite = useMemo(() => {
    const currentMemberIds = new Set(currentCommunityMembers.map((d) => d.id));
    const q = inviteSearchQuery.trim().toLowerCase();
    return allPlatformUsers.filter((doc) => {
      if (currentMemberIds.has(doc.id)) return false;
      if (!q) return true;
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.clinic.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q)
      );
    });
  }, [allPlatformUsers, currentCommunityMembers, inviteSearchQuery]);

  // Filtered community members for the members view tab
  const filteredCommunityMembers = useMemo(() => {
    if (!memberSearchQuery.trim()) return currentCommunityMembers;
    const q = memberSearchQuery.toLowerCase();
    return currentCommunityMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.specialty && m.specialty.toLowerCase().includes(q)) ||
        (m.clinic && m.clinic.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q))
    );
  }, [currentCommunityMembers, memberSearchQuery]);

  // Filtered communities list based on selected filter tab and search query
  const filteredCommunities = useMemo(() => {
    const q = communitySearchQuery.trim().toLowerCase();
    return communities.filter((c) => {
      if (communityFilterTab === 'public' && c.type !== 'public') return false;
      if (communityFilterTab === 'private' && c.type !== 'private') return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    });
  }, [communities, communityFilterTab, communitySearchQuery]);

  const activeCommunityMessages = communityMessages[activeCommunity?.id] || [];

  // Auto scroll community messages
  useEffect(() => {
    if (communityEndRef.current) {
      communityEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [communityMessages, activeCommunityId, viewMode]);

  // Helper to post official system announcements into community
  const postSystemCommunityMessage = (commId, text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const announcement = {
      id: `sys-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      senderId: 'system',
      senderName: 'Group Admin Protocol',
      senderSpecialty: 'Community Notice',
      senderImg: '',
      isSystem: true,
      text,
      time: timeStr,
      isMe: false,
    };

    setCommunityMessages((prev) => {
      const channelMsgs = [...(prev[commId] || []), announcement];
      const nextAll = { ...prev, [commId]: channelMsgs };
      try {
        localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
      } catch {}
      return nextAll;
    });
  };

  // GROUP ADMIN: Open Admin Settings tab in Executive Popup Modal
  const handleOpenAdminSettings = () => {
    if (!isCurrentUserAdmin) {
      alert('Only the Group Admin has access to manage this community.');
      return;
    }
    setEditCommName(activeCommunity?.name || '');
    setEditCommCategory(activeCommunity?.category || 'General Surgery & Medicine');
    setEditCommDesc(activeCommunity?.description || '');
    setEditCommType(activeCommunity?.type || 'public');
    setManageModalActiveTab('details');
    setMemberSearchQuery('');
    setInviteSearchQuery('');
    setIsManageCommunityModalOpen(true);
  };

  // VIEW MEMBERS: Open Members Tab in Executive Popup Modal
  const handleOpenViewMembers = () => {
    if (!activeCommunity) return;
    setEditCommName(activeCommunity?.name || '');
    setEditCommCategory(activeCommunity?.category || 'General Surgery & Medicine');
    setEditCommDesc(activeCommunity?.description || '');
    setEditCommType(activeCommunity?.type || 'public');
    setManageModalActiveTab('members');
    setMemberSearchQuery('');
    setInviteSearchQuery('');
    setIsManageCommunityModalOpen(true);
  };

  // Close the unified management & members modal
  const handleCloseManageCommunityModal = () => {
    setIsManageCommunityModalOpen(false);
    setMemberSearchQuery('');
    setInviteSearchQuery('');
  };

  // Copy community invitation link to clipboard with unique group invite code
  const handleCopyCommunityLink = () => {
    if (!activeCommunity) return;
    const code =
      activeCommunity.inviteCode ||
      (activeCommunity.id === 'comm-public-clinical' ? 'ZN-IND-9021' : 'ZN-PVT-4481');
    const url = `${window.location.origin}/join/${code}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedCommLink(true);
          setTimeout(() => setCopiedCommLink(false), 2200);
        })
        .catch(() => {
          setCopiedCommLink(true);
          setTimeout(() => setCopiedCommLink(false), 2200);
        });
    } else {
      setCopiedCommLink(true);
      setTimeout(() => setCopiedCommLink(false), 2200);
    }
  };

  // Copy just the unique group code to clipboard
  const handleCopyInviteCodeOnly = () => {
    if (!activeCommunity) return;
    const code =
      activeCommunity.inviteCode ||
      (activeCommunity.id === 'comm-public-clinical' ? 'ZN-IND-9021' : 'ZN-PVT-4481');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          setCopiedCodeOnly(true);
          setTimeout(() => setCopiedCodeOnly(false), 2200);
        })
        .catch(() => {
          setCopiedCodeOnly(true);
          setTimeout(() => setCopiedCodeOnly(false), 2200);
        });
    } else {
      setCopiedCodeOnly(true);
      setTimeout(() => setCopiedCodeOnly(false), 2200);
    }
  };

  // Insert structured clinical case consultation template into input composer
  const handleInsertClinicalPrompt = (template) => {
    setCommunityInput((prev) => {
      if (!prev.trim()) return template;
      return `${prev} ${template}`;
    });
  };

  // GROUP ADMIN: Save updated name, category, description, and privacy
  const handleSaveAdminSettings = (e) => {
    if (e) e.preventDefault();
    if (!isCurrentUserAdmin) {
      alert('Only the Group Admin has permission to modify this community.');
      return;
    }
    const name = editCommName.trim();
    if (!name) return;

    const oldName = activeCommunity.name;
    const oldType = activeCommunity.type;
    const nextType = editCommType;
    const typeChanged = nextType !== oldType;
    const nameChanged = name !== oldName;

    const updatedCommunities = communities.map((c) => {
      if (c.id === activeCommunity.id) {
        return {
          ...c,
          name,
          category: editCommCategory,
          description: editCommDesc,
          type: nextType,
          avatar: nextType === 'public' ? '🌐' : '🔒',
        };
      }
      return c;
    });

    setCommunities(updatedCommunities);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(updatedCommunities));
    } catch {}

    if (nameChanged) {
      postSystemCommunityMessage(
        activeCommunity.id,
        `✏️ Group Admin renamed this community from "${oldName}" to "${name}".`
      );
    }
    if (typeChanged) {
      postSystemCommunityMessage(
        activeCommunity.id,
        nextType === 'public'
          ? '📢 Group Admin changed privacy to PUBLIC: All platform doctors across India can now view and participate.'
          : '🔒 Group Admin changed privacy to PRIVATE: Restricted exclusively to followers and invited doctors.'
      );
    }

    setIsManageCommunityModalOpen(false);
  };

  // GROUP ADMIN: Toggle community privacy between public and private
  const handleToggleCommunityPrivacy = (commId) => {
    const targetComm = communities.find((c) => c.id === commId);
    if (!targetComm) return;

    const isTargetAdmin =
      targetComm.adminId === 'me' ||
      targetComm.createdBy?.includes('You') ||
      targetComm.id === 'comm-private-followers';
    if (!isTargetAdmin) {
      alert('Only the Group Admin has permission to change community privacy.');
      return;
    }

    const nextType = targetComm.type === 'public' ? 'private' : 'public';
    const updated = communities.map((c) =>
      c.id === commId
        ? {
            ...c,
            type: nextType,
            avatar: nextType === 'public' ? '🌐' : '🔒',
          }
        : c
    );
    setCommunities(updated);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(updated));
    } catch {}

    postSystemCommunityMessage(
      commId,
      nextType === 'public'
        ? '📢 Group Admin changed privacy to PUBLIC: All platform doctors across India can now participate.'
        : '🔒 Group Admin changed privacy to PRIVATE: Restricted exclusively to followers and invited members.'
    );
  };

  // GROUP ADMIN: Delete community entirely
  const handleDeleteCommunity = (commId) => {
    if (!isCurrentUserAdmin) {
      alert('Only the Group Admin has permission to delete this community.');
      return;
    }
    if (communities.length <= 1) {
      alert('You must have at least one active community.');
      return;
    }
    const targetName = activeCommunity.name;
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${targetName}"?\nAll community messages and settings will be removed.`
    );
    if (!confirmDelete) return;

    const remaining = communities.filter((c) => c.id !== commId);
    setCommunities(remaining);
    const nextId = remaining[0]?.id || 'comm-public-clinical';
    setActiveCommunityId(nextId);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(remaining));
      localStorage.setItem('zenve_active_community_id', nextId);
    } catch {}

    setIsManageCommunityModalOpen(false);
    setShowMembersDrawer(false);
  };

  // GROUP ADMIN: Remove doctor from community
  const handleRemoveMember = (doctorId) => {
    if (!isCurrentUserAdmin) {
      alert('Only the Group Admin has permission to remove members.');
      return;
    }
    const doc = allPlatformUsers.find((d) => d.id === doctorId);
    const docName = doc ? doc.name : 'this doctor';
    const confirmRemove = window.confirm(`Remove ${docName} from "${activeCommunity.name}"?`);
    if (!confirmRemove) return;

    const updated = communities.map((c) => {
      if (c.id === activeCommunity.id) {
        const removed = Array.isArray(c.removedMemberIds) ? [...c.removedMemberIds] : [];
        if (!removed.includes(doctorId)) removed.push(doctorId);
        const invited = (c.invitedMemberIds || []).filter((id) => id !== doctorId);
        return {
          ...c,
          removedMemberIds: removed,
          invitedMemberIds: invited,
        };
      }
      return c;
    });

    setCommunities(updated);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(updated));
    } catch {}

    postSystemCommunityMessage(
      activeCommunity.id,
      `🚫 ${docName} was removed from this community by the Group Admin.`
    );
  };

  // GROUP ADMIN: Invite doctor into community
  const handleInviteDoctor = (doctorId) => {
    if (!isCurrentUserAdmin) {
      alert('Only the Group Admin has permission to invite doctors.');
      return;
    }
    const doc = allPlatformUsers.find((d) => d.id === doctorId);
    const docName = doc ? doc.name : 'Doctor';

    const updated = communities.map((c) => {
      if (c.id === activeCommunity.id) {
        const invited = Array.isArray(c.invitedMemberIds) ? [...c.invitedMemberIds] : [];
        if (!invited.includes(doctorId)) invited.push(doctorId);
        const removed = (c.removedMemberIds || []).filter((id) => id !== doctorId);
        return {
          ...c,
          invitedMemberIds: invited,
          removedMemberIds: removed,
        };
      }
      return c;
    });

    setCommunities(updated);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(updated));
    } catch {}

    postSystemCommunityMessage(
      activeCommunity.id,
      `🤝 ${docName} was invited and joined this community by the Group Admin.`
    );
  };

  // Create a new community (User is automatically the Group Admin)
  const handleCreateNewCommunity = (e) => {
    if (e) e.preventDefault();
    const name = newCommName.trim();
    if (!name) return;

    const newId = `comm-${Date.now()}`;
    const catCode = (newCommCategory || 'CLIN').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
    const uniqueInviteCode = `ZN-${catCode || 'CLIN'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCommunity = {
      id: newId,
      inviteCode: uniqueInviteCode,
      name,
      type: newCommType, // 'public' | 'private'
      category: newCommCategory || 'Clinical Practice',
      description:
        newCommDesc.trim() ||
        (newCommType === 'public'
          ? `Pan-India public case sharing and open veterinary forum for ${newCommCategory || 'Clinical Practice'}.`
          : `Private professional exchange reserved exclusively for verified followers focusing on ${newCommCategory || 'Clinical Practice'}.`),
      avatar: newCommType === 'public' ? '🌐' : '🔒',
      bannerColor: newCommType === 'public' ? '#1D3B2F' : '#3D0D18',
      adminId: 'me',
      createdBy: 'You (Dr. Practitioner)',
      createdAt: 'Just now',
      invitedMemberIds: [],
      removedMemberIds: [],
      guidelines: [
        {
          id: 1,
          title: `${newCommCategory || 'Clinical'} Consultation Standards`,
          desc: `Submit comprehensive signalment, medical history, and clinical lab values for all ${name} patient cases.`,
        },
        {
          id: 2,
          title: newCommType === 'public' ? 'Public Anonymization Policy' : 'Follower Confidentiality Agreement',
          desc:
            newCommType === 'public'
              ? 'Ensure pet guardian names, contact details, and microchip numbers are masked before submitting media.'
              : 'All case differentials, treatment outcomes, and surgical debriefs shared in this circle must remain confidential to members.',
        },
        {
          id: 3,
          title: 'Evidence-Based Veterinary Care',
          desc: 'Cite peer-reviewed references, standard dosages, and established surgical techniques when offering recommendations.',
        },
      ],
    };

    const updatedCommunities = [newCommunity, ...communities];
    setCommunities(updatedCommunities);
    setActiveCommunityId(newId);
    try {
      localStorage.setItem('zenve_communities_list', JSON.stringify(updatedCommunities));
      localStorage.setItem('zenve_active_community_id', newId);
    } catch {}

    // Initial system welcome message in the new community
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const welcomeMsg = {
      id: `welcome-${Date.now()}`,
      senderId: 'system',
      senderName: 'Zenve Community Bot',
      senderSpecialty: 'Automated Welcome',
      senderImg: '',
      isSystem: true,
      text:
        newCommType === 'public'
          ? `🎉 Welcome to "${name}"! This is a PUBLIC community open to all platform veterinarians across India.`
          : `🔐 Welcome to "${name}"! This is a PRIVATE community restricted strictly to your followers and invited doctors.`,
      time: timeStr,
      isMe: false,
    };

    setCommunityMessages((prev) => {
      const nextAll = { ...prev, [newId]: [welcomeMsg] };
      try {
        localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
      } catch {}
      return nextAll;
    });

    // Reset form & focus new community
    setNewCommName('');
    setNewCommDesc('');
    setNewCommType('public');
    setIsCreateCommunityModalOpen(false);
    setViewMode('community');
  };

  // Send message in active community
  const handleSendCommunityMessage = (textToSend) => {
    const text = (textToSend || communityInput).trim();
    if (!text && !commAttachment) return;
    if (!activeCommunity) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentAttachment = commAttachment ? { ...commAttachment } : null;

    const currentQuoted = replyingTo && replyingTo.context === 'community' ? replyingTo : null;

    const newMsg = {
      id: `cmsg-${Date.now()}`,
      senderId: 'me',
      senderName: 'You (Dr. Practitioner)',
      senderSpecialty: 'Veterinary Surgeon',
      senderImg: '',
      text: text || (currentAttachment ? `[${currentAttachment.name}]` : ''),
      time: timeStr,
      createdAt: Date.now(),
      isMe: true,
      attachment: currentAttachment,
      replyTo: currentQuoted
        ? {
            id: currentQuoted.id,
            senderName: currentQuoted.senderName,
            text: currentQuoted.text,
          }
        : null,
    };

    setReplyingTo(null);
    setCommAttachment(null);
    setShowEmojiPicker(null);

    setCommunityMessages((prev) => {
      const channelMsgs = [...(prev[activeCommunity.id] || []), newMsg];
      const nextAll = { ...prev, [activeCommunity.id]: channelMsgs };
      try {
        localStorage.setItem('zenve_community_chat_history', JSON.stringify(nextAll));
      } catch {}
      return nextAll;
    });

    setCommunityInput('');
  };

  if (!hasProfile) {
    return (
      <div className="zenve-gate-screen-wrapper">
        <div className="zenve-messages-profile-gate">
          {/* Subtle Ambient Background Elements */}
          <div className="zenve-gate-ambient-glow" aria-hidden="true" />
          <div className="zenve-gate-mesh-grid" aria-hidden="true" />

          <div className="zenve-gate-card">
            {/* Visual Icon Badge with Doctor Orbit Connections */}
            <div className="zenve-gate-hero-visual">
              <div className="zenve-gate-orbit-ring" />
              <div className="zenve-gate-pulse-ring" />

              {/* Central Glowing Icon Badge */}
              <div className="zenve-gate-icon-badge">
                <MessagesIcon size={34} color="#ffffff" />
                <span className="zenve-gate-icon-sparkle">
                  <Sparkles size={16} color="#fbbf24" />
                </span>
              </div>

              {/* Floating Doctor Avatars */}
              <div className="zenve-gate-floating-avatar pos-1" title="Dr. Aarthi (Orthopedic Surgeon)">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Dr. Aarthi"
                />
                <span className="zenve-gate-mini-dot" />
              </div>
              <div className="zenve-gate-floating-avatar pos-2" title="Dr. Arun Mehta (Surgeon)">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Dr. Arun Mehta"
                />
                <span className="zenve-gate-mini-dot" />
              </div>
              <div className="zenve-gate-floating-avatar pos-3" title="Dr. Priya Nair (Dermatologist)">
                <img
                  src="https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Dr. Priya Nair"
                />
                <span className="zenve-gate-mini-dot" />
              </div>
            </div>

            {/* Eyebrow Pill */}
            <div className="zenve-gate-tag-pill">
              <Lock size={12} />
              <span>CONFIDENTIAL CLINICAL NETWORK</span>
            </div>

            {/* Headline matching user prompt */}
            <h2 className="zenve-gate-title">
              Message your peers privately.
            </h2>

            {/* Subtitle matching user prompt */}
            <p className="zenve-gate-subtitle">
              Create your free page, connect with doctors, then chat.
            </p>

            <p className="zenve-gate-desc">
              Direct, encrypted consultations between verified veterinarians across India. Share case radiograms, discuss differential diagnoses, and connect securely with colleagues.
            </p>

            {/* Feature Highlights Grid */}
            <div className="zenve-gate-features-row">
              <div className="zenve-gate-feature-pill">
                <ShieldCheck size={16} color="#16a34a" />
                <span>Verified Doctors Only</span>
              </div>
              <div className="zenve-gate-feature-pill">
                <Lock size={16} color="#3D0D18" />
                <span>Private 1-on-1 Consults</span>
              </div>
              <div className="zenve-gate-feature-pill">
                <Sparkles size={16} color="#d97706" />
                <span>Instant Clinical Differentials</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="zenve-gate-cta-wrapper">
              <button
                type="button"
                className="zenve-gate-create-btn"
                onClick={() => setIsCreateProfileModalOpen(true)}
              >
                <Sparkles size={16} />
                <span>Create your profile</span>
                <ArrowUpRight size={17} />
              </button>
              <span className="zenve-gate-cta-subtext">
                Free for all veterinary practitioners • Setup takes under 60 seconds
              </span>
            </div>
          </div>
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal
          isOpen={isCreateProfileModalOpen}
          onClose={() => setIsCreateProfileModalOpen(false)}
          onProfileCreated={handleProfileCreated}
        />
      </div>
    );
  }

  return (
    <div className="zenve-messages-container">
      {/* ── Left Rail: Sidebar (Mode Switch + Chats OR Communities) ───── */}
      <aside className="zenve-messages-sidebar" aria-label="Messages contacts and communities">
        {/* Top Segmented Mode Switcher (Direct Chats first) */}
        <div className="zenve-messages-mode-switch" role="tablist">
          <button
            type="button"
            className={`zenve-mode-switch-btn ${viewMode === 'chats' ? 'active' : ''}`}
            onClick={() => setViewMode('chats')}
            role="tab"
            aria-selected={viewMode === 'chats'}
          >
            <MessagesIcon size={14} />
            <span>Direct Chats</span>
          </button>
          <button
            type="button"
            className={`zenve-mode-switch-btn ${viewMode === 'community' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('community');
              if (activeCommunityId) {
                setUnseenCommunityCounts((prev) => {
                  const next = { ...prev, [activeCommunityId]: 0 };
                  try {
                    localStorage.setItem('zenve_unseen_comm_counts', JSON.stringify(next));
                  } catch {}
                  return next;
                });
              }
            }}
            role="tab"
            aria-selected={viewMode === 'community'}
          >
            <span className="zenve-mode-btn-icon">
              <Users size={14} />
            </span>
            <span>Communities</span>
            {totalUnseenCommunityCount > 0 && (
              <span className="zenve-mode-badge zenve-unseen-badge">{totalUnseenCommunityCount}</span>
            )}
          </button>
        </div>

        {viewMode === 'community' ? (
          /* COMMUNITY SIDEBAR */
          <>
            <div className="zenve-messages-sidebar-header zenve-comm-sidebar-header">
              <div className="zenve-messages-title-row">
                <div>
                  <h2 className="zenve-messages-title">
                    <span>Clinical Communities</span>
                  </h2>
                  <p className="zenve-comm-sidebar-sub">All-India Forums & Private Follower Circles</p>
                </div>
                <button
                  type="button"
                  className="zenve-create-comm-cta-btn"
                  onClick={() => setIsCreateCommunityModalOpen(true)}
                  title="Create new community group"
                >
                  <span>+ Create</span>
                </button>
              </div>

              {/* Community Search Box */}
              <div className="zenve-messages-search-box zenve-comm-search-box">
                <SearchIcon size={14} color="#84938b" />
                <input
                  type="text"
                  className="zenve-messages-search-input"
                  placeholder="Search clinical communities..."
                  value={communitySearchQuery}
                  onChange={(e) => setCommunitySearchQuery(e.target.value)}
                  aria-label="Search clinical communities"
                />
                {communitySearchQuery && (
                  <button
                    type="button"
                    className="zenve-messages-search-clear"
                    onClick={() => setCommunitySearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Community Privacy Filter Tabs */}
              <div className="zenve-messages-filter-tabs zenve-comm-filter-tabs">
                <button
                  type="button"
                  className={`zenve-messages-tab-btn ${communityFilterTab === 'all' ? 'active' : ''}`}
                  onClick={() => setCommunityFilterTab('all')}
                >
                  All ({communities.length})
                </button>
                <button
                  type="button"
                  className={`zenve-messages-tab-btn ${communityFilterTab === 'public' ? 'active' : ''}`}
                  onClick={() => setCommunityFilterTab('public')}
                >
                  🌐 Public ({communities.filter((c) => c.type === 'public').length})
                </button>
                <button
                  type="button"
                  className={`zenve-messages-tab-btn ${communityFilterTab === 'private' ? 'active' : ''}`}
                  onClick={() => setCommunityFilterTab('private')}
                >
                  🔒 Private ({communities.filter((c) => c.type === 'private').length})
                </button>
              </div>
            </div>

            {/* Communities List */}
            <div className="zenve-messages-list zenve-comm-list">
              {filteredCommunities.map((comm) => {
                const isSelected = comm.id === activeCommunityId;
                const isPub = comm.type === 'public';
                const count = isPub ? allPlatformUsers.length : followerDoctors.length;
                const msgs = communityMessages[comm.id] || [];
                const lastMsg = msgs[msgs.length - 1];
                const unseenCount = unseenCommunityCounts[comm.id] || 0;

                return (
                  <div
                    key={comm.id}
                    className={`zenve-contact-item zenve-community-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCommunityId(comm.id);
                      setUnseenCommunityCounts((prev) => {
                        const next = { ...prev, [comm.id]: 0 };
                        try {
                          localStorage.setItem('zenve_unseen_comm_counts', JSON.stringify(next));
                          localStorage.setItem('zenve_active_community_id', comm.id);
                        } catch {}
                        return next;
                      });
                      setShowMembersDrawer(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className="zenve-comm-icon-box"
                      style={{ background: comm.bannerColor || '#1D3B2F' }}
                    >
                      <span>{comm.avatar || (isPub ? '🌐' : '🔒')}</span>
                    </div>

                    <div className="zenve-contact-info">
                      <div className="zenve-contact-top-row">
                        <span className="zenve-contact-name" title={comm.name}>
                          {comm.name}
                        </span>
                        <span className="zenve-contact-time">
                          {lastMsg ? lastMsg.time : '12:42'}
                        </span>
                      </div>
                      <div className="zenve-contact-bottom-row">
                        <p className="zenve-contact-preview">
                          {lastMsg ? (
                            <>
                              {lastMsg.isMe && <span className="zenve-wa-preview-checks">✓✓ </span>}
                              {lastMsg.senderName && !lastMsg.isMe ? `${lastMsg.senderName.split(' ')[0]}: ` : ''}
                              {lastMsg.text}
                            </>
                          ) : (
                            comm.description
                          )}
                        </p>
                        <div className="zenve-comm-badges-stack">
                          {unseenCount > 0 && (
                            <span className="zenve-comm-item-unread-badge" title={`${unseenCount} unread messages`}>
                              {unseenCount}
                            </span>
                          )}
                          <span
                            className={`zenve-comm-type-pill ${
                              isPub ? 'zenve-status-public' : 'zenve-status-private'
                            }`}
                          >
                            {isPub ? '🌐 Public' : '🔒 Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredCommunities.length === 0 && (
                <div className="zenve-contacts-empty">
                  No {communityFilterTab} communities found.
                </div>
              )}
            </div>
          </>
        ) : (
          /* DIRECT CHATS SIDEBAR */
          <>
            <div className="zenve-messages-sidebar-header">
              <div className="zenve-messages-title-row">
                <h2 className="zenve-messages-title">
                  <MessagesIcon size={20} color="#3D0D18" />
                  <span>Direct Chats</span>
                </h2>
                <span className="zenve-messages-count-badge">
                  {Object.keys(followingMap).filter((k) => followingMap[k]).length} Following
                </span>
              </div>

              {/* Search Box */}
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
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setReplyingTo(null);
                        }}
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
                              {lastMsg ? (
                                <>
                                  {lastMsg.sender === 'me' && <span className="zenve-wa-preview-checks">✓✓ </span>}
                                  {lastMsg.text}
                                </>
                              ) : (
                                doc.specialty
                              )}
                            </p>
                            <span
                              className={`zenve-contact-status-chip ${
                                isFollowing
                                  ? 'zenve-status-following'
                                  : doc.isFollower
                                  ? 'zenve-status-follower'
                                  : 'zenve-status-connect'
                              }`}
                            >
                              {isFollowing ? 'Following' : doc.isFollower ? 'Follower' : '+ Follow'}
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
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setReplyingTo(null);
                        }}
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
                            <span
                              className={`zenve-contact-status-chip ${
                                isFollowing ? 'zenve-status-following' : 'zenve-status-connect'
                              }`}
                            >
                              {isFollowing ? 'Following' : '+ Follow'}
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
          </>
        )}
      </aside>

      {/* ── Right: Conversation Pane ─────────────────────────────────── */}
      <main className="zenve-messages-chat-pane" aria-label="Conversation view">
        {viewMode === 'community' ? (
          /* COMMUNITY MAIN CHAT PANE */
          activeCommunity ? (
            <>
              {/* Community Chat Header */}
              <div className="zenve-chat-header zenve-comm-chat-header">
                <div className="zenve-chat-header-user">
                  <div
                    className="zenve-comm-header-avatar"
                    style={{ background: activeCommunity.bannerColor || '#1D3B2F', cursor: 'pointer' }}
                    onClick={() => setShowCommProfileDrawer((prev) => !prev)}
                    title="Click to view community profile & guidelines"
                  >
                    {activeCommunity.avatar || (activeCommunity.type === 'public' ? '🌐' : '🔒')}
                  </div>
                  <div className="zenve-comm-header-title-box">
                    <div className="zenve-comm-header-title-row">
                      <h3
                        className="zenve-chat-header-name"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowCommProfileDrawer((prev) => !prev)}
                        title={activeCommunity.name}
                      >
                        {activeCommunity.name}
                      </h3>
                    </div>
                    <p className="zenve-chat-header-sub">
                      <span
                        className={`zenve-comm-mini-type-badge ${
                          activeCommunity.type === 'public'
                            ? 'zenve-status-public'
                            : 'zenve-status-private'
                        }`}
                      >
                        {activeCommunity.type === 'public' ? '🌐 Public' : '🔒 Private'}
                      </span>
                      {isCurrentUserAdmin ? (
                        <span
                          className="zenve-comm-mini-admin-badge"
                          title="You are the Group Admin with full management permissions"
                        >
                          👑 Admin
                        </span>
                      ) : (
                        <span className="zenve-comm-created-by-pill">
                          Admin: {activeCommunity.createdBy || 'Zenve Council'}
                        </span>
                      )}
                      <span>•</span>
                      <span>{activeCommunity.category}</span>
                      <span>•</span>
                      <span>
                        {currentCommunityMembers.length}{' '}
                        {activeCommunity.type === 'public'
                          ? 'Platform Doctors'
                          : 'Followers & Members'}
                      </span>
                      <span>•</span>
                      <span className="zenve-comm-header-code" title="Unique Community Code">
                        Code: {activeCommunity.inviteCode || 'ZN-IND-9021'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Strict Single Horizontal Line Toolbar */}
                <div className="zenve-chat-header-actions">
                  {/* Button 1: Members (count) */}
                  <button
                    type="button"
                    className="zenve-comm-action-btn zenve-view-members-btn"
                    onClick={handleOpenViewMembers}
                    title="View community members in executive popup"
                  >
                    <Users size={14} className="zenve-btn-icon" />
                    <span>Members ({currentCommunityMembers.length})</span>
                  </button>

                  {/* ONLY GROUP ADMIN HAS ACCESS TO MANAGE SETTINGS OR TOGGLE PRIVACY */}
                  {isCurrentUserAdmin ? (
                    <>
                      {/* Button 2: Toggle Privacy */}
                      <button
                        type="button"
                        className="zenve-comm-action-btn zenve-toggle-privacy-btn"
                        onClick={() => handleToggleCommunityPrivacy(activeCommunity.id)}
                        title={`Switch privacy to ${
                          activeCommunity.type === 'public'
                            ? 'Private (Followers Only)'
                            : 'Public (All Users)'
                        }`}
                      >
                        {activeCommunity.type === 'public' ? (
                          <>
                            <Lock size={14} className="zenve-btn-icon" />
                            <span>Make Private</span>
                          </>
                        ) : (
                          <>
                            <Globe size={14} className="zenve-btn-icon" />
                            <span>Make Public</span>
                          </>
                        )}
                      </button>

                      {/* Button 3: Manage Group */}
                      <button
                        type="button"
                        className="zenve-comm-action-btn zenve-admin-settings-btn"
                        onClick={handleOpenAdminSettings}
                        title="Group Admin settings (Edit Name, Category, Privacy, Delete)"
                      >
                        <Settings size={14} className="zenve-btn-icon" />
                        <span>Manage Group</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className="zenve-admin-only-tag"
                      title="Only the Group Admin has access to manage this group"
                    >
                      <Lock size={12} className="zenve-btn-icon" />
                      <span>Admin Controlled</span>
                    </span>
                  )}

                  {/* Button 4: Share Community Link */}
                  <button
                    type="button"
                    className={`zenve-comm-action-btn zenve-share-comm-btn ${copiedCommLink ? 'copied' : ''}`}
                    onClick={handleCopyCommunityLink}
                    title="Copy unique community invitation link"
                  >
                    {copiedCommLink ? (
                      <>
                        <Check size={14} className="zenve-btn-icon" color="#16a34a" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} className="zenve-btn-icon" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {/* Button 5: Community Profile & Guidelines */}
                  <button
                    type="button"
                    className={`zenve-comm-action-btn zenve-info-comm-btn ${showCommProfileDrawer ? 'active' : ''}`}
                    onClick={() => setShowCommProfileDrawer((prev) => !prev)}
                    title="Community Profile & Clinical Guidelines"
                  >
                    <Info size={14} className="zenve-btn-icon" />
                    <span>About</span>
                  </button>
                </div>
              </div>

              {/* Community Profile & Clinical Guidelines Slide-down Drawer */}
              {showCommProfileDrawer && (
                <div className="zenve-comm-profile-drawer">
                  <div className="zenve-comm-drawer-header">
                    <div className="zenve-comm-drawer-identity">
                      <div
                        className="zenve-comm-drawer-avatar"
                        style={{ background: activeCommunity.bannerColor || '#1D3B2F' }}
                      >
                        {activeCommunity.avatar || (activeCommunity.type === 'public' ? '🌐' : '🔒')}
                      </div>
                      <div>
                        <h4 className="zenve-comm-drawer-title">{activeCommunity.name}</h4>
                        <div className="zenve-comm-drawer-meta">
                          <span className="zenve-comm-drawer-cat">{activeCommunity.category}</span>
                          <span>•</span>
                          <span className={`zenve-comm-drawer-type ${activeCommunity.type}`}>
                            {activeCommunity.type === 'public' ? '🌐 Public Forum' : '🔒 Private Circle'}
                          </span>
                          <span>•</span>
                          <span>{currentCommunityMembers.length} Doctors</span>
                          <span>•</span>
                          <span className="zenve-comm-code-chip">
                            Code: {activeCommunity.inviteCode || 'ZN-IND-9021'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="zenve-comm-drawer-close"
                      onClick={() => setShowCommProfileDrawer(false)}
                      title="Close drawer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Unique Group Invite Code Banner with Instant Copy */}
                  <div className="zenve-comm-code-banner">
                    <div className="zenve-code-banner-left">
                      <span className="zenve-code-banner-label">Unique Community Invite Code:</span>
                      <strong className="zenve-code-banner-val">{activeCommunity.inviteCode || 'ZN-IND-9021'}</strong>
                    </div>
                    <div className="zenve-code-banner-actions">
                      <button
                        type="button"
                        className="zenve-code-copy-btn"
                        onClick={handleCopyInviteCodeOnly}
                        title="Copy unique code only"
                      >
                        {copiedCodeOnly ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{copiedCodeOnly ? 'Code Copied!' : 'Copy Code'}</span>
                      </button>
                      <button
                        type="button"
                        className="zenve-code-copy-btn primary"
                        onClick={handleCopyCommunityLink}
                        title="Copy complete invite link"
                      >
                        {copiedCommLink ? <Check size={13} color="#ffffff" /> : <Share2 size={13} />}
                        <span>{copiedCommLink ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="zenve-comm-drawer-grid">
                    {/* Unique Mission / Clinical Scope */}
                    <div className="zenve-comm-drawer-card">
                      <div className="zenve-comm-card-label">
                        <FileText size={13} />
                        <span>Clinical Focus & Scope</span>
                      </div>
                      <p className="zenve-comm-card-desc">
                        {activeCommunity.description ||
                          'Peer-to-peer clinical case discussions, surgical differential reviews, and evidence-based pharmacotherapy for verified veterinary practitioners.'}
                      </p>
                    </div>

                    {/* Unique Community Administration */}
                    <div className="zenve-comm-drawer-card">
                      <div className="zenve-comm-card-label">
                        <ShieldCheck size={13} />
                        <span>Governance & Administration</span>
                      </div>
                      <p className="zenve-comm-card-desc">
                        {isCurrentUserAdmin ? (
                          <strong className="text-burgundy">👑 You are the Group Admin</strong>
                        ) : (
                          <>Admin: <strong>{activeCommunity.createdBy || 'Zenve Medical Council'}</strong></>
                        )}
                        {' • '}
                        {activeCommunity.type === 'public'
                          ? 'Open to all licensed veterinarians across India.'
                          : 'Exclusive access limited to approved followers & invited specialists.'}
                      </p>
                    </div>

                    {/* Unique Clinical Guidelines for this specific Community */}
                    <div className="zenve-comm-drawer-card zenve-comm-card-wide">
                      <div className="zenve-comm-card-label">
                        <Sparkles size={13} />
                        <span>Community Guidelines & Best Practices</span>
                      </div>
                      <div className="zenve-comm-guidelines-list">
                        {(activeCommunity.guidelines && activeCommunity.guidelines.length > 0
                          ? activeCommunity.guidelines
                          : [
                              {
                                id: 1,
                                title: 'Patient Anonymization',
                                desc: 'Mask pet parent and patient identifying records prior to uploading radiographs or lab panels.',
                              },
                              {
                                id: 2,
                                title: 'Structured Signalment',
                                desc: 'State species, breed, age, sex, and relevant comorbidity history for rapid differential guidance.',
                              },
                              {
                                id: 3,
                                title: 'Evidence-Based Therapeutics',
                                desc: 'Cite peer-tested protocols and reference standard clinical pharmacology dosages.',
                              },
                            ]
                        ).map((g, idx) => (
                          <div key={g.id || idx} className="zenve-guideline-item">
                            <span className="zenve-guideline-dot">{g.id || idx + 1}</span>
                            <span>
                              <strong>{g.title}:</strong> {g.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="zenve-comm-drawer-footer">
                    <button
                      type="button"
                      className="zenve-drawer-action-btn"
                      onClick={() => {
                        setShowCommProfileDrawer(false);
                        handleOpenViewMembers();
                      }}
                    >
                      <Users size={14} />
                      <span>View All {currentCommunityMembers.length} Members</span>
                    </button>
                    {isCurrentUserAdmin && (
                      <button
                        type="button"
                        className="zenve-drawer-action-btn zenve-drawer-admin-btn"
                        onClick={() => {
                          setShowCommProfileDrawer(false);
                          handleOpenAdminSettings();
                        }}
                      >
                        <Settings size={14} />
                        <span>Manage Community Settings</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="zenve-drawer-action-btn"
                      onClick={handleCopyCommunityLink}
                    >
                      {copiedCommLink ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
                      <span>{copiedCommLink ? 'Link Copied!' : 'Copy Invitation Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* WhatsApp-Style Community Chat History */}
              <div className="zenve-chat-history zenve-comm-chat-history zenve-wa-chat-canvas">
                {/* Pinned Clinical Announcement Banner */}
                {!isCommNoticeDismissed && (
                  <div className="zenve-comm-pinned-banner">
                    <div className="zenve-comm-pinned-content">
                      <Pin size={14} color="#d97706" style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Clinical Announcement:</strong> Multi-Specialty Clinical Grand Rounds & Case Reviews are active in this community. Mask patient identifiers before posting.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="zenve-comm-pinned-dismiss"
                      onClick={() => setIsCommNoticeDismissed(true)}
                      title="Dismiss announcement"
                    >
                      Dismiss ✕
                    </button>
                  </div>
                )}

                {/* WhatsApp End-to-End Encryption Notice Pill */}
                <div className="zenve-wa-encryption-pill">
                  <span>🔒 Messages in &ldquo;{activeCommunity.name}&rdquo; are secure & verified under ZenveVet clinical protocol.</span>
                </div>

                {/* WhatsApp Centered Date Divider */}
                <div className="zenve-wa-date-divider">
                  <span>TODAY</span>
                </div>

                {/* Messages list rendered in WhatsApp Bubbles */}
                {activeCommunityMessages.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="zenve-wa-system-pill">
                        <span className="zenve-wa-sys-icon">📣</span>
                        <span>{msg.text}</span>
                        <span className="zenve-wa-sys-time">{msg.time}</span>
                      </div>
                    );
                  }

                  const isMe = msg.isMe || msg.senderId === 'me';
                  const authorColor = getDoctorColor(msg.senderId || msg.senderName);

                  return (
                    <div
                      key={msg.id}
                      className={`zenve-wa-msg-row ${isMe ? 'wa-sent' : 'wa-received'}`}
                    >
                      <div className={`zenve-wa-bubble ${isMe ? 'bubble-sent' : 'bubble-received'}`}>
                        {!isMe && (
                          <div className="zenve-wa-author-line">
                            <span className="zenve-wa-author-name" style={{ color: authorColor }}>
                              {msg.senderName}
                            </span>
                            {msg.senderSpecialty && (
                              <span className="zenve-wa-author-spec">
                                • {msg.senderSpecialty}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Attachment display inside bubble */}
                        {msg.attachment && !msg.isDeletedForEveryone && (
                          <div className="zenve-wa-bubble-attachment">
                            {msg.attachment.isImage ? (
                              <div className="zenve-wa-msg-img-wrap">
                                <img
                                  src={msg.attachment.dataUrl}
                                  alt={msg.attachment.name}
                                  className="zenve-wa-msg-image"
                                  onClick={() => window.open(msg.attachment.dataUrl, '_blank')}
                                  title="Click to view full image"
                                />
                              </div>
                            ) : (
                              <div className="zenve-wa-msg-doc-card">
                                <div className="zenve-wa-doc-icon-wrap">
                                  <FileText size={22} color="#1D3B2F" />
                                </div>
                                <div className="zenve-wa-doc-info">
                                  <span className="zenve-wa-doc-name" title={msg.attachment.name}>
                                    {msg.attachment.name}
                                  </span>
                                  <span className="zenve-wa-doc-size">{msg.attachment.size}</span>
                                </div>
                                <a
                                  href={msg.attachment.dataUrl}
                                  download={msg.attachment.name}
                                  className="zenve-wa-doc-download-btn"
                                  title="Download attachment"
                                >
                                  <Download size={15} />
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Deleted Message Tombstone */}
                        {msg.isDeletedForEveryone ? (
                          <div className="zenve-wa-deleted-msg">
                            <span className="zenve-wa-deleted-icon">🚫</span>
                            <span className="zenve-wa-deleted-text">
                              {(msg.text ? msg.text.replace(/^[🚫\s]+/, '') : '') || 'This message was deleted'}
                            </span>
                            <span className="zenve-wa-meta-inline">
                              <span className="zenve-wa-time">{msg.time}</span>
                            </span>
                          </div>
                        ) : editingMessage?.id === msg.id && editingMessage?.context === 'community' ? (
                          /* Inline Edit Box */
                          <div className="zenve-wa-inline-edit-box">
                            <input
                              type="text"
                              className="zenve-wa-inline-edit-input"
                              value={editingMessage.text}
                              onChange={(e) =>
                                setEditingMessage((prev) => ({ ...prev, text: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit('community', msg.id, editingMessage.text);
                                if (e.key === 'Escape') setEditingMessage(null);
                              }}
                              autoFocus
                            />
                            <div className="zenve-wa-inline-edit-actions">
                              <button
                                type="button"
                                className="zenve-wa-edit-btn save"
                                onClick={() => handleSaveEdit('community', msg.id, editingMessage.text)}
                                title="Save edit (Enter)"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                className="zenve-wa-edit-btn cancel"
                                onClick={() => setEditingMessage(null)}
                                title="Cancel (Esc)"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Standard Message Text Content */
                          <div className="zenve-wa-text-content">
                            <span className="zenve-wa-msg-text">{msg.text}</span>
                            <span className="zenve-wa-meta-inline">
                              {msg.isEdited && <span className="zenve-wa-edited-badge">(edited)</span>}
                              <span className="zenve-wa-time">{msg.time}</span>
                              {isMe && <span className="zenve-wa-checks">✓✓</span>}
                            </span>

                            {/* Dropdown Menu Trigger for Reply / Edit / Delete */}
                            <div className="zenve-wa-msg-actions-wrap">
                              <button
                                type="button"
                                className="zenve-wa-msg-actions-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuMsgId((prev) => (prev === msg.id ? null : msg.id));
                                }}
                                title="Message options"
                                aria-label="Message options"
                              >
                                <MoreVertical size={13} />
                              </button>
                              {activeMenuMsgId === msg.id && (
                                <div className="zenve-wa-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="zenve-wa-menu-item"
                                    onClick={() => {
                                      setReplyingTo({
                                        id: msg.id,
                                        senderName: isMe ? 'You' : (msg.senderName || 'Member'),
                                        text: msg.text,
                                        context: 'community',
                                      });
                                      setActiveMenuMsgId(null);
                                    }}
                                  >
                                    <CornerUpLeft size={13} />
                                    <span>Reply</span>
                                  </button>
                                  {isMe && !msg.isDeletedForEveryone && isMessageWithinOneHour(msg) && (
                                    <button
                                      type="button"
                                      className="zenve-wa-menu-item"
                                      onClick={() => {
                                        setEditingMessage({ id: msg.id, text: msg.text, context: 'community' });
                                        setActiveMenuMsgId(null);
                                      }}
                                    >
                                      <Edit2 size={13} />
                                      <span>Edit message</span>
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="zenve-wa-menu-item danger"
                                    onClick={() => {
                                      const canEveryone = isMe && !msg.isDeletedForEveryone && isMessageWithinOneHour(msg);
                                      setDeleteTarget({
                                        id: msg.id,
                                        context: 'community',
                                        isMe,
                                        canDeleteForEveryone: canEveryone,
                                        text: msg.text,
                                      });
                                      setActiveMenuMsgId(null);
                                    }}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete message</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={communityEndRef} />
              </div>

              {/* Quick Consultation Case Prompts for Community */}
              <div className="zenve-quick-prompts-row zenve-comm-prompts">
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleInsertClinicalPrompt(
                      '🩺 [Case Consultation] Signalment: Canine, 4y | Presenting Complaint: Acute lameness | Prior Rx: '
                    )
                  }
                  title="Click to insert clinical consultation template"
                >
                  🩺 Case Consultation
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleInsertClinicalPrompt(
                      '📋 [Radiograph Opinion] View: Lateral & VD | Region: Thoracic / Stifle | Differential query: '
                    )
                  }
                  title="Click to insert imaging review template"
                >
                  📋 Radiograph Opinion
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleInsertClinicalPrompt(
                      '💊 [Therapeutics] Drug / Regimen: | Indication: Refractory pruritus / Infection | Protocol query: '
                    )
                  }
                  title="Click to insert therapeutics query template"
                >
                  💊 Therapeutics Query
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleInsertClinicalPrompt(
                      '🔬 [Lab & Pathology] CBC & Biochemistry findings: | Suspected pathology: '
                    )
                  }
                  title="Click to insert lab review template"
                >
                  🔬 Lab Review
                </button>
                <button
                  type="button"
                  className="zenve-quick-prompt-btn"
                  onClick={() =>
                    handleInsertClinicalPrompt(
                      '⚡ [Urgent Differential] Patient Status: Critical / Trauma | Immediate peer guidance needed on: '
                    )
                  }
                  title="Click to insert urgent emergency differential"
                >
                  ⚡ Urgent Differential
                </button>
              </div>

              {/* WhatsApp-Style Community Message Composer Dock */}
              <div className="zenve-wa-composer-wrapper">
                {/* Pending Attachment Bar Preview */}
                {commAttachment && (
                  <div className="zenve-wa-attachment-bar">
                    <div className="zenve-wa-attach-preview-box">
                      {commAttachment.isImage ? (
                        <img
                          src={commAttachment.dataUrl}
                          alt={commAttachment.name}
                          className="zenve-wa-attach-img-thumb"
                        />
                      ) : (
                        <div className="zenve-wa-attach-icon-wrap">
                          <FileText size={20} color="#1D3B2F" />
                        </div>
                      )}
                      <div className="zenve-wa-attach-details">
                        <span className="zenve-wa-attach-filename">{commAttachment.name}</span>
                        <span className="zenve-wa-attach-size">{commAttachment.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="zenve-wa-attach-remove-btn"
                      onClick={() => setCommAttachment(null)}
                      title="Remove attachment"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* WhatsApp Interactive Emoji Picker Popover */}
                {showEmojiPicker === 'community' && (
                  <div className="zenve-wa-emoji-popover" onClick={(e) => e.stopPropagation()}>
                    <div className="zenve-wa-emoji-tabs">
                      {EMOJI_TABS.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`zenve-wa-emoji-tab-btn ${activeEmojiTab === tab.id ? 'active' : ''}`}
                          onClick={() => setActiveEmojiTab(tab.id)}
                          title={tab.title}
                        >
                          <span>{tab.label}</span>
                          <span className="zenve-wa-emoji-tab-label">{tab.title.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                    <div className="zenve-wa-emoji-grid">
                      {((EMOJI_TABS.find((t) => t.id === activeEmojiTab) || EMOJI_TABS[0]).emojis || []).map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="zenve-wa-emoji-btn"
                          onClick={() => setCommunityInput((prev) => prev + emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden File Input for Community */}
                <input
                  type="file"
                  ref={commFileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'community')}
                />

                {/* Replying Context Bar for Community */}
                {replyingTo && replyingTo.context === 'community' && (
                  <div className="zenve-chat-replying-bar">
                    <div className="zenve-replying-bar-left">
                      <div className="zenve-replying-bar-icon">
                        <CornerUpLeft size={13} />
                      </div>
                      <div className="zenve-replying-bar-text">
                        <span className="zenve-replying-bar-author">
                          Replying to {replyingTo.senderName}
                        </span>
                        <span className="zenve-replying-bar-snippet">{replyingTo.text}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="zenve-replying-bar-close"
                      onClick={() => setReplyingTo(null)}
                      title="Cancel reply"
                      aria-label="Cancel reply"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="zenve-wa-composer-dock">
                  <button
                    type="button"
                    className={`zenve-wa-dock-icon-btn ${showEmojiPicker === 'community' ? 'active' : ''}`}
                    title="Choose emoji"
                    aria-label="Choose emoji"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker((prev) => (prev === 'community' ? null : 'community'));
                    }}
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="button"
                    className={`zenve-wa-dock-icon-btn ${commAttachment ? 'has-file' : ''}`}
                    title="Upload clinical document, image or lab panel"
                    aria-label="Upload file"
                    onClick={() => commFileInputRef.current?.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  <div className="zenve-wa-input-container">
                    <input
                      type="text"
                      className="zenve-wa-input"
                      placeholder={`Type a message in ${activeCommunity.name}...`}
                      value={communityInput}
                      onChange={(e) => setCommunityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendCommunityMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="zenve-wa-send-btn"
                    onClick={() => handleSendCommunityMessage()}
                    disabled={!communityInput.trim() && !commAttachment}
                    title="Send message"
                    aria-label="Send message"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="zenve-chat-no-selection">
              <div className="zenve-chat-no-selection-icon">
                <MessagesIcon size={32} color="#3D0D18" />
              </div>
              <h3 className="zenve-chat-no-selection-title">Select a Community</h3>
              <p className="zenve-chat-no-selection-desc">
                Choose an all-India public forum or a private follower circle on the left.
              </p>
            </div>
          )
        ) : (
          /* DIRECT CHATS MAIN CONVERSATION PANE */
          selectedDoctor ? (
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
                    title={
                      isFollowingSelected ? 'Click to Unfollow' : 'Follow to enable messaging'
                    }
                  >
                    {isFollowingSelected ? '✓ Following' : '+ Follow to Msg'}
                  </button>
                </div>
              </div>

              {/* Messages Thread Flow - WhatsApp Style Canvas */}
              <div className="zenve-chat-history zenve-wa-chat-canvas">
                {/* WhatsApp End-to-End Encryption Notice Pill */}
                <div className="zenve-wa-encryption-pill">
                  <span>🔒 Direct clinical messages with Dr. {selectedDoctor.name} are end-to-end encrypted.</span>
                </div>

                {/* WhatsApp Centered Date Divider */}
                <div className="zenve-wa-date-divider">
                  <span>TODAY</span>
                </div>

                {activeChatMessages.map((msg) => {
                  const isMe = msg.sender === 'me';
                  const isReplyingToThis = replyingTo?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`zenve-chat-bubble-wrap ${isMe ? 'sent' : 'received'} ${isReplyingToThis ? 'zenve-bubble-selected-reply' : ''
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
        )
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
