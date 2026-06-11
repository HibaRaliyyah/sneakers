import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignInPage({ onBack, onSuccess }) {
  const { login, register } = useAuth();

  const [mode, setMode]       = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [serverError, setServerError] = useState('');
  const [forgotSent, setForgotSent]   = useState(false);

  const validate = () => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@'))              e.email = 'Enter a valid email';
    if (mode !== 'forgot' && form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'forgot') {
        // Simulate — no real password reset endpoint yet
        await new Promise((r) => setTimeout(r, 1200));
        setForgotSent(true);
        setLoading(false);
        return;
      }

      if (mode === 'signin') {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      onSuccess?.();
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    signin: { heading: 'Welcome Back',   sub: 'Sign in to your VOIDSTEP account' },
    signup: { heading: 'Join VOIDSTEP',  sub: 'Create your account to start shopping' },
    forgot: { heading: 'Reset Password', sub: "We'll send a reset link to your email" },
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setServerError('');
    setForgotSent(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#000010' }}
    >
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.15) 0%, transparent 70%)' }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group z-10"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back</span>
      </button>

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-display font-black text-2xl tracking-tight">
        VOID<span style={{ color: 'var(--neon-blue)' }}>STEP</span>
      </div>

      {/* Card */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-6"
      >
        {/* Glow behind card */}
        <div
          className="absolute inset-0 rounded-3xl blur-3xl -z-10"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }}
        />

        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(10,10,20,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px)',
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
            >
              <FiUser size={22} color="#000" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-black text-3xl text-white tracking-tight mb-1">
              {titles[mode].heading}
            </h1>
            <p className="text-white/40 text-sm">{titles[mode].sub}</p>
          </div>



          {/* Server Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
                style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.25)', color: '#ff6060' }}
              >
                <FiAlertCircle size={15} />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot success */}
          <AnimatePresence>
            {forgotSent && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl mb-4 text-sm text-center"
                style={{ background: 'rgba(0,255,100,0.08)', border: '1px solid rgba(0,255,100,0.2)', color: '#00ff80' }}
              >
                📬 Reset link sent! Check your inbox.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <InputField
                icon={<FiUser size={15} />}
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
              />
            )}

            <InputField
              icon={<FiMail size={15} />}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              error={errors.email}
            />

            {mode !== 'forgot' && (
              <InputField
                icon={<FiLock size={15} />}
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                error={errors.password}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                }
              />
            )}



            <button
              type="submit"
              disabled={loading || forgotSent}
              className="w-full py-4 rounded-xl font-bold text-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  {mode === 'signin' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending...'}
                </span>
              ) : forgotSent ? '✓ Link Sent' : (
                mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'
              )}
            </button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' && (
              <p className="text-white/30">
                New to VOIDSTEP?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--neon-blue)' }}
                >
                  Create an account
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-white/30">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--neon-blue)' }}
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                ← Back to sign in
              </button>
            )}
          </div>

          {/* Terms */}
          {mode === 'signup' && (
            <p className="text-[11px] text-white/20 text-center mt-4 leading-relaxed">
              By creating an account you agree to our{' '}
              <span style={{ color: 'var(--neon-blue)' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'var(--neon-blue)' }}>Privacy Policy</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-all hover:border-white/20"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span className="font-bold">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function InputField({ icon, type, placeholder, value, onChange, error, suffix }) {
  return (
    <div>
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        <span className="text-white/30 flex-shrink-0">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
        />
        {suffix}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-1.5 ml-1"
          style={{ color: '#ff6060' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
