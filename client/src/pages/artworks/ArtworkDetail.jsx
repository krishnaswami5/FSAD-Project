import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Star, Eye, ArrowLeft, Share2,
  User, Calendar, Ruler, Tag, ExternalLink, Check
} from 'lucide-react';
import { fetchArtwork, addReview } from '../../redux/slices/artworkSlice';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => !readonly && onChange?.(s)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}>
        <Star className={`w-5 h-5 ${s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
      </button>
    ))}
  </div>
);

const ArtworkDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentArtwork: artwork, loading, artworks } = useSelector(s => s.artworks);
  const { addItem, isInCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchArtwork(id));
  }, [id, dispatch]);

  // Fallback to mock data
  const displayArtwork = artwork || artworks.find(a => a._id === id);

  const handleAddToCart = () => {
    if (!displayArtwork) return;
    addItem(displayArtwork);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setReviewSubmitting(true);
    await dispatch(addReview({ id, data: { rating: reviewRating, comment: reviewComment } }));
    setReviewComment('');
    setReviewSubmitting(false);
  };

  if (loading || !displayArtwork) {
    return (
      <div className="section container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-[3/4] rounded-2xl" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-8 rounded-xl" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const inCart = isInCart(displayArtwork._id);
  const images = displayArtwork.images?.length ? displayArtwork.images : [{ url: displayArtwork.thumbnail }];

  return (
    <div className="section">
      <div className="container-max">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gallery-card border border-gallery-border"
            >
              <img
                src={images[selectedImage]?.url || displayArtwork.thumbnail}
                alt={displayArtwork.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = `https://picsum.photos/seed/${id}/600/800`; }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {displayArtwork.isFeatured && <span className="badge badge-primary">Featured</span>}
                <span className={`badge ${getStatusBadge(displayArtwork.status)}`}>{displayArtwork.status}</span>
              </div>
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-500' : 'border-gallery-border'}`}>
                    <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="badge badge-primary mb-3 capitalize">{displayArtwork.category}</span>
              <h1 className="font-display text-4xl font-bold text-white mb-2">{displayArtwork.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <StarRating value={Math.round(displayArtwork.avgRating)} readonly />
                <span className="text-sm text-gray-400">
                  {displayArtwork.avgRating || '—'} ({displayArtwork.totalReviews || 0} reviews)
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" /> {displayArtwork.views || 0} views
                </span>
              </div>
              <p className="text-4xl font-bold text-gradient">{formatCurrency(displayArtwork.price)}</p>
            </div>

            {/* Artist */}
            <div className="flex items-center gap-3 p-4 card">
              {displayArtwork.artist?.avatar && (
                <img src={displayArtwork.artist.avatar} alt={displayArtwork.artist?.name}
                  className="w-12 h-12 rounded-xl object-cover" />
              )}
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Created by</p>
                <p className="font-semibold text-white">{displayArtwork.artist?.name}</p>
                {displayArtwork.artist?.bio && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{displayArtwork.artist.bio}</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {displayArtwork.medium && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Tag className="w-4 h-4 text-primary-500" />
                  <span>{displayArtwork.medium}</span>
                </div>
              )}
              {displayArtwork.year && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{displayArtwork.year}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">About this Artwork</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{displayArtwork.description}</p>
            </div>

            {/* Cultural history */}
            {displayArtwork.culturalHistory && (
              <div className="p-4 rounded-xl bg-primary-900/20 border border-primary-800/30">
                <h3 className="text-sm font-semibold text-primary-300 mb-2">Cultural & Historical Context</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{displayArtwork.culturalHistory}</p>
              </div>
            )}

            {/* Tags */}
            {displayArtwork.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayArtwork.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-gallery-card border border-gallery-border text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {displayArtwork.status !== 'sold' ? (
                <button
                  onClick={handleAddToCart}
                  disabled={inCart || added}
                  className={`flex-1 btn btn-lg ${inCart || added ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {added ? <><Check className="w-5 h-5" /> Added!</> :
                   inCart ? <><ShoppingCart className="w-5 h-5" /> In Cart</> :
                   <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
                </button>
              ) : (
                <div className="flex-1 btn btn-secondary btn-lg opacity-60 cursor-not-allowed">Sold</div>
              )}
              <button className="btn btn-secondary btn-lg p-4">
                <Heart className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary btn-lg p-4">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Review form */}
          {isAuthenticated && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Leave a Review</h2>
              <form onSubmit={handleReviewSubmit} className="card p-6 space-y-4">
                <div>
                  <label className="input-label mb-2">Your Rating</label>
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                </div>
                <div>
                  <label className="input-label">Comment</label>
                  <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this artwork…"
                    rows={4} className="input resize-none" required />
                </div>
                <button type="submit" disabled={reviewSubmitting} className="btn btn-primary w-full">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Existing reviews */}
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Reviews ({displayArtwork.reviews?.length || 0})
            </h2>
            {displayArtwork.reviews?.length === 0 ? (
              <div className="card p-6 text-center text-gray-500">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayArtwork.reviews?.map((review, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {review.user?.avatar ? (
                        <img src={review.user.avatar} alt={review.user?.name}
                          className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-xs font-bold text-white">
                          {review.user?.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{review.user?.name || 'Collector'}</p>
                        <StarRating value={review.rating} readonly />
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-gray-400">{review.comment}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
