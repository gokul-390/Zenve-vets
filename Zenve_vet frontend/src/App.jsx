import React, { useState } from 'react';

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

  // Global event listener to switch to messages page for a specific doctor
  React.useEffect(() => {
    const handleOpenMessageEvent = (e) => {
      if (e.detail?.doctorId) {
        setActiveMessageDoctorId(e.detail.doctorId);
      }
      setActiveTab('messages');
    };
    window.addEventListener('zenve_open_message', handleOpenMessageEvent);
    return () => window.removeEventListener('zenve_open_message', handleOpenMessageEvent);
  }, []);

  // Switch between the Advertise page and its dashboard.
  // The global Header and Sidebar remain mounted.
  const [showAdvertiserDashboard, setShowAdvertiserDashboard] =
    useState(false);

  // Load the latest saved veterinarian profile.
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

  // Save a newly created veterinarian profile.
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

  // Handle sidebar navigation.
  const handleSelectTab = (tab) => {
    if (tab !== 'advertise') {
      setShowAdvertiserDashboard(false);
    }

    setActiveTab(tab);
  };

  // Open the advertiser dashboard in the main workspace.
  const handleOpenAdvertiserDashboard = () => {
    setShowAdvertiserDashboard(true);
  };

  // Return from the dashboard to the Advertise page.
  const handleBackToAdvertise = () => {
    setShowAdvertiserDashboard(false);
  };

  return (
    <div className="zenve-app-container">
      {/* Global Header */}
      <Header
        onCreateProfile={() => setIsModalOpen(true)}
      />

      {/* Main Application Layout */}
      <div className="zenve-main-layout">
        {/* Existing Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenCreateProfile={() => setIsModalOpen(true)}
        />

        {/* Main Workspace */}
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
          ) : activeTab === 'benefits' ? (
            <MemberBenefitsPage
              onOpenCreateProfile={() => setIsModalOpen(true)}
            />
          ) : activeTab === 'advertise' ? (
            showAdvertiserDashboard ? (
              <AdvertiserDashboard
                onBack={handleBackToAdvertise}
              />
            ) : (
              <AdvertisePage
                onOpenDashboard={handleOpenAdvertiserDashboard}
              />
            )
          ) : activeTab === 'messages' ? (
            <MessagesPage
              initialDoctorId={activeMessageDoctorId}
              onDoctorChanged={setActiveMessageDoctorId}
            />
          ) : (
            <div className="zenve-section-placeholder-view">
              <span className="zenve-indicator-tag">
                ACTIVE VIEW
              </span>

              <h2 className="zenve-section-placeholder-title">
                {activeTab === 'messages' &&
                  'Direct Messages & Consultations'}
                {activeTab === 'clinical' &&
                  'Clinical Cases & Case Discussions'}
                {activeTab === 'benefits' &&
                  'Exclusive Member Benefits'}
                {activeTab === 'videos' &&
                  'Short Videos'}
              </h2>

              <p className="zenve-section-placeholder-desc">
                Switch back to the <strong>Feed</strong> tab to
                explore moments from the community, people to know,
                and the full Zenve advantage.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Existing Profile Modal */}
      <CreateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProfileCreated={handleProfileCreated}
      />
    </div>
  );
}

export default App;