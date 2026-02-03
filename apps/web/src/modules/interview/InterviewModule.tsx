import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 面试模块根容器
 * 负责定义该模块通用的布局或容器样式，现在的业务逻辑由嵌套路由分发
 */
const InterviewModule: React.FC = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default InterviewModule;

