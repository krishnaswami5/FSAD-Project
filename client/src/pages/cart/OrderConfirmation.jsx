import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'ORD' + Date.now();
  const total = state?.total || 0;
  const items = state?.items || [];

  return (
    <div className="section min-h-screen flex items-center justify-center">
      <div className="container-max max-w-xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}>
          <div className="w-24 h-24 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Order Confirmed! 🎨</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. Your artwork will be carefully packaged and shipped to you with a certificate of authenticity.
          </p>

          <div className="card p-6 text-left mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Order Details</h2>
              <span className="badge badge-success">Paid</span>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Order ID</span><span className="text-white font-mono text-xs">{orderId}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Date</span><span className="text-white">{formatDate(new Date())}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Delivery</span><span className="text-white">7–14 business days</span>
              </div>
            </div>
            {items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex gap-3 py-2 border-t border-gallery-border">
                <img src={item.thumbnail} alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${i}/80/80`; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.artist?.name || item.artist}</p>
                </div>
                <p className="text-sm text-primary-400 font-medium">{formatCurrency(item.price)}</p>
              </div>
            ))}
            <div className="border-t border-gallery-border pt-3 flex justify-between font-semibold">
              <span className="text-white">Total Paid</span>
              <span className="text-gradient text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn btn-secondary btn-lg">
              <Home className="w-4 h-4" /> Back to Gallery
            </Link>
            <Link to="/artworks" className="btn btn-primary btn-lg">
              Explore More Art <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
