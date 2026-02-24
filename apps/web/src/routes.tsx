import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';

// 路由懒加载
const Home = lazy(() => import('./modules/home/Home'));
const InterviewModule = lazy(() => import('./modules/interview/pages/InterviewModule'));
const InterviewHome = lazy(() => import('./modules/interview/pages/InterviewHome'));
const SettingsForm = lazy(() => import('./modules/interview/pages/SettingsForm'));
const InterviewSession = lazy(() => import('./modules/interview/pages/InterviewSession'));
const FeedbackReport = lazy(() => import('./modules/interview/pages/FeedbackReport'));
const HistoryList = lazy(() => import('./modules/interview/pages/HistoryList'));
const HistoryDetail = lazy(() => import('./modules/interview/pages/HistoryDetail'));
const ChatPage = lazy(() => import('./modules/chat/ChatPage'));
const SettingsPage = lazy(() => import('./modules/settings/SettingsPage'));
const ResumeModule = lazy(() => import('./modules/resume/pages/ResumeModule'));
const ResumeSetupPage = lazy(() => import('./modules/resume/pages/ResumeSetupPage'));
const ResumeResultPage = lazy(() => import('./modules/resume/pages/ResumeResultPage'));
const ResumePreviewPage = lazy(() => import('./modules/resume/pages/ResumePreviewPage'));

// 简单的加载占位组件
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

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
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'interview',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InterviewModule />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: 'resume',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeModule />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <ResumeSetupPage />,
          },
          {
            path: 'result',
            element: <ResumeResultPage />,
          },
          {
            path: 'preview',
            element: <ResumePreviewPage />,
          },
        ],
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      // 捕获所有未定义的路径并重定向到首页
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

