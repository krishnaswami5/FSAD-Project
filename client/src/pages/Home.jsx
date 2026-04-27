import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Sparkles, Shield, TrendingUp, Globe, Star, Play } from 'lucide-react';
import { fetchFeatured } from '../redux/slices/artworkSlice';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { formatCurrency, formatNumber } from '../utils/formatters';

const stats = [
  { label: 'Artworks', value: '12,400', icon: '🖼️' },
  { label: 'Artists', value: '3,200', icon: '🎨' },
  { label: 'Sales', value: '$2.1M', icon: '💰' },
  { label: 'Countries', value: '84', icon: '🌍' },
];

const features = [
  { icon: Shield, title: 'Verified Artists', desc: 'Every artist is vetted and verified for authenticity.', color: 'text-primary-400' },
  { icon: Globe, title: 'Global Reach', desc: 'Connect with collectors and galleries worldwide.', color: 'text-blue-400' },
  { icon: TrendingUp, title: 'Growing Market', desc: 'Track sales, analytics, and market trends in real time.', color: 'text-accent-400' },
  { icon: Sparkles, title: 'Virtual Tours', desc: 'Experience immersive 3D gallery tours from anywhere.', color: 'text-green-400' },
];

const Home = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector(s => s.artworks);

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary-600/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Floating art thumbnails */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden xl:flex flex-col justify-center gap-3 pr-8 overflow-hidden">
          {['cosmos', 'urban', 'bloom', 'neon', 'terra'].map((seed, i) => (
            <motion.div key={seed}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: i % 2 === 0 ? 0 : 30, opacity: 0.7 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="relative flex-shrink-0"
            >
              <img src={`https://picsum.photos/seed/${seed}/300/200`} alt=""
                className="w-56 h-36 object-cover rounded-2xl shadow-card border border-gallery-border" />
            </motion.div>
          ))}
        </div>

        <div className="container-max px-6 relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="badge badge-primary mb-6 py-1.5 px-4 text-sm">
              <Star className="w-3.5 h-3.5" /> Premier Art Marketplace
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Where Art Meets{' '}
              <span className="text-gradient">Infinity</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-8">
              Discover extraordinary artworks from the world's most talented artists. Collect, invest, and immerse yourself in culture-defining pieces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/artworks" className="btn btn-primary btn-lg">
                Explore Gallery <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/virtual-tour" className="btn btn-secondary btn-lg">
                <Play className="w-4 h-4" /> Virtual Tour
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-gallery-border glass-dark">
        <div className="container-max px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="section">
        <div className="container-max">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">Curated Selection</p>
              <h2 className="font-display text-4xl font-bold text-white">Featured Artworks</h2>
            </div>
            <Link to="/artworks" className="btn btn-secondary hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.slice(0, 8).map((artwork, i) => (
              <ArtworkCard key={artwork._id} artwork={artwork} index={i} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/artworks" className="btn btn-secondary">View All Artworks</Link>
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="section bg-gallery-surface border-y border-gallery-border">
        <div className="container-max">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-gallery-dark/60" />
            <img src="https://picsum.photos/seed/gallery-wide/1200/400" alt="Virtual Tour"
              className="w-full h-80 object-cover" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-12">
              <div className="max-w-xl">
                <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-3">New Experience</p>
                <h2 className="font-display text-4xl font-bold text-white mb-4">
                  Explore Our Virtual Gallery
                </h2>
                <p className="text-gray-300 mb-6">
                  Wander through immersive rooms, discover hidden gems, and experience art like never before — all from your home.
                </p>
                <Link to="/virtual-tour" className="btn btn-primary btn-lg">
                  <Play className="w-5 h-5" /> Start Virtual Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">Why AuraGallery</p>
            <h2 className="font-display text-4xl font-bold text-white">Built for Art Lovers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card p-6 hover:border-primary-700 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gallery-surface flex items-center justify-center mb-4">
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gallery-surface border-t border-gallery-border">
        <div className="container-max text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Start Your Art Journey?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of artists, collectors, and curators building the future of the art world.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/artworks" className="btn btn-secondary btn-lg">
                Browse Artworks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
