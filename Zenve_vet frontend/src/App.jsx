import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FeedContent from './components/FeedContent';
import RightSidebar from './components/RightSidebar';
import SearchPage from './components/SearchPage';
import AdvertisePage from './components/AdvertisePage';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import MemberBenefitsPage from './components/MemberBenefitsPage';
import CreateProfileModal from './components/CreateProfileModal';
import VetNetwork from './components/VetNetwork';
import ClinicalCases from './components/ClinicalCases';
import MessagesPage from './components/MessagesPage';

import './csscomponents/App.css';
 export function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMessageDoctorId, setActiveMessageDoctorId] = useState(null);
  const [showAdvertiserDashboard, setShowAdvertiserDashboard] = useState(false);

  useEffect(() => {
    const handleOpenMessageEvent = (event) => {
      if (event.detail?.doctorId) {
        setActiveMessageDoctorId(event.detail.doctorId);
      }

      setActiveTab('messages');
    };

    window.addEventListener('zenve_open_message', handleOpenMessageEvent);

    return () => {
      window.removeEventListener(
        'zenve_open_message',
        handleOpenMessageEvent
      );
    };
  }, []);

  const [customVets, setCustomVets] = useState(() => {
    try {
      const stored = localStorage.getItem('zenve_custom_vets');

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const latestProfile = [parsed[0]];

          localStorage.setItem(
            'zenve_custom_vets',
            JSON.stringify(latestProfile)
          );

          return latestProfile;
        }
      }

      return [];
    } catch (error) {
      console.error('Failed to load veterinarian profile:', error);
      return [];
    }
  });

  const handleProfileCreated = (newVet) => {
    const updated = [newVet];

    setCustomVets(updated);

    try {
      localStorage.setItem(
        'zenve_custom_vets',
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to save veterinarian profile:', error);
    }

    setActiveTab('network');
    setIsModalOpen(false);
  };

  const handleSelectTab = (tab) => {
    if (tab !== 'advertise') {
      setShowAdvertiserDashboard(false);
    }

    setActiveTab(tab);
  };

  const handleOpenAdvertiserDashboard = () => {
    setShowAdvertiserDashboard(true);
  };

  const handleBackToAdvertise = () => {
    setShowAdvertiserDashboard(false);
  };

  return (
    <div className="zenve-app-container">
      <Header onCreateProfile={() => setIsModalOpen(true)} />

      <div className="zenve-main-layout">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenCreateProfile={() => setIsModalOpen(true)}
        />

        <main className="zenve-content-workspace">
          {activeTab === 'feed' || activeTab === 'videos' ? (
            <div className="zenve-feed-layout-columns">
              <FeedContent
                onOpenCreateProfile={() => setIsModalOpen(true)}
                activeMainTab={activeTab}
                onSelectMainTab={handleSelectTab}
              />

              <RightSidebar
                onOpenCreateProfile={() => setIsModalOpen(true)}
                onSelectTab={handleSelectTab}
              />
            </div>
          ) : activeTab === 'network' ? (
            <VetNetwork
              customVets={customVets}
              onOpenCreateProfile={() => setIsModalOpen(true)}
            />
          ) : activeTab === 'clinical' ? (
            <ClinicalCases />
          ) : activeTab === 'search' ? (
            <SearchPage />
          ) : activeTab === 'messages' ? (
            <MessagesPage
              initialDoctorId={activeMessageDoctorId}
              onDoctorChanged={setActiveMessageDoctorId}
            />
          ) : activeTab === 'benefits' ? (
            <MemberBenefitsPage
              onOpenCreateProfile={() => setIsModalOpen(true)}
              onSelectTab={handleSelectTab}
              onNavigateToNetwork={() => handleSelectTab('network')}
              onNavigateToFeed={() => handleSelectTab('feed')}
              onNavigateToMessages={() => handleSelectTab('messages')}
            />
          ) : activeTab === 'advertise' ? (
            showAdvertiserDashboard ? (
              <AdvertiserDashboard onBack={handleBackToAdvertise} />
            ) : (
              <AdvertisePage
                onOpenDashboard={handleOpenAdvertiserDashboard}
              />
            )
          ) : (
            <div className="zenve-section-placeholder-view">
              <span className="zenve-indicator-tag">ACTIVE VIEW</span>

              <h2 className="zenve-section-placeholder-title">
                {activeTab === 'messages' &&
                  'Direct Messages & Consultations'}
                {activeTab === 'clinical' &&
                  'Clinical Cases & Case Discussions'}
                {activeTab === 'benefits' &&
                  'Exclusive Member Benefits'}
              </h2>

              <p className="zenve-section-placeholder-desc">
                Switch back to the <strong>Feed</strong> tab to explore
                moments from the community, people to know, and the full
                Zenve advantage.
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