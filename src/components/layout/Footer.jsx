import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiYoutube, FiLinkedin } from 'react-icons/fi';

const FOOTER_LINKS = {
  Collection: ['VOID X1', 'APEX RUNNER', 'LUNAR DRIFT', 'Archive'],
  Company:    ['About', 'Story', 'Careers', 'Press'],
  Support:    ['FAQ', 'Shipping', 'Returns', 'Contact'],
};

const SOCIALS = [
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: FiTwitter,   href: '#', label: 'Twitter'   },
  { icon: FiYoutube,   href: '#', label: 'YouTube'   },
  { icon: FiLinkedin,  href: '#', label: 'LinkedIn'  },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="relative bg-void2 border-t border-white/5 pt-20 pb-10 px-6 md:px-12 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-10"
        style={{ background: 'radial-gradient(ellipse at center, var(--neon-blue) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <h2 className="font-display font-black text-4xl tracking-[-0.04em] mb-4">
              VOID<span style={{ color: 'var(--neon-blue)' }}>STEP</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Engineered for tomorrow. Where innovation meets obsession. Step beyond the ordinary.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white"
                  whileHover={{ y: -3, borderColor: 'rgba(0,212,255,0.4)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="section-label mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white animated-underline transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/5 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/25 font-mono">
          <p>© 2026 VOIDSTEP. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/50 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
