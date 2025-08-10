import { Suspense, useState, useEffect, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'motion/react'
import { RefreshCw, Timer, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameCard3D } from '../components/GameCard3D'
import type { CardData } from '../components/GameCard3D'
import type { GameStats } from '../store/gameStore'


const BOARD_SIZE = 16
const GRID = 4
const SPACING = 2.5

interface GameScreenProps {
  onGameEnd: (stats: GameStats) => void
}

export function GameScreen({ onGameEnd }: GameScreenProps) {
  const [cards, setCards] = useState<CardData[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // inicializa tablero
  const initializeGame = useCallback(() => {
    const symbols = ['⚡', '🌟', '💎', '🔥', '❄️', '🌙', '⭐', '💫']
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
    setCards(deck.map((s, i) => ({ id: i, symbol: s, isFlipped: false, isMatched: false })))
    setFlippedCards([])
    setMatchedPairs([])
    setAttempts(0)
    setTimeElapsed(0)
    setGameStarted(true)
  }, [])

  // timer
  useEffect(() => {
    if (!gameStarted) return
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [gameStarted])

  useEffect(() => { initializeGame() }, [initializeGame])

  // lógica de pares
  useEffect(() => {
    if (flippedCards.length !== 2) return
    const [a, b] = flippedCards
    const c1 = cards[a], c2 = cards[b]
    setAttempts(n => n + 1)
    setTimeout(() => {
      if (c1.symbol === c2.symbol) {
        setMatchedPairs(mp => mp.concat(a, b))
        setCards(cs => cs.map((c, i) => (i === a || i === b) ? { ...c, isMatched: true } : c))
      }
      setFlippedCards([])
      setCards(cs => cs.map((c, i) => (i === a || i === b) ? { ...c, isFlipped: false } : c))
    }, 800)
  }, [flippedCards, cards])

  // fin de juego
  useEffect(() => {
    if (matchedPairs.length === BOARD_SIZE && gameStarted) {
      setTimeout(() => onGameEnd({
        timeElapsed,
        attempts,
        matches: matchedPairs.length / 2
      }), 500)
    }
  }, [matchedPairs.length, timeElapsed, attempts, gameStarted, onGameEnd])

  const handleCardClick = (id: number) => {
    if (flippedCards.length >= 2 || flippedCards.includes(id) || cards[id].isMatched) return
    setFlippedCards(fc => fc.concat(id))
    setCards(cs => cs.map((c, i) => i === id ? { ...c, isFlipped: true } : c))
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // precalcula posiciones 4×4 centradas en origen
  const positions = useMemo(() => {
    return cards.map((_, i) => {
      const x = (i % GRID - (GRID - 1) / 2) * SPACING
      const y = (Math.floor(i / GRID) - (GRID - 1) / 2) * -( SPACING + 1.0 )
      return [x, y, 0] as [number, number, number]
    })
  }, [cards])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.div className="p-4 flex justify-between bg-gray-800/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex gap-6 text-white">
          <Timer className="w-5 h-5" /><span>{formatTime(timeElapsed)}</span>
          <Target className="w-5 h-5" /><span>Intentos: {attempts}</span>
          <span>Pares: {matchedPairs.length / 2}/{BOARD_SIZE / 2}</span>
        </div>
        <Button onClick={initializeGame} variant="outline">Reiniciar <RefreshCw className="inline-block ml-1" /></Button>
      </motion.div>

      {/* Escena 3D */}
      <div className="flex-1 w-full  pt-10">
        <Canvas
          className="w-full h-full "
          shadows
          camera={{ position: [0, 0, 15], fov: 50 }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={0.8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={null}>
            {cards.map((card, i) => (
              <GameCard3D
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card.id)}
                disabled={flippedCards.length >= 2}
                position={positions[i]}
              />
            ))}
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>


    </div>
  )
}
