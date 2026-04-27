import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, Grid, List } from 'lucide-react';
import { fetchArtworks, setFilters, clearFilters } from '../../redux/slices/artworkSlice';
import ArtworkCard from '../../components/artwork/ArtworkCard';
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from '../../utils/constants';

const Artworks = () => {
  const dispatch = useDispatch();
  const { artworks, loading, filters, pagination } = useSelector(s => s.artworks);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    dispatch(fetchArtworks({ ...filters, page: 1 }));
  }, [filters, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const handleCategoryClick = (cat) => {
    dispatch(setFilters({ category: filters.category === cat ? '' : cat }));
  };

  const handlePriceRange = (range) => {
    dispatch(setFilters({ minPrice: range.min, maxPrice: range.max }));
  };

  const handleSort = (sort) => dispatch(setFilters({ sort }));

  const handleClear = () => { dispatch(clearFilters()); setSearchInput(''); };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search;

  // Filter displayed artworks by active filters (for offline/mock mode)
  const displayedArtworks = artworks.filter(a => {
    if (filters.category && a.category !== filters.category) return false;
    if (filters.minPrice && a.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && a.price > Number(filters.maxPrice)) return false;
    if (filters.search && !a.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="section min-h-screen">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">Our Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Explore Artworks</h1>
          <p className="text-gray-400 max-w-xl">
            Discover {pagination.total || displayedArtworks.length} extraordinary pieces from world-class artists across every style and medium.
          </p>
        </div>

        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="artwork-search"
              type="text"
              placeholder="Search by title, artist, tag…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="input pl-10 pr-28"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm">
              Search
            </button>
          </form>
          <div className="flex gap-2">
            <button onClick={() => setShowFilters(f => !f)}
              className={`btn btn-secondary flex items-center gap-2 ${showFilters ? 'border-primary-500 text-primary-400' : ''}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
            </button>
            <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
              className="btn btn-secondary p-2.5">
              {view === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="card p-5 mb-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Filter & Sort</h3>
              {hasActiveFilters && (
                <button onClick={handleClear} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2.5">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.value}
                    onClick={() => handleCategoryClick(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filters.category === cat.value
                        ? 'bg-primary-700 border-primary-500 text-white'
                        : 'bg-gallery-surface border-gallery-border text-gray-400 hover:border-primary-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2.5">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(range => (
                  <button key={range.label}
                    onClick={() => handlePriceRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filters.minPrice == range.min && filters.maxPrice == range.max
                        ? 'bg-primary-700 border-primary-500 text-white'
                        : 'bg-gallery-surface border-gallery-border text-gray-400 hover:border-primary-600'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2.5">Sort By</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.value}
                    onClick={() => handleSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filters.sort === opt.value
                        ? 'bg-primary-700 border-primary-500 text-white'
                        : 'bg-gallery-surface border-gallery-border text-gray-400 hover:border-primary-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.category && (
              <span className="badge badge-primary">
                {CATEGORIES.find(c => c.value === filters.category)?.label}
                <button onClick={() => dispatch(setFilters({ category: '' }))} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {filters.search && (
              <span className="badge badge-info">
                "{filters.search}"
                <button onClick={() => { dispatch(setFilters({ search: '' })); setSearchInput(''); }} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="badge badge-warning">
                Price filtered
                <button onClick={() => dispatch(setFilters({ minPrice: '', maxPrice: '' }))} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="text-white">{displayedArtworks.length}</span> artworks
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : displayedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-display text-xl text-white mb-2">No artworks found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
            <button onClick={handleClear} className="btn btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <div className={view === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "grid grid-cols-1 gap-4"
          }>
            {displayedArtworks.map((artwork, i) => (
              <ArtworkCard key={artwork._id} artwork={artwork} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artworks;
