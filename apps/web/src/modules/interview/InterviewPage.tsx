import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 面试模块主页面容器
 * 现在的业务逻辑由嵌套路由分发到 InterviewLanding, HistoryList, HistoryDetail 等组件
 */
const InterviewPage: React.FC = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default InterviewPage;
