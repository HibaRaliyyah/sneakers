import { AnimatePresence, motion } from 'framer-motion';

// Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { useCart }     from './context/CartContext.jsx';
import { useAuth }     from './context/AuthContext.jsx';

// Layout
import Navbar   from './components/layout/Navbar';
import Footer   from './components/layout/Footer';

// UI
import Loader     from './components/ui/Loader';
import CursorGlow from './components/ui/CursorGlow';

// Sections (landing page)
import Hero              from './components/sections/Hero';
import ShoeShowcase      from './components/sections/ShoeShowcase';
import ProductExperience from './components/sections/ProductExperience';
import Features          from './components/sections/Features';
import Stats             from './components/sections/Stats';
import Testimonials      from './components/sections/Testimonials';
import BrandStory        from './components/sections/BrandStory';
import Gallery           from './components/sections/Gallery';
import Newsletter        from './components/sections/Newsletter';

// Pages
import CartPage       from './pages/CartPage';
import SignInPage     from './pages/SignInPage';
import CollectionPage from './pages/CollectionPage';
import ConfigurePage  from './pages/ConfigurePage';
import OrdersPage     from './pages/OrdersPage';
import CheckoutPage   from './pages/CheckoutPage';

// Hooks
import { useLenis }  from './hooks/useLenis';
import { useState }  from 'react';

const PAGE_TRANSITION = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

/** Inner app — has access to Auth + Cart contexts */
function AppInner() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage]     = useState('home');

  const { cartCount, cartItems, addToCart } = useCart();
  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartShipping  = cartSubtotal > 300 ? 0 : 25;
  const cartTotal     = cartSubtotal + cartShipping;
  const { user, logout }         = useAuth();

  useLenis();

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <>
      <CursorGlow />

      <AnimatePresence>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" {...PAGE_TRANSITION} className="bg-void min-h-screen">
              <Navbar
                onNavigate={navigate}
                cartCount={cartCount}
                user={user}
                onLogout={handleLogout}
              />
              <main>
                <Hero onShopNow={() => navigate('collection')} onExplore={() => navigate('collection')} />
                <ShoeShowcase onViewAll={() => navigate('collection')} onAddToCart={addToCart} />
                <ProductExperience onConfigure={() => navigate('configure')} />
                <Features />
                <Stats />
                <Testimonials />
                <BrandStory />
                <Gallery />
                <Newsletter />
              </main>
              <Footer onNavigate={navigate} />
            </motion.div>
          )}

          {page === 'cart' && (
            <motion.div key="cart" {...PAGE_TRANSITION}>
              <CartPage
                onBack={() => navigate('home')}
                onCheckout={() => navigate(user ? 'checkout' : 'signin')}
              />
            </motion.div>
          )}

          {page === 'checkout' && (
            <motion.div key="checkout" {...PAGE_TRANSITION}>
              <CheckoutPage
                onBack={() => navigate('cart')}
                cartItems={cartItems}
                total={cartTotal}
              />
            </motion.div>
          )}

          {page === 'signin' && (
            <motion.div key="signin" {...PAGE_TRANSITION}>
              <SignInPage
                onBack={() => navigate('home')}
                onSuccess={() => navigate('home')}
              />
            </motion.div>
          )}

          {page === 'collection' && (
            <motion.div key="collection" {...PAGE_TRANSITION}>
              <CollectionPage
                onBack={() => navigate('home')}
                onAddToCart={addToCart}
              />
            </motion.div>
          )}

          {page === 'configure' && (
            <motion.div key="configure" {...PAGE_TRANSITION}>
              <ConfigurePage
                onBack={() => navigate('home')}
                onAddToCart={addToCart}
              />
            </motion.div>
          )}

          {page === 'orders' && (
            <motion.div key="orders" {...PAGE_TRANSITION}>
              <OrdersPage onBack={() => navigate('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
