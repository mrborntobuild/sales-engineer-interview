import React from 'react';

export const TopBanner: React.FC = () => (
  <div className="bg-[#ff8fa3] text-black text-xs md:text-sm py-2 px-4 border-b-2 border-black flex justify-between items-center relative z-50">
    <div className="mx-auto flex items-center gap-2">
      <span className="text-xl">😎</span>
      <span className="font-medium text-black">Ready to prove your Sales Engineering skills? Start the challenge today.</span>
    </div>
    <button className="border border-black px-1 hover:bg-white transition-colors text-black">✕</button>
  </div>
);

export const Navbar: React.FC = () => (
  <nav className="w-full max-w-7xl mx-auto mt-6 px-4 md:px-6 relative z-40">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Logo Area */}
      <div className="flex bg-white border-2 border-black brutalist-shadow text-black">
        <div className="px-4 py-2 font-black text-2xl tracking-tighter flex items-center border-r-2 border-black text-black">
          <span className="mr-1">◢</span>
          INTERVIEW.AI
        </div>
        <div className="hidden md:flex">
           <a href="#" className="px-4 py-3 text-sm font-bold hover:bg-[#dcd6f7] transition-colors border-r-2 border-black flex items-center text-black">
             <span className="bg-[#ff8fa3] text-[10px] px-1 border border-black mr-2 text-black">BETA</span>
             DASHBOARD
           </a>
           <a href="#" className="px-4 py-3 text-sm font-bold hover:bg-[#dcd6f7] transition-colors border-r-2 border-black flex items-center text-black">
             CANDIDATES
           </a>
           <a href="#" className="px-4 py-3 text-sm font-bold hover:bg-[#dcd6f7] transition-colors flex items-center text-black">
             SETTINGS
           </a>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex gap-4">
        <div className="bg-white border-2 border-black brutalist-shadow flex">
            <button className="px-6 py-2 font-bold hover:bg-gray-100 border-r-2 border-black text-black">LOGOUT</button>
            <button className="px-6 py-2 font-bold bg-[#ff8fa3] hover:bg-[#ff7a91] text-black">PROFILE</button>
        </div>
      </div>
    </div>
  </nav>
);