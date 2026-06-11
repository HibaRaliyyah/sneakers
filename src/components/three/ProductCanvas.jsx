import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ShoeModel from './ShoeModel';

const COLOR_OPTIONS = [
  { label: 'Neon Blue',   value: '#00d4ff', name: 'VOID BLUE'   },
  { label: 'Neon Cyan',   value: '#00ffcc', name: 'CYBER CYAN'  },
  { label: 'Neon Purple', value: '#9b59ff', name: 'ULTRA VIOLET'},
  { label: 'Neon Pink',   value: '#ff0099', name: 'SOLAR PINK'  },
  { label: 'White',       value: '#e0e0e0', name: 'ARCTIC WHITE'},
];

export default function ProductCanvas() {
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <AdaptiveDpr pixelated />

        {/* No direct lights — ambient only so the color tint on the model reads clearly */}
        <ambientLight intensity={0.45} />

        <Suspense fallback={null}>
          {/* Low-intensity IBL for natural shading, no harsh reflections */}
          <Environment preset="warehouse" environmentIntensity={0.2} />
          <ShoeModel color={color} autoRotate={false} />
          <ContactShadows
            position={[0, -1.0, 0]}
            opacity={0.3}
            scale={5}
            blur={2}
            far={3}
          />
        </Suspense>

        {/* Full 360° continuous auto-rotation */}
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={7}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 8}
          autoRotate
          autoRotateSpeed={2.5}
        />

        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.7}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>

      {/* Color switcher overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
          <span className="section-label text-[10px]">COLOR</span>
          <div className="flex gap-3">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setColor(opt.value)}
                className="relative"
                title={opt.name}
              >
                <div
                  className="w-7 h-7 rounded-full transition-all duration-200"
                  style={{
                    background: opt.value,
                    boxShadow: color === opt.value ? `0 0 12px ${opt.value}, 0 0 24px ${opt.value}40` : 'none',
                    transform: color === opt.value ? 'scale(1.3)' : 'scale(1)',
                    border: color === opt.value ? `2px solid ${opt.value}` : '2px solid rgba(255,255,255,0.15)',
                  }}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-white/40 font-mono ml-2">
            {COLOR_OPTIONS.find(o => o.value === color)?.name}
          </span>
        </div>
      </div>

      {/* Interaction hint */}
      <div className="absolute top-6 right-6 glass rounded-xl px-4 py-2">
        <p className="text-xs text-white/40 font-mono">DRAG TO ROTATE · SCROLL TO ZOOM</p>
      </div>
    </div>
  );
}
