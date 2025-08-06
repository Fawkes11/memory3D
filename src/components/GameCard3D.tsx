import { useRef, useEffect } from 'react'
import { Mesh, Group } from 'three'
import { gsap } from 'gsap'
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
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.rotation, {
      y: card.isFlipped || card.isMatched ? Math.PI : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
  }, [card.isFlipped, card.isMatched])

  const handleClick = () => {
    if (disabled || card.isMatched || card.isFlipped) return
    if (!groupRef.current) return

    gsap.to(groupRef.current.position, {
      z: position[2] + 0.5,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(groupRef.current.position, {
          z: position[2],
          duration: 0.3,
          ease: 'bounce.out',
          onComplete: () => onClick(),
        })
      },
    })
  }

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Parte trasera */}
      <mesh>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial
          color={card.isMatched ? '#9effa2' : '#2dd4bf'}
          metalness={0.3}
          roughness={0.4}
          depthTest
        />
      </mesh>
      
      {/* Parte frontal */}
      <group rotation-y={Math.PI}>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.5, 1.5]} />

          <meshStandardMaterial color="white" />
          <Html center transform>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {cardSymbols[card.symbol]}
              </span>
            </div>
          </Html>
        </mesh>
      </group>
    </group>
  )
}
