import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const PRODUCTS = [
  { name: 'VOID X1',        category: 'Signature',   price: 349, badge: 'BESTSELLER', color: '#00d4ff', tags: ['signature', 'limited'],    description: 'The flagship VOID X1 merges aerospace-grade materials with next-gen cushioning. Designed for those who dare to stand out.', rating: 4.9, reviewCount: 482 },
  { name: 'APEX RUNNER',    category: 'Performance', price: 289, badge: 'NEW DROP',   color: '#ff4444', tags: ['performance', 'sport'],     description: 'Built for elite performance. The Apex Runner features a carbon-fiber plate and adaptive foam that responds to every stride.', rating: 4.7, reviewCount: 213 },
  { name: 'LUNAR DRIFT',    category: 'Luxury',      price: 449, badge: 'LIMITED',    color: '#9b59ff', tags: ['luxury', 'limited'],         description: 'Hand-stitched Italian leather upper with our signature glow-midsole. Only 500 pairs worldwide.', rating: 4.8, reviewCount: 97 },
  { name: 'PHANTOM STRIKE', category: 'Performance', price: 319, badge: 'NEW',        color: '#00ffcc', tags: ['performance'],              description: 'Phantom Strike is engineered for speed. Ultra-light knit upper and our fastest midsole compound yet.', rating: 4.6, reviewCount: 154 },
  { name: 'NOVA LITE',      category: 'Lifestyle',   price: 199, badge: '',           color: '#ff9900', tags: ['lifestyle'],                description: 'Effortless everyday style. Nova Lite pairs clean silhouettes with vibrant colorways for the modern trendsetter.', rating: 4.5, reviewCount: 328 },
  { name: 'ULTRA ZERO',     category: 'Signature',   price: 499, badge: 'EXCLUSIVE',  color: '#e0c080', tags: ['signature', 'limited'],    description: 'Ultra Zero represents the pinnacle of VOIDSTEP design. Gold-accented hardware and hand-numbered insoles.', rating: 5.0, reviewCount: 64 },
  { name: 'GRID FORCE',     category: 'Performance', price: 259, badge: '',           color: '#ff0099', tags: ['performance', 'sport'],    description: 'Grid Force harnesses a multi-directional traction pattern for explosive lateral movement on any surface.', rating: 4.4, reviewCount: 189 },
  { name: 'DARK MATTER',    category: 'Luxury',      price: 529, badge: 'LIMITED',    color: '#c0c0c0', tags: ['luxury', 'limited'],        description: 'Dark Matter pushes the boundaries of luxury with iridescent overlays that shift color under different lighting.', rating: 4.9, reviewCount: 45 },
  { name: 'SOLAR RUSH',     category: 'Lifestyle',   price: 179, badge: 'NEW',        color: '#ffdd00', tags: ['lifestyle', 'sport'],       description: 'Solar Rush is your go-to for active days. Lightweight, breathable, and impossibly bright.', rating: 4.3, reviewCount: 267 },
  { name: 'STEALTH PRO',    category: 'Signature',   price: 389, badge: 'BESTSELLER', color: '#00d4ff', tags: ['signature'],               description: 'Stealth Pro is the workhorse of our Signature line — refined aesthetics with relentless all-day comfort.', rating: 4.8, reviewCount: 395 },
  { name: 'VOLT EDGE',      category: 'Performance', price: 299, badge: '',           color: '#aaff00', tags: ['performance'],              description: 'Volt Edge channels electric energy into every run. High-rebound foam and a precision-fit upper.', rating: 4.5, reviewCount: 142 },
  { name: 'COSMOS X',       category: 'Luxury',      price: 599, badge: 'EXCLUSIVE',  color: '#ff6600', tags: ['luxury', 'limited'],        description: 'The crown jewel of VOIDSTEP. Cosmos X features hand-painted gradient panels and a 24k gold heel badge.', rating: 5.0, reviewCount: 28 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let added = 0, skipped = 0;
    for (const p of PRODUCTS) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`  ➕ Seeded: ${p.name}`);
        added++;
      } else {
        console.log(`  ⏭️  Skipped (exists): ${p.name}`);
        skipped++;
      }
    }

    console.log(`\n✅ Seeding complete — ${added} added, ${skipped} skipped`);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
