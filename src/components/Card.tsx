
import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { gsap } from 'gsap'


interface CardProps {
  position?: [number, number, number]
}

export const Card: React.FC<CardProps> = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef<Mesh>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    const mesh = meshRef.current
    if (!mesh || mesh.name !== 'card') return

    const tl = gsap.timeline()

    tl.to(mesh.position, {
      z: mesh.position.z + 0.5,
      duration: 0.2,
      ease: 'power2.out'
    })
      .to(mesh.position, {
        z: mesh.position.z,
        duration: 0.3,
        ease: 'bounce.out'
      })
      .to(mesh.rotation, {
        y: mesh.rotation.y + Math.PI,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsFlipped((prev) => !prev)
        }
      })
  }

  return (
    <mesh
      ref={meshRef}
      name="card"
      position={position}
      onClick={handleClick}
      castShadow
    >
      <boxGeometry args={[2, 3, 0.1]} />
      <meshStandardMaterial color={isFlipped ? 'orange' : 'skyblue'} />
    </mesh>
  )
}
