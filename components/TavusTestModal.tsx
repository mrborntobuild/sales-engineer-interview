import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tavusService, Replica, Persona, CreateConversationResponse, CreatePersonaResponse } from '../services/tavus';

interface TavusTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TavusTestModal: React.FC<TavusTestModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'replicas' | 'personas' | 'conversation'>('replicas');
  const [conversationResult, setConversationResult] = useState<CreateConversationResponse | null>(null);
  const [createdPersona, setCreatedPersona] = useState<CreatePersonaResponse | null>(null);

  const handleTestReplicas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tavusService.getReplicas();
      setReplicas(data);
      setActiveTab('replicas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch replicas');
      console.error('Error testing replicas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPersonas = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await tavusService.getPersonas();
      setPersonas(data);
      setActiveTab('personas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personas');
      console.error('Error testing personas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSalesEngineerPersona = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await tavusService.createSalesEngineerHiringPersona();
      setCreatedPersona(data);
      setSuccess(`Persona created successfully! ID: ${data.persona_id}`);
      // Refresh personas list
      const updatedPersonas = await tavusService.getPersonas();
      setPersonas(updatedPersonas);
      setActiveTab('personas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create persona');
      console.error('Error creating persona:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCreateConversation = async () => {
    if (personas.length === 0) {
      setError('Please fetch personas first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Use default replica ID from service, or fallback to first replica if available
      const defaultReplicaId = tavusService.getDefaultReplicaId();
      const replicaId = defaultReplicaId || (replicas.length > 0 ? replicas[0].replica_id : null);
      
      if (!replicaId) {
        setError('No replica ID available. Please set VITE_TAVUS_DEFAULT_REPLICA_ID in .env.local or fetch replicas first');
        setLoading(false);
        return;
      }
      
      const personaId = personas[0].persona_id;
      const data = await tavusService.testCreateConversation({
        replicaId,
        personaId,
        conversationName: 'Test Sales Engineer Interview',
      });
      setConversationResult(data);
      setSuccess(`Conversation created! URL: ${data.conversation_url}`);
      setActiveTab('conversation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      console.error('Error creating conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-black brutalist-shadow max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-black bg-[#ff8fa3]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-black font-bold">Test Tavus Service</h2>
            <button
              onClick={onClose}
              className="text-3xl font-bold text-black hover:text-gray-700 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleTestReplicas}
              disabled={loading}
              className="bg-black text-white px-6 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading && activeTab === 'replicas' ? 'LOADING...' : 'TEST GET REPLICAS'}
            </button>
            <button
              onClick={handleTestPersonas}
              disabled={loading}
              className="bg-[#ff8fa3] text-black px-6 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-[#ff7a91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading && activeTab === 'personas' ? 'LOADING...' : 'TEST GET PERSONAS'}
            </button>
            <button
              onClick={handleCreateSalesEngineerPersona}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'CREATING...' : 'CREATE SALES ENGINEER PERSONA'}
            </button>
            <button
              onClick={handleTestCreateConversation}
              disabled={loading || replicas.length === 0 || personas.length === 0}
              className="bg-blue-500 text-white px-6 py-3 font-bold border-2 border-black brutalist-shadow hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'CREATING...' : 'TEST CREATE INTERVIEW'}
            </button>
          </div>

          {/* Success Display */}
          {success && (
            <div className="bg-green-100 border-2 border-green-500 p-4 mb-6">
              <p className="font-mono text-sm text-green-800 font-bold">SUCCESS:</p>
              <p className="font-mono text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border-2 border-red-500 p-4 mb-6">
              <p className="font-mono text-sm text-red-800 font-bold">ERROR:</p>
              <p className="font-mono text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Results Tabs */}
          {(replicas.length > 0 || personas.length > 0 || conversationResult) && (
            <div className="border-2 border-black">
              {/* Tab Headers */}
              <div className="flex border-b-2 border-black">
                <button
                  onClick={() => setActiveTab('replicas')}
                  className={`flex-1 px-4 py-2 font-bold border-r-2 border-black transition-colors text-xs ${
                    activeTab === 'replicas'
                      ? 'bg-[#dcd6f7] text-black'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  REPLICAS ({replicas.length})
                </button>
                <button
                  onClick={() => setActiveTab('personas')}
                  className={`flex-1 px-4 py-2 font-bold border-r-2 border-black transition-colors text-xs ${
                    activeTab === 'personas'
                      ? 'bg-[#dcd6f7] text-black'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  PERSONAS ({personas.length})
                </button>
                {conversationResult && (
                  <button
                    onClick={() => setActiveTab('conversation')}
                    className={`flex-1 px-4 py-2 font-bold transition-colors text-xs ${
                      activeTab === 'conversation'
                        ? 'bg-[#dcd6f7] text-black'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    CONVERSATION
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="p-4 max-h-[400px] overflow-y-auto">
                {activeTab === 'replicas' && (
                  <div className="space-y-4">
                    {replicas.length === 0 ? (
                      <p className="font-mono text-sm text-gray-600">No replicas found. Click "TEST GET REPLICAS" to fetch.</p>
                    ) : (
                      replicas.map((replica) => (
                        <div
                          key={replica.replica_id}
                          className="bg-gray-50 border-2 border-black p-4"
                        >
                          <div className="font-mono text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-black">ID:</span>
                              <span className="text-gray-700">{replica.replica_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-black">Name:</span>
                              <span className="text-gray-700">{replica.replica_name}</span>
                            </div>
                            {replica.status && (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-black">Status:</span>
                                <span className="text-gray-700">{replica.status}</span>
                              </div>
                            )}
                            {replica.created_at && (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-black">Created:</span>
                                <span className="text-gray-700">{new Date(replica.created_at).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <pre className="mt-2 text-xs bg-black text-white p-2 overflow-x-auto">
                            {JSON.stringify(replica, null, 2)}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'personas' && (
                  <div className="space-y-4">
                    {personas.length === 0 ? (
                      <p className="font-mono text-sm text-gray-600">No personas found. Click "TEST GET PERSONAS" to fetch.</p>
                    ) : (
                      personas.map((persona) => (
                        <div
                          key={persona.persona_id}
                          className="bg-gray-50 border-2 border-black p-4"
                        >
                          <div className="font-mono text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-black">ID:</span>
                              <span className="text-gray-700">{persona.persona_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-black">Name:</span>
                              <span className="text-gray-700">{persona.persona_name}</span>
                            </div>
                            {persona.replica_id && (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-black">Replica ID:</span>
                                <span className="text-gray-700">{persona.replica_id}</span>
                              </div>
                            )}
                            {persona.system_prompt && (
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-black">System Prompt:</span>
                                <span className="text-gray-700 text-xs bg-gray-100 p-2 rounded">
                                  {persona.system_prompt.substring(0, 200)}
                                  {persona.system_prompt.length > 200 ? '...' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          <pre className="mt-2 text-xs bg-black text-white p-2 overflow-x-auto">
                            {JSON.stringify(persona, null, 2)}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'conversation' && conversationResult && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border-2 border-black p-4">
                      <div className="font-mono text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Conversation ID:</span>
                          <span className="text-gray-700">{conversationResult.conversation_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Conversation URL:</span>
                          <a 
                            href={conversationResult.conversation_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {conversationResult.conversation_url}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Persona ID:</span>
                          <span className="text-gray-700">{conversationResult.persona_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">Replica ID:</span>
                          <span className="text-gray-700">{conversationResult.replica_id}</span>
                        </div>
                        {conversationResult.conversation_name && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black">Name:</span>
                            <span className="text-gray-700">{conversationResult.conversation_name}</span>
                          </div>
                        )}
                        {conversationResult.status && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-black">Status:</span>
                            <span className="text-gray-700">{conversationResult.status}</span>
                          </div>
                        )}
                      </div>
                      <pre className="mt-4 text-xs bg-black text-white p-2 overflow-x-auto">
                        {JSON.stringify(conversationResult, null, 2)}
                      </pre>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            navigate(`/tavus-conversation?url=${encodeURIComponent(conversationResult.conversation_url)}`);
                            onClose();
                          }}
                          className="bg-blue-500 text-white px-4 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-blue-600 transition-colors text-sm"
                        >
                          OPEN IN EMBEDDED VIEW
                        </button>
                        <button
                          onClick={() => window.open(conversationResult.conversation_url, '_blank')}
                          className="bg-gray-500 text-white px-4 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-600 transition-colors text-sm"
                        >
                          OPEN IN NEW TAB
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created Persona Display */}
          {createdPersona && (
            <div className="bg-green-50 border-2 border-green-500 p-4 mb-6">
              <p className="font-mono text-sm text-green-800 font-bold mb-2">CREATED PERSONA:</p>
              <div className="font-mono text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">Persona ID:</span>
                  <span className="text-gray-700">{createdPersona.persona_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">Name:</span>
                  <span className="text-gray-700">{createdPersona.persona_name}</span>
                </div>
              </div>
              <pre className="mt-2 text-xs bg-black text-white p-2 overflow-x-auto">
                {JSON.stringify(createdPersona, null, 2)}
              </pre>
            </div>
          )}

          {/* Empty State */}
          {replicas.length === 0 && personas.length === 0 && !conversationResult && !error && !loading && (
            <div className="text-center py-12">
              <p className="font-mono text-gray-600 mb-4">Click a test button above to fetch data from Tavus API</p>
              <p className="text-xs font-mono text-gray-500">
                Make sure VITE_TAVUS_API_KEY is set in your .env.local file
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black bg-gray-50">
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 font-bold border-2 border-black brutalist-shadow hover:bg-gray-800 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

