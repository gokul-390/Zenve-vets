import React, { useMemo, useState } from 'react';
import {
  Search, MapPin, Stethoscope, ShieldCheck,
  MessageCircle, CheckCircle2
} from 'lucide-react';
import '../csscomponents/SearchPage.css';

const doctors = [
  {
    name: 'Dr. Ananya Sharma',
    specialty: 'Small Animal Medicine',
    city: 'Bengaluru',
    initials: 'AS',
    color: '#DCE9E0',
    type: 'Doctors',
    verified: false,
    takeaway: true
  },
  {
    name: 'Dr. Arjun Mehta',
    specialty: 'Veterinary Surgery',
    city: 'Mumbai',
    initials: 'AM',
    color: '#E9DFD1',
    type: 'Doctors',
    verified: false,
    takeaway: true
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    city: 'Kochi',
    initials: 'PN',
    color: '#E6DFEC',
    type: 'Doctors',
    verified: false,
    takeaway: false
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Medicine',
    city: 'Jaipur',
    initials: 'VS',
    color: '#DCE5EF',
    type: 'Doctors',
    verified: false,
    takeaway: true
  }
];

const specialties = [
  'Dermatology', 'Surgery', 'Livestock', 'Equine',
  'Imaging', 'Nutrition', 'Wildlife', 'Preventive'
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All states');
  const [specialty, setSpecialty] = useState('');
  const [tab, setTab] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [takeawaysOnly, setTakeawaysOnly] = useState(false);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const text = `${doctor.name} ${doctor.specialty} ${doctor.city}`.toLowerCase();

      return (
        text.includes(query.toLowerCase()) &&
        (city === 'All states' || doctor.city === city) &&
        (!specialty ||
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase())) &&
        (!verifiedOnly || doctor.verified) &&
        (!takeawaysOnly || doctor.takeaway) &&
        (tab === 'All' || tab === 'Doctors')
      );
    });
  }, [query, city, specialty, tab, verifiedOnly, takeawaysOnly]);

  return (
    <section className="search-page">
      <div className="search-heading">
        <span className="search-eyebrow">DISCOVER</span>
        <h1>Find people, cases &amp; answers.</h1>
        
      </div>

      <label className="search-input-wrap">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Try "pyoderma Kerala" or "daily lameness"...'
          aria-label="Search people, cases and answers"
        />
        <select
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

      <div className="search-specialties" aria-label="Specialty filters">
        {specialties.map((item) => (
          <button
            type="button"
            key={item}
            className={specialty === item ? 'selected' : ''}
            onClick={() => setSpecialty(specialty === item ? '' : item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="search-options">
        <label>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) => setVerifiedOnly(event.target.checked)}
          />
          <ShieldCheck size={15} /> Verified only
        </label>
        <label>
          <input
            type="checkbox"
            checked={takeawaysOnly}
            onChange={(event) => setTakeawaysOnly(event.target.checked)}
          />
          Has takeaways
        </label>
      </div>

      <div className="search-tabs" role="tablist" aria-label="Search categories">
        {['All', 'Doctors', 'Cases', 'Stories & videos'].map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={tab === item}
            key={item}
            className={tab === item ? 'active' : ''}
            onClick={() => setTab(item)}
          >
            {item}
            {item === 'All' ? ' 205' : item === 'Doctors' ? ' 69' : ''}
          </button>
        ))}
      </div>

      <div className="search-results-heading">
        <h2>{tab === 'All' ? 'Doctors' : tab}</h2>
        <span>{filteredDoctors.length} results</span>
      </div>

      {tab === 'Cases' || tab === 'Stories & videos' ? (
        <div className="search-empty">
          <Search size={25} />
          <h3>{tab} are not connected yet</h3>
          <p>These results can be connected when the team provides the relevant API.</p>
        </div>
      ) : filteredDoctors.length ? (
        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <article className="doctor-card" key={doctor.name}>
              <div className="doctor-card-banner">
                <Stethoscope size={28} />
                <span>{doctor.city}</span>
              </div>
              <div
                className="doctor-avatar"
                style={{ backgroundColor: doctor.color }}
              >
                {doctor.initials}
              </div>
              <div className="doctor-card-body">
                <span className="doctor-label">EXAMPLE PROFILE · NOT VERIFIED</span>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialty}</p>
                <div className="doctor-location">
                  <MapPin size={14} /> {doctor.city}
                </div>
                <div className="doctor-card-footer">
                  <span><CheckCircle2 size={14} /> Community profile</span>
                  <button
                    type="button"
                    title={`Message ${doctor.name}`}
                    onClick={() => window.alert('Messaging will be connected to the backend API.')}
                  >
                    <MessageCircle size={17} />
                    Message
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <Search size={25} />
          <h3>No matching professionals found</h3>
          <p>Try another search term or clear one of the filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCity('All states');
              setSpecialty('');
              setVerifiedOnly(false);
              setTakeawaysOnly(false);
              setTab('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}