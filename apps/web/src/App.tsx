import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import Home from './modules/home/Home';
import InterviewPage from './modules/interview/InterviewPage';
import InterviewLanding from './modules/interview/InterviewLanding';
import SettingsForm from './modules/interview/components/SettingsForm';
import InterviewSession from './modules/interview/components/InterviewSession';
import FeedbackReport from './modules/interview/components/FeedbackReport';
import HistoryList from './modules/interview/components/HistoryList';
import HistoryDetail from './modules/interview/components/HistoryDetail';
import ChatPage from './modules/chat/ChatPage';
import SettingsPage from './modules/settings/SettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="interview" element={<InterviewPage />}>
            <Route index element={<InterviewLanding />} />
            <Route path="setup" element={<SettingsForm />} />
            <Route path="session" element={<InterviewSession />} />
            <Route path="result" element={<FeedbackReport />} />
            <Route path="history" element={<HistoryList />} />
            <Route path="history/:id" element={<HistoryDetail />} />
          </Route>
          <Route path="chat" element={<ChatPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
