import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, default: 1, min: 1 },
  size: { type: String, default: 'US 10' },
  color: { type: String },        // selected color hex
  colorName: { type: String },
}, { _id: true });

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
