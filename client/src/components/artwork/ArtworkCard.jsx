import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const ArtworkCard = ({ artwork, index = 0 }) => {
  const { addItem, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const inCart = isInCart(artwork._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isAuthenticated) addItem(artwork);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="card-hover overflow-hidden group"
    >
      <Link to={`/artworks/${artwork._id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gallery-surface">
          <img
            src={artwork.thumbnail}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${artwork._id}/400/530`;
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Featured badge */}
          {artwork.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-primary">Featured</span>
            </div>
          )}

          {/* Status badge */}
          {artwork.status === 'sold' && (
            <div className="absolute top-3 right-3">
              <span className="badge badge-danger">Sold</span>
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {artwork.status !== 'sold' && isAuthenticated && (
              <button
                onClick={handleAddToCart}
                className={`flex-1 btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>
            )}
            <button className="p-1.5 rounded-lg bg-gallery-card/80 text-gray-300 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Stats overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-1 glass rounded-md px-2 py-0.5 text-xs text-yellow-400">
              <Star className="w-3 h-3" /> {artwork.avgRating || '—'}
            </div>
            <div className="flex items-center gap-1 glass rounded-md px-2 py-0.5 text-xs text-gray-300">
              <Eye className="w-3 h-3" /> {formatNumber(artwork.views || 0)}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-white text-base leading-tight line-clamp-2 group-hover:text-primary-300 transition-colors">
              {artwork.title}
            </h3>
            <span className="text-base font-bold text-primary-400 whitespace-nowrap">
              {formatCurrency(artwork.price)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {artwork.artist?.avatar && (
                <img src={artwork.artist.avatar} alt={artwork.artist.name}
                  className="w-5 h-5 rounded-full object-cover" />
              )}
              <p className="text-xs text-gray-400">{artwork.artist?.name}</p>
            </div>
            <span className="text-xs text-gray-600 capitalize bg-gallery-surface px-2 py-0.5 rounded-full">
              {artwork.category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArtworkCard;
