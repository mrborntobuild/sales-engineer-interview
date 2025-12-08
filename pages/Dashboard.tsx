import React, { useState } from 'react';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  date: Date;
  duration: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  transcript: string;
  score?: number;
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen@example.com',
    date: new Date('2024-01-15'),
    duration: '45m 23s',
    status: 'completed',
    transcript: `Interviewer: Welcome! Let's start with a brief introduction. Tell me about yourself and your background.

Candidate: Hi! I'm Sarah, and I've been working as a Sales Engineer for the past 5 years. I specialize in cloud infrastructure and API integrations.

Interviewer: Great! Can you walk me through how you would explain our API rate limiting to a potential customer who's concerned about scalability?

Candidate: Absolutely. I'd start by explaining that rate limiting is actually a feature that protects their application's performance. I'd show them our dashboard where they can monitor their usage in real-time...`,
    score: 8.5
  },
  {
    id: '2',
    candidateName: 'Michael Rodriguez',
    candidateEmail: 'm.rodriguez@example.com',
    date: new Date('2024-01-14'),
    duration: '38m 12s',
    status: 'completed',
    transcript: `Interviewer: Thanks for joining us today. Let's dive right in. How do you approach a technical proof-of-concept?

Candidate: I always start by understanding the customer's specific use case and pain points. Then I build a minimal viable demo that addresses their core needs...`,
    score: 7.8
  },
  {
    id: '3',
    candidateName: 'Emily Watson',
    candidateEmail: 'emily.w@example.com',
    date: new Date('2024-01-13'),
    duration: '52m 45s',
    status: 'completed',
    transcript: `Interviewer: Welcome! Tell me about a time you had to troubleshoot a complex integration issue during a customer call.

Candidate: Sure! Last quarter, we had a customer experiencing authentication failures. I used our debugging tools to trace the issue to a token expiration problem...`,
    score: 9.2
  },
  {
    id: '4',
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@example.com',
    date: new Date('2024-01-12'),
    duration: '15m 30s',
    status: 'cancelled',
    transcript: 'Interview cancelled by candidate.',
    score: undefined
  }
];

export const Dashboard: React.FC = () => {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterviews = mockInterviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto mt-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-black mb-2">Dashboard</h1>
          <p className="text-lg text-gray-700 font-mono">View past interviews and transcripts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interview List */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black brutalist-shadow p-4 mb-4">
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-2 border-black outline-none font-mono text-sm"
              />
            </div>

            <div className="bg-white border-2 border-black brutalist-shadow">
              <div className="p-4 border-b-2 border-black">
                <h2 className="font-bold text-lg text-black">Past Interviews</h2>
                <p className="text-xs text-gray-600 font-mono">{filteredInterviews.length} total</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {filteredInterviews.map((interview) => (
                  <button
                    key={interview.id}
                    onClick={() => setSelectedInterview(interview)}
                    className={`w-full text-left p-4 border-b-2 border-black hover:bg-[#dcd6f7] transition-colors ${
                      selectedInterview?.id === interview.id ? 'bg-[#dcd6f7]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-black">{interview.candidateName}</h3>
                        <p className="text-xs text-gray-600 font-mono">{interview.candidateEmail}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 border border-black ${
                        interview.status === 'completed' ? 'bg-[#ff8fa3]' :
                        interview.status === 'in-progress' ? 'bg-yellow-200' :
                        'bg-gray-200'
                      } text-black`}>
                        {interview.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-gray-600">
                      <span>{formatDate(interview.date)}</span>
                      <span>{interview.duration}</span>
                    </div>
                    {interview.score && (
                      <div className="mt-2 text-xs font-bold text-black">
                        Score: {interview.score}/10
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Transcript View */}
          <div className="lg:col-span-2">
            {selectedInterview ? (
              <div className="bg-white border-2 border-black brutalist-shadow">
                <div className="p-6 border-b-2 border-black">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-serif text-black mb-1">{selectedInterview.candidateName}</h2>
                      <p className="text-sm font-mono text-gray-600">{selectedInterview.candidateEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-gray-600">{formatDate(selectedInterview.date)}</p>
                      <p className="text-sm font-mono text-gray-600">Duration: {selectedInterview.duration}</p>
                      {selectedInterview.score && (
                        <p className="text-lg font-bold text-black mt-2">Score: {selectedInterview.score}/10</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-bold px-3 py-1 border-2 border-black ${
                      selectedInterview.status === 'completed' ? 'bg-[#ff8fa3]' :
                      selectedInterview.status === 'in-progress' ? 'bg-yellow-200' :
                      'bg-gray-200'
                    } text-black`}>
                      {selectedInterview.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-black border-b-2 border-black pb-2">Transcript</h3>
                  <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-black bg-gray-50 p-4 border-2 border-black max-h-[500px] overflow-y-auto">
                    {selectedInterview.transcript}
                  </div>
                </div>

                <div className="p-6 border-t-2 border-black bg-gray-50">
                  <button className="bg-black text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors mr-2">
                    DOWNLOAD PDF
                  </button>
                  <button className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors">
                    SHARE TRANSCRIPT
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-black brutalist-shadow p-12 text-center">
                <p className="text-gray-600 font-mono text-lg">Select an interview to view the transcript</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


