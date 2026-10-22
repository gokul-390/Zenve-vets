import React, { useState, useMemo, useEffect } from 'react';
import { SearchIcon, PlusIcon } from './Icons';
import '../csscomponents/ClinicalCases.css';

/* ── Seed Data ─────────────────────────────────────────────────────────── */

const INITIAL_DOCTORS = [
  {
    id: 'doc-001',
    name: 'Dr. Aarthi',
    doctorId: 'ZV-DR-001',
    qualification: 'BVSc & AH, MVSc (Orthopedic Surgery)',
    specialization: 'Orthopedic Surgery',
    contact: '+91 98451 10001',
    email: 'aarthi@zenvevet.in',
    clinic: 'Bengaluru Pet Orthopedics & Trauma Centre',
    location: 'Bengaluru, Karnataka',
    availability: 'Mon–Sat, 9 AM – 6 PM',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'doc-002',
    name: 'Dr. Arun Mehta',
    doctorId: 'ZV-DR-002',
    qualification: 'BVSc & AH, MVSc (Surgery & Radiology)',
    specialization: 'Veterinary Surgery',
    contact: '+91 98201 20002',
    email: 'arun.mehta@zenvevet.in',
    clinic: 'Apex Veterinary Multi-Specialty & Trauma Hospital',
    location: 'Mumbai, Maharashtra',
    availability: 'Mon–Fri, 10 AM – 7 PM',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'doc-003',
    name: 'Dr. Priya Nair',
    doctorId: 'ZV-DR-003',
    qualification: 'BVSc & AH, MVSc (Dermatology)',
    specialization: 'Veterinary Dermatology',
    contact: '+91 94471 30003',
    email: 'priya.nair@zenvevet.in',
    clinic: 'Coastal Veterinary Specialty & Allergy Clinic',
    location: 'Kochi, Kerala',
    availability: 'Tue–Sun, 8 AM – 5 PM',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'doc-004',
    name: 'Dr. Nidhi',
    doctorId: 'ZV-DR-004',
    qualification: 'BVSc & AH, MVSc (Internal Medicine)',
    specialization: 'Small Animal Medicine',
    contact: '+91 90000 40004',
    email: 'nidhi@zenvevet.in',
    clinic: 'Hyderabad Small Animal Hospital',
    location: 'Hyderabad, Telangana',
    availability: 'Mon–Sat, 9 AM – 4 PM',
    img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    id: 'doc-005',
    name: 'Dr. Sanjay',
    doctorId: 'ZV-DR-005',
    qualification: 'BVSc & AH, MVSc (Equine Medicine)',
    specialization: 'Equine Medicine',
    contact: '+91 97295 50005',
    email: 'sanjay@zenvevet.in',
    clinic: 'Rajputana Equine Hospital & Stud Health Care',
    location: 'Jaipur, Rajasthan',
    availability: 'Mon–Sun, 7 AM – 8 PM',
    img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&h=120&q=80',
  },
];

const INITIAL_CASES = [
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

/* ── Status / Priority config ─────────────────────────────────────────── */

const STATUS_OPTIONS = ['Active', 'Under Observation', 'Resolved', 'Closed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const SPECIES_OPTIONS = ['Canine', 'Feline', 'Equine', 'Avian', 'Exotic', 'Bovine', 'Other'];

const STATUS_COLOR = {
  Active: 'cc-status--active',
  'Under Observation': 'cc-status--observation',
  Resolved: 'cc-status--resolved',
  Closed: 'cc-status--closed',
};

const PRIORITY_COLOR = {
  Low: 'cc-priority--low',
  Medium: 'cc-priority--medium',
  High: 'cc-priority--high',
  Critical: 'cc-priority--critical',
};

/* ── Storage helpers ──────────────────────────────────────────────────── */
function notifyClinicalCasesUpdated() {
  window.dispatchEvent(
    new CustomEvent('zenve:community-content-updated', {
      detail: { type: 'clinical-cases' },
    })
  );
}
function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function genId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ── Blank form templates ─────────────────────────────────────────────── */

const BLANK_DOCTOR = {
  name: '',
  doctorId: '',
  qualification: '',
  specialization: '',
  contact: '',
  email: '',
  clinic: '',
  location: '',
  availability: '',
  img: '',
};

const BLANK_CASE = {
  caseNumber: '',
  title: '',
  species: 'Canine',
  breed: '',
  age: '',
  weight: '',
  status: 'Active',
  priority: 'Medium',
  description: '',
  diagnosis: '',
  treatment: '',
  notes: '',
  assignedDoctorId: '',
  date: new Date().toISOString().slice(0, 10),
  nextVisit: '',
};

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                        */
/* ══════════════════════════════════════════════════════════════════════ */

export const ClinicalCases = () => {
  /* ── App-level panel: 'cases' | 'doctors' ── */
  const [panel, setPanel] = useState('cases');

  /* ── Cases state ── */
  const [cases, setCases] = useState(() =>
    loadFromStorage('zenve_clinical_cases', INITIAL_CASES)
  );
  const [caseSearch, setCaseSearch] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState('all');
  const [caseView, setCaseView] = useState(null);       // case being viewed
  const [caseEditData, setCaseEditData] = useState(null); // case being edited/created
  const [caseMode, setCaseMode] = useState(null);        // 'add' | 'edit' | 'view'
  const [caseFormError, setCaseFormError] = useState('');

  /* ── Doctors state ── */
  const [doctors, setDoctors] = useState(() =>
    loadFromStorage('zenve_clinical_doctors', INITIAL_DOCTORS)
  );
  const [docSearch, setDocSearch] = useState('');
  const [docView, setDocView] = useState(null);
  const [docEditData, setDocEditData] = useState(null);
  const [docMode, setDocMode] = useState(null); // 'add' | 'edit' | 'view'
  const [docFormError, setDocFormError] = useState('');
  const [docFormSuccess, setDocFormSuccess] = useState(false);
  const [docEditMode, setDocEditMode] = useState('edit'); // 'add' | 'edit'

  /* ── Derived ── */
  const filteredCases = useMemo(() => {
    let list = cases;
    if (caseStatusFilter !== 'all') list = list.filter((c) => c.status === caseStatusFilter);
    if (caseSearch.trim()) {
      const q = caseSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.species.toLowerCase().includes(q) ||
          c.breed.toLowerCase().includes(q) ||
          c.diagnosis.toLowerCase().includes(q)
      );
    }
    return list;
  }, [cases, caseSearch, caseStatusFilter]);

  const filteredDoctors = useMemo(() => {
    if (!docSearch.trim()) return doctors;
    const q = docSearch.toLowerCase();
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.clinic.toLowerCase().includes(q)
    );
  }, [doctors, docSearch]);

  const getDoctorById = (id) => doctors.find((d) => d.id === id) || null;

  const caseCounts = useMemo(() => {
    const all = cases.length;
    const active = cases.filter((c) => c.status === 'Active').length;
    const resolved = cases.filter((c) => c.status === 'Resolved').length;
    const critical = cases.filter((c) => c.priority === 'Critical').length;
    return { all, active, resolved, critical };
  }, [cases]);

  /* ── Lock background scroll when Add Case / modal is open ── */
  useEffect(() => {
    if (caseMode || docMode || docView) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [caseMode, docMode, docView]);

  /* ── Case CRUD ── */
  const openAddCase = () => {
    setCaseEditData({ ...BLANK_CASE });
    setCaseMode('add');
    setCaseFormError('');
  };
  const openEditCase = (c) => {
    setCaseEditData({ ...c });
    setCaseMode('edit');
    setCaseFormError('');
  };
  const openViewCase = (c) => {
    setCaseView(c);
    setCaseMode('view');
  };
  const closeCaseModal = () => {
    setCaseMode(null);
    setCaseView(null);
    setCaseEditData(null);
    setCaseFormError('');
  };

  const saveCase = () => {
    if (!caseEditData.title.trim() || !caseEditData.caseNumber.trim()) {
      setCaseFormError('Case Number and Title are required.');
      return;
    }
    let updated;
    if (caseMode === 'add') {
      const newCase = { ...caseEditData, id: genId('case') };
      updated = [newCase, ...cases];
    } else {
      updated = cases.map((c) => (c.id === caseEditData.id ? { ...caseEditData } : c));
    }
    setCases(updated);
    saveToStorage('zenve_clinical_cases', updated);
    closeCaseModal();
  };

  const deleteCase = (id) => {
    const updated = cases.filter((c) => c.id !== id);
    setCases(updated);
    saveToStorage('zenve_clinical_cases', updated);
    closeCaseModal();
  };

  /* ── Doctor CRUD & Profile Section ── */
  const openEditProfileSection = (d) => {
    setDocEditData({ ...d });
    setDocEditMode('edit');
    setDocFormError('');
    setDocFormSuccess(false);
    setPanel('edit-profile');
  };

  const openAddDoctorSection = () => {
    setDocEditData({ ...BLANK_DOCTOR });
    setDocEditMode('add');
    setDocFormError('');
    setDocFormSuccess(false);
    setPanel('edit-profile');
  };

  const saveDoctorProfileSection = () => {
    if (!docEditData?.name?.trim() || !docEditData?.doctorId?.trim()) {
      setDocFormError('Doctor Name and Doctor ID are required.');
      setDocFormSuccess(false);
      return;
    }
    let updated;
    if (docEditMode === 'add') {
      const newDoc = { ...docEditData, id: genId('doc') };
      updated = [newDoc, ...doctors];
      setDocEditData(newDoc);
      setDocEditMode('edit');
    } else {
      updated = doctors.map((d) => (d.id === docEditData.id ? { ...docEditData } : d));
    }
    setDoctors(updated);
    saveToStorage('zenve_clinical_doctors', updated);
    setDocFormError('');
    setDocFormSuccess(true);
    setTimeout(() => setDocFormSuccess(false), 3500);
  };

  const openAddDoctor = () => {
    openAddDoctorSection();
  };
  const openViewDoctor = (d) => {
    setDocView(d);
    setDocMode('view');
  };
  const closeDocModal = () => {
    setDocMode(null);
    setDocView(null);
    setDocFormError('');
  };

  const saveDoctor = () => {
    if (!docEditData.name.trim() || !docEditData.doctorId.trim()) {
      setDocFormError('Doctor Name and Doctor ID are required.');
      return;
    }
    let updated;
    if (docMode === 'add') {
      const newDoc = { ...docEditData, id: genId('doc') };
      updated = [newDoc, ...doctors];
    } else {
      updated = doctors.map((d) => (d.id === docEditData.id ? { ...docEditData } : d));
    }
    setDoctors(updated);
    saveToStorage('zenve_clinical_doctors', updated);
    closeDocModal();
  };

  const deleteDoctor = (id) => {
    const updated = doctors.filter((d) => d.id !== id);
    setDoctors(updated);
    saveToStorage('zenve_clinical_doctors', updated);
    if (docEditData?.id === id) {
      if (updated.length > 0) {
        setDocEditData({ ...updated[0] });
        setDocEditMode('edit');
      } else {
        setDocEditData({ ...BLANK_DOCTOR });
        setDocEditMode('add');
      }
    }
    closeDocModal();
  };

  /* ── Render ── */
  return (
    <div className="cc-page">
      {/* ── Hero Banner ── */}
      <section className="cc-hero">
        <div className="cc-hero-left">
          <span className="cc-hero-tag">CLINICAL MANAGEMENT</span>
          <h1 className="cc-hero-title">Clinical Cases</h1>
          <p className="cc-hero-desc">
            Manage clinical case records, track patient progress, assign specialist
            veterinarians, and monitor treatment outcomes across your practice.
          </p>
        </div>
        <div className="cc-hero-stats">
          <div className="cc-stat-box">
            <span className="cc-stat-number">{caseCounts.all}</span>
            <span className="cc-stat-label">Total Cases</span>
          </div>
          <div className="cc-stat-box">
            <span className="cc-stat-number">{caseCounts.active}</span>
            <span className="cc-stat-label">Active</span>
          </div>
          <div className="cc-stat-box">
            <span className="cc-stat-number">{caseCounts.critical}</span>
            <span className="cc-stat-label">Critical</span>
          </div>
          <div className="cc-stat-box">
            <span className="cc-stat-number">{doctors.length}</span>
            <span className="cc-stat-label">Doctors</span>
          </div>
        </div>
      </section>

      {/* ── Panel Tabs ── */}
      <div className="cc-panel-tabs-bar">
        <div className="cc-panel-tabs">
          <button
            type="button"
            className={`cc-panel-tab ${panel === 'cases' ? 'cc-panel-tab--active' : ''}`}
            onClick={() => setPanel('cases')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="6.5" width="17" height="13.5" rx="2.5" />
              <path d="M9 6.5V5C9 4.2 9.7 3.5 10.5 3.5H13.5C14.3 3.5 15 4.2 15 5V6.5" />
              <path d="M12 10.5V15.5" /><path d="M9.5 13H14.5" />
            </svg>
            Clinical Cases
            <span className="cc-panel-tab-badge">{caseCounts.all}</span>
          </button>
          <button
            type="button"
            className={`cc-panel-tab ${panel === 'doctors' ? 'cc-panel-tab--active' : ''}`}
            onClick={() => setPanel('doctors')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="7" r="3.2" /><path d="M3.5 18.5C3.5 15.2 6 13.2 9 13.2C12 13.2 14.5 15.2 14.5 18.5" />
              <circle cx="16.5" cy="8" r="2.5" /><path d="M15.5 13.5C17.2 13.8 20.5 15 20.5 18.2" />
            </svg>
            Doctors
            <span className="cc-panel-tab-badge">{doctors.length}</span>
          </button>
          <button
            type="button"
            className={`cc-panel-tab ${panel === 'edit-profile' ? 'cc-panel-tab--active' : ''}`}
            onClick={() => {
              if (!docEditData && doctors.length > 0) {
                openEditProfileSection(doctors[0]);
              } else {
                setDocFormError('');
                setDocFormSuccess(false);
                setPanel('edit-profile');
              }
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* ══ CASES PANEL ══════════════════════════════════════════════════ */}
      {panel === 'cases' && (
        <>
          {/* Search + Add */}
          <div className="cc-controls-bar">
            <div className="cc-search-wrap">
              <span className="cc-search-icon-wrap">
                <SearchIcon size={16} color="#798680" />
              </span>
              <input
                type="text"
                className="cc-search-input"
                placeholder="Search cases by title, species, diagnosis..."
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
              />
              {caseSearch && (
                <button
                  type="button"
                  className="cc-search-clear"
                  onClick={() => setCaseSearch('')}
                  title="Clear"
                >✕</button>
              )}
            </div>
            <button
              type="button"
              className="cc-add-btn"
              onClick={openAddCase}
            >
              <PlusIcon size={14} color="white" />
              Add Case
            </button>
          </div>

          {/* Status filter pills */}
          <div className="cc-filters-row">
            <span className="cc-filter-label">Status:</span>
            <div className="cc-pills-scroll">
              {['all', ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`cc-pill ${caseStatusFilter === s ? 'cc-pill--active' : ''}`}
                  onClick={() => setCaseStatusFilter(s)}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Cases list */}
          {filteredCases.length === 0 ? (
            <div className="cc-empty-state">
              <div className="cc-empty-icon">🩺</div>
              <h3 className="cc-empty-title">No clinical cases found</h3>
              <p className="cc-empty-desc">
                {caseSearch
                  ? `No cases match "${caseSearch}". Try a different search.`
                  : 'Add your first clinical case to get started.'}
              </p>
              <button type="button" className="cc-empty-action-btn" onClick={openAddCase}>
                + Add Clinical Case
              </button>
            </div>
          ) : (
            <div className="cc-cases-list">
              {filteredCases.map((c) => {
                const assignedDoc = getDoctorById(c.assignedDoctorId);
                return (
                  <div key={c.id} className="cc-case-card">
                    <div className="cc-case-card-top">
                      <div className="cc-case-card-meta">
                        <span className="cc-case-number">{c.caseNumber}</span>
                        <span className={`cc-status ${STATUS_COLOR[c.status] || ''}`}>{c.status}</span>
                        <span className={`cc-priority ${PRIORITY_COLOR[c.priority] || ''}`}>{c.priority}</span>
                      </div>
                      <div className="cc-case-card-actions">
                        <button
                          type="button"
                          className="cc-icon-btn"
                          title="View case"
                          onClick={() => openViewCase(c)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="cc-icon-btn"
                          title="Edit case"
                          onClick={() => openEditCase(c)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="cc-icon-btn cc-icon-btn--danger"
                          title="Delete case"
                          onClick={() => deleteCase(c.id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3 className="cc-case-title" onClick={() => openViewCase(c)}>{c.title}</h3>
                    <p className="cc-case-desc">{c.description}</p>

                    <div className="cc-case-details-row">
                      <span className="cc-case-detail-chip">🐾 {c.species} · {c.breed}</span>
                      <span className="cc-case-detail-chip">🗓 {c.date}</span>
                      {c.nextVisit && <span className="cc-case-detail-chip">📅 Next: {c.nextVisit}</span>}
                    </div>

                    {assignedDoc ? (
                      <div className="cc-assigned-doc-strip">
                        <img
                          src={assignedDoc.img || 'https://via.placeholder.com/32'}
                          alt={assignedDoc.name}
                          className="cc-assigned-doc-avatar"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }}
                        />
                        <div className="cc-assigned-doc-info">
                          <span className="cc-assigned-doc-name">{assignedDoc.name}</span>
                          <span className="cc-assigned-doc-spec">{assignedDoc.specialization}</span>
                        </div>
                        <button
                          type="button"
                          className="cc-assigned-doc-link"
                          onClick={() => { setPanel('doctors'); openViewDoctor(assignedDoc); }}
                          title="View doctor profile"
                        >
                          View profile ↗
                        </button>
                      </div>
                    ) : (
                      <div className="cc-no-doctor-strip">
                        <span>No doctor assigned</span>
                        <button
                          type="button"
                          className="cc-assigned-doc-link"
                          onClick={() => openEditCase(c)}
                        >
                          Assign doctor
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ══ DOCTORS PANEL ════════════════════════════════════════════════ */}
      {panel === 'doctors' && (
        <>
          <div className="cc-controls-bar">
            <div className="cc-search-wrap">
              <span className="cc-search-icon-wrap">
                <SearchIcon size={16} color="#798680" />
              </span>
              <input
                type="text"
                className="cc-search-input"
                placeholder="Search doctors by name, specialty, location..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
              />
              {docSearch && (
                <button
                  type="button"
                  className="cc-search-clear"
                  onClick={() => setDocSearch('')}
                  title="Clear"
                >✕</button>
              )}
            </div>
            <button type="button" className="cc-add-btn" onClick={openAddDoctor}>
              <PlusIcon size={14} color="white" />
              Add Doctor
            </button>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="cc-empty-state">
              <div className="cc-empty-icon">👨‍⚕️</div>
              <h3 className="cc-empty-title">No doctors found</h3>
              <p className="cc-empty-desc">
                {docSearch ? `No doctors match "${docSearch}".` : 'Add your first doctor to the directory.'}
              </p>
              <button type="button" className="cc-empty-action-btn" onClick={openAddDoctor}>
                + Add Doctor
              </button>
            </div>
          ) : (
            <div className="cc-doctors-grid">
              {filteredDoctors.map((d) => (
                <div key={d.id} className="cc-doctor-card">
                  <div className="cc-doctor-card-top">
                    <img
                      src={d.img || 'https://via.placeholder.com/56'}
                      alt={d.name}
                      className="cc-doctor-avatar"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                    />
                    <div className="cc-doctor-card-info">
                      <span className="cc-doctor-name">{d.name}</span>
                      <span className="cc-doctor-id-badge">{d.doctorId}</span>
                      <span className="cc-doctor-spec">{d.specialization}</span>
                    </div>
                    <div className="cc-doctor-card-actions">
                      <button
                        type="button"
                        className="cc-doctor-edit-btn"
                        title="Edit Doctor Profile"
                        onClick={() => openEditProfileSection(d)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
                        className="cc-icon-btn cc-icon-btn--danger"
                        title="Delete doctor"
                        onClick={() => deleteDoctor(d.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="cc-doctor-card-details">
                    <div className="cc-doctor-detail-row">
                      <span className="cc-doctor-detail-icon">🎓</span>
                      <span className="cc-doctor-detail-text">{d.qualification}</span>
                    </div>
                    <div className="cc-doctor-detail-row">
                      <span className="cc-doctor-detail-icon">🏥</span>
                      <span className="cc-doctor-detail-text">{d.clinic}</span>
                    </div>
                    <div className="cc-doctor-detail-row">
                      <span className="cc-doctor-detail-icon">📍</span>
                      <span className="cc-doctor-detail-text">{d.location}</span>
                    </div>
                    <div className="cc-doctor-detail-row">
                      <span className="cc-doctor-detail-icon">📞</span>
                      <span className="cc-doctor-detail-text">{d.contact}</span>
                    </div>
                    <div className="cc-doctor-detail-row">
                      <span className="cc-doctor-detail-icon">🕐</span>
                      <span className="cc-doctor-detail-text">{d.availability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══ EDIT PROFILE SECTION ═════════════════════════════════════════ */}
      {panel === 'edit-profile' && (
        <section className="cc-edit-profile-section" aria-label="Edit Doctor Profile">
          {/* Header Bar */}
          <div className="cc-edit-profile-header">
            <button
              type="button"
              className="cc-edit-back-btn"
              onClick={() => setPanel('doctors')}
            >
              ← Back to Doctors
            </button>

            <div className="cc-edit-profile-selector-wrap">
              <span className="cc-edit-selector-label">Select Doctor:</span>
              <select
                className="cc-doctor-select"
                value={docEditData?.id || ''}
                onChange={(e) => {
                  const targetDoc = doctors.find((doc) => doc.id === e.target.value);
                  if (targetDoc) {
                    openEditProfileSection(targetDoc);
                  }
                }}
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.doctorId}) – {doc.specialization}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="cc-new-doctor-btn"
                onClick={openAddDoctorSection}
              >
                + New Doctor
              </button>
            </div>
          </div>

          {/* Section Main Workspace Grid */}
          <div className="cc-edit-profile-container">
            {/* Left Rail: Live Doctor Card Preview */}
            <div className="cc-edit-preview-column">
              <div className="cc-edit-preview-card">
                <span className="cc-preview-badge">Live Profile Preview</span>
                <div className="cc-preview-avatar-wrap">
                  <img
                    src={docEditData?.img || 'https://via.placeholder.com/84'}
                    alt={docEditData?.name || 'Doctor'}
                    className="cc-preview-avatar"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/84'; }}
                  />
                </div>
                <h3 className="cc-preview-name">{docEditData?.name || 'Doctor Name'}</h3>
                <span className="cc-doctor-id-badge">{docEditData?.doctorId || 'ZV-DR-XXX'}</span>
                <p className="cc-preview-spec">{docEditData?.specialization || 'Specialization'}</p>

                <div className="cc-preview-details">
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">🎓</span>
                    <span className="cc-preview-item-text">{docEditData?.qualification || 'Not specified'}</span>
                  </div>
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">🏥</span>
                    <span className="cc-preview-item-text">{docEditData?.clinic || 'Not specified'}</span>
                  </div>
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">📍</span>
                    <span className="cc-preview-item-text">{docEditData?.location || 'Not specified'}</span>
                  </div>
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">📞</span>
                    <span className="cc-preview-item-text">{docEditData?.contact || 'Not specified'}</span>
                  </div>
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">✉️</span>
                    <span className="cc-preview-item-text">{docEditData?.email || 'Not specified'}</span>
                  </div>
                  <div className="cc-preview-detail-item">
                    <span className="cc-preview-item-icon">🕐</span>
                    <span className="cc-preview-item-text">{docEditData?.availability || 'Not specified'}</span>
                  </div>
                </div>

                {docEditData?.id && (
                  <div className="cc-preview-cases-box">
                    <span className="cc-preview-cases-label">Assigned Cases:</span>
                    <span className="cc-preview-cases-count">
                      {cases.filter((c) => c.assignedDoctorId === docEditData.id).length} Active Case(s)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Edit Profile Form Card */}
            <div className="cc-edit-form-column">
              <div className="cc-edit-form-card">
                <div className="cc-edit-form-card-header">
                  <div>
                    <h2 className="cc-edit-form-title">
                      {docEditMode === 'add' ? 'Add New Doctor Profile' : `Edit Doctor Profile: ${docEditData?.name || ''}`}
                    </h2>
                    <p className="cc-edit-form-subtitle">
                      Modify doctor credentials, contact details, clinic details, and availability schedule.
                    </p>
                  </div>
                </div>

                {docFormSuccess && (
                  <div className="cc-form-success">
                    ✓ Doctor profile updated successfully!
                  </div>
                )}
                {docFormError && (
                  <div className="cc-form-error">{docFormError}</div>
                )}

                <div className="cc-form-grid">
                  <div className="cc-form-group">
                    <label className="cc-form-label">Doctor Name *</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.name || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Dr. Aarthi"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Doctor ID *</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.doctorId || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, doctorId: e.target.value }))}
                      placeholder="e.g. ZV-DR-001"
                    />
                  </div>

                  <div className="cc-form-group cc-form-group--full">
                    <label className="cc-form-label">Qualification</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.qualification || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, qualification: e.target.value }))}
                      placeholder="e.g. BVSc & AH, MVSc (Orthopedic Surgery)"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Specialization</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.specialization || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, specialization: e.target.value }))}
                      placeholder="e.g. Orthopedic Surgery"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Clinic / Hospital</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.clinic || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, clinic: e.target.value }))}
                      placeholder="e.g. Bengaluru Pet Orthopedics Centre"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Location</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.location || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Bengaluru, Karnataka"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Contact Number</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.contact || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, contact: e.target.value }))}
                      placeholder="e.g. +91 98451 10001"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Email Address</label>
                    <input
                      type="email"
                      className="cc-form-input"
                      value={docEditData?.email || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="e.g. doctor@zenvevet.in"
                    />
                  </div>

                  <div className="cc-form-group">
                    <label className="cc-form-label">Availability Schedule</label>
                    <input
                      type="text"
                      className="cc-form-input"
                      value={docEditData?.availability || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, availability: e.target.value }))}
                      placeholder="e.g. Mon–Sat, 9 AM – 6 PM"
                    />
                  </div>

                  <div className="cc-form-group cc-form-group--full">
                    <label className="cc-form-label">Profile Image URL</label>
                    <input
                      type="url"
                      className="cc-form-input"
                      value={docEditData?.img || ''}
                      onChange={(e) => setDocEditData((p) => ({ ...p, img: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="cc-edit-form-actions">
                  <button
                    type="button"
                    className="cc-save-profile-btn"
                    onClick={saveDoctorProfileSection}
                  >
                    Save Profile Changes
                  </button>
                  <button
                    type="button"
                    className="cc-cancel-profile-btn"
                    onClick={() => setPanel('doctors')}
                  >
                    Back to Doctors
                  </button>
                  {docEditMode === 'edit' && docEditData?.id && (
                    <button
                      type="button"
                      className="cc-delete-profile-btn"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${docEditData.name}?`)) {
                          deleteDoctor(docEditData.id);
                        }
                      }}
                    >
                      Delete Doctor
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ MODAL: VIEW CASE ═════════════════════════════════════════════ */}
      {caseMode === 'view' && caseView && (
        <div className="cc-modal-overlay" onClick={closeCaseModal}>
          <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <div>
                <span className="cc-modal-case-number">{caseView.caseNumber}</span>
                <h2 className="cc-modal-title">{caseView.title}</h2>
              </div>
              <div className="cc-modal-header-badges">
                <span className={`cc-status ${STATUS_COLOR[caseView.status] || ''}`}>{caseView.status}</span>
                <span className={`cc-priority ${PRIORITY_COLOR[caseView.priority] || ''}`}>{caseView.priority}</span>
                <button type="button" className="cc-modal-close" onClick={closeCaseModal} aria-label="Close">✕</button>
              </div>
            </div>

            <div className="cc-modal-body">
              <div className="cc-modal-section-grid">
                {/* Left column */}
                <div>
                  <h4 className="cc-modal-section-label">Patient Information</h4>
                  <div className="cc-modal-info-grid">
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Species</span><span className="cc-modal-info-val">{caseView.species}</span></div>
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Breed</span><span className="cc-modal-info-val">{caseView.breed}</span></div>
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Age</span><span className="cc-modal-info-val">{caseView.age}</span></div>
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Weight</span><span className="cc-modal-info-val">{caseView.weight}</span></div>
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Date</span><span className="cc-modal-info-val">{caseView.date}</span></div>
                    <div className="cc-modal-info-item"><span className="cc-modal-info-key">Next Visit</span><span className="cc-modal-info-val">{caseView.nextVisit || '—'}</span></div>
                  </div>

                  <h4 className="cc-modal-section-label" style={{ marginTop: '18px' }}>Clinical Details</h4>
                  <div className="cc-modal-text-block">
                    <span className="cc-modal-info-key">Description</span>
                    <p className="cc-modal-info-val cc-modal-para">{caseView.description}</p>
                  </div>
                  <div className="cc-modal-text-block">
                    <span className="cc-modal-info-key">Diagnosis</span>
                    <p className="cc-modal-info-val cc-modal-para">{caseView.diagnosis}</p>
                  </div>
                  <div className="cc-modal-text-block">
                    <span className="cc-modal-info-key">Treatment</span>
                    <p className="cc-modal-info-val cc-modal-para">{caseView.treatment}</p>
                  </div>
                  {caseView.notes && (
                    <div className="cc-modal-text-block">
                      <span className="cc-modal-info-key">Notes</span>
                      <p className="cc-modal-info-val cc-modal-para">{caseView.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right column: Assigned Doctor */}
                <div>
                  <h4 className="cc-modal-section-label">Assigned Doctor</h4>
                  {(() => {
                    const doc = getDoctorById(caseView.assignedDoctorId);
                    return doc ? (
                      <div className="cc-modal-doctor-card">
                        <img
                          src={doc.img || 'https://via.placeholder.com/56'}
                          alt={doc.name}
                          className="cc-modal-doctor-avatar"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                        />
                        <div className="cc-modal-doctor-name">{doc.name}</div>
                        <div className="cc-modal-doctor-id">{doc.doctorId}</div>
                        <div className="cc-modal-doctor-spec">{doc.specialization}</div>
                        <div className="cc-modal-doctor-details">
                          <div className="cc-modal-doctor-row">
                            <span>🎓</span>
                            <span>{doc.qualification}</span>
                          </div>
                          <div className="cc-modal-doctor-row">
                            <span>🏥</span>
                            <span>{doc.clinic}</span>
                          </div>
                          <div className="cc-modal-doctor-row">
                            <span>📍</span>
                            <span>{doc.location}</span>
                          </div>
                          <div className="cc-modal-doctor-row">
                            <span>📞</span>
                            <span>{doc.contact}</span>
                          </div>
                          <div className="cc-modal-doctor-row">
                            <span>✉️</span>
                            <span>{doc.email}</span>
                          </div>
                          <div className="cc-modal-doctor-row">
                            <span>🕐</span>
                            <span>{doc.availability}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="cc-modal-no-doctor">
                        <span>No doctor assigned to this case.</span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="cc-modal-footer">
              <button type="button" className="cc-modal-btn cc-modal-btn--secondary" onClick={closeCaseModal}>Close</button>
              <button type="button" className="cc-modal-btn cc-modal-btn--primary" onClick={() => { closeCaseModal(); openEditCase(caseView); }}>Edit Case</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: ADD / EDIT CASE ═══════════════════════════════════════ */}
      {(caseMode === 'add' || caseMode === 'edit') && caseEditData && (
        <div className="cc-modal-overlay" onClick={closeCaseModal}>
          <div className="cc-modal cc-modal--form" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h2 className="cc-modal-title">{caseMode === 'add' ? 'Add Clinical Case' : 'Edit Clinical Case'}</h2>
              <button type="button" className="cc-modal-close" onClick={closeCaseModal} aria-label="Close">✕</button>
            </div>

            <div className="cc-modal-body">
              {caseFormError && <div className="cc-form-error">{caseFormError}</div>}
              <div className="cc-form-grid">
                <div className="cc-form-group">
                  <label className="cc-form-label">Case Number *</label>
                  <input className="cc-form-input" value={caseEditData.caseNumber}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, caseNumber: e.target.value }))}
                    placeholder="CC-2026-XXX" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Status</label>
                  <select className="cc-form-select" value={caseEditData.status}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, status: e.target.value }))}>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Case Title *</label>
                  <input className="cc-form-input" value={caseEditData.title}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Brief case description..." />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Species</label>
                  <select className="cc-form-select" value={caseEditData.species}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, species: e.target.value }))}>
                    {SPECIES_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Priority</label>
                  <select className="cc-form-select" value={caseEditData.priority}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, priority: e.target.value }))}>
                    {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Breed</label>
                  <input className="cc-form-input" value={caseEditData.breed}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, breed: e.target.value }))}
                    placeholder="e.g. Labrador" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Age</label>
                  <input className="cc-form-input" value={caseEditData.age}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, age: e.target.value }))}
                    placeholder="e.g. 3 years" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Weight</label>
                  <input className="cc-form-input" value={caseEditData.weight}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, weight: e.target.value }))}
                    placeholder="e.g. 28 kg" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Case Date</label>
                  <input type="date" className="cc-form-input" value={caseEditData.date}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Next Visit</label>
                  <input type="date" className="cc-form-input" value={caseEditData.nextVisit}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, nextVisit: e.target.value }))} />
                </div>

                {/* Assigned Doctor Dropdown */}
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Assigned Doctor</label>
                  <select
                    className="cc-form-select"
                    value={caseEditData.assignedDoctorId}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, assignedDoctorId: e.target.value }))}
                  >
                    <option value="">— None —</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} · {d.specialization} · {d.doctorId}
                      </option>
                    ))}
                  </select>
                  {/* Preview of selected doctor */}
                  {caseEditData.assignedDoctorId && (() => {
                    const doc = getDoctorById(caseEditData.assignedDoctorId);
                    return doc ? (
                      <div className="cc-form-doctor-preview">
                        <img
                          src={doc.img || 'https://via.placeholder.com/32'}
                          alt={doc.name}
                          className="cc-form-doctor-preview-avatar"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/32'; }}
                        />
                        <div>
                          <div className="cc-form-doctor-preview-name">{doc.name}</div>
                          <div className="cc-form-doctor-preview-meta">{doc.qualification} · {doc.clinic} · {doc.contact}</div>
                          <div className="cc-form-doctor-preview-avail">Available: {doc.availability}</div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Description</label>
                  <textarea className="cc-form-textarea" rows={3} value={caseEditData.description}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Clinical description and presenting complaint..." />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Diagnosis</label>
                  <textarea className="cc-form-textarea" rows={2} value={caseEditData.diagnosis}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, diagnosis: e.target.value }))}
                    placeholder="Clinical diagnosis..." />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Treatment</label>
                  <textarea className="cc-form-textarea" rows={2} value={caseEditData.treatment}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, treatment: e.target.value }))}
                    placeholder="Treatment plan and medications..." />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Notes</label>
                  <textarea className="cc-form-textarea" rows={2} value={caseEditData.notes}
                    onChange={(e) => setCaseEditData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Additional notes and follow-up instructions..." />
                </div>
              </div>
            </div>

            <div className="cc-modal-footer">
              <button type="button" className="cc-modal-btn cc-modal-btn--secondary" onClick={closeCaseModal}>Cancel</button>
              {caseMode === 'edit' && (
                <button
                  type="button"
                  className="cc-modal-btn cc-modal-btn--danger"
                  onClick={() => deleteCase(caseEditData.id)}
                >Delete</button>
              )}
              <button type="button" className="cc-modal-btn cc-modal-btn--primary" onClick={saveCase}>
                {caseMode === 'add' ? 'Create Case' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: VIEW DOCTOR ═══════════════════════════════════════════ */}
      {docMode === 'view' && docView && (
        <div className="cc-modal-overlay" onClick={closeDocModal}>
          <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h2 className="cc-modal-title">Doctor Profile</h2>
              <button type="button" className="cc-modal-close" onClick={closeDocModal} aria-label="Close">✕</button>
            </div>
            <div className="cc-modal-body">
              <div className="cc-doc-view-profile">
                <img
                  src={docView.img || 'https://via.placeholder.com/80'}
                  alt={docView.name}
                  className="cc-doc-view-avatar"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                />
                <div className="cc-doc-view-name">{docView.name}</div>
                <span className="cc-doc-view-id-badge">{docView.doctorId}</span>
                <div className="cc-doc-view-spec">{docView.specialization}</div>
              </div>
              <div className="cc-doc-view-details">
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Qualification</span>
                  <span className="cc-doc-view-val">{docView.qualification}</span>
                </div>
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Clinic</span>
                  <span className="cc-doc-view-val">{docView.clinic}</span>
                </div>
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Location</span>
                  <span className="cc-doc-view-val">{docView.location}</span>
                </div>
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Contact</span>
                  <span className="cc-doc-view-val">{docView.contact}</span>
                </div>
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Email</span>
                  <span className="cc-doc-view-val">{docView.email}</span>
                </div>
                <div className="cc-doc-view-row">
                  <span className="cc-doc-view-key">Availability</span>
                  <span className="cc-doc-view-val">{docView.availability}</span>
                </div>
              </div>
              {/* Cases assigned to this doctor */}
              <div className="cc-doc-view-cases">
                <h4 className="cc-modal-section-label">Assigned Cases</h4>
                {cases.filter((c) => c.assignedDoctorId === docView.id).length === 0 ? (
                  <p className="cc-doc-view-no-cases">No cases assigned to this doctor.</p>
                ) : (
                  <div className="cc-doc-view-cases-list">
                    {cases
                      .filter((c) => c.assignedDoctorId === docView.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="cc-doc-view-case-chip"
                          onClick={() => { closeDocModal(); setPanel('cases'); openViewCase(c); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && closeDocModal()}
                        >
                          <span className={`cc-status cc-status--sm ${STATUS_COLOR[c.status] || ''}`}>{c.status}</span>
                          <span className="cc-doc-view-case-title">{c.caseNumber} – {c.title}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="cc-modal-footer">
              <button type="button" className="cc-modal-btn cc-modal-btn--secondary" onClick={closeDocModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: ADD / EDIT DOCTOR ═════════════════════════════════════ */}
      {(docMode === 'add' || docMode === 'edit') && docEditData && (
        <div className="cc-modal-overlay" onClick={closeDocModal}>
          <div className="cc-modal cc-modal--form" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h2 className="cc-modal-title">{docMode === 'add' ? 'Add Doctor' : 'Edit Doctor Profile'}</h2>
              <button type="button" className="cc-modal-close" onClick={closeDocModal} aria-label="Close">✕</button>
            </div>
            <div className="cc-modal-body">
              {docFormError && <div className="cc-form-error">{docFormError}</div>}
              <div className="cc-form-grid">
                <div className="cc-form-group">
                  <label className="cc-form-label">Doctor Name *</label>
                  <input className="cc-form-input" value={docEditData.name}
                    onChange={(e) => setDocEditData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Dr. Full Name" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Doctor ID *</label>
                  <input className="cc-form-input" value={docEditData.doctorId}
                    onChange={(e) => setDocEditData((p) => ({ ...p, doctorId: e.target.value }))}
                    placeholder="ZV-DR-XXX" />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Qualification</label>
                  <input className="cc-form-input" value={docEditData.qualification}
                    onChange={(e) => setDocEditData((p) => ({ ...p, qualification: e.target.value }))}
                    placeholder="BVSc & AH, MVSc (Specialty)" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Specialization</label>
                  <input className="cc-form-input" value={docEditData.specialization}
                    onChange={(e) => setDocEditData((p) => ({ ...p, specialization: e.target.value }))}
                    placeholder="e.g. Orthopedic Surgery" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Contact</label>
                  <input className="cc-form-input" value={docEditData.contact}
                    onChange={(e) => setDocEditData((p) => ({ ...p, contact: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Email</label>
                  <input type="email" className="cc-form-input" value={docEditData.email}
                    onChange={(e) => setDocEditData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="doctor@clinic.in" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Clinic</label>
                  <input className="cc-form-input" value={docEditData.clinic}
                    onChange={(e) => setDocEditData((p) => ({ ...p, clinic: e.target.value }))}
                    placeholder="Clinic or Hospital name" />
                </div>
                <div className="cc-form-group">
                  <label className="cc-form-label">Location</label>
                  <input className="cc-form-input" value={docEditData.location}
                    onChange={(e) => setDocEditData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="City, State" />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Availability</label>
                  <input className="cc-form-input" value={docEditData.availability}
                    onChange={(e) => setDocEditData((p) => ({ ...p, availability: e.target.value }))}
                    placeholder="e.g. Mon–Sat, 9 AM – 6 PM" />
                </div>
                <div className="cc-form-group cc-form-group--full">
                  <label className="cc-form-label">Profile Image URL</label>
                  <input type="url" className="cc-form-input" value={docEditData.img}
                    onChange={(e) => setDocEditData((p) => ({ ...p, img: e.target.value }))}
                    placeholder="https://..." />
                </div>
              </div>
            </div>
            <div className="cc-modal-footer">
              <button type="button" className="cc-modal-btn cc-modal-btn--secondary" onClick={closeDocModal}>Cancel</button>
              {docMode === 'edit' && (
                <button
                  type="button"
                  className="cc-modal-btn cc-modal-btn--danger"
                  onClick={() => deleteDoctor(docEditData.id)}
                >Delete</button>
              )}
              <button type="button" className="cc-modal-btn cc-modal-btn--primary" onClick={saveDoctor}>
                {docMode === 'add' ? 'Add Doctor' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalCases;
