import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Card } from './components/Card'


export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Card position={[-3, 0, 0]} />
        <Card position={[0, 0, 0]} />
        <Card position={[3, 0, 0]} />
      </Suspense>
    </Canvas>
  )
}

