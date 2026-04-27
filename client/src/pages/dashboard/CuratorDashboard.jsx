import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Star, Palette, Edit2, Trash2, X, Image } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';

const mockExhibitions = [
  {
    _id: 'e1',
    title: 'Visions of Tomorrow',
    description: 'A groundbreaking exploration of how contemporary artists envision the future of humanity, technology, and nature.',
    theme: 'Futurism & Nature',
    coverImage: 'https://picsum.photos/seed/exhibition/600/300',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    isFeatured: true,
    artworks: Array.from({ length: 8 }),
    tags: ['contemporary', 'futurism', 'nature'],
    rooms: [
      { name: 'The Cosmic Room', description: 'Celestial wonders and universal mysteries', artworks: Array(3) },
      { name: 'The Earth Room', description: 'Grounded in nature and materiality', artworks: Array(3) },
      { name: 'The Digital Room', description: 'Code, algorithms and synthetic beauty', artworks: Array(2) },
    ],
  },
  {
    _id: 'e2',
    title: 'Echoes of the Earth',
    description: 'A collection celebrating the raw beauty of our natural world through sculpture and photography.',
    theme: 'Nature & Ecology',
    coverImage: 'https://picsum.photos/seed/exhibition2/600/300',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    isFeatured: false,
    artworks: Array.from({ length: 5 }),
    tags: ['nature', 'sculpture', 'photography'],
    rooms: [],
  },
];

const CuratorDashboard = () => {
  const { user } = useAuth();
  const { artworks } = useSelector(s => s.artworks);
  const [exhibitions, setExhibitions] = useState(mockExhibitions);
  const [activeTab, setActiveTab] = useState('exhibitions');
  const [showForm, setShowForm] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', theme: '', coverImage: '', tags: '' });

  const tabs = [
    { key: 'exhibitions', label: 'Exhibitions' },
    { key: 'collections', label: 'Collections' },
    { key: 'featured', label: 'Featured' },
  ];

  const handleCreateExhibition = (e) => {
    e.preventDefault();
    const newEx = {
      _id: 'ex' + Date.now(),
      ...form,
      tags: form.tags.split(',').map(t => t.trim()),
      artworks: [],
      rooms: [],
      isActive: true,
      isFeatured: false,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setExhibitions(prev => [newEx, ...prev]);
    setShowForm(false);
    setForm({ title: '', description: '', theme: '', coverImage: '', tags: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this exhibition?')) setExhibitions(prev => prev.filter(e => e._id !== id));
  };

  const featuredArtworks = artworks.filter(a => a.isFeatured);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">Curator Studio</p>
          <h1 className="font-display text-3xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> New Exhibition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="stat-label">Exhibitions</p>
          <p className="stat-value">{exhibitions.length}</p>
          <p className="text-xs text-gray-500">{exhibitions.filter(e => e.isActive).length} active</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Artworks</p>
          <p className="stat-value">{exhibitions.reduce((s, e) => s + (e.artworks?.length || 0), 0)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Featured Works</p>
          <p className="stat-value">{featuredArtworks.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gallery-card rounded-xl border border-gallery-border mb-8 w-fit">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-primary-700 text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exhibitions tab */}
      {activeTab === 'exhibitions' && (
        <div className="space-y-4">
          {exhibitions.map(ex => (
            <motion.div key={ex._id} layout
              className="card overflow-hidden hover:border-primary-700 transition-all cursor-pointer"
              onClick={() => setSelectedExhibition(selectedExhibition?._id === ex._id ? null : ex)}
            >
              <div className="flex gap-4 p-4">
                <img src={ex.coverImage} alt={ex.title}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${ex._id}/200/200`; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-display font-semibold text-white">{ex.title}</h3>
                    <div className="flex gap-1 flex-shrink-0">
                      {ex.isFeatured && <span className="badge badge-primary">Featured</span>}
                      <span className={`badge ${ex.isActive ? 'badge-success' : 'badge-warning'}`}>
                        {ex.isActive ? 'Active' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{ex.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span><BookOpen className="w-3 h-3 inline mr-1" />{ex.artworks?.length || 0} works</span>
                    <span><Palette className="w-3 h-3 inline mr-1" />{ex.rooms?.length || 0} rooms</span>
                    {ex.theme && <span>{ex.theme}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); }} className="btn btn-secondary btn-sm">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(ex._id); }} className="btn btn-danger btn-sm">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Expanded rooms */}
              <AnimatePresence>
                {selectedExhibition?._id === ex._id && ex.rooms?.length > 0 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gallery-border">
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {ex.rooms.map((room, i) => (
                        <div key={i} className="p-3 rounded-xl bg-gallery-surface border border-gallery-border">
                          <p className="text-sm font-semibold text-white mb-1">{room.name}</p>
                          <p className="text-xs text-gray-400 mb-2">{room.description}</p>
                          <p className="text-xs text-gray-500">{room.artworks?.length || 0} artworks</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Collections tab */}
      {activeTab === 'collections' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-5">Art Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Cosmic', 'Earth & Nature', 'Digital & Tech', 'Abstract Forms', 'Portraiture'].map((col, i) => {
              const seeds = ['cosmos', 'terra', 'digital1', 'storm', 'portrait'];
              return (
                <div key={col} className="card overflow-hidden hover:border-primary-700 transition-all cursor-pointer">
                  <img src={`https://picsum.photos/seed/${seeds[i]}/400/200`} alt={col}
                    className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{col}</h3>
                    <p className="text-xs text-gray-400">{Math.floor(Math.random() * 8) + 3} artworks</p>
                    <button className="btn btn-secondary btn-sm mt-3">Manage Collection</button>
                  </div>
                </div>
              );
            })}
            <div className="card p-6 flex flex-col items-center justify-center text-center border-dashed cursor-pointer hover:border-primary-600 transition-colors"
              style={{ minHeight: '180px' }}>
              <Plus className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">Create New Collection</p>
            </div>
          </div>
        </div>
      )}

      {/* Featured tab */}
      {activeTab === 'featured' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-5">Featured Artworks ({featuredArtworks.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredArtworks.map(art => (
              <div key={art._id} className="card overflow-hidden flex gap-3 p-3">
                <img src={art.thumbnail} alt={art.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = `https://picsum.photos/seed/${art._id}/100/100`; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{art.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{art.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-400">{art.avgRating || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Exhibition Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gallery-border">
              <h2 className="font-display text-xl font-bold text-white">Create Exhibition</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateExhibition} className="p-6 space-y-4">
              <div>
                <label className="input-label">Exhibition Title *</label>
                <input required className="input" placeholder="Title" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Theme</label>
                <input className="input" placeholder="e.g. Futurism & Nature" value={form.theme}
                  onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Cover Image URL</label>
                <input className="input" placeholder="https://..." value={form.coverImage}
                  onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Description *</label>
                <textarea required rows={3} className="input resize-none" placeholder="Describe the exhibition…"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Tags (comma-separated)</label>
                <input className="input" placeholder="contemporary, digital" value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn btn-primary">Create Exhibition</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CuratorDashboard;
