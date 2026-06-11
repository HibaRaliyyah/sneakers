import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Signature', 'Performance', 'Luxury', 'Lifestyle'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    badge: { type: String, default: '' },
    color: { type: String, required: true },    // primary hex color
    tags: [String],
    stock: { type: Number, default: 50 },
    description: { type: String, default: '' },
    sizes: {
      type: [String],
      default: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
