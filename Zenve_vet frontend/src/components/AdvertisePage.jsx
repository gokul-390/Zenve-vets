import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  KeyRound,
  Megaphone,
  Target,
  CalendarDays,
  Image,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import '../csscomponents/AdvertisePage.css';

const campaignObjectives = [
  'Brand awareness',
  'Product promotion',
  'Generate enquiries',
  'Promote an event',
];

const campaignFormats = [
  'Sponsored feed post',
  'Image or poster',
  'Video campaign',
  'Product announcement',
];

const audiences = [
  'All veterinary professionals',
  'Small-animal practitioners',
  'Livestock professionals',
  'Equine professionals',
  'Research and academics',
  'Clinics and hospitals',
];

const budgetRanges = [
  'Not decided yet',
  'Under ₹5,000',
  '₹5,000 – ₹15,000',
  '₹15,000 – ₹50,000',
  'Above ₹50,000',
];

export default function AdvertisePage({ onOpenDashboard }) {
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [objective, setObjective] = useState(campaignObjectives[0]);
  const [format, setFormat] = useState(campaignFormats[0]);
  const [audience, setAudience] = useState(audiences[0]);
  const [budget, setBudget] = useState(budgetRanges[0]);
  const [startDate, setStartDate] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  function handleAdvertiserSubmit(event) {
    event.preventDefault();

    setMessageType('success');
    setMessage(
      `Your campaign brief is ready. Brand: ${brandName.trim()}. Objective: ${objective}. This is an on-screen preview only; your details have not been sent to a server.`
    );
  }

  function handleDashboardSubmit() {
    setMessage('');

    if (typeof onOpenDashboard === 'function') {
      onOpenDashboard();
    }
  }

  return (
    <section className="advertise-page">
      <header className="advertise-hero">
        <div className="advertise-hero-orb advertise-hero-orb-one" />
        <div className="advertise-hero-orb advertise-hero-orb-two" />

        <div className="advertise-hero-content">
          <span className="advertise-eyebrow">
            <Megaphone size={15} aria-hidden="true" />
            ZENVE VET · ADVERTISING STUDIO
          </span>

          <h1>
            Make your brand
            <br />
            <span>part of better animal care.</span>
          </h1>

          <p className="advertise-intro">
            Reach veterinary professionals with relevant campaigns,
            thoughtfully presented to a community that cares about animal
            health and clinical excellence.
          </p>

          <div className="advertise-hero-actions">
            <a
              className="advertise-hero-cta"
              href="#advertiser-registration"
            >
              Plan your campaign
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <a
              className="advertise-hero-contact"
              href="mailto:zenvefashions@gmail.com"
            >
              Talk to our team
            </a>
          </div>

          <div className="advertise-trust-line">
            <span>
              <ShieldCheck size={15} aria-hidden="true" />
              Review-led campaigns
            </span>

            <span>
              <Target size={15} aria-hidden="true" />
              Audience-focused planning
            </span>
          </div>
        </div>

        <div className="advertise-hero-aside" aria-hidden="true">
          <div className="advertise-orbit">
            <div className="advertise-orbit-center">
              <Megaphone size={32} />
            </div>

            <span className="advertise-orbit-dot dot-one" />
            <span className="advertise-orbit-dot dot-two" />
            <span className="advertise-orbit-dot dot-three" />
          </div>

          <span className="advertise-orbit-caption">
            CONNECT · INFORM · GROW
          </span>
        </div>

        <div className="advertise-hero-bottom">
          <span className="advertise-live-indicator" />
          Campaign enquiries are open
          <span className="advertise-hero-bottom-divider">/</span>
          Pricing available on request
        </div>
      </header>

      <section
        className="advertise-benefits-section"
        aria-labelledby="advertise-benefits-title"
      >
        <div className="advertise-section-intro">
          <div>
            <span className="advertise-section-kicker">
              WHY ZENVE VET
            </span>

            <h2 id="advertise-benefits-title">
              Advertising with purpose.
            </h2>
          </div>

         
        </div>

        <div className="advertise-benefits">
          <article className="advertise-benefit">
            <span className="advertise-benefit-icon">
              <Users size={22} aria-hidden="true" />
            </span>

            <span className="advertise-benefit-number">
              01 / AUDIENCE
            </span>

            <h3>Reach the right professionals</h3>

            <p>
              Plan campaigns for veterinary practitioners, clinics,
              livestock and equine professionals, and researchers.
            </p>
          </article>

          <article className="advertise-benefit">
            <span className="advertise-benefit-icon">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>

            <span className="advertise-benefit-number">
              02 / TRUST
            </span>

            <h3>Responsible campaign review</h3>

            <p>
              Campaigns are intended to be reviewed by the Zenve Vet team
              before publication.
            </p>
          </article>

          <article className="advertise-benefit">
            <span className="advertise-benefit-icon">
              <Eye size={22} aria-hidden="true" />
            </span>

            <span className="advertise-benefit-number">
              03 / INSIGHTS
            </span>

            <h3>Plan for measurable results</h3>

            <p>
              Views, clicks, and click-through reporting are planned
              features, subject to analytics integration.
            </p>
          </article>
        </div>
      </section>

      <section
        className="advertise-workspace"
        id="advertiser-registration"
      >
        <div className="advertise-workspace-heading">
          <span className="advertise-section-kicker">
            YOUR NEXT STEP
          </span>

          <h2>Let's build your campaign.</h2>

        </div>

        <div className="advertiser-panels">
          <section className="advertiser-form-panel">
            <div className="advertiser-section-heading">
              <span className="advertiser-heading-icon">
                <Megaphone size={20} aria-hidden="true" />
              </span>

              <div>
                <span className="advertiser-panel-kicker">
                  01 · GET STARTED
                </span>

                <h2>Brand &amp; campaign brief</h2>
              </div>
            </div>

            <p className="advertiser-subtitle">
              Tell us about your organisation and what you want to achieve.
            </p>

            <form onSubmit={handleAdvertiserSubmit}>
              <div className="advertiser-form-section-label">
                <span>Brand details</span>
                <span>Required fields *</span>
              </div>

              <label htmlFor="advertiser-brand">
                Brand or organisation name *
              </label>

              <input
                id="advertiser-brand"
                type="text"
                placeholder="e.g. Your organisation"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                autoComplete="organization"
                maxLength={120}
                required
              />

              <label htmlFor="advertiser-email">
                Business contact email *
              </label>

              <input
                id="advertiser-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                maxLength={254}
                required
              />

              <label htmlFor="advertiser-website">
                Website URL *
              </label>

              <input
                id="advertiser-website"
                type="url"
                placeholder="https://yourbrand.com"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                autoComplete="url"
                maxLength={2048}
                required
              />

              <div className="advertiser-form-divider" />

              <div className="advertiser-form-section-label">
                <span>Campaign preferences</span>
                <span>Help us plan</span>
              </div>

              <div className="advertiser-form-grid">
                <div className="advertiser-field">
                  <label htmlFor="advertiser-objective">
                    <Target size={14} aria-hidden="true" />
                    Campaign objective
                  </label>

                  <select
                    id="advertiser-objective"
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                  >
                    {campaignObjectives.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="advertiser-field">
                  <label htmlFor="advertiser-format">
                    <Image size={14} aria-hidden="true" />
                    Preferred format
                  </label>

                  <select
                    id="advertiser-format"
                    value={format}
                    onChange={(event) => setFormat(event.target.value)}
                  >
                    {campaignFormats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="advertiser-field">
                  <label htmlFor="advertiser-audience">
                    <Users size={14} aria-hidden="true" />
                    Target audience
                  </label>

                  <select
                    id="advertiser-audience"
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                  >
                    {audiences.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="advertiser-field">
                  <label htmlFor="advertiser-budget">
                    Indicative budget
                  </label>

                  <select
                    id="advertiser-budget"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                  >
                    {budgetRanges.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="advertiser-field advertiser-date-field">
                <label htmlFor="advertiser-start-date">
                  <CalendarDays size={14} aria-hidden="true" />
                  Preferred campaign start date
                </label>

                <input
                  id="advertiser-start-date"
                  type="date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div className="advertiser-plan-summary">
                <Sparkles size={17} aria-hidden="true" />

                <div>
                  <strong>Your campaign direction</strong>

                  <p>
                    {objective} · {format} · {audience}
                  </p>

                  <p>Budget: {budget}</p>

                  {startDate && (
                    <p>Preferred start: {startDate}</p>
                  )}
                </div>
              </div>

              <button
                className="advertiser-primary-button"
                type="submit"
              >
                Prepare campaign brief
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>

              <p className="advertiser-note">
                This creates an on-screen preview only. Your details are not
                sent to a server until the backend is connected.
              </p>
            </form>
          </section>

          <section className="advertiser-dashboard-panel">
            <div className="advertiser-section-heading">
              <span className="advertiser-heading-icon advertiser-key-icon">
                <KeyRound size={20} aria-hidden="true" />
              </span>

              <div>
                <span className="advertiser-panel-kicker">
                  02 · EXISTING ADVERTISERS
                </span>

                <h2>Advertiser dashboard</h2>
              </div>
            </div>

            <p className="advertiser-subtitle">
              Explore sample campaign statistics and advertising
              performance while the backend API is being developed.
            </p>

            <div className="advertiser-dashboard-note">
              <ShieldCheck size={19} aria-hidden="true" />

              <div>
                <strong>Demo dashboard</strong>

                <p>
                  The dashboard currently displays sample campaign data.
                  No access key or authentication is required.
                </p>
              </div>
            </div>

            <button
              className="advertiser-secondary-button"
              type="button"
              onClick={handleDashboardSubmit}
            >
              <KeyRound size={16} aria-hidden="true" />
              Open advertiser dashboard
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>

            <div className="advertiser-contact-card">
              <span className="advertiser-contact-icon">
                <Users size={19} aria-hidden="true" />
              </span>

              <div>
                <strong>Need help getting started?</strong>

                <p>
                  Contact our team for campaign pricing and setup guidance.
                </p>

                <a href="mailto:zenvefashions@gmail.com">
                  zenvevet@gmail.com
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="advertiser-process-list">
              <span className="advertiser-panel-kicker">
                HOW IT WORKS
              </span>

              <div>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Share your brand and campaign preferences</span>
              </div>

              <div>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Discuss pricing and campaign requirements</span>
              </div>

              <div>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>
                  Complete review and publishing setup with the team
                </span>
              </div>
            </div>
          </section>
        </div>
      </section>

      {message && (
        <div
          className={`advertiser-feedback advertiser-feedback-${messageType}`}
          role="status"
          aria-live="polite"
        >
          {messageType === 'success' ? (
            <CheckCircle2 size={19} aria-hidden="true" />
          ) : (
            <ShieldCheck size={19} aria-hidden="true" />
          )}

          <p>{message}</p>

          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}