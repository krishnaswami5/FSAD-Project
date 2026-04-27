import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ShoppingCart, Info, Maximize2, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

const rooms = [
  { id: 'r1', name: 'The Cosmic Room', description: 'Step into the infinite — celestial wonders and universal mysteries await.', wallColor: '#0a0a1e', artworkIndices: [0, 1, 2], ambience: 'Starlight & Silence' },
  { id: 'r2', name: 'The Earth Room', description: 'Grounded in nature — sculptures and paintings celebrating the raw beauty of our world.', wallColor: '#12100a', artworkIndices: [3, 4, 5], ambience: 'Organic & Primal' },
  { id: 'r3', name: 'The Digital Room', description: 'Code meets canvas — generative art and digital innovation push creative boundaries.', wallColor: '#0a120a', artworkIndices: [6, 7, 8], ambience: 'Electric & Synthetic' },
  { id: 'r4', name: 'The Portrait Hall', description: 'Faces and stories — a journey through human expression across cultures and centuries.', wallColor: '#1a0a0a', artworkIndices: [9, 10, 11], ambience: 'Warm & Intimate' },
];

const VirtualTour = () => {
  const { artworks } = useSelector(s => s.artworks);
  const { addItem, isInCart } = useCart();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const room = rooms[currentRoom];
  const roomArtworks = room.artworkIndices.map(i => artworks[i]).filter(Boolean);

  const goNext = () => setCurrentRoom(r => (r + 1) % rooms.length);
  const goPrev = () => setCurrentRoom(r => (r - 1 + rooms.length) % rooms.length);

  // Artwork wall positions
  const wallPositions = [
    { left: '10%', top: '10%', width: '28%', height: '65%' },
    { left: '36%', top: '5%', width: '28%', height: '75%' },
    { left: '64%', top: '10%', width: '28%', height: '65%' },
  ];

  return (
    <div className="min-h-screen bg-gallery-dark">
      {/* Header */}
      <div className="pt-20 pb-6 px-6">
        <div className="container-max flex items-center justify-between">
          <div>
            <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">Immersive Experience</p>
            <h1 className="font-display text-4xl font-bold text-white">{room.name}</h1>
            <p className="text-gray-400 mt-1 max-w-lg">{room.description}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="badge badge-primary">{room.ambience}</span>
            <span className="badge badge-info">Room {currentRoom + 1} of {rooms.length}</span>
          </div>
        </div>
      </div>

      {/* Virtual Room */}
      <div className="px-6 mb-6">
        <div className="container-max">
          <div
            className="relative rounded-3xl overflow-hidden border border-gallery-border shadow-2xl"
            style={{
              background: `linear-gradient(180deg, ${room.wallColor} 0%, ${room.wallColor}dd 60%, #0a0a0f 100%)`,
              minHeight: '480px',
              perspective: '1000px',
            }}
          >
            {/* Room floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))',
                borderTop: `1px solid rgba(255,255,255,0.04)`,
              }}
            />

            {/* Ceiling light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-white/3 blur-3xl rounded-full" />

            {/* Room name label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-4 py-1.5 rounded-full">
              <p className="text-xs text-gray-300">{room.name}</p>
            </div>

            {/* Artworks on wall */}
            {roomArtworks.map((artwork, i) => {
              const pos = wallPositions[i];
              return (
                <motion.div key={artwork._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => setSelectedArtwork(artwork)}
                  className="absolute cursor-pointer group"
                  style={{ left: pos.left, top: pos.top, width: pos.width, paddingBottom: pos.height }}
                >
                  {/* Frame */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden"
                    style={{
                      boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 3px rgba(255,255,255,0.1)',
                      border: '8px solid #2a2018',
                    }}
                  >
                    <img
                      src={artwork.thumbnail}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${artwork._id}/400/600`; }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-semibold line-clamp-1">{artwork.title}</p>
                        <p className="text-primary-300 text-xs">{formatCurrency(artwork.price)}</p>
                      </div>
                    </div>
                    {/* View icon */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1.5 rounded-lg glass">
                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                  {/* Frame shadow */}
                  <div className="absolute -bottom-3 left-2 right-2 h-4 bg-black/50 blur-sm rounded-full" />
                </motion.div>
              );
            })}

            {/* Navigation arrows */}
            <button onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass rounded-2xl text-white hover:bg-white/20 transition-all z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Room selector */}
      <div className="px-6 mb-8">
        <div className="container-max">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {rooms.map((r, i) => (
              <button key={r.id}
                onClick={() => { setCurrentRoom(i); setSelectedArtwork(null); }}
                className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium border transition-all ${
                  currentRoom === i
                    ? 'border-primary-500 bg-primary-900/30 text-white'
                    : 'border-gallery-border bg-gallery-card text-gray-400 hover:border-primary-600 hover:text-white'
                }`}
                style={currentRoom === i ? { boxShadow: '0 0 15px rgba(192, 68, 240, 0.2)' } : {}}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Artwork thumbnails */}
      <div className="px-6 mb-12">
        <div className="container-max">
          <h2 className="font-display text-xl font-semibold text-white mb-4">In This Room</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roomArtworks.map(artwork => (
              <motion.div key={artwork._id} layout
                className="card flex gap-3 p-3 cursor-pointer hover:border-primary-600 transition-all"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <img src={artwork.thumbnail} alt={artwork.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${artwork._id}/100/100`; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{artwork.title}</p>
                  <p className="text-xs text-gray-400">{artwork.artist?.name}</p>
                  <p className="text-sm font-semibold text-primary-400 mt-1">{formatCurrency(artwork.price)}</p>
                </div>
                <button className="p-1.5 text-gray-500 hover:text-primary-400 transition-colors flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Artwork detail modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              onClick={() => setSelectedArtwork(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50 card overflow-hidden"
            >
              <div className="relative">
                <img src={selectedArtwork.thumbnail} alt={selectedArtwork.title}
                  className="w-full h-72 object-cover"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${selectedArtwork._id}/800/400`; }} />
                <button onClick={() => setSelectedArtwork(null)}
                  className="absolute top-3 right-3 p-2 glass rounded-xl text-white hover:bg-white/20 transition-all">
                  <X className="w-5 h-5" />
                </button>
                {selectedArtwork.isFeatured && (
                  <div className="absolute top-3 left-3"><span className="badge badge-primary">Featured</span></div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white">{selectedArtwork.title}</h2>
                    <p className="text-gray-400 text-sm mt-1">by {selectedArtwork.artist?.name}</p>
                  </div>
                  <p className="text-2xl font-bold text-gradient">{formatCurrency(selectedArtwork.price)}</p>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{selectedArtwork.description}</p>
                {selectedArtwork.culturalHistory && (
                  <div className="p-3 rounded-xl bg-primary-900/20 border border-primary-800/30 mb-4">
                    <p className="text-xs text-primary-300 flex items-center gap-1.5 mb-1">
                      <Info className="w-3 h-3" /> Cultural Context
                    </p>
                    <p className="text-xs text-gray-300 line-clamp-2">{selectedArtwork.culturalHistory}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => { addItem(selectedArtwork); setSelectedArtwork(null); }}
                    disabled={isInCart(selectedArtwork._id)}
                    className="flex-1 btn btn-primary">
                    <ShoppingCart className="w-4 h-4" />
                    {isInCart(selectedArtwork._id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                  <Link to={`/artworks/${selectedArtwork._id}`} onClick={() => setSelectedArtwork(null)}
                    className="btn btn-secondary">
                    Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualTour;
