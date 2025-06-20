'use client';

import { useState, useEffect } from 'react';
import AgentLogin from '@/components/AgentLogin';
import AgentDashboard from '@/components/AgentDashboard';

export default function AgentPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (key: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (response.ok) {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        alert('Invalid API key');
      }
    } catch {
      alert('Failed to authenticate');
    }
  };

  if (!isAuthenticated) {
    return <AgentLogin onLogin={handleLogin} />;
  }

  return <AgentDashboard />;
}