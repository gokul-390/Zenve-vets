import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FeedContent from './components/FeedContent';
import RightSidebar from './components/RightSidebar';
import SearchPage from './components/SearchPage';
import AdvertisePage from './components/AdvertisePage';
import CreateProfileModal from './components/CreateProfileModal';
import VetNetwork from './components/VetNetwork';
import './csscomponents/App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // User-created veterinarian profile persisted in localStorage (single user page)
  const [customVets, setCustomVets] = useState(() => {
    try {
      const stored = localStorage.getItem('zenve_custom_vets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const latestProfile = [parsed[0]];
          localStorage.setItem('zenve_custom_vets', JSON.stringify(latestProfile));
          return latestProfile;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const handleProfileCreated = (newVet) => {
    const updated = [newVet];
    setCustomVets(updated);
    try {
      localStorage.setItem('zenve_custom_vets', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
    setActiveTab('network');
  };

  return (
    <div className="zenve-app-container">
      {/* 1. Global Header */}
      <Header onCreateProfile={() => setIsModalOpen(true)} />

      {/* 2. Main Content Body */}
      <div className="zenve-main-layout">
        {/* Left: Sidenav */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenCreateProfile={() => setIsModalOpen(true)}
        />

        {/* Center & Right: Main Workspace */}
        <main className="zenve-content-workspace">
          {activeTab === 'feed' || activeTab === 'videos' ? (
            <div className="zenve-feed-layout-columns">
              {/* Main Feed Column */}
              <FeedContent
                onOpenCreateProfile={() => setIsModalOpen(true)}
                activeMainTab={activeTab}
                onSelectMainTab={setActiveTab}
              />

              {/* Right Aside Column (People to Know & Zenve Advantage) */}
              <RightSidebar
                onOpenCreateProfile={() => setIsModalOpen(true)}
                onSelectTab={setActiveTab}
              />
            </div>
          ) : activeTab === 'network' ? (
            <VetNetwork
              customVets={customVets}
              onOpenCreateProfile={() => setIsModalOpen(true)}
            />
          ) : activeTab === 'search' ? (
            <SearchPage />
          ) : activeTab === 'advertise' ? (
            <AdvertisePage />
          ) : (
            <div className="zenve-section-placeholder-view">
              <span className="zenve-indicator-tag">ACTIVE VIEW</span>
              <h2 className="zenve-section-placeholder-title">
                {activeTab === 'clinical' && 'Clinical Cases & Case Discussions'}
                {activeTab === 'messages' && 'Direct Messages & Consultations'}
                {activeTab === 'benefits' && 'Exclusive Member Benefits'}
              </h2>
              <p className="zenve-section-placeholder-desc">
                Switch back to the <strong>Feed</strong> tab to explore moments from the community, people to know, and the full Zenve advantage.
              </p>
            </div>
          )}
        </main>
      </div>
      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProfileCreated={handleProfileCreated}
      />
    </div>
  );
}

export default App;
