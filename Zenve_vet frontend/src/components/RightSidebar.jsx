import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchIcon } from './Icons';
import DoctorProfileModal from './DoctorProfileModal';
import { VETERINARIANS } from '../data/veterinarians';
import { DOCTORS_DATABASE } from '../data/doctorsData';
import '../csscomponents/RightSidebar.css';

// Base unified member directory with complete profiles
const BASE_DOCTORS = [
  {
    id: 'arun',
    name: 'Dr. Arun Mehta',
    specialty: 'Veterinary Surgery',
    location: 'Mumbai, Maharashtra',
    clinic: 'Apex Veterinary Multi-Specialty & Trauma Hospital',
    education: 'BVSc & AH, MVSc (Surgery & Radiology)',
    experience: '12+ years clinical experience',
    casesHandled: '850+ surgeries',
    followers: '2.4k',
    rating: '4.9 ★',
    about:
      'Senior Veterinary Surgeon specializing in minimally invasive soft-tissue surgery, complex trauma reconstruction, and orthopedic stabilization. Dedicated to advancing surgical excellence and mentoring junior veterinary residents.',
    focusAreas: [
      'Orthopedic Surgery',
      'Soft Tissue Procedures',
      'Trauma Management',
      'Laparoscopy',
      'Joint Reconstruction',
    ],
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'priya',
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    location: 'Kochi, Kerala',
    clinic: 'Coastal Veterinary Specialty & Allergy Clinic',
    education: 'BVSc & AH, MVSc (Dermatology)',
    experience: '9+ years clinical experience',
    casesHandled: '620+ patients',
    followers: '1.9k',
    rating: '4.9 ★',
    about:
      'Specialist in canine and feline dermatology, environmental allergies, and autoimmune skin conditions. Pioneer in sublingual allergen-specific immunotherapy (SLIT) protocols for companion animals.',
    focusAreas: [
      'Dermatopathology',
      'Allergy Immunotherapy',
      'Cytology & Biopsy',
      'Autoimmune Skin Disease',
      'Ear Canal Diagnostics',
    ],
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'vikram',
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Medicine',
    location: 'Jaipur, Rajasthan',
    clinic: 'Rajputana Equine Hospital & Stud Health Care',
    education: 'BVSc & AH, MVSc (Equine Medicine)',
    experience: '15+ years clinical experience',
    casesHandled: '1,100+ horses',
    followers: '3.1k',
    rating: '5.0 ★',
    about:
      'Internationally recognized equine clinician focusing on sports horse sports medicine, gait kinematics, soundness evaluations, and equine emergency critical care.',
    focusAreas: [
      'Equine Sports Medicine',
      'Lameness Diagnostics',
      'Colic Critical Care',
      'Equine Ultrasonography',
      'Stud Herd Management',
    ],
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'aarthi',
    name: 'Dr. Aarthi Raman',
    specialty: 'Orthopedic Surgery & Cardiology',
    location: 'Bengaluru, Karnataka',
    clinic: 'Bengaluru Pet Orthopedics & Trauma Centre',
    education: 'BVSc & AH, MVSc (Orthopedic Surgery)',
    experience: '11+ years clinical experience',
    casesHandled: '920+ surgeries',
    followers: '2.1k',
    rating: '4.9 ★',
    about:
      'Chief Veterinary Orthopedic Surgeon specializing in TPLO knee stabilization, complex fracture plating, angular limb deformity correction, and post-operative joint rehabilitation.',
    focusAreas: [
      'TPLO Knee Stabilization',
      'Joint Reconstruction',
      'Fracture Internal Fixation',
      'Arthroscopy',
      'Physical Rehabilitation',
    ],
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'sweet_heart',
    name: 'Dr. Sneha Kapoor',
    specialty: 'Animal Rehabilitation & Physiotherapy',
    location: 'Delhi NCR, India',
    clinic: 'Paws in Motion Rehabilitation & Hydrotherapy Center',
    education: 'BVSc & AH, CCRT',
    experience: '7+ years clinical experience',
    casesHandled: '580+ cases',
    followers: '3.4k',
    rating: '5.0 ★',
    about:
      'Certified veterinary rehabilitation therapist specializing in hydrotherapy, canine physical therapy, neurological patient re-education, and aquatic fitness for companion animals.',
    focusAreas: [
      'Hydrotherapy Pool Work',
      'Spinal Rehabilitation',
      'Joint Mobility Exercises',
      'Post-Op Physical Therapy',
      'Geriatric Canine Wellness',
    ],
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'nidhi',
    name: 'Dr. Nidhi Sharma',
    specialty: 'Small Animal Medicine',
    location: 'Hyderabad, Telangana',
    clinic: 'CarePet Multispecialty Animal Hospital',
    education: 'BVSc & AH, MVSc (Internal Medicine)',
    experience: '8+ years clinical experience',
    casesHandled: '740+ patients',
    followers: '2.2k',
    rating: '4.9 ★',
    about:
      'Internal medicine clinician dedicated to pediatric veterinary medicine, preventative diagnostics, canine cardiology, and feline chronic kidney disease management.',
    focusAreas: [
      'Pediatric Wellness',
      'Canine Cardiology',
      'Kidney Management',
      'Routine Vaccinations',
      'Ultrasound Diagnostics',
    ],
    img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'karthika',
    name: 'Dr. Karthika Iyer',
    specialty: 'Avian & Exotic Care',
    location: 'Bengaluru, Karnataka',
    clinic: 'Wings & Wild Exotic Pet Sanctuary',
    education: 'BVSc & AH, MVSc (Avian Medicine)',
    experience: '10+ years clinical experience',
    casesHandled: '820+ exotic patients',
    followers: '2.6k',
    rating: '4.9 ★',
    about:
      'Avian & exotic animal practitioner specializing in psittacine nutrition, beak conditioning, feather disorders, and reptile wellness management.',
    focusAreas: [
      'Avian Medicine',
      'Exotic Wildlife',
      'Beak Conditioning',
      'Reptile Care',
      'Psittacine Nutrition',
    ],
    img: '/images/doctors/karthika.jpg',
  },
  {
    id: 'sanjay',
    name: 'Dr. Sanjay Patel',
    specialty: 'Equine Specialist',
    location: 'Jaipur, Rajasthan',
    clinic: 'Rajputana Equine Hospital & Stud Health Care',
    education: 'BVSc & AH, MVSc (Equine Surgery)',
    experience: '15+ years clinical experience',
    casesHandled: '1,100+ horses',
    followers: '3.1k',
    rating: '5.0 ★',
    about:
      'Equine soundness evaluation specialist focusing on sports horse sports medicine, gait kinematics, soundness evaluations, and equine emergency critical care.',
    focusAreas: [
      'Equine Sports Medicine',
      'Lameness Diagnostics',
      'Gait Kinematics',
      'Colic Critical Care',
    ],
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&h=120&q=80',
  },
];

export const RightSidebar = ({ onOpenCreateProfile, onSelectTab }) => {
  const [followingMap, setFollowingMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zenve_following_doctors');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [connectToast, setConnectToast] = useState(null);
  const searchInputRef = useRef(null);

  // Combine user custom profiles, base doctors, and unified veterinarians into all members
  const allDoctors = useMemo(() => {
    let customVets = [];
    try {
      const stored = localStorage.getItem('zenve_custom_vets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) customVets = parsed;
      }
    } catch {
      customVets = [];
    }

    const combined = [...customVets, ...BASE_DOCTORS];

    // Merge in any other doctors from VETERINARIANS that aren't represented
    if (Array.isArray(VETERINARIANS)) {
      VETERINARIANS.forEach((vet) => {
        const alreadyExists = combined.some(
          (d) =>
            d.id === vet.id ||
            d.name?.toLowerCase().trim() === vet.name?.toLowerCase().trim()
        );
        if (!alreadyExists) {
          combined.push({
            id: vet.id,
            name: vet.name,
            specialty: vet.specialty,
            location: vet.location,
            clinic: vet.clinic,
            education: vet.degrees || vet.education,
            experience: vet.experience,
            casesHandled: vet.casesHandled,
            followers: vet.followers,
            rating: vet.rating,
            about: vet.about || vet.description,
            focusAreas: vet.focusAreas || [],
            img: vet.img,
          });
        }
      });
    }

    // Deduplicate by unique id
    const seen = new Set();
    return combined.filter((doc) => {
      const key = doc.id || doc.name;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  // Focus input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // When search is closed, show the top 3 members.
  // When search is open, search across ALL members in the system!
  const filteredDoctors = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();

    if (!isSearchOpen && !trimmed) {
      // Standard closed view: top 3 featured members
      return allDoctors.slice(0, 3);
    }

    if (!trimmed) {
      // Search is open, but query is empty: show all members
      return allDoctors;
    }

    return allDoctors.filter((doc) => {
      const name = (doc.name || '').toLowerCase();
      const specialty = (doc.specialty || '').toLowerCase();
      const location = (doc.location || '').toLowerCase();
      const clinic = (doc.clinic || '').toLowerCase();
      const about = (doc.about || '').toLowerCase();
      const focusAreas = Array.isArray(doc.focusAreas)
        ? doc.focusAreas.join(' ').toLowerCase()
        : '';

      return (
        name.includes(trimmed) ||
        specialty.includes(trimmed) ||
        location.includes(trimmed) ||
        clinic.includes(trimmed) ||
        about.includes(trimmed) ||
        focusAreas.includes(trimmed)
      );
    });
  }, [allDoctors, isSearchOpen, searchQuery]);

  const toggleFollow = (id) => {
    setFollowingMap((prev) => {
      const willFollow = !prev[id];
      const next = { ...prev, [id]: willFollow };
      try {
        localStorage.setItem('zenve_following_doctors', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save doctor following state to localStorage:', err);
      }
      const doc = allDoctors.find((d) => d.id === id);
      if (willFollow && doc) {
        setConnectToast(`Connected with ${doc.name}!`);
        setTimeout(() => setConnectToast(null), 3000);
      }
      return next;
    });
  };

  const handleConnectClick = (e, doctor) => {
    e.stopPropagation();
    setFollowingMap((prev) => {
      const willFollow = !prev[doctor.id];
      const next = { ...prev, [doctor.id]: willFollow };
      try {
        localStorage.setItem('zenve_following_doctors', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save doctor following state to localStorage:', err);
      }
      if (willFollow) {
        setConnectToast(`Connected with ${doctor.name}! Viewing profile...`);
        setTimeout(() => setConnectToast(null), 3000);
      }
      return next;
    });
    // Open doctor details modal
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleOpenDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        setSearchQuery('');
      }
      return next;
    });
  };



  return (
    <aside className="zenve-right-sidebar" aria-label="People to know">
      {/* 1. People to Know */}
      <section className="zenve-aside-block">
        <div className="zenve-aside-header">
          <span className="zenve-aside-tag">PEOPLE TO KNOW</span>
          <div className="zenve-aside-header-actions">
            <button
              type="button"
              className={`zenve-aside-search-toggle ${isSearchOpen ? 'zenve-search-toggle-active' : ''}`}
              onClick={handleToggleSearch}
              title={isSearchOpen ? 'Close search' : 'Search all members'}
              aria-label="Search all members"
            >
              <SearchIcon size={13} color="currentColor" />
            </button>
            <a
              href="#view-all"
              className="zenve-aside-link"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectTab) onSelectTab('search');
              }}
            >
              <span>View all</span>
              <span className="zenve-aside-link-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Real-time search box when toggled */}
        {isSearchOpen && (
          <div className="zenve-people-search-box">
            <SearchIcon size={13} color="#7c8a83" />
            <input
              ref={searchInputRef}
              type="text"
              className="zenve-people-search-input"
              placeholder="Search all members by name, city or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="zenve-people-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Search status summary if search is open */}
        {isSearchOpen && (
          <div className="zenve-search-status-bar">
            <span>
              {searchQuery.trim()
                ? `Found ${filteredDoctors.length} ${
                    filteredDoctors.length === 1 ? 'member' : 'members'
                  }`
                : `All members (${allDoctors.length})`}
            </span>
            {searchQuery.trim() && (
              <button
                type="button"
                className="zenve-search-status-reset"
                onClick={() => setSearchQuery('')}
              >
                Show all
              </button>
            )}
          </div>
        )}

        <div className={`zenve-doctor-list ${isSearchOpen ? 'zenve-doctor-list-scrollable' : ''}`}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const isFollowing = !!followingMap[doctor.id];
              return (
                <div
                  key={doctor.id}
                  className="zenve-doctor-card"
                  onClick={() => handleOpenDoctorDetails(doctor)}
                  title={`View details of ${doctor.name}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenDoctorDetails(doctor);
                  }}
                >
                  <div className="zenve-doctor-avatar-wrapper">
                    {doctor.img ? (
                      <img
                        src={doctor.img}
                        alt={doctor.name}
                        className="zenve-doctor-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="zenve-doctor-avatar-fallback">
                        {doctor.name?.slice(0, 2)?.toUpperCase() || 'DR'}
                      </div>
                    )}
                  </div>

                  <div className="zenve-doctor-info">
                    <h3 className="zenve-doctor-name">{doctor.name}</h3>
                    <p className="zenve-doctor-specialty">{doctor.specialty}</p>
                    <span className="zenve-doctor-location">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{doctor.location}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`zenve-doctor-follow-btn ${isFollowing ? 'zenve-doctor-following' : ''}`}
                    onClick={(e) => handleConnectClick(e, doctor)}
                    title={isFollowing ? 'Connected • Click to view details' : 'Click to connect & view doctor details'}
                    aria-label={`Connect with ${doctor.name}`}
                  >
                    {isFollowing ? '✓' : '+'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="zenve-doctor-no-results">
              <p>No members found matching "{searchQuery}"</p>
              <button
                type="button"
                className="zenve-search-view-all-btn"
                onClick={() => onSelectTab && onSelectTab('search')}
              >
                Search in Vet Network ↗
              </button>
            </div>
          )}
        </div>
      </section>



      {/* 3. Doctor Details Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        isFollowing={selectedDoctor ? !!followingMap[selectedDoctor.id] : false}
        onToggleFollow={toggleFollow}
      />

      {/* 4. Connect Toast Notification */}
      {connectToast && (
        <div className="zenve-connect-toast">
          <span className="zenve-toast-icon">✓</span>
          <span>{connectToast}</span>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
