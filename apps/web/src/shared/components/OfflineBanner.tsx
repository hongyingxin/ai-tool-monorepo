import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 实测连通性函数
    const verifyConnectivity = async () => {
      if (!navigator.onLine) {
        setIsOffline(true);
        return;
      }

      try {
        // 使用 cache: 'no-store' 强制跳过缓存，并发起一个真实的请求确认
        // 这里请求 favicon.ico 或 vite.svg 等存在的静态资源
        await fetch('/vite.svg', { 
          method: 'HEAD', 
          cache: 'no-store',
          mode: 'no-cors' // 避免 CORS 问题（虽然是同源请求）
        });
        // 如果能走到这里且没报错，说明网络是通的
        setIsOffline(false);
      } catch (err) {
        // 请求失败（TypeError: Failed to fetch）意味着真正的离线
        console.log('[Network] Connectivity check failed, assuming offline');
        setIsOffline(true);
      }
    };

    const handleOnline = () => {
      console.log('[Network] Event: online');
      verifyConnectivity();
    };
    const handleOffline = () => {
      console.log('[Network] Event: offline');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 初始化时强制实测一次
    verifyConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '14px',
      borderBottom: '1px solid #fecaca',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <WifiOff size={16} />
      <span>当前处于离线模式，功能受限</span>
    </div>
  );
};

export default OfflineBanner;
