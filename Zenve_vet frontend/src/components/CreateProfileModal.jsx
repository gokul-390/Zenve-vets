import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowUpRight } from 'lucide-react';
import { doctorsApi } from '../api';
import '../csscomponents/CreateProfileModal.css';

export const CreateProfileModal = ({ isOpen, onClose, onProfileCreated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    cityState: '',
    specialty: '',
    workingPlace: '',
    experience: '',
    aboutYou: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    setIsSubmitting(true);

    const rawName = formData.fullName.trim();
    const formattedName = rawName.toLowerCase().startsWith('dr.')
      ? rawName
      : `Dr. ${rawName}`;

    const specLower = (formData.specialty || '').toLowerCase();
    let category = 'Medicine';
    if (specLower.includes('surg') || specLower.includes('sureg')) category = 'Surgery';
    else if (specLower.includes('derm') || specLower.includes('skin')) category = 'Dermatology';
    else if (specLower.includes('cardio') || specLower.includes('heart')) category = 'Cardiology';
    else if (specLower.includes('equine') || specLower.includes('horse')) category = 'Equine';
    else if (specLower.includes('rehab') || specLower.includes('physio')) category = 'Rehabilitation';
    else if (specLower.includes('exotic') || specLower.includes('avian') || specLower.includes('bird')) category = 'Exotics';

    const expText = formData.experience.trim();
    const formattedExp = expText.toLowerCase().includes('year')
      ? expText
      : `${expText} years experience`;

    const newDoctor = {
      id: `custom-vet-${Date.now()}`,
      name: formattedName,
      rawName: rawName,
      degrees: 'BVSc & AH',
      specialty: formData.specialty.trim() || 'Veterinary Specialist',
      specialtyCategory: category,
      location: formData.cityState.trim() || 'India',
      clinic: formData.workingPlace.trim() || 'Independent Clinical Practice',
      experience: formattedExp,
      casesHandled: '150+',
      followers: '1',
      rating: '5.0 ★',
      about:
        formData.aboutYou.trim() ||
        'Dedicated veterinary practitioner with expertise in clinical diagnostics, compassionate surgery, and patient rehabilitation.',
      description:
        formData.aboutYou.trim() ||
        'Specializing in compassionate clinical and surgical animal care with patient-first principles.',
      focusAreas: [
        formData.specialty.trim() || 'General Practice',
        'Clinical Diagnostics',
        'Patient Wellness',
        'Emergency Care',
      ],
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80',
      coverImg: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80',
      mutualCount: 1,
      mutualConnectionsText: 'Zenvevet Community Member',
      mutualAvatars: [
        'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=100&h=100&q=80',
      ],
      initialStatus: 'not_connected',
      initialFollowing: false,
      isVerified: false,
      isCurrentUser: true,
      createdAt: Date.now(),
    };

    try {
      if (doctorsApi && doctorsApi.createProfile) {
        await doctorsApi.createProfile(formData);
      }
    } catch (err) {
      console.warn('API notice (saved locally in browser session):', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        if (onProfileCreated) {
          onProfileCreated(newDoctor);
        }
        setIsSubmitted(false);
        onClose();
        setFormData({
          fullName: '',
          cityState: '',
          specialty: '',
          workingPlace: '',
          experience: '',
          aboutYou: '',
        });
      }, 850);
    }
  };

  return (
    <div
      className="zenve-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create Your Professional Profile"
    >
      <div
        className="zenve-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="zenve-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="zenve-modal-header">
          <div className="zenve-modal-header-badge">
            <Sparkles size={13} />
            <span>PRACTITIONER PROFILE</span>
          </div>
          <h2 className="zenve-modal-title">Make your professional mark</h2>
          <p className="zenve-modal-subtitle">
            Your own public veterinary page. Free, with no login required.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="zenve-modal-body">
          {/* Notice Box matching Join Community */}
          <div className="zenve-modal-notice">
            <p>
              Your page is published to the Zenve Veterinary directory. Clinical colleagues and pet parents can view your verified expertise across India.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="zenve-modal-form">
            <div className="zenve-form-grid">
              {/* Full Name */}
              <div className="zenve-form-group">
                <label htmlFor="fullName" className="zenve-form-label">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="zenve-form-input"
                  placeholder="Dr. Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* City & State */}
              <div className="zenve-form-group">
                <label htmlFor="cityState" className="zenve-form-label">City &amp; state</label>
                <input
                  id="cityState"
                  name="cityState"
                  type="text"
                  className="zenve-form-input"
                  placeholder="Bengaluru, Karnataka"
                  value={formData.cityState}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="zenve-form-grid">
              {/* Specialty */}
              <div className="zenve-form-group">
                <label htmlFor="specialty" className="zenve-form-label">Specialty</label>
                <input
                  id="specialty"
                  name="specialty"
                  type="text"
                  className="zenve-form-input"
                  placeholder="Small Animal Medicine"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Experience */}
              <div className="zenve-form-group">
                <label htmlFor="experience" className="zenve-form-label">Experience</label>
                <input
                  id="experience"
                  name="experience"
                  type="text"
                  className="zenve-form-input"
                  placeholder="e.g. 5+ years"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Working Place */}
            <div className="zenve-form-group">
              <label htmlFor="workingPlace" className="zenve-form-label">Working place</label>
              <input
                id="workingPlace"
                name="workingPlace"
                type="text"
                className="zenve-form-input"
                placeholder="e.g. PetCare Veterinary Clinic / Animal Hospital"
                value={formData.workingPlace}
                onChange={handleChange}
                required
              />
            </div>

            {/* About You */}
            <div className="zenve-form-group">
              <label htmlFor="aboutYou" className="zenve-form-label">About you</label>
              <textarea
                id="aboutYou"
                name="aboutYou"
                rows="3"
                className="zenve-form-textarea"
                placeholder="Your approach to care, interests and professional story"
                value={formData.aboutYou}
                onChange={handleChange}
              />
            </div>

            {/* Disclaimer Text */}
            <p className="zenve-modal-disclaimer">
              Your page and posts are public and unverified. Publishing access stays in this browser; keep its data to retain access.
            </p>

            {/* Actions */}
            <div className="zenve-modal-actions">
              <button
                type="submit"
                className="zenve-modal-submit-btn"
                disabled={isSubmitted || isSubmitting}
              >
                <span>
                  {isSubmitting
                    ? 'Connecting to ZenveVet...'
                    : isSubmitted
                    ? 'Creating your page...'
                    : 'Create my professional page'}
                </span>
                {!isSubmitted && !isSubmitting && <ArrowUpRight size={17} />}
              </button>

              <button
                type="button"
                className="zenve-modal-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;
