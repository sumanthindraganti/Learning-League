import React, { useEffect } from 'react';
import mermaid from 'mermaid';

interface ArchitectureDiagramProps {
  onComplete?: () => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ onComplete }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      flowchart: {
        curve: 'basis',
        padding: 20
      }
    });
    
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">High-Level Architecture</h3>
        <div className="mermaid">
          {`
          flowchart TB
            subgraph Client Layer
              UI[User Interface]
              State[State Management]
              Router[Router]
            end

            subgraph API Layer
              API[API Gateway]
              Auth[Auth Service]
              Cache[Cache Layer]
            end

            subgraph Business Layer
              Services[Business Services]
              Logic[Business Logic]
              Valid[Validation]
            end

            subgraph Data Layer
              DB[(Database)]
              Queue[(Message Queue)]
              Storage[(File Storage)]
            end

            Client Layer --> API Layer
            API Layer --> Business Layer
            Business Layer --> Data Layer
          `}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Microservices Architecture</h3>
        <div className="mermaid">
          {`
          flowchart LR
            subgraph Frontend
              Web[Web App]
              Mobile[Mobile App]
            end

            subgraph Gateway
              LB[Load Balancer]
              API[API Gateway]
            end

            subgraph Services
              Auth[Auth Service]
              User[User Service]
              Payment[Payment Service]
              Notify[Notification Service]
            end

            subgraph Data Stores
              UserDB[(User DB)]
              AuthDB[(Auth DB)]
              PayDB[(Payment DB)]
              Cache[(Redis Cache)]
            end

            Frontend --> Gateway
            Gateway --> Services
            Auth --> AuthDB
            User --> UserDB
            Payment --> PayDB
            Services --> Cache
          `}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Deployment Architecture</h3>
        <div className="mermaid">
          {`
          flowchart TB
            subgraph Cloud Provider
              subgraph Web Tier
                LB[Load Balancer]
                Web1[Web Server 1]
                Web2[Web Server 2]
              end

              subgraph App Tier
                App1[App Server 1]
                App2[App Server 2]
                Cache[(Redis Cluster)]
              end

              subgraph Data Tier
                Master[(Master DB)]
                Slave1[(Slave DB 1)]
                Slave2[(Slave DB 2)]
              end

              subgraph Services
                Queue[Message Queue]
                Search[Search Service]
                Storage[Object Storage]
              end
            end

            LB --> Web1 & Web2
            Web1 & Web2 --> App1 & App2
            App1 & App2 --> Cache
            App1 & App2 --> Master
            Master --> Slave1 & Slave2
            App1 & App2 --> Services
          `}
        </div>
      </div>
    </div>
  );
};