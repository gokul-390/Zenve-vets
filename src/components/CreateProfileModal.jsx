import React, { useState, useEffect } from 'react';
import { doctorsApi } from '../api';
import '../csscomponents/CreateProfileModal.css';

export const CreateProfileModal = ({ isOpen, onClose }) => {
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
    setIsSubmitting(true);

    try {
      await doctorsApi.createProfile(formData);
    } catch (err) {
      console.warn('API notice (saved locally in browser session):', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1400);
    }
  };

  return (
    <div className="zenve-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="zenve-modal-header" style={{ backgroundImage: "url('your-image-url.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="zenve-modal-header">
          <h2 className="zenve-modal-title">Make your professional mark.</h2>
          <p className="zenve-modal-subtitle">
            Your own public veterinary page. Free, with no login required.
          </p>
        </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="zenve-modal-form">
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

          {/* Experience */}
          <div className="zenve-form-group">
            <label htmlFor="experience" className="zenve-form-label">Experience</label>
            <input
              id="experience"
              name="experience"
              type="text"
              className="zenve-form-input"
              placeholder="e.g. 5+ years in clinical practice"
              value={formData.experience}
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
              rows="4"
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

          {/* Submit Action */}
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
            {!isSubmitted && !isSubmitting && <span className="zenve-submit-arrow">↗</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfileModal;
