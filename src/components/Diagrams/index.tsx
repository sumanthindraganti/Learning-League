import React, { useState } from 'react';
import { CollaborationDiagram } from './CollaborationDiagram';
import { SequenceDiagram } from './SequenceDiagram';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ActivityDiagram } from './ActivityDiagram';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Diagrams: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'collaboration' | 'sequence' | 'architecture' | 'activity'>('architecture');

  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'architecture'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Architecture Diagram
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'collaboration'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Collaboration Diagram
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'sequence'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Sequence Diagram
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Activity Diagram
          </button>
        </div>

        {activeTab === 'architecture' ? (
          <ArchitectureDiagram />
        ) : activeTab === 'collaboration' ? (
          <CollaborationDiagram />
        ) : activeTab === 'sequence' ? (
          <SequenceDiagram />
        ) : (
          <ActivityDiagram />
        )}
      </div>
    </div>
  );
};