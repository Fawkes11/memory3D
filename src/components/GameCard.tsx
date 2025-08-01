import React from 'react';
import { motion } from 'motion/react';

export interface CardData {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameCardProps {
  card: CardData;
  onClick: () => void;
  disabled: boolean;
}

const cardSymbols = {
  '⚡': '⚡',
  '🌟': '🌟',
  '💎': '💎',
  '🔥': '🔥',
  '❄️': '❄️',
  '🌙': '🌙',
  '⭐': '⭐',
  '💫': '💫'
};

export function GameCard({ card, onClick, disabled }: GameCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer perspective-1000"
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled && !isRevealed ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !isRevealed ? { scale: 0.95 } : undefined}
    >
      <motion.div
        className="relative w-full h-full transform-style-preserve-3d"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Card Back */}
        <motion.div
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 border border-gray-500/50 flex items-center justify-center shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {/* Circuit pattern background */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M10,5 L10,15 M5,10 L15,10 M5,5 L5,15 M15,5 L15,15"
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeWidth="1"
                      fill="none"
                    />
                    <circle cx="10" cy="10" r="2" fill="rgba(6, 182, 212, 0.4)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-2 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10"></div>

            {/* Center symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-magenta-400 rounded-lg opacity-60">

              </div>
            </div>
          </div>
        </motion.div>

        {/* Card Front */}
        <motion.div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-xl flex items-center justify-center shadow-lg transform ${card.isMatched
            ? 'bg-gradient-to-br from-lime-500/20 to-cyan-500/20 border-lime-400/50'
            : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600/50'
            } border`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.3, delay: isRevealed ? 0.3 : 0 }}
          >
            <span className="text-4xl select-none">
              {cardSymbols[card.symbol] || '❓'}
            </span>

            {/* Matched glow effect */}
            {card.isMatched && (
              <motion.div
                className="absolute inset-0 bg-lime-400/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional 3D shadow effect */}
      <div className="absolute inset-0 bg-black/20 rounded-xl transform translate-y-1 translate-x-1 -z-10"></div>
    </motion.div>
  );
}