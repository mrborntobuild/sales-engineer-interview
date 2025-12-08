// Types for Tavus API responses
export interface Replica {
  replica_id: string;
  replica_name: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Add other fields as needed based on API response
}

export interface Persona {
  persona_id: string;
  persona_name: string;
  system_prompt?: string;
  replica_id?: string;
  perception_model?: string;
  smart_turn_detection?: boolean;
  created_at?: string;
  updated_at?: string;
  // Add other fields as needed based on API response
}

interface TavusApiResponse<T> {
  data: T[];
  // May include pagination or other metadata
}

export interface Conversation {
  conversation_id: string;
  conversation_url?: string;
  persona_id?: string;
  replica_id?: string;
  conversation_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationDetails {
  conversation_id: string;
  transcript?: string | any[];
  duration?: number;
  participant_name?: string;
  created_at?: string;
  replica_id_used?: string;
  replica_joined_timestamp?: string;
  transcript_added_timestamp?: string;
  shutdown_reason?: string;
  shutdown_timestamp?: string;
  analysis?: string;
  analysis_added_timestamp?: string;
  meta_data?: any;
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  // Add other fields as returned by the API
  [key: string]: any;
}

interface CreateConversationResponse {
  conversation_id: string;
  conversation_url: string;
  persona_id: string;
  replica_id: string;
  conversation_name?: string;
  status?: string;
}

interface CreateConversationRequest {
  replica_id: string;
  persona_id: string;
  conversation_name?: string;
}

interface CreatePersonaRequest {
  pipeline_mode: string;
  system_prompt: string;
  persona_name?: string;
}

interface CreatePersonaResponse {
  persona_id: string;
  persona_name: string;
  system_prompt?: string;
  replica_id?: string;
  status?: string;
}

export class TavusService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://tavusapi.com/v2';

  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_TAVUS_API_KEY || import.meta.env.TAVUS_API_KEY || null;
    
    if (!this.apiKey) {
      console.warn("TAVUS_API_KEY not found. Please set VITE_TAVUS_API_KEY in .env.local");
    }
  }

  /**
   * Gets the API key (for validation purposes)
   */
  private getHeaders(): HeadersInit {
    if (!this.apiKey) {
      throw new Error("Tavus API key is not configured. Please set VITE_TAVUS_API_KEY in .env.local");
    }

    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };
  }

  /**
   * Fetches all replicas from Tavus API
   * @returns Array of Replica objects
   */
  async getReplicas(): Promise<Replica[]> {
    try {
      const response = await fetch(`${this.baseUrl}/replicas`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: TavusApiResponse<Replica> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching replicas:", error);
      throw error;
    }
  }

  /**
   * Fetches all personas from Tavus API
   * @returns Array of Persona objects
   */
  async getPersonas(): Promise<Persona[]> {
    try {
      const response = await fetch(`${this.baseUrl}/personas`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: TavusApiResponse<Persona> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching personas:", error);
      throw error;
    }
  }

  /**
   * Creates a new interview conversation session
   * Returns the conversation URL that the user should be redirected to
   */
  async createInterviewSession(options: {
    replicaId: string;
    personaId: string;
    conversationName?: string;
  }): Promise<string> {
    try {
      const requestBody: CreateConversationRequest = {
        replica_id: options.replicaId,
        persona_id: options.personaId,
        conversation_name: options.conversationName || 'Interview Session',
      };

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: CreateConversationResponse = await response.json();
      
      if (!data.conversation_url) {
        throw new Error("Tavus API did not return a conversation_url");
      }

      return data.conversation_url;
    } catch (error) {
      console.error("Error creating Tavus interview session:", error);
      throw error;
    }
  }

  /**
   * Test creating a conversation/interview
   * Returns the full conversation response
   */
  async testCreateConversation(options: {
    replicaId: string;
    personaId: string;
    conversationName?: string;
  }): Promise<CreateConversationResponse> {
    try {
      const requestBody: CreateConversationRequest = {
        replica_id: options.replicaId,
        persona_id: options.personaId,
        conversation_name: options.conversationName || 'Test Interview Session',
      };

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: CreateConversationResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating test conversation:", error);
      throw error;
    }
  }

  /**
   * Fetches all conversations from Tavus API
   * @returns Array of Conversation objects
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: TavusApiResponse<Conversation> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  }

  /**
   * Gets detailed conversation data from the webhook API
   * @param conversationId The conversation ID to fetch details for
   * @returns Conversation details including transcript and other data
   */
  async getConversationDetails(conversationId: string): Promise<ConversationDetails> {
    try {
      const response = await fetch('https://buildhouse.app.n8n.cloud/webhook/get-conversation-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Conversation details API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      
      // Handle array response - API returns [{...}] instead of {...}
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as ConversationDetails;
      } else if (Array.isArray(data) && data.length === 0) {
        throw new Error('No conversation details found');
      }
      
      // If it's already an object, return it directly
      return data as ConversationDetails;
    } catch (error) {
      console.error("Error fetching conversation details:", error);
      throw error;
    }
  }

  /**
   * Creates a persona for a Sales Engineer hiring manager
   */
  async createSalesEngineerHiringPersona(): Promise<CreatePersonaResponse> {
    const systemPrompt = `You are an expert Sales Engineering Manager at a top-tier SaaS company (like Datadog, Splunk, or Vercel). 
You are interviewing a candidate for a Senior Sales Engineer role.
Your goal is to assess their technical depth, communication skills, and ability to think on their feet.

Structure of the interview:
1. Start by asking them to introduce themselves and their background.
2. Ask a technical question related to APIs, Cloud Architecture, or Debugging.
3. Ask a situational question about handling a difficult customer or a proof-of-concept failure.
4. Keep your responses concise (under 3 sentences) to keep the conversation flowing.
5. Be professional but slightly challenging.
6. If the user provides a good answer, acknowledge it briefly and move to the next topic.

Do not write out long paragraphs. Speak as if you are on a video call.`;

    try {
      const requestBody: CreatePersonaRequest = {
        pipeline_mode: 'full',
        system_prompt: systemPrompt,
        persona_name: 'Sales Engineer Hiring Manager',
      };

      const response = await fetch(`${this.baseUrl}/personas`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Tavus API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      const data: CreatePersonaResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating Sales Engineer hiring persona:", error);
      throw error;
    }
  }
}

export const tavusService = new TavusService();

// Export types for use in components
export type { CreateConversationResponse, CreatePersonaResponse };

