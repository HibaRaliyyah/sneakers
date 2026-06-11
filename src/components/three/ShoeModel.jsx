import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/sneaker_dior.glb');

export default function ShoeModel({
  color = '#00d4ff',
  mouseX = 0,
  mouseY = 0,
  autoRotate = true,
}) {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/sneaker_dior.glb');

  // Stable clone — memoised so it doesn't change between renders
  const root = useMemo(() => {
    const clone = scene.clone(true);

    // Fit to ~2.2 units
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(2.2 / maxDim);

    // Centre at origin
    box.setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    return clone;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Apply colour tint to every mesh whenever `color` changes
  useEffect(() => {
    const accent = new THREE.Color(color);

    root.traverse((child) => {
      if (!child.isMesh) return;

      const applyTint = (mat) => {
        const m = mat.clone();
        m.metalness        = 0.05;   // no mirror blowout
        m.roughness        = 0.85;
        m.envMapIntensity  = 0.15;   // minimal IBL reflection
        m.emissive         = accent.clone();
        m.emissiveIntensity = 0.55;  // strong enough to see clearly
        m.needsUpdate      = true;
        return m;
      };

      if (Array.isArray(child.material)) {
        child.material = child.material.map(applyTint);
      } else {
        child.material = applyTint(child.material);
      }
    });
  }, [color, root]);

  // Animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    if (autoRotate) {
      groupRef.current.rotation.y = t * 0.38;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, mouseX * 0.8, 0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, mouseY * -0.35, 0.05
      );
    }

    groupRef.current.position.y = Math.sin(t * 0.9) * 0.07;
  });

  return (
    <group ref={groupRef} rotation={[0.05, -0.32, 0.04]}>
      <primitive object={root} />
    </group>
  );
}
