import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ShoeModel from './ShoeModel';
import ParticleField from './ParticleField';
import { useMousePosition } from '../../hooks/useMousePosition';

export default function HeroCanvas() {
  const { normalX, normalY } = useMousePosition();

  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <AdaptiveDpr pixelated />

      {/* No direct lights — only soft ambient so model shows its own textures */}
      <ambientLight intensity={0.4} />

      <Suspense fallback={null}>
        {/* Low-intensity IBL — provides shape without blowing out materials */}
        <Environment preset="warehouse" environmentIntensity={0.25} />
        <group position={[1.5, -0.2, 0]} scale={1.5}>
          <ShoeModel mouseX={normalX} mouseY={normalY} autoRotate={true} />
        </group>
        <ParticleField count={1200} />
      </Suspense>

      {/* Very tight bloom — only emissive accents glow */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.7}
          radius={0.4}
        />
      </EffectComposer>
    </Canvas>
  );
}
