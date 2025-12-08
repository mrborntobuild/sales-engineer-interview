import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TavusInterview: React.FC = () => {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = () => {
    setIsStarting(true);
    // In a real scenario, this would redirect to the actual Tavus conversation URL
    // For now, we'll simulate it
    setTimeout(() => {
      alert('In production, this would redirect to the Tavus conversation URL');
      setIsStarting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dcd6f7] via-[#e8e3f5] to-[#f0edf8] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white border-2 border-black brutalist-shadow p-4 mb-6">
            <img 
              src="/tavus-logo.svg" 
              alt="Tavus Logo" 
              className="h-8 mx-auto mb-2"
            />
            <div className="w-16 h-1 bg-[#ff8fa3] mx-auto"></div>
          </div>
          <p className="font-mono text-sm text-gray-600 animate-bounce">
            ↓ Scroll down to see more information ↓
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border-2 border-black brutalist-shadow p-8 md:p-12">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
              Welcome to Your Interview
            </h2>
            <p className="text-lg md:text-xl font-mono text-gray-700 leading-relaxed">
              Hey! You are being screened by <span className="font-bold text-black">Tavus</span> as a <span className="font-bold text-[#ff8fa3]">Sales Engineer</span>.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[#fdf6e3] border-2 border-black p-6 mb-8">
            <h3 className="text-xl font-serif text-black mb-4 border-b-2 border-black pb-2">
              Your Job
            </h3>
            <p className="font-mono text-base text-black mb-4">
              Your job is to answer the questions we are looking for. Please be thorough, 
              clear, and demonstrate your technical knowledge and communication skills.
            </p>
          </div>

          {/* Questions Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-serif text-black mb-6 border-b-2 border-black pb-2">
              What We're Looking For
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#ff8fa3] border-2 border-black flex items-center justify-center font-bold text-black">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-mono text-base text-black">
                    <span className="font-bold">Technical Depth:</span> Demonstrate your understanding 
                    of complex technical concepts, APIs, cloud architecture, and system design.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#ff8fa3] border-2 border-black flex items-center justify-center font-bold text-black">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-mono text-base text-black">
                    <span className="font-bold">Communication Skills:</span> Explain technical concepts 
                    clearly to both technical and non-technical audiences. Show your ability to 
                    translate complex ideas into understandable terms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-[#ff8fa3] border-2 border-black flex items-center justify-center font-bold text-black">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-mono text-base text-black">
                    <span className="font-bold">Problem-Solving:</span> Showcase your ability to 
                    troubleshoot issues, handle difficult customer situations, and think on your 
                    feet during technical demonstrations and proof-of-concepts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 border-2 border-black p-6 mb-8">
            <h4 className="font-bold text-black mb-3 font-mono">Important Notes:</h4>
            <ul className="space-y-2 font-mono text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#ff8fa3] font-bold">•</span>
                <span>This interview will be recorded for evaluation purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff8fa3] font-bold">•</span>
                <span>Ensure you have a stable internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff8fa3] font-bold">•</span>
                <span>Find a quiet environment with good lighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff8fa3] font-bold">•</span>
                <span>Have your camera and microphone ready</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff8fa3] font-bold">•</span>
                <span>The interview will take approximately 30-45 minutes</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartInterview}
              disabled={isStarting}
              className="flex-1 bg-[#ff8fa3] text-black px-8 py-4 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isStarting ? 'STARTING INTERVIEW...' : 'START INTERVIEW'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-8 py-4 font-bold border-2 border-black brutalist-shadow hover:bg-gray-50 transition-colors"
            >
              GO BACK
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="font-mono text-sm text-gray-600">
            Powered by <span className="font-bold text-black">Tavus</span> • Interview.AI Platform
          </p>
        </div>
      </div>
    </div>
  );
};

