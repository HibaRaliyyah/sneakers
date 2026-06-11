import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FiArrowLeft, FiShoppingBag, FiCheck, FiRotateCcw, FiMinus, FiPlus } from 'react-icons/fi';
import ShoeModel from '../components/three/ShoeModel';
import { useCart } from '../context/CartContext.jsx';

const COLOR_OPTIONS = [
  { label: 'Void Blue',     value: '#00d4ff', name: 'VOID BLUE',    price: 0   },
  { label: 'Cyber Cyan',    value: '#00ffcc', name: 'CYBER CYAN',   price: 0   },
  { label: 'Ultra Violet',  value: '#9b59ff', name: 'ULTRA VIOLET', price: 20  },
  { label: 'Solar Pink',    value: '#ff0099', name: 'SOLAR PINK',   price: 20  },
  { label: 'Arctic White',  value: '#e8e8e8', name: 'ARCTIC WHITE', price: 0   },
  { label: 'Hyper Red',     value: '#ff3333', name: 'HYPER RED',    price: 20  },
  { label: 'Gold Rush',     value: '#e0c040', name: 'GOLD RUSH',    price: 40  },
  { label: 'Shadow Black',  value: '#334455', name: 'SHADOW BLACK', price: 0   },
];

const SIZES = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'];

const MATERIALS = [
  { name: 'VOID FLEX',    desc: 'Ultra-lightweight mesh upper',         price: 0  },
  { name: 'CARBON WEAVE', desc: 'Carbon-fiber reinforced composite',    price: 50 },
  { name: 'LUNAR KNIT',   desc: 'Premium adaptive knit technology',     price: 35 },
];

const SOLE_OPTIONS = [
  { name: 'STANDARD',   desc: 'Standard cushioning',  price: 0  },
  { name: 'MAX CLOUD',  desc: 'Maximum comfort foam',  price: 30 },
  { name: 'CARBON PRO', desc: 'Performance carbon plate', price: 60 },
];

const BASE_PRICE = 349;

export default function ConfigurePage({ onBack, onAddToCart }) {
  const { cartItems, updateQty, removeItem, addToCart } = useCart();
  const [color, setColor]     = useState(COLOR_OPTIONS[0]);
  const [size, setSize]       = useState(null);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [sole, setSole]       = useState(SOLE_OPTIONS[0]);
  const [step, setStep]       = useState(0); // 0=color, 1=size, 2=material, 3=sole
  const [autoRotate, setAutoRotate] = useState(true);
  const [baseProductId, setBaseProductId] = useState(null);

  useEffect(() => {
    import('../api/index.js').then(({ apiFetch }) => {
      apiFetch('/api/products?search=VOID X1')
        .then(({ products }) => {
          if (products && products[0]) setBaseProductId(products[0]._id);
        })
        .catch(console.error);
    });
  }, []);

  const totalPrice = BASE_PRICE + color.price + material.price + sole.price;

  const steps = [
    { label: 'Color'},
    { label: 'Size'},
    { label: 'Material'},
    { label: 'Sole'},
  ];

  const cartItem = cartItems.find(i => i.id === baseProductId && i.size === size && i.color === color.value);

  const handleAdd = () => {
    if (!size) { setStep(1); return; }
    if (cartItem) {
      updateQty(cartItem._itemId, cartItem.qty + 1);
    } else {
      const payload = {
        _id: baseProductId,
        name: 'VOID X1 CUSTOM', 
        price: totalPrice, 
        color: color.value, 
        size 
      };
      if (onAddToCart) onAddToCart(payload);
      else addToCart(payload);
    }
  };

  const handleMinus = () => {
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQty(cartItem._itemId, cartItem.qty - 1);
      } else {
        removeItem(cartItem._itemId);
      }
    }
  };

  const reset = () => {
    setColor(COLOR_OPTIONS[0]);
    setSize(null);
    setMaterial(MATERIALS[0]);
    setSole(SOLE_OPTIONS[0]);
    setStep(0);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#000008' }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${color.value}12 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(155,89,255,0.08) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* ── LEFT: 3D Viewer ── */}
        <div className="lg:w-3/5 relative" style={{ minHeight: '55vh' }}>
          {/* Header */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="font-display font-black text-white text-lg">
              VOID<span style={{ color: color.value }}>STEP</span>
            </span>
          </div>

          {/* Auto-rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: autoRotate ? 'var(--neon-blue)' : 'rgba(255,255,255,0.3)',
            }}
          >
            <FiRotateCcw size={12} />
            {autoRotate ? 'Auto' : 'Manual'}
          </button>

          {/* Canvas */}
          <Canvas
            camera={{ position: [3.5, 1.5, 4.5], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            shadows
            style={{ width: '100%', height: '100%', minHeight: '55vh' }}
          >
            <AdaptiveDpr pixelated />
            <ambientLight intensity={0.45} />

            <Suspense fallback={null}>
              <Environment preset="warehouse" environmentIntensity={0.2} />
              <ShoeModel color={color.value} autoRotate={autoRotate} />
              <ContactShadows
                position={[0, -0.95, 0]}
                opacity={0.5}
                scale={7}
                blur={3}
                far={5}
                color={color.value}
              />
            </Suspense>

            {!autoRotate && (
              <OrbitControls
                enablePan={false}
                minDistance={2.5}
                maxDistance={9}
                maxPolarAngle={Math.PI / 1.7}
                minPolarAngle={Math.PI / 8}
              />
            )}

            <EffectComposer>
              <Bloom intensity={0.5} luminanceThreshold={0.85} luminanceSmoothing={0.7} radius={0.4} />
            </EffectComposer>
          </Canvas>

          {/* Color name overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <motion.div
              key={color.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 rounded-full text-xs font-bold font-mono tracking-widest"
              style={{
                background: `${color.value}20`,
                border: `1px solid ${color.value}50`,
                color: color.value,
              }}
            >
              {color.name}
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT: Configuration Panel ── */}
        <div
          className="lg:w-2/5 flex flex-col"
          style={{
            background: 'rgba(5,5,15,0.9)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Title */}
            <div className="mb-8">
              <p className="section-label text-[10px] mb-2">CUSTOM CONFIGURATOR</p>
              <h1 className="font-display font-black text-3xl text-white tracking-tight">VOID X1</h1>
              <p className="text-white/30 text-sm mt-1">Design your perfect pair</p>
            </div>

            {/* Step tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: step === i ? `${color.value}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${step === i ? color.value + '60' : 'rgba(255,255,255,0.06)'}`,
                    color: step === i ? color.value : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && (
                  <ConfigSection title="Choose Color">
                    <div className="grid grid-cols-4 gap-3">
                      {COLOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setColor(opt)}
                          className="group flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-12 h-12 rounded-2xl transition-all"
                            style={{
                              background: opt.value,
                              border: `2px solid ${color.value === opt.value ? opt.value : 'transparent'}`,
                              boxShadow: color.value === opt.value ? `0 0 16px ${opt.value}80` : 'none',
                              transform: color.value === opt.value ? 'scale(1.15)' : 'scale(1)',
                            }}
                          />
                          <span className="text-[9px] text-white/30 font-mono">{opt.name.split(' ')[0]}</span>
                          {opt.price > 0 && (
                            <span className="text-[9px]" style={{ color: opt.value }}>+${opt.price}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                )}

                {step === 1 && (
                  <ConfigSection title="Select Size">
                    <div className="grid grid-cols-4 gap-2">
                      {SIZES.map(s => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className="py-3 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: size === s ? `${color.value}20` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${size === s ? color.value : 'rgba(255,255,255,0.08)'}`,
                            color: size === s ? color.value : 'rgba(255,255,255,0.5)',
                            transform: size === s ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >
                          {s.replace('US ', '')}
                        </button>
                      ))}
                    </div>
                    {!size && (
                      <p className="text-xs mt-3" style={{ color: '#ff6060' }}>Please select a size</p>
                    )}
                  </ConfigSection>
                )}

                {step === 2 && (
                  <ConfigSection title="Upper Material">
                    <div className="space-y-3">
                      {MATERIALS.map(m => (
                        <button
                          key={m.name}
                          onClick={() => setMaterial(m)}
                          className="w-full p-4 rounded-2xl text-left transition-all"
                          style={{
                            background: material.name === m.name ? `${color.value}10` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${material.name === m.name ? color.value + '50' : 'rgba(255,255,255,0.07)'}`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm text-white font-mono tracking-wider">{m.name}</p>
                              <p className="text-xs text-white/40 mt-0.5">{m.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {m.price > 0 && (
                                <span className="text-xs font-bold" style={{ color: color.value }}>+${m.price}</span>
                              )}
                              {material.name === m.name && (
                                <FiCheck size={14} style={{ color: color.value }} />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                )}

                {step === 3 && (
                  <ConfigSection title="Sole Technology">
                    <div className="space-y-3">
                      {SOLE_OPTIONS.map(s => (
                        <button
                          key={s.name}
                          onClick={() => setSole(s)}
                          className="w-full p-4 rounded-2xl text-left transition-all"
                          style={{
                            background: sole.name === s.name ? `${color.value}10` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${sole.name === s.name ? color.value + '50' : 'rgba(255,255,255,0.07)'}`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm text-white font-mono tracking-wider">{s.name}</p>
                              <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {s.price > 0 && (
                                <span className="text-xs font-bold" style={{ color: color.value }}>+${s.price}</span>
                              )}
                              {sole.name === s.name && (
                                <FiCheck size={14} style={{ color: color.value }} />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ConfigSection>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex justify-between mt-6">
              <button
                disabled={step === 0}
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white transition-all disabled:opacity-20"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ← Previous
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{ background: `${color.value}20`, border: `1px solid ${color.value}40`, color: color.value }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white transition-all flex items-center gap-1.5"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <FiRotateCcw size={11} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div
            className="p-6 md:p-8 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Config summary */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                ['Color', color.name],
                ['Size', size || 'Not selected'],
                ['Material', material.name],
                ['Sole', sole.name],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-white/20 font-mono">{k}</p>
                  <p className="text-xs text-white/60 font-semibold mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-white/30 text-sm">Total</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                className="font-display font-black text-2xl"
                style={{ color: color.value }}
              >
                ${totalPrice}
              </motion.span>
            </div>

            {cartItem ? (
              <div className="w-full py-2 rounded-2xl flex items-center justify-between px-6 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${color.value}40`,
                }}>
                <button onClick={handleMinus} className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"><FiMinus size={18} /></button>
                <span className="text-xl font-bold w-6 text-center" style={{ color: color.value }}>{cartItem.qty}</span>
                <button onClick={handleAdd} className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white" style={{ color: color.value }}><FiPlus size={18} /></button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${color.value}, ${color.value}cc)`,
                }}
              >
                <FiShoppingBag size={16} />
                {!size ? 'Select Size First' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigSection({ title, children }) {
  return (
    <div>
      <p className="section-label text-[10px] mb-4">{title.toUpperCase()}</p>
      {children}
    </div>
  );
}
