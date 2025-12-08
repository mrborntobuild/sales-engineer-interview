import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { tavusService, Conversation, ConversationDetails } from '../services/tavus';

export const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'transcript' | 'analysis'>('transcript');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tavusService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    // Reset state when selecting a new conversation
    setSelectedConversation(conversation);
    setConversationDetails(null); // Clear previous details
    setError(null);
    setLoadingDetails(true);
    
    try {
      console.log('Fetching details for conversation:', conversation.conversation_id);
      const details = await tavusService.getConversationDetails(conversation.conversation_id);
      console.log('Received conversation details:', details);
      console.log('Transcript type:', typeof details.transcript);
      console.log('Has transcript:', !!details.transcript);
      console.log('Has analysis:', !!details.analysis);
      
      if (details.transcript) {
        console.log('Transcript value:', details.transcript.substring(0, 100) + '...');
        if (typeof details.transcript === 'string') {
          try {
            const parsed = JSON.parse(details.transcript);
            console.log('Parsed transcript:', parsed);
            console.log('Transcript array length:', Array.isArray(parsed) ? parsed.length : 'Not an array');
          } catch (e) {
            console.error('Error parsing transcript in handleSelect:', e);
          }
        }
      }
      
      setConversationDetails(details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation details';
      setError(errorMessage);
      console.error('Error loading conversation details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.conversation_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.conversation_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-10 bg-[#dcd6f7] bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-white mix-blend-overlay z-0 noise-bg"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto mt-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-black mb-2">Past Conversations</h1>
          <p className="text-lg text-gray-700 font-mono">View and manage all Tavus interview conversations</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-2 border-red-500 p-4 mb-6">
            <p className="font-mono text-sm text-red-800 font-bold">ERROR:</p>
            <p className="font-mono text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Conversation List */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-black brutalist-shadow p-4 mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-2 border-black outline-none font-mono text-sm"
              />
            </div>

            <div className="bg-white border-2 border-black brutalist-shadow">
              <div className="p-4 border-b-2 border-black flex justify-between items-center">
                <h2 className="font-bold text-lg text-black">Conversations</h2>
                <button
                  onClick={loadConversations}
                  disabled={loading}
                  className="bg-[#ff8fa3] text-black px-3 py-1 text-xs font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors disabled:opacity-50"
                >
                  {loading ? 'LOADING...' : 'REFRESH'}
                </button>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#ff8fa3] border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="font-mono text-xs text-gray-600">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-mono text-sm text-gray-600">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.conversation_id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full text-left p-4 border-b-2 border-black hover:bg-[#dcd6f7] transition-colors ${
                        selectedConversation?.conversation_id === conversation.conversation_id
                          ? 'bg-[#dcd6f7]'
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-black text-sm">
                            {conversation.conversation_name || 'Untitled Conversation'}
                          </h3>
                          <p className="text-xs text-gray-600 font-mono mt-1">
                            {conversation.conversation_id}
                          </p>
                        </div>
                        {conversation.status && (
                          <span
                            className={`text-xs font-bold px-2 py-1 border border-black ${
                              conversation.status === 'completed'
                                ? 'bg-green-200'
                                : conversation.status === 'active'
                                ? 'bg-[#ff8fa3]'
                                : 'bg-gray-200'
                            } text-black`}
                          >
                            {conversation.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono text-gray-600">
                        <span>{formatDate(conversation.created_at)}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Conversation Details */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white border-2 border-black brutalist-shadow">
                <div className="p-6 border-b-2 border-black">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-serif text-black mb-1">
                        {selectedConversation.conversation_name || 'Untitled Conversation'}
                      </h2>
                      <p className="text-sm font-mono text-gray-600">
                        {selectedConversation.conversation_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-gray-600">
                        {formatDate(selectedConversation.created_at)}
                      </p>
                      {selectedConversation.status && (
                        <span
                          className={`inline-block mt-2 text-xs font-bold px-3 py-1 border-2 border-black ${
                            selectedConversation.status === 'completed'
                              ? 'bg-green-200'
                              : selectedConversation.status === 'active'
                              ? 'bg-[#ff8fa3]'
                              : 'bg-gray-200'
                          } text-black`}
                        >
                          {selectedConversation.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {loadingDetails ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-12 h-12 border-4 border-[#ff8fa3] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="font-mono text-sm text-gray-600">Loading conversation details...</p>
                      <p className="font-mono text-xs text-gray-500 mt-2">
                        Fetching data for: {selectedConversation.conversation_id}
                      </p>
                    </div>
                  ) : conversationDetails ? (
                    <div className="space-y-6">

                      {/* Conversation Info */}
                      <div className="bg-gray-50 border-2 border-black p-4">
                        <h3 className="font-bold text-lg mb-4 text-black border-b-2 border-black pb-2">
                          Conversation Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
                          {conversationDetails.replica_id_used && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Replica ID:</span>
                              <span className="text-gray-700">{conversationDetails.replica_id_used}</span>
                            </div>
                          )}
                          {conversationDetails.replica_joined_timestamp && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Replica Joined:</span>
                              <span className="text-gray-700">{formatDate(conversationDetails.replica_joined_timestamp)}</span>
                            </div>
                          )}
                          {conversationDetails.shutdown_reason && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Shutdown Reason:</span>
                              <span className="text-gray-700 capitalize">{conversationDetails.shutdown_reason.replace(/_/g, ' ')}</span>
                            </div>
                          )}
                          {conversationDetails.shutdown_timestamp && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Ended:</span>
                              <span className="text-gray-700">{formatDate(conversationDetails.shutdown_timestamp)}</span>
                            </div>
                          )}
                          {conversationDetails.transcript_added_timestamp && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Transcript Added:</span>
                              <span className="text-gray-700">{formatDate(conversationDetails.transcript_added_timestamp)}</span>
                            </div>
                          )}
                          {conversationDetails.analysis_added_timestamp && (
                            <div className="flex flex-col">
                              <span className="font-bold text-black text-xs mb-1">Analysis Added:</span>
                              <span className="text-gray-700">{formatDate(conversationDetails.analysis_added_timestamp)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transcript and Analysis Tabs */}
                      <div className="border-2 border-black">
                        {/* Tab Headers */}
                        <div className="flex border-b-2 border-black">
                          <button
                            onClick={() => setActiveTab('transcript')}
                            className={`flex-1 px-6 py-3 font-bold text-sm border-r-2 border-black transition-colors ${
                              activeTab === 'transcript'
                                ? 'bg-[#ff8fa3] text-black'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            CONVERSATION TRANSCRIPT
                          </button>
                          <button
                            onClick={() => setActiveTab('analysis')}
                            className={`flex-1 px-6 py-3 font-bold text-sm transition-colors ${
                              activeTab === 'analysis'
                                ? 'bg-[#ff8fa3] text-black'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            CONVERSATION ANALYSIS
                          </button>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white">
                          {activeTab === 'transcript' ? (
                            <div className="p-4">
                              {conversationDetails.transcript ? (
                                <div className="bg-gray-50 border-2 border-black p-4 max-h-[500px] overflow-y-auto space-y-3">
                                  {(() => {
                                    try {
                                      let transcriptArray;
                                      
                                      // Parse transcript if it's a string
                                      if (typeof conversationDetails.transcript === 'string') {
                                        transcriptArray = JSON.parse(conversationDetails.transcript);
                                      } else if (Array.isArray(conversationDetails.transcript)) {
                                        transcriptArray = conversationDetails.transcript;
                                      } else {
                                        throw new Error('Transcript is not in expected format');
                                      }
                                      
                                      if (Array.isArray(transcriptArray) && transcriptArray.length > 0) {
                                        const messages = transcriptArray
                                          .filter((message: any) => message && message.role && message.role !== 'system') // Filter out system messages and nulls
                                          .map((message: any, index: number) => {
                                            const isUser = message.role === 'user';
                                            const isAssistant = message.role === 'assistant';
                                            
                                            return (
                                              <div
                                                key={`${message.role}-${index}`}
                                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                              >
                                                <div
                                                  className={`max-w-[80%] p-3 border-2 border-black rounded-sm ${
                                                    isUser
                                                      ? 'bg-[#ff8fa3] text-black'
                                                      : isAssistant
                                                      ? 'bg-[#dcd6f7] text-black'
                                                      : 'bg-gray-200 text-black'
                                                  }`}
                                                >
                                                  <div className="font-bold text-xs mb-1 uppercase opacity-70">
                                                    {isUser ? 'User' : isAssistant ? 'Assistant' : message.role}
                                                  </div>
                                                  <div className="text-sm break-words prose prose-sm max-w-none">
                                                    <ReactMarkdown
                                                      components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                        em: ({ children }) => <em className="italic">{children}</em>,
                                                        code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1 inline-block">{children}</li>,
                                                      }}
                                                    >
                                                      {message.content || 'No content'}
                                                    </ReactMarkdown>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                          .filter(Boolean); // Remove any null/undefined entries
                                        
                                        return messages.length > 0 ? (
                                          <div className="space-y-3">
                                            {messages}
                                          </div>
                                        ) : (
                                          <div className="font-mono text-sm text-gray-600 text-center py-4">
                                            No user/assistant messages found in transcript
                                          </div>
                                        );
                                      }
                                      
                                      // Fallback if transcript is not an array
                                      return (
                                        <div className="font-mono text-sm text-gray-700 whitespace-pre-wrap">
                                          {typeof conversationDetails.transcript === 'string' 
                                            ? conversationDetails.transcript 
                                            : JSON.stringify(conversationDetails.transcript, null, 2)}
                                        </div>
                                      );
                                    } catch (e) {
                                      console.error('Error parsing transcript:', e);
                                      return (
                                        <div className="font-mono text-sm text-red-600 p-4 bg-red-50 border-2 border-red-500">
                                          <p className="font-bold mb-2">Error parsing transcript:</p>
                                          <p className="text-xs">{e instanceof Error ? e.message : 'Unknown error'}</p>
                                          <details className="mt-4">
                                            <summary className="cursor-pointer text-xs">Show raw transcript</summary>
                                            <pre className="mt-2 text-xs bg-black text-white p-2 overflow-x-auto">
                                              {typeof conversationDetails.transcript === 'string' 
                                                ? conversationDetails.transcript 
                                                : JSON.stringify(conversationDetails.transcript, null, 2)}
                                            </pre>
                                          </details>
                                        </div>
                                      );
                                    }
                                  })()}
                                </div>
                              ) : (
                                <div className="bg-gray-50 border-2 border-black p-4 text-center">
                                  <p className="font-mono text-sm text-gray-600">No transcript available</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4">
                              {conversationDetails.analysis ? (
                                <div className="bg-[#fdf6e3] border-2 border-black p-4 max-h-[500px] overflow-y-auto">
                                  <div className="prose prose-sm max-w-none text-black">
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                        strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                        h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                                        ul: ({ children }) => <ul className="list-disc mb-3">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal mb-3">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-400 pl-4 italic my-3">{children}</blockquote>,
                                      }}
                                    >
                                      {typeof conversationDetails.analysis === 'string' 
                                        ? conversationDetails.analysis 
                                        : JSON.stringify(conversationDetails.analysis, null, 2)}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-[#fdf6e3] border-2 border-black p-4 text-center">
                                  <p className="font-mono text-sm text-gray-600">No analysis available</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Raw Data (Collapsible) */}
                      <details className="border-2 border-black">
                        <summary className="bg-gray-200 p-4 font-bold text-black cursor-pointer hover:bg-gray-300 transition-colors">
                          View Raw JSON Data
                        </summary>
                        <pre className="text-xs bg-black text-white p-4 overflow-x-auto max-h-[300px] overflow-y-auto">
                          {JSON.stringify(conversationDetails, null, 2)}
                        </pre>
                      </details>

                      {/* Actions */}
                      {selectedConversation.conversation_url && (
                        <div className="flex gap-4 pt-4 border-t-2 border-black">
                          <button
                            onClick={() =>
                              navigate(
                                `/tavus-conversation?url=${encodeURIComponent(
                                  selectedConversation.conversation_url!
                                )}`
                              )
                            }
                            className="bg-[#ff8fa3] text-black px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors"
                          >
                            VIEW CONVERSATION
                          </button>
                          <button
                            onClick={() => {
                              if (conversationDetails.transcript) {
                                const blob = new Blob([conversationDetails.transcript], {
                                  type: 'text/plain',
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `conversation-${selectedConversation.conversation_id}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }
                            }}
                            disabled={!conversationDetails.transcript}
                            className="bg-black text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            DOWNLOAD TRANSCRIPT
                          </button>
                        </div>
                      )}
                    </div>
                  ) : selectedConversation && !loadingDetails ? (
                    <div className="text-center py-12">
                      <p className="font-mono text-gray-600 mb-2">No details loaded yet</p>
                      <p className="font-mono text-xs text-gray-500">
                        Click the conversation again or check the console for errors
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="font-mono text-gray-600">Select a conversation to view details</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-black brutalist-shadow p-12 text-center">
                <p className="text-gray-600 font-mono text-lg">Select a conversation to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

