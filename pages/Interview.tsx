import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { InterviewStatus, Message, PermissionState } from '../types';
import { interviewService } from '../services/gemini';

const CheckItem: React.FC<{ label: string; checked: boolean; loading?: boolean }> = ({ label, checked, loading }) => (
  <div className="flex items-center gap-3 py-2">
    <div className={`w-6 h-6 border-2 border-black flex items-center justify-center ${checked ? 'bg-[#ff8fa3]' : 'bg-white'}`}>
      {checked && <span className="text-black font-bold">✓</span>}
      {loading && !checked && <span className="animate-spin text-black text-xs">◐</span>}
    </div>
    <span className={`font-mono text-sm ${checked ? 'text-black' : 'text-gray-500'}`}>{label}</span>
  </div>
);

export const Interview: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [permissions, setPermissions] = useState<PermissionState>({ audio: false, video: false, screen: false });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial check logic could go here
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      screenStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const requestPermissions = async () => {
    setStatus(InterviewStatus.CHECKING);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setPermissions(prev => ({ ...prev, audio: true, video: true }));
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus(InterviewStatus.READY);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("We need camera and microphone permissions to proceed.");
      setStatus(InterviewStatus.IDLE);
    }
  };

  const startInterview = async () => {
    try {
      // Request Screen Share
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(displayStream);
      setPermissions(prev => ({ ...prev, screen: true }));
      
      if (screenRef.current) {
        screenRef.current.srcObject = displayStream;
      }

      setStatus(InterviewStatus.ACTIVE);
      
      // Initialize AI
      setIsLoading(true);
      const initialResponse = await interviewService.startInterview();
      setMessages([{ role: 'model', text: initialResponse, timestamp: new Date() }]);
      setIsLoading(false);

    } catch (err) {
      console.error("Error getting display media", err);
      alert("Screen sharing is required for the technical assessment.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await interviewService.sendMessage(history, userMsg.text);
    
    setMessages(prev => [...prev, { role: 'model', text: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto mt-12 px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-600">Careers at Interview.AI</h2>
          <h1 className="text-5xl md:text-7xl font-serif text-black mb-6 leading-tight">
            Forward Deployed <br/> Engineer Interview
          </h1>
          <p className="text-xl md:text-2xl font-serif text-gray-700 italic">
            Join the team decoding conversation.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* LEFT: AI Avatar / Interviewer */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-4 brutalist-shadow relative overflow-hidden h-[400px] md:h-[500px] flex flex-col">
              <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-mono text-xs z-20">
                AI_INTERVIEWER_CAM_01
              </div>
              
              {/* Simulated Avatar View */}
              <div className="flex-1 bg-[#f0f0f0] relative border-2 border-black overflow-hidden flex items-center justify-center">
                 {/* Decorative background for avatar */}
                 <div className="absolute inset-0 opacity-10 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-200 via-slate-600 to-indigo-200"></div>
                 
                 {/* The "Avatar" */}
                 <div className="relative w-48 h-48">
                    <div className={`absolute inset-0 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 ${isLoading ? 'animate-pulse' : ''}`}></div>
                    <img 
                      src="https://picsum.photos/400/400?grayscale" 
                      alt="AI Avatar" 
                      className="w-full h-full object-cover border-2 border-black filter contrast-125"
                    />
                    {/* Speaking Indicator */}
                    {isLoading && (
                       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                          <div className="w-2 h-2 bg-[#ff8fa3] animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#ff8fa3] animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-[#ff8fa3] animate-bounce delay-150"></div>
                       </div>
                    )}
                 </div>

                 {/* Scanlines Overlay */}
                 <div className="absolute inset-0 scanlines pointer-events-none opacity-30"></div>
              </div>

              {/* Chat Interface (appears when Active) */}
              {status === InterviewStatus.ACTIVE && (
                <div className="mt-4 h-[150px] flex flex-col bg-white border-2 border-black relative">
                   <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm font-mono" id="chat-container">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`p-2 border border-black ${msg.role === 'user' ? 'bg-[#dcd6f7] ml-4' : 'bg-gray-100 mr-4'}`}>
                           <span className="font-bold block text-[10px] uppercase mb-1 text-gray-500">{msg.role}</span>
                           <span className="text-black">{msg.text}</span>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                   </div>
                   <form onSubmit={handleSendMessage} className="border-t-2 border-black flex">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type response..." 
                        className="flex-1 p-2 outline-none text-sm bg-white text-black"
                        autoFocus
                      />
                      <button type="submit" disabled={isLoading} className="bg-black text-white px-3 text-xs font-bold hover:bg-gray-800 disabled:opacity-50">SEND</button>
                   </form>
                </div>
              )}
            </div>
            
            {/* Context/Info Card */}
            <div className="bg-[#fdf6e3] border-2 border-black p-6 brutalist-shadow text-black">
               <h3 className="serif-font text-2xl mb-4 text-black">Role Context</h3>
               <p className="font-mono text-sm leading-relaxed opacity-80 mb-4 text-black">
                 You are applying for a technical client-facing role. 
                 The AI agent will test your ability to explain complex concepts 
                 and troubleshoot live issues.
               </p>
               <div className="flex gap-2 flex-wrap">
                  <span className="bg-white border border-black px-2 py-1 text-xs font-bold text-black">REACT</span>
                  <span className="bg-white border border-black px-2 py-1 text-xs font-bold text-black">TYPESCRIPT</span>
                  <span className="bg-white border border-black px-2 py-1 text-xs font-bold text-black">SALES</span>
               </div>
            </div>
          </div>

          {/* RIGHT: User Camera & Setup */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="bg-white border-2 border-black p-2 brutalist-shadow relative h-[500px]">
               <div className="absolute top-0 left-0 bg-[#ff8fa3] text-black px-3 py-1 font-mono text-xs z-20 border-r-2 border-b-2 border-black font-bold">
                CANDIDATE_FEED_LIVE
              </div>

              {/* User Video Container */}
              <div className="w-full h-full bg-black relative overflow-hidden group">
                 
                 {/* Main User Camera */}
                 {!localStream ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-[#1a1a1a]">
                       <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                       </div>
                       <p className="font-mono text-sm">CAMERA FEED DISCONNECTED</p>
                    </div>
                 ) : (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted 
                      className={`w-full h-full object-cover ${screenStream ? 'opacity-40' : 'opacity-100'}`}
                    />
                 )}

                 {/* Screen Share Overlay (Picture in Picture style logic) */}
                 {screenStream && (
                    <div className="absolute inset-4 z-10 border-2 border-[#ff8fa3] shadow-lg bg-black">
                       <video 
                          ref={screenRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-contain"
                       />
                       <div className="absolute top-2 right-2 bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
                    </div>
                 )}

                 {/* Controls Overlay */}
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-black/80 backdrop-blur border border-white/20 p-2 text-white text-xs font-mono">
                       <div>MIC: {permissions.audio ? 'ON' : 'OFF'}</div>
                       <div>CAM: {permissions.video ? 'ON' : 'OFF'}</div>
                       <div>SCR: {permissions.screen ? 'SHARING' : 'OFF'}</div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Checklist & Actions Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white border-2 border-black p-6 brutalist-shadow">
                 <h4 className="font-bold border-b-2 border-black pb-2 mb-4 text-black">SYSTEM CHECK</h4>
                 <div className="space-y-1">
                    <CheckItem 
                      label="Camera Access" 
                      checked={permissions.video} 
                      loading={status === InterviewStatus.CHECKING} 
                    />
                    <CheckItem 
                      label="Microphone Access" 
                      checked={permissions.audio} 
                      loading={status === InterviewStatus.CHECKING} 
                    />
                    <CheckItem 
                      label="Screen Share Permission" 
                      checked={permissions.screen} 
                      loading={status === InterviewStatus.ACTIVE && !permissions.screen} 
                    />
                    <CheckItem 
                      label="Network Latency < 100ms" 
                      checked={true} 
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-4 justify-center">
                 {status === InterviewStatus.IDLE && (
                    <Button onClick={requestPermissions} fullWidth className="h-16 text-lg">
                       INITIALIZE HARDWARE
                    </Button>
                 )}
                 
                 {status === InterviewStatus.READY && (
                    <div className="space-y-4">
                      <div className="text-xs font-mono text-gray-600 bg-white p-2 border border-black">
                        * By clicking Start, you will be prompted to share your screen. Select the window where your coding environment is open.
                      </div>
                      <Button onClick={startInterview} variant="primary" fullWidth className="h-16 text-xl tracking-wider">
                         START INTERVIEW
                      </Button>
                    </div>
                 )}

                 {status === InterviewStatus.ACTIVE && (
                    <div className="bg-black text-[#ff8fa3] p-6 border-2 border-[#ff8fa3] brutalist-shadow h-full flex flex-col justify-center items-center text-center">
                       <span className="animate-pulse font-mono text-xl font-bold mb-2">● RECORDING</span>
                       <p className="text-white text-sm">Session ID: TVS-882-991</p>
                       <button 
                          onClick={() => window.location.reload()} 
                          className="mt-4 border border-[#ff8fa3] text-white px-4 py-1 hover:bg-[#ff8fa3] hover:text-black transition-colors text-xs"
                        >
                          END SESSION
                       </button>
                    </div>
                 )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Logos */}
        <div className="border-t-2 border-black pt-12 text-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="serif-font text-2xl mb-8 text-black">Backed by the leaders in venture and innovation</p>
          <div className="flex justify-center items-center gap-12 flex-wrap text-black">
            <span className="text-3xl font-black font-sans tracking-tight">crv</span>
            <span className="text-3xl font-bold font-sans tracking-widest">SCALE</span>
            <div className="w-10 h-10 bg-gray-400 text-white font-serif flex items-center justify-center text-xl font-bold">Y</div>
            <span className="text-xl font-serif tracking-widest">SEQUOIA</span>
          </div>
        </div>

      </main>
    </div>
  );
};


