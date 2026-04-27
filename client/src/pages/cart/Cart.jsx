import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

const Cart = () => {
  const { items, removeItem, subtotal, tax, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gallery-card border border-gallery-border flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">Discover extraordinary artworks and add them to your collection</p>
          <Link to="/artworks" className="btn btn-primary btn-lg">
            Browse Artworks <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section min-h-screen">
      <div className="container-max">
        <div className="mb-8">
          <Link to="/artworks" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <h1 className="font-display text-4xl font-bold text-white">Your Cart</h1>
          <p className="text-gray-400 mt-1">{items.length} artwork{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div key={item._id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="card flex gap-4 p-4"
              >
                <img src={item.thumbnail} alt={item.title}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${item._id}/200/200`; }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
                  {item.artist?.name && <p className="text-sm text-gray-400 mb-1">by {item.artist.name}</p>}
                  <p className="text-xs text-gray-500 capitalize mb-2">{item.category}</p>
                  <p className="text-lg font-bold text-primary-400">{formatCurrency(item.price)}</p>
                </div>
                <button onClick={() => removeItem(item._id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all flex-shrink-0 self-start">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="text-white">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-gallery-border pt-3 flex justify-between font-semibold text-base">
                  <span className="text-white">Total</span>
                  <span className="text-gradient text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary w-full btn-lg mb-3">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/artworks" className="btn btn-secondary w-full">
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gallery-border space-y-2">
                {['🔒 Secure payment', '🚚 Free insured shipping', '✅ Certificate of authenticity', '↩️ 14-day return policy'].map(badge => (
                  <p key={badge} className="text-xs text-gray-500">{badge}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
