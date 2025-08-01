import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Card } from '../components/Card'
import React, { useState, useEffect, useCallback } from 'react';

import { motion } from 'motion/react';
import { RefreshCw, Timer, Target } from 'lucide-react';

import type { GameStats } from '../store/gameStore';
import { GameCard } from '../components/GameCard';
import { Button } from '@/components/ui/button';

 
export interface CardData {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameScreenProps {
  onGameEnd: (stats: GameStats) => void;
}

const BOARD_SIZE = 16; // 4x4 grid
const SYMBOLS = ['⚡', '🌟', '💎', '🔥', '❄️', '🌙', '⭐', '💫'];

export function GameScreen({ onGameEnd }: GameScreenProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game board
  const initializeGame = useCallback(() => {
    const gameSymbols = [...SYMBOLS, ...SYMBOLS]; // Create pairs
    const shuffledSymbols = gameSymbols.sort(() => Math.random() - 0.5);
    
    const newCards: CardData[] = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setTimeElapsed(0);
    setGameStarted(true);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      setAttempts(prev => prev + 1);

      setTimeout(() => {
        if (firstCard.symbol === secondCard.symbol) {
          // Match found
          setMatchedPairs(prev => [...prev, firstId, secondId]);
          setCards(prev => prev.map((card, index) => 
            index === firstId || index === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
        }
        
        // Reset flipped cards
        setFlippedCards([]);
        setCards(prev => prev.map((card, index) => 
          index === firstId || index === secondId 
            ? { ...card, isFlipped: false }
            : card
        ));
      }, 1000);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === BOARD_SIZE && gameStarted) {
      setTimeout(() => {
        onGameEnd({
          timeElapsed,
          attempts,
          matches: matchedPairs.length / 2
        });
      }, 500);
    }
  }, [matchedPairs.length, timeElapsed, attempts, onGameEnd, gameStarted]);

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length >= 2 || 
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    ) {
      return;
    }

    setFlippedCards(prev => [...prev, cardId]);
    setCards(prev => prev.map((card, index) => 
      index === cardId ? { ...card, isFlipped: true } : card
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header UI */}
      <motion.div
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
          {/* Game stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-cyan-400">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2 text-magenta-400">
              <Target className="w-5 h-5" />
              <span>Intentos: {attempts}</span>
            </div>
            <div className="flex items-center gap-2 text-lime-400">
              <span>Pares: {matchedPairs.length / 2}/{BOARD_SIZE / 2}</span>
            </div>
          </div>

          {/* Reset button */}
          <Button
            onClick={initializeGame}
            variant="outline"
            className="flex items-center gap-2 border-gray-600 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar
          </Button>
        </div>
      </motion.div>

      {/* Game Board */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-600/30">
          <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
            {cards.map((card) => (
              <GameCard
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
                disabled={flippedCards.length >= 2}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-magenta-500/10 rounded-full blur-xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}


/* 
<Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Card position={[-3, 0, 0]} />
        <Card position={[0, 0, 0]} />
        <Card position={[3, 0, 0]} />
      </Suspense>
    </Canvas> */