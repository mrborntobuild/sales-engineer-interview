import React, { useState } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'interviewed' | 'hired' | 'rejected';
  interviewCount: number;
  lastInterview?: Date;
  averageScore?: number;
  resumeUrl?: string;
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Sales Engineer',
    status: 'interviewed',
    interviewCount: 3,
    lastInterview: new Date('2024-01-15'),
    averageScore: 8.5,
    resumeUrl: '#'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'm.rodriguez@example.com',
    phone: '+1 (555) 234-5678',
    position: 'Sales Engineer',
    status: 'interviewed',
    interviewCount: 2,
    lastInterview: new Date('2024-01-14'),
    averageScore: 7.8
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.w@example.com',
    phone: '+1 (555) 345-6789',
    position: 'Senior Sales Engineer',
    status: 'hired',
    interviewCount: 4,
    lastInterview: new Date('2024-01-13'),
    averageScore: 9.2
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 456-7890',
    position: 'Sales Engineer',
    status: 'rejected',
    interviewCount: 1,
    lastInterview: new Date('2024-01-12'),
    averageScore: 5.5
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'j.martinez@example.com',
    phone: '+1 (555) 567-8901',
    position: 'Sales Engineer',
    status: 'active',
    interviewCount: 0
  },
  {
    id: '6',
    name: 'Robert Taylor',
    email: 'r.taylor@example.com',
    phone: '+1 (555) 678-9012',
    position: 'Senior Sales Engineer',
    status: 'interviewed',
    interviewCount: 2,
    lastInterview: new Date('2024-01-10'),
    averageScore: 8.0
  }
];

export const Candidates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'bg-green-200';
      case 'rejected': return 'bg-red-200';
      case 'interviewed': return 'bg-[#ff8fa3]';
      case 'active': return 'bg-yellow-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto mt-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-black mb-2">Candidates</h1>
          <p className="text-lg text-gray-700 font-mono">View and manage all candidates</p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-black brutalist-shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border-2 border-black outline-none font-mono text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border-2 border-black outline-none font-mono text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border-2 border-black brutalist-shadow p-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-black mb-1">{candidate.name}</h3>
                  <p className="text-sm font-mono text-gray-600">{candidate.position}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 border border-black ${getStatusColor(candidate.status)} text-black`}>
                  {candidate.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-mono text-gray-700">
                  <span>📧</span>
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-700">
                  <span>📞</span>
                  <span>{candidate.phone}</span>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4 mt-4">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-gray-600">Interviews:</span>
                  <span className="font-bold text-black">{candidate.interviewCount}</span>
                </div>
                {candidate.lastInterview && (
                  <div className="flex justify-between items-center text-sm font-mono mt-1">
                    <span className="text-gray-600">Last:</span>
                    <span className="text-black">{formatDate(candidate.lastInterview)}</span>
                  </div>
                )}
                {candidate.averageScore && (
                  <div className="flex justify-between items-center text-sm font-mono mt-1">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="font-bold text-black">{candidate.averageScore}/10</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-black text-white px-4 py-2 text-xs font-bold border-2 border-black brutalist-shadow-sm hover:bg-gray-800 transition-colors">
                  VIEW PROFILE
                </button>
                {candidate.resumeUrl && (
                  <button className="bg-[#ff8fa3] text-black px-4 py-2 text-xs font-bold border-2 border-black brutalist-shadow-sm hover:bg-[#ff7a91] transition-colors">
                    RESUME
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="bg-white border-2 border-black brutalist-shadow p-12 text-center">
            <p className="text-gray-600 font-mono text-lg">No candidates found matching your criteria</p>
          </div>
        )}

        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCandidate(null)}
          >
            <div 
              className="bg-white border-2 border-black brutalist-shadow max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b-2 border-black">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-serif text-black mb-2">{selectedCandidate.name}</h2>
                    <p className="text-lg font-mono text-gray-600">{selectedCandidate.position}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="text-2xl font-bold text-black hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <span className={`inline-block text-xs font-bold px-3 py-1 border-2 border-black ${getStatusColor(selectedCandidate.status)} text-black mt-4`}>
                  {selectedCandidate.status.toUpperCase()}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-black mb-2 border-b-2 border-black pb-1">Contact Information</h3>
                  <div className="font-mono text-sm space-y-1">
                    <p><span className="text-gray-600">Email:</span> {selectedCandidate.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedCandidate.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-black mb-2 border-b-2 border-black pb-1">Interview Statistics</h3>
                  <div className="font-mono text-sm space-y-1">
                    <p><span className="text-gray-600">Total Interviews:</span> {selectedCandidate.interviewCount}</p>
                    {selectedCandidate.lastInterview && (
                      <p><span className="text-gray-600">Last Interview:</span> {formatDate(selectedCandidate.lastInterview)}</p>
                    )}
                    {selectedCandidate.averageScore && (
                      <p><span className="text-gray-600">Average Score:</span> <span className="font-bold">{selectedCandidate.averageScore}/10</span></p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="bg-black text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors">
                    VIEW ALL INTERVIEWS
                  </button>
                  <button className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors">
                    SCHEDULE INTERVIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


