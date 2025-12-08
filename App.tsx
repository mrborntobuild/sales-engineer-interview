import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TopBanner, Navbar } from './components/Layout';
import { Interview } from './pages/Interview';
import { Dashboard } from './pages/Dashboard';
import { Candidates } from './pages/Candidates';
import { Settings } from './pages/Settings';
import { TavusInterview } from './pages/TavusInterview';
import { TavusConversation } from './pages/TavusConversation';
import { Conversations } from './pages/Conversations';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isTavusPage =
    location.pathname === '/tavus-interview' || location.pathname === '/tavus-conversation';

  if (isTavusPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <TopBanner />
      <Navbar />

      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Interview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/tavus-interview" element={<TavusInterview />} />
          <Route path="/tavus-conversation" element={<TavusConversation />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;