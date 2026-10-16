import React, { useMemo, useRef, useState } from 'react';
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
  ArrowUpRight,
  PlayCircle,
  FileText,
  Heart,
  Eye,
  Clock3,
  PawPrint,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

import '../csscomponents/SearchPage.css';

const doctors = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    specialty: 'Small Animal Medicine',
    city: 'Bengaluru',
    initials: 'AS',
    color: '#DCE9E0',
    verified: false,
    takeaway: true,
    experience: '6 years',
    about:
      'Interested in preventive care, small animal medicine, and practical approaches to improving animal wellbeing.',
    interests: ['Small Animal Care', 'Preventive Medicine', 'Pet Wellness'],
  },
  {
    id: 2,
    name: 'Dr. Arjun Mehta',
    specialty: 'Veterinary Surgery',
    city: 'Mumbai',
    initials: 'AM',
    color: '#E9DFD1',
    verified: false,
    takeaway: true,
    experience: '8 years',
    about:
      'Focused on veterinary surgical practice, case discussions, and sharing practical clinical knowledge.',
    interests: ['Veterinary Surgery', 'Clinical Cases', 'Patient Care'],
  },
  {
    id: 3,
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    city: 'Kochi',
    initials: 'PN',
    color: '#E6DFEC',
    verified: false,
    takeaway: false,
    experience: '5 years',
    about:
      'Interested in veterinary dermatology, skin health, and evidence-informed approaches to animal care.',
    interests: ['Dermatology', 'Skin Health', 'Small Animal Care'],
  },
  {
    id: 4,
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Medicine',
    city: 'Jaipur',
    initials: 'VS',
    color: '#DCE5EF',
    verified: false,
    takeaway: true,
    experience: '7 years',
    about:
      'Interested in equine health, lameness assessment, and sharing knowledge with veterinary professionals.',
    interests: ['Equine Medicine', 'Lameness', 'Animal Welfare'],
  },
];

const specialties = [
  'Dermatology',
  'Surgery',
  'Livestock',
  'Equine',
  'Imaging',
  'Nutrition',
  'Wildlife',
  'Preventive',
];

const discoveryItems = [
  {
    id: 'case-1',
    type: 'Cases',
    title: 'A closer look at clinical case discussions',
    description:
      'Review how structured case notes can help veterinary teams discuss symptoms, findings, and next steps.',
    author: 'Clinical Learning',
    icon: FileText,
    time: 'Case discussion',
  },
  {
    id: 'story-1',
    type: 'Stories',
    title: 'Everyday moments in veterinary practice',
    description:
      'A space for professionals to share practice experiences, milestones, and lessons learned.',
    author: 'Community Stories',
    icon: Heart,
    time: 'Community story',
  },
  {
    id: 'video-1',
    type: 'Videos',
    title: 'Learn through short clinical demonstrations',
    description:
      'Discover a dedicated space for demonstrations, learning clips, and educational videos.',
    author: 'Video Learning',
    icon: PlayCircle,
    time: 'Video collection',
  },
  {
    id: 'case-2',
    type: 'Cases',
    title: 'From observations to useful case notes',
    description:
      'Organize clinical observations and questions before discussing a case with colleagues.',
    author: 'Clinical Learning',
    icon: Stethoscope,
    time: 'Case discussion',
  },
];

const tabs = [
  { label: 'All', count: 124, icon: LayoutGrid },
  { label: 'Doctors', count: 86, icon: Stethoscope },
  { label: 'Cases', count: 18, icon: FileText },
  { label: 'Stories & videos', count: 20, icon: PlayCircle },
];

function DiscoveryCard({ item }) {
  const ItemIcon = item.icon;

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

  const photoInputRef = useRef(null);

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = doctors.filter((doctor) => {
      const searchableText =
        `${doctor.name} ${doctor.specialty} ${doctor.city} ${doctor.about} ${doctor.interests.join(' ')}`.toLowerCase();

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
      results.sort(
        (a, b) =>
          parseInt(b.experience, 10) - parseInt(a.experience, 10)
      );
    }

    return results;
  }, [query, city, specialty, verifiedOnly, takeawaysOnly, sortBy]);

  const visibleDoctors =
    tab === 'All' || tab === 'Doctors' ? filteredDoctors : [];

  const visibleDiscoveryItems = useMemo(() => {
    return discoveryItems.filter((item) => {
      const matchesFilter =
        discoveryFilter === 'All' || item.type === discoveryFilter;

      const matchesSearch =
        !query.trim() ||
        `${item.title} ${item.description} ${item.author} ${item.type}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      const matchesTab =
        tab === 'All' ||
        tab === 'Doctors' ||
        (tab === 'Cases' && item.type === 'Cases') ||
        (tab === 'Stories & videos' &&
          ['Stories', 'Videos'].includes(item.type));

      return matchesFilter && matchesSearch && matchesTab;
    });
  }, [discoveryFilter, query, tab]);

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
      {/* Page heading */}
      <header className="search-heading">
        <span className="search-eyebrow">DISCOVER THE COMMUNITY</span>
        <h1>Find people, cases &amp; answers.</h1>
        <p>
          Explore veterinary professionals, exchange knowledge, and discover
          stories and clinical insights from the community.
        </p>
      </header>

      {/* Search and location */}
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
            <option>All states</option>
            <option>Bengaluru</option>
            <option>Mumbai</option>
            <option>Kochi</option>
            <option>Jaipur</option>
          </select>
        </label>
      </div>

      {/* Specialty chips */}
      <div className="search-filter-section">
        <span className="search-filter-label">Explore specialties</span>

        <div className="search-specialties" aria-label="Specialty filters">
          {specialties.map((item) => (
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

      {/* Verification filters */}
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

      {/* Category navigation */}
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

      {/* Doctor directory */}
      {(tab === 'All' || tab === 'Doctors') && (
        <section className="search-results-section">
          <div className="search-results-heading">
            <div>
              <span className="search-results-eyebrow">YOUR DIRECTORY</span>
              <h2>Professionals to explore</h2>
              <p>
                Discover peers by specialty and location. Sample profiles are
                clearly identified.
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
                  const photo = profilePhotos[doctor.id];

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
                          SAMPLE PROFILE · NOT VERIFIED
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
                              onClick={() =>
                                window.alert(
                                  'Messaging will be connected to the backend API.'
                                )
                              }
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

      {/* Clinical cases and stories/videos */}
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
                Explore learning topics and community content.
              </p>
            </div>

            <span className="search-result-count">
              {visibleDiscoveryItems.length}{' '}
              {visibleDiscoveryItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="discovery-filter-row" aria-label="Filter discovery content">
            {['All', 'Cases', 'Stories', 'Videos'].map((item) => (
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
                <DiscoveryCard key={item.id} item={item} />
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
              These are sample clinical cases, stories, and videos. Live
              community content can be connected when the relevant backend
              APIs are available.
            </p>
          </div>
        </section>
      )}

      {/* Doctor profile modal */}
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
                {profilePhotos[selectedDoctor.id] ? (
                  <img
                    src={profilePhotos[selectedDoctor.id]}
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
                <span>Experience (sample)</span>
              </div>
              <div>
                <strong>
                  {connections[selectedDoctor.id]
                    ? 'Connected'
                    : 'Not connected'}
                </strong>
                <span>Connection status</span>
              </div>
            </div>

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
                This is a sample community profile, not a verified real-world
                professional record.
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
                  <UserCheck size={16} />
                ) : (
                  <UserPlus size={16} />
                )}
                {connections[selectedDoctor.id] ? 'Connected' : 'Connect'}
              </button>

              <button
                type="button"
                className="doctor-message-button"
                onClick={() =>
                  window.alert(
                    'Messaging will be connected to the backend API.'
                  )
                }
              >
                <MessageCircle size={16} />
                Message
              </button>
            </div>

            <p className="doctor-profile-disclaimer">
              Profile-picture changes are a local preview and are not uploaded
              to a server. Sample profile details should be replaced with
              verified backend data.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}