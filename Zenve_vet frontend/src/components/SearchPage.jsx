import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  MapPin,
  Stethoscope,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  UserPlus,
  UserCheck,
  X,
  Camera,
  PlayCircle,
  FileText,
  Heart,
  Eye,
  Clock3,
  PawPrint,
  LayoutGrid,
  SlidersHorizontal,
  Activity,
  AlertCircle,
  Newspaper,
} from 'lucide-react';

import { VETERINARIANS } from '../data/veterinarians';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import {SHORT_VIDEOS_DATA} from '../data/shortVideosData';

import '../csscomponents/SearchPage.css';

const STORAGE_KEYS = {
  posts: 'zenve_community_posts',
  stories: 'zenve_user_stories',
  cases: 'zenve_clinical_cases',
  doctors: 'zenve_clinical_doctors',
};

const CONTENT_UPDATED_EVENT = 'zenve:community-content-updated';
const FEED_SAMPLES_EVENT = 'zenve:feed-samples-ready';
const CASE_SAMPLES_EVENT = 'zenve:clinical-samples-ready';

const AVATAR_COLORS = [
  '#DCE9E0',
  '#E9DFD1',
  '#E6DFEC',
  '#DCE5EF',
  '#F0E0D9',
  '#E2E8D8',
];

const SPECIALTY_CHIPS = [
  'Dermatology',
  'Surgery',
  'Livestock',
  'Equine',
  'Imaging',
  'Nutrition',
  'Wildlife',
  'Preventive',
];

const CONTENT_TABS = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Doctors', icon: Stethoscope },
  { label: 'Feed', icon: Newspaper },
  { label: 'Clinical Cases', icon: FileText },
  { label: 'Short Videos', icon: PlayCircle },
  { label: 'Stories', icon: Heart },
];

// Fallback sample cases ensure Search works even before
// ClinicalCases.jsx has mounted and exposed its sample data.
const FALLBACK_CASES = [
  {
    id: 'case-001',
    caseNumber: 'CC-2026-001',
    title: 'TPLO Post-Op Monitoring – German Shepherd',
    species: 'Canine',
    breed: 'German Shepherd',
    age: '4 years',
    weight: '32 kg',
    status: 'Active',
    priority: 'High',
    description:
      'Post-operative monitoring for TPLO knee stabilization surgery. Patient showing excellent ambulation on day 5. Early weight-bearing protocol initiated.',
    diagnosis: 'Cranial Cruciate Ligament (CCL) Rupture',
    treatment: 'TPLO Surgery + Post-op physical rehabilitation',
    notes: 'Patient responds well. Recheck radiograph scheduled at week 6.',
    assignedDoctorId: 'doc-001',
    date: '2026-10-12',
    nextVisit: '2026-10-26',
  },
  {
    id: 'case-002',
    caseNumber: 'CC-2026-002',
    title: 'Chronic Pruritus & Skin Lesions – Persian Cat',
    species: 'Feline',
    breed: 'Persian',
    age: '3 years',
    weight: '4.2 kg',
    status: 'Under Observation',
    priority: 'Medium',
    description:
      'Chronic pruritus with erythematous plaques on dorsal neck region. Allergy immunotherapy initiated. Lesions showing 70% improvement.',
    diagnosis: 'Atopic Dermatitis + Environmental Allergy',
    treatment: 'SLIT Immunotherapy + Topical corticosteroids',
    notes: 'Monthly revisit for immunotherapy dose titration.',
    assignedDoctorId: 'doc-003',
    date: '2026-09-30',
    nextVisit: '2026-10-30',
  },
  {
    id: 'case-003',
    caseNumber: 'CC-2026-003',
    title: 'Equine Colic – Arabian Stallion',
    species: 'Equine',
    breed: 'Arabian',
    age: '6 years',
    weight: '480 kg',
    status: 'Resolved',
    priority: 'Critical',
    description:
      'Emergency large colon displacement. Surgical correction performed under general anaesthesia. Full recovery achieved on day 10.',
    diagnosis: 'Large Colon Displacement (Right Dorsal Displacement)',
    treatment: 'Emergency exploratory laparotomy + Colon correction',
    notes: 'Case closed. Follow-up in 3 months for routine soundness evaluation.',
    assignedDoctorId: 'doc-005',
    date: '2026-09-15',
    nextVisit: '2027-01-15',
  },
];

function readStoredArray(key) {
  try {
    if (typeof window === 'undefined') return [];

    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Unable to read ${key} from localStorage.`, error);
    return [];
  }
}

function readWindowArray(key) {
  if (typeof window === 'undefined') return [];

  return Array.isArray(window[key]) ? window[key] : [];
}

function asText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return 'VP';

  return (
    parts
      .slice(0, 2)
      .map((part) => part.replace(/[^a-zA-Z]/g, '').charAt(0))
      .join('')
      .toUpperCase() || 'VP'
  );
}

function getDoctorExperience(doctor) {
  const value = doctor?.experience;

  if (typeof value === 'number') return `${value} years`;

  return asText(value, 'Not specified');
}

function normalizeDoctor(doctor, index) {
  const name = asText(doctor?.name, 'Veterinary professional');

  const specialty = asText(
    doctor?.specialty || doctor?.specialization,
    asText(doctor?.specialtyCategory, 'Veterinary Medicine')
  );

  const focusAreas = asArray(doctor?.focusAreas)
    .map((item) => {
      if (typeof item === 'string') return item;
      return asText(item?.name || item?.title);
    })
    .filter(Boolean);

  const interests = focusAreas.length ? focusAreas : [specialty];

  const city =
    asText(doctor?.location, 'Location not specified')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)[0] || 'Location not specified';

  return {
    id: asText(doctor?.id, `veterinarian-${index}`),
    name,
    specialty,
    city,
    initials: getInitials(name),
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    image: asText(doctor?.img || doctor?.image),
    verified: Boolean(doctor?.verified),
    takeaway: focusAreas.length > 0,
    experience: getDoctorExperience(doctor),
    about: asText(
      doctor?.about,
      asText(doctor?.description, 'Veterinary professional profile.')
    ),
    interests,
    education: asText(
      doctor?.degrees || doctor?.education || doctor?.qualification
    ),
    clinic: asText(doctor?.clinic),
    original: doctor,
  };
}

function getDoctorDirectory() {
  return asArray(VETERINARIANS).map((doctor, index) =>
    normalizeDoctor(doctor, index)
  );
}

function getStoredDoctorContent() {
  if (!DOCTORS_DATABASE || typeof DOCTORS_DATABASE !== 'object') {
    return [];
  }

  return Object.values(DOCTORS_DATABASE).filter(
    (doctor) => doctor && typeof doctor === 'object'
  );
}

function getClinicalDoctors() {
  return readStoredArray(STORAGE_KEYS.doctors).map((doctor, index) =>
    normalizeDoctor(doctor, index + 1000)
  );
}

function getDoctorProfileContent() {
  const posts = [];
  const videos = [];

  getStoredDoctorContent().forEach((doctor, doctorIndex) => {
    const author = asText(doctor.name, 'Veterinary professional');
    const authorId = asText(doctor.id, `profile-${doctorIndex}`);

    asArray(doctor.posts).forEach((post, postIndex) => {
      const isVideo = Boolean(
        post?.isVideoShort ||
          post?.videoUrl ||
          post?.mediaType === 'video' ||
          post?.type === 'video'
      );

      const title = asText(
        post?.title || post?.caption || post?.description || post?.content,
        'Veterinary community post'
      );

      const item = {
        id: asText(post?.id, `${authorId}-post-${postIndex}`),
        type: isVideo ? 'Short Videos' : 'Feed',
        title,
        description: asText(
          post?.description || post?.caption || post?.content,
          title
        ),
        author,
        time: asText(post?.timeAgo || post?.createdAt, 'Profile post'),
        image: asText(
          post?.thumbnailUrl ||
            post?.imageUrl ||
            post?.mediaUrl ||
            post?.image
        ),
        videoUrl: asText(post?.videoUrl),
        searchText: `${title} ${author} ${asArray(post?.tags).join(' ')}`,
      };

      if (isVideo) videos.push(item);
      else posts.push(item);
    });

    asArray(doctor.videos).forEach((video, videoIndex) => {
      const title = asText(
        video?.title || video?.caption || video?.description,
        'Veterinary educational video'
      );

      videos.push({
        id: asText(video?.id, `${authorId}-video-${videoIndex}`),
        type: 'Short Videos',
        title,
        description: asText(video?.description || video?.caption, title),
        author,
        time: asText(video?.timeAgo || video?.createdAt, 'Profile video'),
        image: asText(
          video?.thumbnailUrl || video?.imageUrl || video?.thumbnail
        ),
        videoUrl: asText(video?.videoUrl || video?.url),
        searchText: `${title} ${author}`,
      });
    });
  });

  return { posts, videos };
}

function normalizeCase(item, index) {
  const title = asText(
    item?.title || item?.caseNumber,
    `Clinical case ${index + 1}`
  );

  const species = asText(item?.species);
  const breed = asText(item?.breed);
  const diagnosis = asText(item?.diagnosis);
  const treatment = asText(item?.treatment);
  const status = asText(item?.status, 'Not specified');
  const priority = asText(item?.priority, 'Not specified');

  const details = [
    item?.description ? asText(item.description) : '',
    species ? `Species: ${species}` : '',
    breed ? `Breed: ${breed}` : '',
    diagnosis ? `Diagnosis: ${diagnosis}` : '',
    treatment ? `Treatment: ${treatment}` : '',
  ].filter(Boolean);

  return {
    id: asText(item?.id, `case-${index}`),
    type: 'Clinical Cases',
    title,
    description: details.join(' · ') || 'Clinical case record.',
    author: asText(
      item?.assignedDoctorName ||
        item?.authorName ||
        item?.createdByName ||
        item?.assignedDoctorId,
      'Clinical case record'
    ),
    time: asText(
      item?.date || item?.createdAt || item?.updatedAt,
      'Clinical case'
    ),
    status,
    priority,
    species,
    breed,
    diagnosis,
    treatment,
    caseNumber: asText(item?.caseNumber),
    searchText: [
      title,
      item?.caseNumber,
      species,
      breed,
      item?.age,
      item?.weight,
      item?.description,
      diagnosis,
      treatment,
      item?.notes,
      item?.nextVisit,
      status,
      priority,
      item?.assignedDoctorName,
      item?.assignedDoctorId,
      item?.authorName,
    ]
      .map((value) => asText(value))
      .join(' '),
  };
}

function normalizePost(item, index) {
  const title = asText(
    item?.title || item?.caption || item?.description || item?.content,
    'Community post'
  );

  const isVideo = Boolean(
    item?.isVideoShort ||
      item?.videoUrl ||
      item?.mediaType === 'video' ||
      item?.type === 'video'
  );

  return {
    id: asText(item?.id, `post-${index}`),
    type: isVideo ? 'Short Videos' : 'Feed',
    title,
    description: asText(
      item?.description || item?.caption || item?.content,
      title
    ),
    author: asText(
      item?.authorName || item?.author?.name || item?.name,
      'Community member'
    ),
    time: asText(
      item?.timeAgo || item?.createdAt || item?.time,
      'Community post'
    ),
    image: asText(
      item?.thumbnailUrl ||
        item?.mediaUrl ||
        item?.imageUrl ||
        item?.image
    ),
    videoUrl: asText(item?.videoUrl),
    searchText: [
      title,
      item?.authorName,
      item?.authorSpecialty,
      item?.caption,
      item?.description,
      item?.audioTitle,
      asArray(item?.tags).join(' '),
    ]
      .map((value) => asText(value))
      .join(' '),
  };
}

function normalizeStory(item, index) {
  const title = asText(
    item?.title || item?.caption || item?.name || item?.authorName,
    `Community story ${index + 1}`
  );

  return {
    id: asText(item?.id, `story-${index}`),
    type: 'Stories',
    title,
    description: asText(
      item?.description || item?.caption,
      'A story shared by the veterinary community.'
    ),
    author: asText(
      item?.authorName || item?.name,
      'Community member'
    ),
    time: asText(
      item?.timeAgo || item?.createdAt || item?.time,
      'Community story'
    ),
    image: asText(
      item?.mediaUrl ||
        item?.imageUrl ||
        item?.image ||
        item?.storyMedia
    ),
    searchText: [
      title,
      item?.authorName,
      item?.name,
      item?.specialty,
      item?.caption,
      item?.description,
    ]
      .map((value) => asText(value))
      .join(' '),
  };
}

function normalizeStoryGroups(groups) {
  const stories = [];

  asArray(groups).forEach((group, groupIndex) => {
    const items = asArray(group?.items);
    const author = asText(group?.name, 'Community member');

    if (items.length) {
      items.forEach((slide, slideIndex) => {
        stories.push(
          normalizeStory(
            {
              ...slide,
              id:
                slide?.id ||
                `${group?.id || groupIndex}-slide-${slideIndex}`,
              authorName: author,
              specialty: group?.specialty,
              time: slide?.time || group?.time,
              storyMedia:
                slide?.storyMedia || slide?.mediaUrl || group?.img,
            },
            stories.length
          )
        );
      });
    } else {
      stories.push(
        normalizeStory(
          {
            ...group,
            authorName: author,
            storyMedia: group?.storyMedia || group?.img,
          },
          stories.length
        )
      );
    }
  });

  return stories;
}

function uniqueItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.type}:${item.id}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
function normalizeShortVideo(video, index) {
  const author = video?.author || {};

  const title = asText(video?.title, `Clinical video ${index + 1}`);
  const videoUrl = asText(video?.videoUrl);

  return {
    id: `short-video-${asText(video?.id, index)}`,
    type: 'Short Videos',
    title,
    description: asText(
      video?.clinicalPearls || video?.description,
      title
    ),
    author: asText(author?.name, 'Veterinary professional'),
    time: asText(video?.date, 'Clinical video'),
    image: asText(video?.thumbnail),
    videoUrl,
    searchText: [
      title,
      author?.name,
      author?.specialty,
      author?.clinic,
      video?.category,
      video?.specialtyTag,
      video?.clinicalPearls,
      ...asArray(video?.tags),
    ]
      .map((value) => asText(value))
      .join(' '),
  };
}
function getDiscoveryContent() {
  if (typeof window === 'undefined') return [];

  const storedPosts = readStoredArray(STORAGE_KEYS.posts);
  const storedStories = readStoredArray(STORAGE_KEYS.stories);
  const storedCases = readStoredArray(STORAGE_KEYS.cases);

  const feedSamples = window.__ZENVE_FEED_SAMPLES__ || {};
  const samplePosts = asArray(feedSamples.posts);
  const sampleStories = asArray(feedSamples.stories);

  const caseSamples = readWindowArray('__ZENVE_CASE_SAMPLES__');
  const profileContent = getDoctorProfileContent();

  // Include videos from the dedicated Short Videos page.
  const dedicatedShortVideos = asArray(SHORT_VIDEOS_DATA).map(
    normalizeShortVideo
  );

  const posts = uniqueItems(
    [...storedPosts, ...samplePosts].map((item, index) =>
      normalizePost(item, index)
    )
  );

  const storedStoryItems = storedStories.flatMap((story, storyIndex) => {
    if (Array.isArray(story?.items)) {
      return story.items.map((item, itemIndex) => ({
        ...item,
        authorName: story.name || item.authorName,
        id:
          item.id ||
          `${story.id || story.name || `story-${storyIndex}`}-${itemIndex}`,
      }));
    }

    return [story];
  });

  const stories = uniqueItems([
    ...storedStoryItems.map((item, index) =>
      normalizeStory(item, index)
    ),
    ...normalizeStoryGroups(sampleStories),
  ]);

  const cases = uniqueItems(
    [...storedCases, ...caseSamples, ...FALLBACK_CASES].map(
      (item, index) => normalizeCase(item, index)
    )
  );

  // Separate regular feed posts from video posts.
  const feedItems = [
    ...posts.filter((item) => item.type === 'Feed'),
    ...profileContent.posts,
  ];

  const videoItems = [
    ...posts.filter((item) => item.type === 'Short Videos'),
    ...profileContent.videos,
  ];

  return uniqueItems([
    ...cases,
    ...stories,
    ...feedItems,
    ...videoItems,
    ...dedicatedShortVideos,
  ]);
}

function getContentIcon(type) {
  if (type === 'Clinical Cases') return FileText;
  if (type === 'Short Videos') return PlayCircle;
  if (type === 'Stories') return Heart;
  return Newspaper;
}

function getPriorityClass(priority) {
  const value = asText(priority).toLowerCase();

  if (
    value.includes('critical') ||
    value.includes('urgent') ||
    value.includes('high')
  ) {
    return 'case-priority-high';
  }

  if (value.includes('medium') || value.includes('normal')) {
    return 'case-priority-medium';
  }

  if (value.includes('low')) {
    return 'case-priority-low';
  }

  return 'case-priority-default';
}

function getStatusClass(status) {
  const value = asText(status).toLowerCase();

  if (
    value.includes('resolved') ||
    value.includes('closed') ||
    value.includes('complete')
  ) {
    return 'case-status-complete';
  }

  if (
    value.includes('progress') ||
    value.includes('active') ||
    value.includes('ongoing')
  ) {
    return 'case-status-progress';
  }

  if (value.includes('pending') || value.includes('open')) {
    return 'case-status-pending';
  }

  return 'case-status-default';
}

function DiscoveryCard({ item }) {
  const ItemIcon = getContentIcon(item.type);
  const isCase = item.type === 'Clinical Cases';
  const isVideo = item.type === 'Short Videos';

  return (
    <article className="discovery-card">
      <div className="discovery-card-top">
        <span className="discovery-card-icon">
          <ItemIcon size={21} aria-hidden="true" />
        </span>
        <span className="discovery-tag">{item.type}</span>
      </div>

      <h3>{item.title}</h3>

      {isCase && (item.species || item.breed || item.caseNumber) && (
        <div className="discovery-case-meta">
          {item.caseNumber && (
            <span className="discovery-case-number">
              {item.caseNumber}
            </span>
          )}

          {item.species && (
            <span>
              <PawPrint size={13} aria-hidden="true" />
              {item.species}
              {item.breed ? ` · ${item.breed}` : ''}
            </span>
          )}
        </div>
      )}

      <p>{item.description}</p>

      {isCase && (item.diagnosis || item.treatment) && (
        <div className="discovery-case-details">
          {item.diagnosis && (
            <p>
              <strong>Diagnosis:</strong> {item.diagnosis}
            </p>
          )}

          {item.treatment && (
            <p>
              <strong>Treatment:</strong> {item.treatment}
            </p>
          )}
        </div>
      )}

      {isCase && (
        <div className="discovery-case-badges">
          {item.status && item.status !== 'Not specified' && (
            <span
              className={`discovery-case-badge ${getStatusClass(item.status)}`}
            >
              <Activity size={12} aria-hidden="true" />
              {item.status}
            </span>
          )}

          {item.priority && item.priority !== 'Not specified' && (
            <span
              className={`discovery-case-badge ${getPriorityClass(item.priority)}`}
            >
              <AlertCircle size={12} aria-hidden="true" />
              {item.priority} priority
            </span>
          )}
        </div>
      )}

{item.image && !isVideo && (
  <div className="discovery-card-media">
    <img
      src={item.image}
      alt={item.title}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  </div>
)}

{isVideo && (
  <div className="discovery-video-player">
    <video
      controls
      playsInline
      preload="metadata"
      poster={item.image || undefined}
    >
      {item.videoUrl && (
        <source
          src={item.videoUrl}
          type={
            item.videoUrl.toLowerCase().endsWith('.webm')
              ? 'video/webm'
              : 'video/mp4'
          }
        />
      )}
      Your browser does not support embedded video.
    </video>
  </div>
)}

      <div className="discovery-card-footer">
        <span>
          <Clock3 size={13} aria-hidden="true" />
          {item.time}
        </span>
        <span className="discovery-author">{item.author}</span>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All states');
  const [specialty, setSpecialty] = useState('');
  const [tab, setTab] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [takeawaysOnly, setTakeawaysOnly] = useState(false);
  const [connections, setConnections] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [contentVersion, setContentVersion] = useState(0);
  const [sortBy, setSortBy] = useState('relevant');

  const photoInputRef = useRef(null);

  useEffect(() => {
    if (!selectedDoctor) return undefined;

    document.body.classList.add('doctor-profile-open');

    return () => {
      document.body.classList.remove('doctor-profile-open');
    };
  }, [selectedDoctor]);

  useEffect(() => {
    const refreshContent = () => {
      setContentVersion((version) => version + 1);
    };

    const handleStorage = (event) => {
      if (!event.key || Object.values(STORAGE_KEYS).includes(event.key)) {
        refreshContent();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(CONTENT_UPDATED_EVENT, refreshContent);
    window.addEventListener(FEED_SAMPLES_EVENT, refreshContent);
    window.addEventListener(CASE_SAMPLES_EVENT, refreshContent);
    window.addEventListener('focus', refreshContent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(CONTENT_UPDATED_EVENT, refreshContent);
      window.removeEventListener(FEED_SAMPLES_EVENT, refreshContent);
      window.removeEventListener(CASE_SAMPLES_EVENT, refreshContent);
      window.removeEventListener('focus', refreshContent);
    };
  }, []);

  const doctors = useMemo(() => {
    const directory = getDoctorDirectory();
    const clinicalDoctors = getClinicalDoctors();
    const seen = new Set();

    return [...directory, ...clinicalDoctors].filter((doctor) => {
      if (seen.has(doctor.id)) return false;
      seen.add(doctor.id);
      return true;
    });
  }, [contentVersion]);

  const discoveryItems = useMemo(
    () => getDiscoveryContent(),
    [contentVersion]
  );

  const cities = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.city)
      .filter((value) => value && value !== 'Location not specified');

    return [
      'All states',
      ...[...new Set(values)].sort((a, b) => a.localeCompare(b)),
    ];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = doctors.filter((doctor) => {
      const searchableText = [
        doctor.name,
        doctor.specialty,
        doctor.city,
        doctor.about,
        doctor.education,
        doctor.clinic,
        doctor.interests.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return (
        searchableText.includes(normalizedQuery) &&
        (city === 'All states' || doctor.city === city) &&
        (!specialty ||
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
          doctor.interests.some((interest) =>
            interest.toLowerCase().includes(specialty.toLowerCase())
          )) &&
        (!verifiedOnly || doctor.verified) &&
        (!takeawaysOnly || doctor.takeaway)
      );
    });

    if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'experience') {
      const getYears = (value) => {
        const match = value.match(/\d+/);
        return match ? Number(match[0]) : 0;
      };

      results.sort(
        (a, b) => getYears(b.experience) - getYears(a.experience)
      );
    }

    return results;
  }, [
    doctors,
    query,
    city,
    specialty,
    verifiedOnly,
    takeawaysOnly,
    sortBy,
  ]);

  const visibleDoctors =
    tab === 'All' || tab === 'Doctors' ? filteredDoctors : [];

  const visibleDiscoveryItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return discoveryItems.filter((item) => {
      const searchableContent = [
        item.title,
        item.description,
        item.author,
        item.type,
        item.searchText || '',
        item.status || '',
        item.priority || '',
        item.species || '',
        item.breed || '',
        item.diagnosis || '',
        item.treatment || '',
        item.caseNumber || '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedQuery || searchableContent.includes(normalizedQuery);

      const matchesTab =
        tab === 'All' ||
        (tab === 'Feed' && item.type === 'Feed') ||
        (tab === 'Clinical Cases' && item.type === 'Clinical Cases') ||
        (tab === 'Short Videos' && item.type === 'Short Videos') ||
        (tab === 'Stories' && item.type === 'Stories');

      return matchesSearch && matchesTab;
    });
  }, [discoveryItems, query, tab]);

  const contentCounts = useMemo(
    () => ({
      all: doctors.length + discoveryItems.length,
      doctors: doctors.length,
      feed: discoveryItems.filter((item) => item.type === 'Feed').length,
      cases: discoveryItems.filter((item) => item.type === 'Clinical Cases').length,
      videos: discoveryItems.filter((item) => item.type === 'Short Videos').length,
      stories: discoveryItems.filter((item) => item.type === 'Stories').length,
    }),
    [doctors, discoveryItems]
  );

  const tabs = CONTENT_TABS.map((item) => ({
    ...item,
    count:
      item.label === 'All'
        ? contentCounts.all
        : item.label === 'Doctors'
          ? contentCounts.doctors
          : item.label === 'Feed'
            ? contentCounts.feed
            : item.label === 'Clinical Cases'
              ? contentCounts.cases
              : item.label === 'Short Videos'
                ? contentCounts.videos
                : contentCounts.stories,
  }));

  function toggleConnection(doctorId) {
    setConnections((previous) => ({
      ...previous,
      [doctorId]: !previous[doctorId],
    }));
  }

  function clearFilters() {
    setQuery('');
    setCity('All states');
    setSpecialty('');
    setVerifiedOnly(false);
    setTakeawaysOnly(false);
    setTab('All');
    setSortBy('relevant');
  }

  function openDoctorMessage(doctorId) {
    window.dispatchEvent(
      new CustomEvent('zenve_open_message', {
        detail: { doctorId },
      })
    );

    setSelectedDoctor(null);
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file || !selectedDoctor) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert('Please select an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePhotos((previous) => ({
        ...previous,
        [selectedDoctor.id]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return (
    <section className="search-page">
      <header className="search-heading">
        <span className="search-eyebrow">DISCOVER THE COMMUNITY</span>
        <h1>Find people, cases &amp; answers.</h1>
        <p>
          Search the veterinary network, community feed, clinical cases,
          short videos, and stories in one place.
        </p>
      </header>

      <div className="search-controls">
        <label className="search-input-wrap">
          <Search size={19} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people, posts, cases, videos, stories..."
            aria-label="Search all Zenve Vet content"
          />

          {query && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        {(tab === 'All' || tab === 'Doctors') && (
          <label className="search-city-field">
            <MapPin size={16} aria-hidden="true" />
            <select
              className="search-city-select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              aria-label="Filter by city"
            >
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {(tab === 'All' || tab === 'Doctors') && (
        <>
          <div className="search-filter-section">
            <span className="search-filter-label">Explore specialties</span>

            <div className="search-specialties" aria-label="Specialty filters">
              {SPECIALTY_CHIPS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={specialty === item ? 'selected' : ''}
                  aria-pressed={specialty === item}
                  onClick={() =>
                    setSpecialty(specialty === item ? '' : item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="search-options">
            <label>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) => setVerifiedOnly(event.target.checked)}
              />
              <ShieldCheck size={15} aria-hidden="true" />
              Verified only
            </label>

            <label>
              <input
                type="checkbox"
                checked={takeawaysOnly}
                onChange={(event) => setTakeawaysOnly(event.target.checked)}
              />
              Has takeaways
            </label>

            <button
              type="button"
              className="search-reset-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </>
      )}

      <div className="search-tabs" role="tablist" aria-label="Search categories">
        {tabs.map((item) => {
          const TabIcon = item.icon;

          return (
            <button
              type="button"
              role="tab"
              aria-selected={tab === item.label}
              key={item.label}
              className={tab === item.label ? 'active' : ''}
              onClick={() => setTab(item.label)}
            >
              <TabIcon size={20} aria-hidden="true" />
              <span className="search-tab-label">{item.label}</span>
              <span className="search-tab-count">{item.count}</span>
            </button>
          );
        })}
      </div>

      {(tab === 'All' || tab === 'Doctors') && (
        <section className="search-results-section">
          <div className="search-results-heading">
            <div>
              <span className="search-results-eyebrow">VET NETWORK</span>
              <h2>Veterinary professionals</h2>
            </div>

            <div className="search-directory-controls">
              <span className="search-result-count">
                {visibleDoctors.length}{' '}
                {visibleDoctors.length === 1 ? 'result' : 'results'}
              </span>

              <label className="search-sort-control">
                <SlidersHorizontal size={15} aria-hidden="true" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort professionals"
                >
                  <option value="relevant">Most relevant</option>
                  <option value="name">Name A–Z</option>
                  <option value="experience">Most experienced</option>
                </select>
              </label>
            </div>
          </div>

          {visibleDoctors.length > 0 ? (
            <div className="doctor-scroll-container">
              <div className="doctor-grid">
                {visibleDoctors.map((doctor) => {
                  const connected = Boolean(connections[doctor.id]);
                  const photo = profilePhotos[doctor.id] || doctor.image;

                  return (
                    <article className="doctor-card" key={doctor.id}>
                      <div className="doctor-card-banner">
                        <span className="doctor-banner-icon">
                          <PawPrint size={23} aria-hidden="true" />
                        </span>
                        <span className="doctor-city-tag">
                          <MapPin size={12} aria-hidden="true" />
                          {doctor.city}
                        </span>
                      </div>

                      <div
                        className="doctor-avatar"
                        style={{ backgroundColor: doctor.color }}
                        aria-label={`${doctor.name} profile`}
                      >
                        {photo ? (
                          <img src={photo} alt={`${doctor.name} profile`} />
                        ) : (
                          doctor.initials
                        )}
                      </div>

                      <div className="doctor-card-body">
                        <span className="doctor-label">
                          {doctor.verified ? 'VERIFIED' : 'COMMUNITY PROFILE'}
                        </span>

                        <h3>
                          {doctor.name}
                          {doctor.verified && (
                            <ShieldCheck
                              className="doctor-verified-icon"
                              size={15}
                              aria-label="Verified professional"
                            />
                          )}
                        </h3>

                        <p className="doctor-specialty">{doctor.specialty}</p>

                        <div className="doctor-experience">
                          {doctor.experience} experience
                        </div>

                        <div className="doctor-location">
                          <MapPin size={14} aria-hidden="true" />
                          {doctor.city}
                        </div>

                        <div className="doctor-card-footer">
                          <span className="doctor-community-status">
                            <CheckCircle2 size={14} aria-hidden="true" />
                            Community profile
                          </span>

                          <div className="doctor-card-actions">
                            <button
                              type="button"
                              className={`doctor-connect-button ${
                                connected ? 'is-connected' : ''
                              }`}
                              onClick={() => toggleConnection(doctor.id)}
                              aria-pressed={connected}
                            >
                              {connected ? (
                                <UserCheck size={15} aria-hidden="true" />
                              ) : (
                                <UserPlus size={15} aria-hidden="true" />
                              )}
                              {connected ? 'Connected' : 'Connect'}
                            </button>

                            <button
                              type="button"
                              className="doctor-profile-button"
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              <Eye size={15} aria-hidden="true" />
                              View profile
                            </button>

                            <button
                              type="button"
                              className="doctor-message-button"
                              onClick={() => openDoctorMessage(doctor.id)}
                              title={`Message ${doctor.name}`}
                            >
                              <MessageCircle size={15} aria-hidden="true" />
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="search-empty">
              <span className="search-empty-icon">
                <Search size={24} aria-hidden="true" />
              </span>
              <h3>No matching professionals found</h3>
              <p>Try another search term or remove one of your filters.</p>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      )}

      {tab !== 'Doctors' && (
        <section className="search-discovery-section">
          <div className="search-results-heading discovery-heading">
            <div>
              <span className="search-results-eyebrow">COMMUNITY CONTENT</span>
              <h2>
                {tab === 'Feed'
                  ? 'Feed posts'
                  : tab === 'Clinical Cases'
                    ? 'Clinical cases'
                    : tab === 'Short Videos'
                      ? 'Short videos'
                      : tab === 'Stories'
                        ? 'Community stories'
                        : 'Feed, cases, short videos & stories'}
              </h2>
            </div>

            <span className="search-result-count">
              {visibleDiscoveryItems.length}{' '}
              {visibleDiscoveryItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {visibleDiscoveryItems.length > 0 ? (
            <div className="discovery-grid">
              {visibleDiscoveryItems.map((item) => (
                <DiscoveryCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <span className="search-empty-icon">
                <Search size={24} aria-hidden="true" />
              </span>
              <h3>No matching content found</h3>
              <p>
                Try another search term or select a different category.
              </p>
              <button type="button" onClick={() => setQuery('')}>
                Show all content
              </button>
            </div>
          )}
        </section>
      )}

      {selectedDoctor && (
        <div
          className="doctor-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedDoctor(null);
            }
          }}
        >
          <section
            className="doctor-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-profile-title"
          >
            <div className="doctor-modal-header">
              <span className="search-eyebrow">COMMUNITY PROFILE</span>
              <button
                type="button"
                className="doctor-modal-close"
                onClick={() => setSelectedDoctor(null)}
                aria-label="Close doctor profile"
              >
                <X size={19} />
              </button>
            </div>

            <div className="doctor-profile-identity">
              <div
                className="doctor-profile-photo"
                style={{ backgroundColor: selectedDoctor.color }}
              >
                {profilePhotos[selectedDoctor.id] || selectedDoctor.image ? (
                  <img
                    src={profilePhotos[selectedDoctor.id] || selectedDoctor.image}
                    alt={`${selectedDoctor.name} profile`}
                  />
                ) : (
                  selectedDoctor.initials
                )}

                <button
                  type="button"
                  aria-label="Choose profile picture"
                  title="Choose profile picture"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={photoInputRef}
                  className="doctor-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  aria-label="Choose profile picture"
                />
              </div>

              <div>
                <h2 id="doctor-profile-title">{selectedDoctor.name}</h2>
                <p>{selectedDoctor.specialty}</p>
                <div className="doctor-location">
                  <MapPin size={14} aria-hidden="true" />
                  {selectedDoctor.city}
                </div>
              </div>
            </div>

            <div className="doctor-profile-stats">
              <div>
                <strong>{selectedDoctor.experience}</strong>
                <span>Experience (source data)</span>
              </div>
              <div>
                <strong>
                  {connections[selectedDoctor.id] ? 'Connected' : 'Not connected'}
                </strong>
                <span>Local connection preview</span>
              </div>
            </div>

            {selectedDoctor.education && (
              <section className="doctor-profile-detail">
                <h3>Education</h3>
                <p>{selectedDoctor.education}</p>
              </section>
            )}

            {selectedDoctor.clinic && (
              <section className="doctor-profile-detail">
                <h3>Clinic</h3>
                <p>{selectedDoctor.clinic}</p>
              </section>
            )}

            <section className="doctor-profile-detail">
              <h3>About</h3>
              <p>{selectedDoctor.about}</p>
            </section>

            <section className="doctor-profile-detail">
              <h3>Areas of interest</h3>
              <div className="doctor-interest-list">
                {selectedDoctor.interests.map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            </section>

            <section className="doctor-profile-detail">
              <h3>Profile status</h3>
              <p>
                Professional identity and verification status are not confirmed
                unless a trusted verification service supplies that information.
              </p>
            </section>

            <div className="doctor-profile-actions">
              <button
                type="button"
                className={`doctor-connect-button ${
                  connections[selectedDoctor.id] ? 'is-connected' : ''
                }`}
                onClick={() => toggleConnection(selectedDoctor.id)}
                aria-pressed={Boolean(connections[selectedDoctor.id])}
              >
                {connections[selectedDoctor.id] ? (
                  <UserCheck size={16} aria-hidden="true" />
                ) : (
                  <UserPlus size={16} aria-hidden="true" />
                )}
                {connections[selectedDoctor.id] ? 'Connected' : 'Connect'}
              </button>

              <button
                type="button"
                className="doctor-message-button"
                onClick={() => openDoctorMessage(selectedDoctor.id)}
                title={`Message ${selectedDoctor.name}`}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Message
              </button>
            </div>

            <p className="doctor-profile-disclaimer">
              Profile-picture changes and connection status are local previews.
              They are not saved to a server by this component.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}