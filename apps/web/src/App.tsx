import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

/**
 * 应用程序根组件
 * 职责：提供路由 Provider，使全局路由配置生效
 */
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
