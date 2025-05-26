import React, { useEffect } from 'react';
import mermaid from 'mermaid';

interface ActivityDiagramProps {
  onComplete?: () => void;
}

export const ActivityDiagram: React.FC<ActivityDiagramProps> = ({ onComplete }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark'
    });
    
    mermaid.contentLoaded();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Activity Diagrams</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">User Authentication Process</h3>
        <div className="mermaid">
          {`
          graph TD
            A[Start] --> B{User Registered?}
            B -->|No| C[Show Registration Form]
            B -->|Yes| D[Show Login Form]
            C --> E[Validate Input]
            D --> E
            E --> F{Valid Input?}
            F -->|No| G[Show Error Message]
            G --> D
            F -->|Yes| H[Authenticate User]
            H --> I{Auth Success?}
            I -->|No| J[Show Auth Error]
            J --> D
            I -->|Yes| K[Navigate to Dashboard]
            K --> L[End]
          `}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Order Processing Flow</h3>
        <div className="mermaid">
          {`
          graph TD
            A[Order Received] --> B{Stock Available?}
            B -->|Yes| C[Process Payment]
            B -->|No| D[Show Out of Stock]
            C --> E{Payment Success?}
            E -->|Yes| F[Create Order]
            E -->|No| G[Show Payment Error]
            F --> H[Send Confirmation]
            H --> I[Update Inventory]
            I --> J[End]
            D --> J
            G --> J
          `}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Data Processing Pipeline</h3>
        <div className="mermaid">
          {`
          graph TD
            A[Data Input] --> B[Validate Data]
            B --> C{Valid Format?}
            C -->|No| D[Log Error]
            C -->|Yes| E[Transform Data]
            E --> F[Save to Database]
            F --> G{Save Success?}
            G -->|No| H[Retry Save]
            G -->|Yes| I[Send Notification]
            H --> F
            D --> J[End]
            I --> J
          `}
        </div>
      </div>
    </div>
  );
};