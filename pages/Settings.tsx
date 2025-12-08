import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TavusTestModal } from '../components/TavusTestModal';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [tavusApiKey, setTavusApiKey] = useState('');
  const [showTavusTest, setShowTavusTest] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    sms: false
  });
  const [theme, setTheme] = useState('light');
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('Settings saved!');
  };

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <main className="relative z-10 max-w-4xl mx-auto mt-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-black mb-2">Settings</h1>
          <p className="text-lg text-gray-700 font-mono">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* API Configuration */}
          <div className="bg-white border-2 border-black brutalist-shadow p-6">
            <h2 className="text-2xl font-serif text-black mb-4 border-b-2 border-black pb-2">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm font-bold text-black mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full p-3 border-2 border-black outline-none font-mono text-sm"
                />
                <p className="text-xs text-gray-600 font-mono mt-1">
                  Your API key is stored securely and never shared
                </p>
              </div>
              <div>
                <label className="block font-mono text-sm font-bold text-black mb-2">
                  Tavus API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={tavusApiKey}
                    onChange={(e) => setTavusApiKey(e.target.value)}
                    placeholder="Enter your Tavus API key"
                    className="flex-1 p-3 border-2 border-black outline-none font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowTavusTest(true)}
                    className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors whitespace-nowrap"
                    title="Test Tavus Service"
                  >
                    TEST TAVUS SERVICE
                  </button>
                </div>
                <p className="text-xs text-gray-600 font-mono mt-1">
                  Set VITE_TAVUS_API_KEY in .env.local and restart dev server
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => navigate('/tavus-interview')}
                    className="text-xs font-mono text-[#ff8fa3] hover:text-black underline"
                  >
                    View Tavus Interview Test Page →
                  </button>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors"
              >
                SAVE API KEYS
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border-2 border-black brutalist-shadow p-6">
            <h2 className="text-2xl font-serif text-black mb-4 border-b-2 border-black pb-2">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-5 h-5 border-2 border-black"
                />
                <span className="font-mono text-sm text-black">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.slack}
                  onChange={(e) => setNotifications({ ...notifications, slack: e.target.checked })}
                  className="w-5 h-5 border-2 border-black"
                />
                <span className="font-mono text-sm text-black">Slack Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="w-5 h-5 border-2 border-black"
                />
                <span className="font-mono text-sm text-black">SMS Notifications</span>
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border-2 border-black brutalist-shadow p-6">
            <h2 className="text-2xl font-serif text-black mb-4 border-b-2 border-black pb-2">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm font-bold text-black mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 border-2 border-black outline-none font-mono text-sm bg-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-5 h-5 border-2 border-black"
                />
                <span className="font-mono text-sm text-black">Auto-save transcripts</span>
              </label>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white border-2 border-black brutalist-shadow p-6">
            <h2 className="text-2xl font-serif text-black mb-4 border-b-2 border-black pb-2">Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm font-bold text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@interview.ai"
                  className="w-full p-3 border-2 border-black outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-mono text-sm font-bold text-black mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  defaultValue="Interview.AI"
                  className="w-full p-3 border-2 border-black outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border-2 border-red-500 brutalist-shadow p-6">
            <h2 className="text-2xl font-serif text-red-600 mb-4 border-b-2 border-red-500 pb-2">Danger Zone</h2>
            <div className="space-y-4">
              <button className="bg-red-500 text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-red-600 transition-colors">
                DELETE ALL DATA
              </button>
              <button className="bg-red-500 text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-red-600 transition-colors ml-2">
                DEACTIVATE ACCOUNT
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button className="bg-white text-black px-8 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-gray-50 transition-colors">
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-8 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors"
            >
              SAVE ALL SETTINGS
            </button>
          </div>
        </div>
      </main>

      {/* Tavus Test Modal */}
      <TavusTestModal isOpen={showTavusTest} onClose={() => setShowTavusTest(false)} />
    </div>
  );
};

