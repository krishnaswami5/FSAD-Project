import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { closeCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { items, isOpen, subtotal, tax, total, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-gallery-surface border-l border-gallery-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gallery-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                {items.length > 0 && (
                  <span className="badge badge-primary">{items.length}</span>
                )}
              </div>
              <button onClick={() => dispatch(closeCart())} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gallery-card transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gallery-card flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mt-1">Explore artworks to add to your collection</p>
                  </div>
                  <Link to="/artworks" onClick={() => dispatch(closeCart())} className="btn btn-primary btn-sm">
                    Browse Artworks
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <motion.div key={item._id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 card"
                  >
                    <img src={item.thumbnail} alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.artist?.name}</p>
                      <p className="text-sm font-semibold text-primary-400 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <button onClick={() => removeItem(item._id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gallery-border px-6 py-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span><span className="text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Tax (10%)</span><span className="text-white">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-gallery-border pt-2">
                    <span className="text-white">Total</span>
                    <span className="text-gradient">{formatCurrency(total)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())} className="btn btn-primary w-full">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/cart" onClick={() => dispatch(closeCart())} className="btn btn-secondary w-full">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
