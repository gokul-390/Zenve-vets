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
} from 'lucide-react';

import { VETERINARIANS } from '../data/veterinarians';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import '../csscomponents/SearchPage.css';

const STORAGE_KEYS = {
posts: 'zenve_community_posts',
stories: 'zenve_user_stories',
cases: 'zenve_clinical_cases',
};

const CONTENT_UPDATED_EVENT = 'zenve:community-content-updated';

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

const CONTENT_FILTERS = ['All', 'Cases', 'Stories', 'Videos'];

function readStoredArray(key) {
try {
if (typeof window === 'undefined') return [];

const raw = window.localStorage.getItem(key);
if (!raw) return [];

const parsed = JSON.parse(raw);
return Array.isArray(parsed) ? parsed : [];

} catch (error) {
console.warn("Unable to read ${key} from localStorage.", error);
return [];
}
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

if (typeof value === 'number') return "${value} years";

return asText(value, 'Not specified');
}

function normalizeDoctor(doctor, index) {
const name = asText(doctor?.name, 'Veterinary professional');

const specialty = asText(
doctor?.specialty,
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
id: asText(doctor?.id, "veterinarian-${index}"),
name,
specialty,
city,
initials: getInitials(name),
color: AVATAR_COLORS[index % AVATAR_COLORS.length],
image: asText(doctor?.img),
verified: false,
takeaway: focusAreas.length > 0,
experience: getDoctorExperience(doctor),
about: asText(
doctor?.about,
asText(doctor?.description, 'Veterinary professional profile.')
),
interests,
education: asText(doctor?.degrees || doctor?.education),
clinic: asText(doctor?.clinic),
rating: doctor?.rating,
casesHandled: doctor?.casesHandled,
followers: doctor?.followers,
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

function getDoctorProfileContent() {
const posts = [];
const videos = [];

getStoredDoctorContent().forEach((doctor, doctorIndex) => {
const author = asText(doctor.name, 'Veterinary professional');
const authorId = asText(doctor.id, "profile-${doctorIndex}");

asArray(doctor.posts).forEach((post, postIndex) => {
  const title = asText(
    post?.title || post?.caption || post?.description || post?.content,
    'Veterinary community post'
  );

  posts.push({
    id: asText(post?.id, `${authorId}-post-${postIndex}`),
    type: 'Stories',
    title,
    description: asText(
      post?.description || post?.caption || post?.content,
      title
    ),
    author,
    time: asText(post?.timeAgo || post?.createdAt, 'Profile post'),
    image: asText(post?.imageUrl || post?.mediaUrl || post?.image),
    searchText: `${title} ${author} ${asText(post?.tags)}`,
  });
});

asArray(doctor.videos).forEach((video, videoIndex) => {
  const title = asText(
    video?.title || video?.caption || video?.description,
    'Veterinary educational video'
  );

  videos.push({
    id: asText(video?.id, `${authorId}-video-${videoIndex}`),
    type: 'Videos',
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
"Clinical case ${index + 1}"
);

const details = [
asText(item?.description),
item?.species ? "Species: ${asText(item.species)}" : '',
item?.breed ? "Breed: ${asText(item.breed)}" : '',
item?.diagnosis ? "Diagnosis: ${asText(item.diagnosis)}" : '',
item?.treatment ? "Treatment: ${asText(item.treatment)}" : '',
item?.status ? "Status: ${asText(item.status)}" : '',
].filter(Boolean);

return {
id: asText(item?.id, "case-${index}"),
type: 'Cases',
title,
description: details.join(' · ') || 'Clinical case record.',
author: asText(item?.assignedDoctorName, 'Clinical case record'),
time: asText(item?.date || item?.createdAt, 'Clinical case'),
searchText: [
title,
item?.caseNumber,
item?.species,
item?.breed,
item?.description,
item?.diagnosis,
item?.treatment,
item?.notes,
item?.status,
item?.priority,
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
id: asText(item?.id, "post-${index}"),
type: isVideo ? 'Videos' : 'Stories',
title,
description: asText(
item?.description || item?.caption || item?.content,
title
),
author: asText(item?.authorName || item?.name, 'Community member'),
time: asText(item?.timeAgo || item?.createdAt, 'Community post'),
image: asText(item?.mediaUrl || item?.imageUrl || item?.image),
videoUrl: asText(item?.videoUrl),
searchText: [
title,
item?.authorName,
item?.authorSpecialty,
item?.caption,
item?.description,
asArray(item?.tags).join(' '),
]
.map((value) => asText(value))
.join(' '),
};
}

function normalizeStory(item, index) {
const title = asText(
item?.title || item?.caption || item?.name || item?.authorName,
"Community story ${index + 1}"
);

return {
id: asText(item?.id, "story-${index}"),
type: 'Stories',
title,
description: asText(
item?.description || item?.caption,
'A story shared by the veterinary community.'
),
author: asText(item?.authorName || item?.name, 'Community member'),
time: asText(
item?.timeAgo || item?.createdAt || item?.time,
'Community story'
),
image: asText(
item?.mediaUrl || item?.imageUrl || item?.image || item?.storyMedia
),
searchText: [
title,
item?.authorName,
item?.name,
item?.caption,
item?.description,
]
.map((value) => asText(value))
.join(' '),
};
}

function getDiscoveryContent() {
const storedPosts = readStoredArray(STORAGE_KEYS.posts);
const storedStories = readStoredArray(STORAGE_KEYS.stories);
const storedCases = readStoredArray(STORAGE_KEYS.cases);
const profileContent = getDoctorProfileContent();

const posts = storedPosts.map(normalizePost);
const stories = storedStories.map(normalizeStory);
const cases = storedCases.map(normalizeCase);

const fallbackStories = storedPosts.length ? [] : profileContent.posts;
const fallbackVideos = storedPosts.length ? [] : profileContent.videos;

const feedVideos = posts.filter((item) => item.type === 'Videos');
const feedStories = posts.filter((item) => item.type === 'Stories');

return [
...cases,
...stories,
...feedStories,
...feedVideos,
...fallbackStories,
...fallbackVideos,
];
}

function getContentIcon(type) {
if (type === 'Cases') return FileText;
if (type === 'Videos') return PlayCircle;
return Heart;
}

function DiscoveryCard({ item }) {
const ItemIcon = getContentIcon(item.type);

return (
<article className="discovery-card">
<div className="discovery-card-top">
<span className="discovery-card-icon">
<ItemIcon size={21} aria-hidden="true" />
</span>
<span className="discovery-tag">{item.type}</span>
</div>

  <h3>{item.title}</h3>
  <p>{item.description}</p>

  {item.image && (
    <div className="discovery-card-media">
      <img src={item.image} alt="" loading="lazy" />
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
const [discoveryFilter, setDiscoveryFilter] = useState('All');
const [sortBy, setSortBy] = useState('relevant');
const [contentVersion, setContentVersion] = useState(0);

const photoInputRef = useRef(null);

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
window.addEventListener('focus', refreshContent);

return () => {
  window.removeEventListener('storage', handleStorage);
  window.removeEventListener(CONTENT_UPDATED_EVENT, refreshContent);
  window.removeEventListener('focus', refreshContent);
};

}, []);

const doctors = useMemo(() => getDoctorDirectory(), []);

const discoveryItems = useMemo(
() => getDiscoveryContent(),
[contentVersion]
);

const cities = useMemo(() => {
const values = doctors
.map((doctor) => doctor.city)
.filter((value) => value && value !== 'Location not specified');

const uniqueCities = [...new Set(values)].sort((a, b) =>
  a.localeCompare(b)
);

return ['All states', ...uniqueCities];

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
  const matchesFilter =
    discoveryFilter === 'All' || item.type === discoveryFilter;

  const searchableContent = [
    item.title,
    item.description,
    item.author,
    item.type,
    item.searchText || '',
  ]
    .join(' ')
    .toLowerCase();

  const matchesSearch =
    !normalizedQuery || searchableContent.includes(normalizedQuery);

  const matchesTab =
    tab === 'All' ||
    tab === 'Doctors' ||
    (tab === 'Cases' && item.type === 'Cases') ||
    (tab === 'Stories & videos' &&
      ['Stories', 'Videos'].includes(item.type));

  return matchesFilter && matchesSearch && matchesTab;
});

}, [discoveryItems, discoveryFilter, query, tab]);

const contentCounts = useMemo(() => {
const caseCount = discoveryItems.filter(
(item) => item.type === 'Cases'
).length;

const storiesAndVideosCount = discoveryItems.filter((item) =>
  ['Stories', 'Videos'].includes(item.type)
).length;

return {
  all: doctors.length + discoveryItems.length,
  doctors: doctors.length,
  cases: caseCount,
  storiesAndVideos: storiesAndVideosCount,
};

}, [doctors, discoveryItems]);

const tabs = [
{ label: 'All', count: contentCounts.all, icon: LayoutGrid },
{ label: 'Doctors', count: contentCounts.doctors, icon: Stethoscope },
{ label: 'Cases', count: contentCounts.cases, icon: FileText },
{
label: 'Stories & videos',
count: contentCounts.storiesAndVideos,
icon: PlayCircle,
},
];

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
setDiscoveryFilter('All');
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
<h1>Find people, cases & answers.</h1>
<p>
Explore veterinary professionals, exchange knowledge, and discover
stories and clinical insights from the community.
</p>
</header>

  <div className="search-controls">
    <label className="search-input-wrap">
      <Search size={19} aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search doctors, specialties, cases..."
        aria-label="Search people, cases and answers"
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
  </div>

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
          onClick={() => {
            setTab(item.label);
            setDiscoveryFilter('All');
          }}
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
          <span className="search-results-eyebrow">YOUR DIRECTORY</span>
          <h2>Professionals to explore</h2>
          <p>
            Profiles are loaded from the existing veterinarian data.
            Verification must come from a trusted backend source.
          </p>
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
                      SAMPLE DATA · NOT VERIFIED
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
          <span className="search-results-eyebrow">KEEP EXPLORING</span>
          <h2>
            {tab === 'Cases'
              ? 'Clinical cases'
              : tab === 'Stories & videos'
                ? 'Stories & videos'
                : 'Clinical cases, stories & videos'}
          </h2>
          <p>
            Search the clinical cases and community content available on
            this device.
          </p>
        </div>

        <span className="search-result-count">
          {visibleDiscoveryItems.length}{' '}
          {visibleDiscoveryItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div
        className="discovery-filter-row"
        aria-label="Filter discovery content"
      >
        {CONTENT_FILTERS.map((item) => (
          <button
            type="button"
            key={item}
            className={discoveryFilter === item ? 'active' : ''}
            aria-pressed={discoveryFilter === item}
            onClick={() => setDiscoveryFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleDiscoveryItems.length > 0 ? (
        <div className="discovery-grid">
          {visibleDiscoveryItems.map((item) => (
            <DiscoveryCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <span className="search-empty-icon">
            <Search size={24} aria-hidden="true" />
          </span>
          <h3>No matching content found</h3>
          <p>
            Try another search term or select another content category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDiscoveryFilter('All');
            }}
          >
            Show all content
          </button>
        </div>
      )}

      <div className="search-discovery-note">
        <Eye size={16} aria-hidden="true" />
        <p>
          Search reads locally stored posts, stories, and clinical cases.
          Content not saved on this device, including backend-only content,
          will not appear until it is connected to the data source.
        </p>
      </div>
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
                src={
                  profilePhotos[selectedDoctor.id] || selectedDoctor.image
                }
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
              {connections[selectedDoctor.id]
                ? 'Connected'
                : 'Not connected'}
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
            These profiles come from local project data. Professional
            identity and verification status have not been confirmed by a
            live verification service.
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
          Profile-picture changes are a local preview and are not uploaded
          to a server. Connection status is also local until the backend
          connection feature is implemented.
        </p>
      </section>
    </div>
  )}
</section>

);
}