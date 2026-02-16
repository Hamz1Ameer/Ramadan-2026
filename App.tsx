
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Guide from './components/Guide';
import DuaGuide from './components/DuaGuide';
import GeminiAssistant from './components/GeminiAssistant';
import QuranPlayer from './components/QuranPlayer';
import PrayerCalendar from './components/PrayerCalendar';
import { NavigationTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <Dashboard />;
      case NavigationTab.CALENDAR:
        return <PrayerCalendar />;
      case NavigationTab.QURAN:
        return <QuranPlayer />;
      case NavigationTab.GUIDE:
        return <Guide />;
      case NavigationTab.DUAS:
        return <DuaGuide />;
      case NavigationTab.AI_ASSISTANT:
        return <GeminiAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
