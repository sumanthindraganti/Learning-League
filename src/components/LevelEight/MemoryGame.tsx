import React, { useState, useEffect } from 'react';
import { Code, RefreshCw, CheckCircle } from 'lucide-react';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number) => void;
}

const memoryCards = [
  { content: 'malloc()', type: 'function' },
  { content: 'free()', type: 'function' },
  { content: 'calloc()', type: 'function' },
  { content: 'realloc()', type: 'function' },
  { content: 'Memory Allocation', type: 'description' },
  { content: 'Memory Deallocation', type: 'description' },
  { content: 'Zero-initialized Memory', type: 'description' },
  { content: 'Resize Memory Block', type: 'description' }
];

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards = [...memoryCards, ...memoryCards];
    const shuffledCards = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        content: card.content,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards.map(id => cards[id]);

      if (firstCard.content === secondCard.content) {
        setMatchedPairs(matchedPairs + 1);
        setCards(cards.map(card =>
          newFlippedCards.includes(card.id)
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === memoryCards.length) {
      const score = Math.max(100 - moves * 5, 20); // Calculate score based on moves
      setTimeout(() => onComplete(score), 1500);
    }
  }, [matchedPairs, moves, onComplete]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Memory Management Match</h2>
        <div className="flex items-center gap-4">
          <div className="text-white">
            Moves: <span className="font-bold">{moves}</span>
          </div>
          <div className="text-white">
            Matches: <span className="font-bold">{matchedPairs}/{memoryCards.length}</span>
          </div>
          <button
            onClick={initializeGame}
            className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-[3/2] rounded-lg cursor-pointer transition-all transform ${
              card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                ? 'rotate-y-180'
                : ''
            }`}
          >
            <div
              className={`w-full h-full p-4 rounded-lg flex items-center justify-center text-center transition-all ${
                card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                  ? 'bg-purple-500/20 text-white'
                  : 'bg-black/30 text-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {card.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {matchedPairs === memoryCards.length && (
        <div className="mt-8 p-4 bg-green-500/20 rounded-lg text-green-400 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span className="text-xl font-bold">
              Congratulations! Moving to debug challenge...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};