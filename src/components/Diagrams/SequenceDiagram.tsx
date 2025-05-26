import React, { useEffect } from 'react';
import mermaid from 'mermaid';

interface SequenceDiagramProps {
  onComplete?: () => void;
}

export const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ onComplete }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      sequence: {
        showSequenceNumbers: true,
        actorMargin: 50,
        messageMargin: 40,
        mirrorActors: false
      }
    });
    
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Sequence Diagrams</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">User Authentication Flow</h3>
        <div className="mermaid">
          {`
          sequenceDiagram
            participant U as User
            participant C as Client
            participant A as Auth Service
            participant D as Database
            
            U->>C: Enter Credentials
            C->>A: Login Request
            A->>D: Validate User
            D-->>A: User Data
            A-->>C: Auth Token
            C-->>U: Login Success
          `}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">API Request Flow</h3>
        <div className="mermaid">
          {`
          sequenceDiagram
            participant C as Client
            participant G as API Gateway
            participant S as Service
            participant D as Database
            participant Ca as Cache
            
            C->>G: API Request
            G->>S: Forward Request
            S->>Ca: Check Cache
            alt Cache Hit
                Ca-->>S: Return Cached Data
            else Cache Miss
                S->>D: Query Data
                D-->>S: Return Data
                S->>Ca: Update Cache
            end
            S-->>G: Response
            G-->>C: API Response
          `}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Error Handling Flow</h3>
        <div className="mermaid">
          {`
          sequenceDiagram
            participant U as User
            participant C as Client
            participant S as Server
            participant D as Database
            
            U->>C: Submit Request
            C->>S: Process Request
            S->>D: Database Query
            alt Success
                D-->>S: Data
                S-->>C: Success Response
                C-->>U: Show Success
            else Error
                D-->>S: Error
                S-->>C: Error Response
                C-->>U: Show Error Message
            end
          `}
        </div>
      </div>
    </div>
  );
};