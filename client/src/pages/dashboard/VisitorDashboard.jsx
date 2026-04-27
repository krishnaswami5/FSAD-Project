import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Clock, Compass, Star, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import ArtworkCard from '../../components/artwork/ArtworkCard';
import { formatCurrency, formatDate } from '../../utils/formatters';

const mockOrders = [
  {
    _id: 'ord1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    total: 3200,
    status: 'delivered',
    items: [
      { title: 'Silent Bloom', price: 3200, thumbnail: 'https://picsum.photos/seed/bloom/80/80', artist: 'Marcus Reyes' },
    ],
  },
  {
    _id: 'ord2',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    total: 3830,
    status: 'shipped',
    items: [
      { title: 'Urban Fragments', price: 1850, thumbnail: 'https://picsum.photos/seed/urban/80/80', artist: 'Elena Vasquez' },
      { title: 'Digital Reverie', price: 980, thumbnail: 'https://picsum.photos/seed/digital1/80/80', artist: 'Marcus Reyes' },
    ],
  },
];

const VisitorDashboard = () => {
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const { artworks } = useSelector(s => s.artworks);
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState(artworks.slice(0, 4));

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: `Orders (${mockOrders.length})` },
    { key: 'wishlist', label: `Wishlist (${wishlist.length})` },
  ];

  const statusColor = { pending: 'badge-warning', paid: 'badge-info', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">My Account</p>
        <h1 className="font-display text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: 'Orders', value: mockOrders.length, color: 'bg-primary-700' },
          { icon: Heart, label: 'Wishlist', value: wishlist.length, color: 'bg-red-700' },
          { icon: ShoppingBag, label: 'In Cart', value: cartItems.length, color: 'bg-accent-700' },
          { icon: Package, label: 'Delivered', value: mockOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-700' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <p className="stat-label">{s.label}</p>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="stat-value">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gallery-card rounded-xl border border-gallery-border mb-8 w-fit overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key ? 'bg-primary-700 text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/artworks" className="card p-5 flex items-center gap-4 hover:border-primary-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Browse Gallery</p>
                <p className="text-xs text-gray-400">Discover new art</p>
              </div>
            </Link>
            <Link to="/virtual-tour" className="card p-5 flex items-center gap-4 hover:border-primary-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent-900 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Virtual Tour</p>
                <p className="text-xs text-gray-400">Explore exhibitions</p>
              </div>
            </Link>
            <Link to="/cart" className="card p-5 flex items-center gap-4 hover:border-primary-600 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">View Cart</p>
                <p className="text-xs text-gray-400">{cartItems.length} items</p>
              </div>
            </Link>
          </div>

          {/* Recent orders preview */}
          {mockOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {mockOrders.slice(0, 2).map(order => (
                  <div key={order._id} className="card p-4 flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 2).map((item, i) => (
                        <img key={i} src={item.thumbnail} alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-gallery-card"
                          onError={e => { e.target.src = `https://picsum.photos/seed/${i}/80/80`; }} />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{order.items.map(i => i.title).join(', ')}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary-400">{formatCurrency(order.total)}</p>
                      <span className={`badge text-xs ${statusColor[order.status] || 'badge-info'}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended artworks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
              <Link to="/artworks" className="text-sm text-primary-400 hover:text-primary-300">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {artworks.slice(0, 4).map((art, i) => (
                <ArtworkCard key={art._id} artwork={art} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Order History</h2>
          {mockOrders.length === 0 ? (
            <div className="card p-10 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-display text-lg text-white mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-4">Start collecting beautiful artworks</p>
              <Link to="/artworks" className="btn btn-primary">Browse Artworks</Link>
            </div>
          ) : mockOrders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-white">Order #{order._id.slice(-6)}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-400">{formatCurrency(order.total)}</p>
                  <span className={`badge ${statusColor[order.status] || 'badge-info'}`}>{order.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${i}/80/80`; }} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.title}</p>
                      <p className="text-xs text-gray-400">by {item.artist}</p>
                    </div>
                    <p className="text-sm font-medium text-primary-400">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-5">Your Wishlist ({wishlist.length})</h2>
          {wishlist.length === 0 ? (
            <div className="card p-10 text-center">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-display text-lg text-white mb-2">No wishlist items</h3>
              <p className="text-gray-400 mb-4">Heart artworks you love to save them here</p>
              <Link to="/artworks" className="btn btn-primary">Explore Gallery</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlist.map((art, i) => (
                <ArtworkCard key={art._id} artwork={art} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitorDashboard;
