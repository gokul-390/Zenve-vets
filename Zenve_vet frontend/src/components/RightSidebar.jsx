import React, { useState } from 'react';
import { SearchIcon } from './Icons';
import DoctorProfileModal from './DoctorProfileModal';
import '../csscomponents/RightSidebar.css';

export const RightSidebar = ({ onOpenCreateProfile, onSelectTab }) => {
  const [followingMap, setFollowingMap] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [connectToast, setConnectToast] = useState(null);

  const doctors = [
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
      about: 'Senior Veterinary Surgeon specializing in minimally invasive soft-tissue surgery, complex trauma reconstruction, and orthopedic stabilization. Dedicated to advancing surgical excellence and mentoring junior veterinary residents.',
      focusAreas: ['Orthopedic Surgery', 'Soft Tissue Procedures', 'Trauma Management', 'Laparoscopy', 'Joint Reconstruction'],
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
      about: 'Specialist in canine and feline dermatology, environmental allergies, and autoimmune skin conditions. Pioneer in sublingual allergen-specific immunotherapy (SLIT) protocols for companion animals.',
      focusAreas: ['Dermatopathology', 'Allergy Immunotherapy', 'Cytology & Biopsy', 'Autoimmune Skin Disease', 'Ear Canal Diagnostics'],
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
      about: 'Internationally recognized equine clinician focusing on sports horse sports medicine, gait kinematics, soundness evaluations, and equine emergency critical care.',
      focusAreas: ['Equine Sports Medicine', 'Lameness Diagnostics', 'Colic Critical Care', 'Equine Ultrasonography', 'Stud Herd Management'],
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ];

  const advantages = [
    {
      id: 'page',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B38F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: 'Your own professional page',
      description: 'A place for your work, your voice, your professional identity.',
    },
    {
      id: 'network',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B38F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <circle cx="18" cy="11" r="3" />
          <path d="M18 17a3 3 0 0 1 3 3v1" />
        </svg>
      ),
      title: 'Meaningful connections',
      description: 'Discover peers beyond your clinic and your city.',
    },
    {
      id: 'growth',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B38F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
      title: 'Grow with possibility',
      description: 'Mentorship, research and innovation pathways.',
    },
  ];

  const toggleFollow = (id) => {
    setFollowingMap((prev) => {
      const willFollow = !prev[id];
      const doc = doctors.find((d) => d.id === id);
      if (willFollow && doc) {
        setConnectToast(`Connected with ${doc.name}!`);
        setTimeout(() => setConnectToast(null), 3000);
      }
      return { ...prev, [id]: willFollow };
    });
  };

  const handleConnectClick = (e, doctor) => {
    e.stopPropagation();
    setFollowingMap((prev) => {
      const willFollow = !prev[doctor.id];
      if (willFollow) {
        setConnectToast(`Connected with ${doctor.name}! Viewing profile...`);
        setTimeout(() => setConnectToast(null), 3000);
      }
      return { ...prev, [doctor.id]: willFollow };
    });
    // Open doctor details modal
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleOpenDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.location.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="zenve-right-sidebar" aria-label="People to know and advantages">
      {/* 1. People to Know */}
      <section className="zenve-aside-block">
        <div className="zenve-aside-header">
          <span className="zenve-aside-tag">PEOPLE TO KNOW</span>
          <div className="zenve-aside-header-actions">
            <button
              type="button"
              className={`zenve-aside-search-toggle ${isSearchOpen ? 'zenve-search-toggle-active' : ''}`}
              onClick={() => setIsSearchOpen((prev) => !prev)}
              title={isSearchOpen ? 'Close search' : 'Search people'}
              aria-label="Search people"
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
              type="text"
              className="zenve-people-search-input"
              placeholder="Search by name, city or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
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

        <div className="zenve-doctor-list">
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
                    <img
                      src={doctor.img}
                      alt={doctor.name}
                      className="zenve-doctor-avatar-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
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
            <p style={{ fontSize: '12px', color: '#7a8882', padding: '10px 0', margin: 0 }}>
              No doctors found matching "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* 2. Doctor Details Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        isFollowing={selectedDoctor ? !!followingMap[selectedDoctor.id] : false}
        onToggleFollow={toggleFollow}
      />

      {/* 3. Connect Toast Notification */}
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
