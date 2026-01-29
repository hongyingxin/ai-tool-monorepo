import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import Home from './modules/home/Home';
import InterviewPage from './modules/interview/InterviewPage';
import ChatPage from './modules/chat/ChatPage';
import SettingsPage from './modules/settings/SettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
