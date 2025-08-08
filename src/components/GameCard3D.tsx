import { useRef, useEffect, useMemo } from 'react'
import {  Group, CanvasTexture  } from 'three'
import { gsap } from 'gsap'

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

export const GameCard3D: React.FC<GameCard3DProps> = ({
  card,
  onClick,
  disabled,
  position,
}) => {
  const groupRef = useRef<Group>(null)

  // Generar la textura de texto dinámicamente
  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    // Fondo transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fondo opcional (solo para probar)
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Símbolo
    ctx.font = '72px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(card.symbol, canvas.width / 2, canvas.height / 2 - 30)

    // Texto extra dinámico
    ctx.font = '28px Arial'
    ctx.fillStyle = 'yellow'
    ctx.fillText(`ID: ${card.id}`, canvas.width / 2, canvas.height / 2 + 50)

    return new CanvasTexture(canvas)
  }, [card.symbol, card.id])

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

        if (!groupRef.current) return

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

      {/* Parte frontal con textura de canvas */}
      <group rotation-y={Math.PI}>
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial
            map={textTexture}
            transparent
          />
        </mesh>
      </group>
    </group>
  )
}
