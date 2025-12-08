import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const TavusConversation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationUrl = searchParams.get('url');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationUrl) {
      // If no URL provided, redirect back to interview page
      navigate('/');
    }
  }, [conversationUrl, navigate]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!conversationUrl) {
    return (
      <div className="min-h-screen bg-[#dcd6f7] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-lg text-black mb-4">No conversation URL provided</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors"
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#dcd6f7]">
      {/* Header Bar */}
      <div className="bg-white border-b-2 border-black p-3 flex justify-between items-center flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-4 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-50 transition-colors text-sm"
          >
            ← BACK
          </button>
          <h1 className="font-serif text-xl text-black">Tavus Interview Session</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-600">Powered by Tavus</span>
        </div>
      </div>

      {/* Tavus Conversation Iframe Container */}
      <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#ff8fa3] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="font-mono text-sm text-gray-600">Loading interview session...</p>
            </div>
          </div>
        )}

        {/* Tavus Conversation Iframe */}
        <iframe
          src={conversationUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Tavus Interview"
          allow="camera; microphone; fullscreen; autoplay"
          allowFullScreen
          onLoad={handleIframeLoad}
          style={{ 
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        />
      </div>
    </div>
  );
};

