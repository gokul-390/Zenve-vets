import React, { useState } from 'react';
import {
  Users, ShieldCheck, Eye, ArrowUpRight, KeyRound, Megaphone
} from 'lucide-react';
import '../csscomponents/AdvertisePage.css';

export default function AdvertisePage() {
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [message, setMessage] = useState('');

  function handleAdvertiserSubmit(event) {
    event.preventDefault();
    setMessage(
      'Your form is ready. Advertiser registration must be connected to the backend API.'
    );
  }

  function handleDashboardSubmit(event) {
    event.preventDefault();
    setMessage(
      accessKey.trim()
        ? 'Dashboard access must be verified by the backend.'
        : 'Please enter your advertiser access key.'
    );
  }

  return (
    <section className="advertise-page">
      <div className="advertise-hero">
        <span className="advertise-eyebrow">ADVERTISE ON ZENVE VET</span>

        <h1>
          Reach India’s veterinary professionals where they share their work.
        </h1>

        <p className="advertise-intro">
          Your poster appears as a sponsored post inside the doctors’ feed —
          clearly labelled, reviewed by our team, measured with daily views and clicks.
        </p>

        <div className="advertise-benefits">
          <article className="advertise-benefit">
            <Users size={23} />
            <h2>Doctors &amp; clinics</h2>
            <p>
              Small-animal, livestock, equine and research professionals across India.
            </p>
          </article>

          <article className="advertise-benefit">
            <ShieldCheck size={23} />
            <h2>Reviewed before going live</h2>
            <p>
              Every campaign is checked by the Zenve Vet team, keeping the feed trustworthy.
            </p>
          </article>

          <article className="advertise-benefit">
            <Eye size={23} />
            <h2>Transparent reports</h2>
            <p>
              Views, clicks and click-through rate by day and by campaign.
            </p>
          </article>
        </div>

        <p className="advertise-pricing">
          Pricing on request — write to{' '}
          <a href="mailto:zenvefashions@gmail.com">
            zenvefashions@gmail.com
          </a>.
        </p>
      </div>

      <div className="advertiser-panels">
        <section className="advertiser-form-panel">
          <div className="advertiser-section-heading">
            <Megaphone size={19} />
            <h2>Create an advertiser account</h2>
          </div>

          <p className="advertiser-subtitle">
            Introduce your brand to the veterinary community.
          </p>

          <form onSubmit={handleAdvertiserSubmit}>
            <label htmlFor="advertiser-brand">Brand name</label>
            <input
              id="advertiser-brand"
              type="text"
              placeholder="Your brand"
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              required
            />

            <label htmlFor="advertiser-email">Contact email</label>
            <input
              id="advertiser-email"
              type="email"
              placeholder="you@brand.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="advertiser-website">Website</label>
            <input
              id="advertiser-website"
              type="text"
              placeholder="brand.com"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              required
            />

            <button className="advertiser-primary-button" type="submit">
              Start advertising <ArrowUpRight size={17} />
            </button>

            <p className="advertiser-note">No login needed. Free to set up.</p>
          </form>
        </section>

        <section className="advertiser-dashboard-panel">
          <div className="advertiser-section-heading">
            <KeyRound size={19} />
            <h2>Already advertising?</h2>
          </div>

          <p className="advertiser-subtitle">
            Enter your access key to open your campaign dashboard.
          </p>

          <form onSubmit={handleDashboardSubmit}>
            <label htmlFor="advertiser-key">Paste your access key</label>
            <input
              id="advertiser-key"
              type="password"
              placeholder="ZENVE-ADV..."
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              required
            />

            <button className="advertiser-secondary-button" type="submit">
              <KeyRound size={16} />
              Open dashboard
            </button>
          </form>
        </section>
      </div>

      {message && (
        <p className="advertiser-feedback" role="status">
          {message}
        </p>
      )}
    </section>
  );
}