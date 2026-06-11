import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { FiMenu, FiX, FiShoppingBag, FiCheck, FiLogOut, FiPackage, FiUser } from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Collection', href: '#showcase',    page: 'collection' },
  { label: 'Experience', href: '#experience',  page: null         },
  { label: 'Features',   href: '#features',    page: null         },
  { label: 'Story',      href: '#story',        page: null         },
  { label: 'Gallery',    href: '#gallery',      page: null         },
];

export default function Navbar({ onNavigate, cartCount = 0, user = null, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const prevCount = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  // Flash "Added" when cart count increases
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setJustAdded(true);
      const t = setTimeout(() => setJustAdded(false), 1800);
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const handleNavClick = (link) => {
    setMenuOpen(false);
    if (link.page && onNavigate) {
      onNavigate(link.page);
    } else {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border 0.4s ease',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => onNavigate && onNavigate('home')}
          className="font-display font-black text-2xl tracking-[-0.04em] cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          VOID<span style={{ color: 'var(--neon-blue)' }}>STEP</span>
        </motion.button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link)}
              className="animated-underline text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Row */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate && onNavigate('orders')}
                className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                <FiPackage size={14} />
                Orders
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-black"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}>
                  {user.name?.[0]?.toUpperCase() || <FiUser size={10} />}
                </div>
                <span className="text-xs text-white/70 font-medium max-w-[80px] truncate">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Sign out"
              >
                <FiLogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate('signin')}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => onNavigate && onNavigate('cart')}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
            style={{
              background: justAdded ? 'rgba(0,255,150,0.12)' : 'transparent',
              border: `1px solid ${justAdded ? 'rgba(0,255,150,0.35)' : 'transparent'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.div
                  key="added"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <FiCheck size={15} style={{ color: '#00ff96' }} />
                  <span className="text-xs font-bold" style={{ color: '#00ff96' }}>Added!</span>
                </motion.div>
              ) : (
                <motion.div key="bag" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
                  <FiShoppingBag size={18} className="text-white/70" />
                </motion.div>
              )}
            </AnimatePresence>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-black"
                style={{ background: justAdded ? '#00ff96' : 'var(--neon-blue)' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </button>

          <button
            onClick={() => onNavigate && onNavigate('collection')}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-black transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
          >
            Shop Now
          </button>
        </div>

        {/* Mobile: cart + menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('cart')}
            className="relative p-2 text-white"
          >
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-black"
                style={{ background: 'var(--neon-blue)' }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8"
          style={{ background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {NAV_LINKS.map(({ label, href, page }, i) => (
            <motion.button
              key={href}
              onClick={() => { setMenuOpen(false); handleNavClick({ label, href, page }); }}
              className="font-display font-bold text-4xl text-white/80 hover:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {label}
            </motion.button>
          ))}

          {user ? (
            <>
              <motion.button onClick={() => { setMenuOpen(false); onNavigate && onNavigate('orders'); }}
                className="text-xl text-white/50 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.08 }}>
                My Orders
              </motion.button>
              <motion.button onClick={() => { setMenuOpen(false); onLogout?.(); }}
                className="text-xl text-red-400/70 hover:text-red-400 transition-colors"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (NAV_LINKS.length + 1) * 0.08 }}>
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => { setMenuOpen(false); onNavigate && onNavigate('signin'); }}
              className="text-xl text-white/50 hover:text-white transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.08 }}
            >
              Sign In
            </motion.button>
          )}

          <motion.button
            onClick={() => { setMenuOpen(false); onNavigate && onNavigate('collection'); }}
            className="mt-4 px-10 py-4 rounded-full font-bold text-black text-xl"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (NAV_LINKS.length + 1) * 0.08 }}
          >
            Shop Now
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
