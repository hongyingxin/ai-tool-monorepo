import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';
import Home from './modules/home/Home';
import InterviewModule from './modules/interview/pages/InterviewModule';
import InterviewHome from './modules/interview/pages/InterviewHome';
import SettingsForm from './modules/interview/pages/SettingsForm';
import InterviewSession from './modules/interview/pages/InterviewSession';
import FeedbackReport from './modules/interview/pages/FeedbackReport';
import HistoryList from './modules/interview/pages/HistoryList';
import HistoryDetail from './modules/interview/pages/HistoryDetail';
import ChatPage from './modules/chat/ChatPage';
import SettingsPage from './modules/settings/SettingsPage';

/**
 * 全局路由配置
 * 使用数据路由模式 (Data Router)，职责清晰，便于维护
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'interview',
        element: <InterviewModule />,
        children: [
          {
            index: true,
            element: <InterviewHome />,
          },
          {
            path: 'setup',
            element: <SettingsForm />,
          },
          {
            path: 'session',
            element: <InterviewSession />,
          },
          {
            path: 'result',
            element: <FeedbackReport />,
          },
          {
            path: 'history',
            element: <HistoryList />,
          },
          {
            path: 'history/:id',
            element: <HistoryDetail />,
          },
        ],
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      // 捕获所有未定义的路径并重定向到首页
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

