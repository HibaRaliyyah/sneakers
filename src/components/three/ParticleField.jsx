import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated particle field using Three.js Points.
 * Creates floating ambient particles in the hero background.
 */
export default function ParticleField({ count = 2000 }) {
  const meshRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i3]     = (Math.random() - 0.5) * 0.001;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     += Math.sin(time * 0.3 + i * 0.1) * 0.0005;
      pos[i3 + 1] += Math.cos(time * 0.2 + i * 0.15) * 0.0005;
      pos[i3 + 2] += Math.sin(time * 0.25 + i * 0.12) * 0.0005;

      // Wrap around bounds
      if (Math.abs(pos[i3])     > 10) pos[i3]     *= -0.95;
      if (Math.abs(pos[i3 + 1]) > 10) pos[i3 + 1] *= -0.95;
      if (Math.abs(pos[i3 + 2]) > 10) pos[i3 + 2] *= -0.95;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
