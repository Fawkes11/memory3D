import { useRef, useEffect } from 'react'
import { Mesh } from 'three'
import { gsap } from 'gsap'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export interface CardData {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

interface GameCard3DProps {
  card: CardData
  onClick: () => void
  disabled: boolean
  position: [number, number, number]
}

const cardSymbols: Record<string, string> = {
  '⚡': '⚡',
  '🌟': '🌟',
  '💎': '💎',
  '🔥': '🔥',
  '❄️': '❄️',
  '🌙': '🌙',
  '⭐': '⭐',
  '💫': '💫'
};

export const GameCard3D: React.FC<GameCard3DProps> = ({
  card,
  onClick,
  disabled,
  position,
}) => {
  const meshRef = useRef<Mesh>(null)

  // Flip animation on state change
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    gsap.to(mesh.rotation, {
      y: card.isFlipped || card.isMatched ? Math.PI : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [card.isFlipped, card.isMatched])

  // Bump effect when clicked
  const handleClick = () => {
    if (disabled || card.isMatched || card.isFlipped) return
    const mesh = meshRef.current
    if (!mesh) return

    gsap.to(mesh.position, {
      z: position[2] + 0.5,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(mesh.position, {
          z: position[2],
          duration: 0.3,
          ease: 'bounce.out',
          onComplete: () => onClick(),
        })
      },
    })
  }

  return (
    <group position={position} onClick={handleClick}>
      {/* Card group container */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial
          attach="material"
          color={card.isMatched ? '#9effa2' : '#2dd4bf'}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Front symbol (only shows when flipped) */}
      {(card.isFlipped || card.isMatched) && (
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="white" transparent opacity={0.95} />
          <Html center>
            <span style={{ fontSize: '1.5rem' }}>{cardSymbols[card.symbol]}</span>
          </Html>
        </mesh>
      )}
    </group>
  )
}
