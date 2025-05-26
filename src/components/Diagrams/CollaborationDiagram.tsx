import React, { useEffect } from 'react';
import mermaid from 'mermaid';

interface CollaborationDiagramProps {
  onComplete?: () => void;
}

export const CollaborationDiagram: React.FC<CollaborationDiagramProps> = ({ onComplete }) => {
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
      <h2 className="text-2xl font-bold text-white mb-6">Collaboration Diagrams</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Authentication Flow</h3>
        <div className="mermaid">
          {`
          graph LR
            A[User] -->|1: login()| B[AuthController]
            B -->|2: validate()| C[UserService]
            C -->|3: checkCredentials()| D[Database]
            D -->|4: return result| C
            C -->|5: return status| B
            B -->|6: return token| A
          `}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Payment Processing</h3>
        <div className="mermaid">
          {`
          graph LR
            A[Client] -->|1: pay()| B[PaymentController]
            B -->|2: process()| C[PaymentService]
            C -->|3: validate()| D[PaymentValidator]
            C -->|4: charge()| E[PaymentGateway]
            E -->|5: confirm()| C
            C -->|6: update()| F[Database]
            C -->|7: result| B
            B -->|8: response| A
          `}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Order Processing</h3>
        <div className="mermaid">
          {`
          graph LR
            A[Customer] -->|1: place order| B[OrderController]
            B -->|2: create| C[OrderService]
            C -->|3: check stock| D[InventoryService]
            C -->|4: validate| E[ValidationService]
            C -->|5: process payment| F[PaymentService]
            C -->|6: save| G[Database]
            C -->|7: notify| H[NotificationService]
            C -->|8: result| B
            B -->|9: confirmation| A
          `}
        </div>
      </div>
    </div>
  );
};