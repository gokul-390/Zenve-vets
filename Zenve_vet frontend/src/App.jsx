import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FeedContent from './components/FeedContent';
import RightSidebar from './components/RightSidebar';
import SearchPage from './components/SearchPage';
import MemberBenefitsPage from './components/MemberBenefitsPage';
import CreateProfileModal from './components/CreateProfileModal';
import './csscomponents/App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          ) : activeTab === 'search' ? (
            <SearchPage />
          ) : activeTab === 'benefits' ? (
            <MemberBenefitsPage onOpenCreateProfile={() => setIsModalOpen(true)} />
          ) : activeTab === 'advertise' ? (
            <AdvertisePage />
          ) : (
            <div className="zenve-section-placeholder-view">
              <span className="zenve-indicator-tag">ACTIVE VIEW</span>
              <h2 className="zenve-section-placeholder-title">
                {activeTab === 'network' && 'Veterinary Professional Network'}
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
      />
    </div>
  );
}

export default App;
