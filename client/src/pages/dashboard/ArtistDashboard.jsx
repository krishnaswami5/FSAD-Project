import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit2, Trash2, Upload, TrendingUp, DollarSign, Eye, Star, X, Check, Image } from 'lucide-react';
import { fetchMyArtworks, createArtwork, updateArtwork, deleteArtwork } from '../../redux/slices/artworkSlice';
import { formatCurrency, getStatusBadge } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

const salesData = [
  { month: 'Jan', sales: 1200 }, { month: 'Feb', sales: 2100 },
  { month: 'Mar', sales: 900 }, { month: 'Apr', sales: 3400 },
  { month: 'May', sales: 2800 }, { month: 'Jun', sales: 4200 },
];

const emptyForm = { title: '', description: '', culturalHistory: '', price: '', category: 'painting', medium: '', year: new Date().getFullYear(), tags: '', thumbnail: '' };

const ArtistDashboard = () => {
  const dispatch = useDispatch();
  const { myArtworks, loading } = useSelector(s => s.artworks);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { dispatch(fetchMyArtworks({})); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price),
      year: Number(form.year),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      images: form.thumbnail ? [{ url: form.thumbnail }] : [],
    };
    if (editId) {
      await dispatch(updateArtwork({ id: editId, data }));
    } else {
      await dispatch(createArtwork(data));
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleEdit = (art) => {
    setForm({
      title: art.title, description: art.description,
      culturalHistory: art.culturalHistory || '',
      price: art.price, category: art.category,
      medium: art.medium || '', year: art.year || '',
      tags: art.tags?.join(', ') || '',
      thumbnail: art.thumbnail || '',
    });
    setEditId(art._id);
    setShowForm(true);
  };

  const handleDelete = (id) => { if (confirm('Delete this artwork?')) dispatch(deleteArtwork(id)); };

  const totalRevenue = myArtworks.filter(a => a.status === 'sold').reduce((s, a) => s + a.price, 0);
  const totalViews = myArtworks.reduce((s, a) => s + (a.views || 0), 0);
  const approved = myArtworks.filter(a => a.status === 'approved').length;
  const pending = myArtworks.filter(a => a.status === 'pending').length;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'artworks', label: `My Artworks (${myArtworks.length})` },
    { key: 'sales', label: 'Sales' },
    { key: 'messages', label: 'Messages' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">Artist Studio</p>
          <h1 className="font-display text-3xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="btn btn-primary">
          <Plus className="w-4 h-4" /> Upload Artwork
        </button>
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
        <div className="space-y-8">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { icon: Image, label: 'Total Artworks', value: myArtworks.length, color: 'bg-primary-700' },
              { icon: Check, label: 'Approved', value: approved, color: 'bg-green-700' },
              { icon: Eye, label: 'Total Views', value: totalViews, color: 'bg-blue-700' },
              { icon: DollarSign, label: 'Revenue Earned', value: formatCurrency(totalRevenue), color: 'bg-accent-700' },
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

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Revenue (6 Months)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c044f0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c044f0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={v => '$' + v} />
                <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }}
                  formatter={v => formatCurrency(v)} />
                <Area type="monotone" dataKey="sales" stroke="#c044f0" fill="url(#salesGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent artworks preview */}
          {myArtworks.slice(0, 4).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Recent Uploads</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {myArtworks.slice(0, 4).map(art => (
                  <div key={art._id} className="card overflow-hidden">
                    <img src={art.thumbnail} alt={art.title} className="w-full h-28 object-cover"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${art._id}/300/200`; }} />
                    <div className="p-2">
                      <p className="text-xs font-medium text-white truncate">{art.title}</p>
                      <span className={`badge text-xs ${getStatusBadge(art.status)}`}>{art.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Artworks */}
      {activeTab === 'artworks' && (
        <div>
          {myArtworks.length === 0 ? (
            <div className="card p-12 text-center">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-display text-xl text-white mb-2">No artworks yet</h3>
              <p className="text-gray-400 mb-4">Start uploading your art to reach collectors worldwide</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">Upload Your First Artwork</button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Artwork</th><th>Category</th><th>Price</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
                <tbody>
                  {myArtworks.map(art => (
                    <tr key={art._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img src={art.thumbnail} alt={art.title} className="w-10 h-10 rounded-lg object-cover"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${art._id}/80/80`; }} />
                          <p className="text-sm font-medium text-white line-clamp-1 max-w-[160px]">{art.title}</p>
                        </div>
                      </td>
                      <td><span className="text-xs text-gray-400 capitalize">{art.category}</span></td>
                      <td className="text-primary-400 font-medium text-sm">{formatCurrency(art.price)}</td>
                      <td><span className={`badge ${getStatusBadge(art.status)}`}>{art.status}</span></td>
                      <td className="text-xs text-gray-400">{art.views || 0}</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(art)} className="btn btn-secondary btn-sm"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => handleDelete(art._id)} className="btn btn-danger btn-sm"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Sales tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card">
              <p className="stat-label">Total Sales</p>
              <p className="stat-value">{myArtworks.filter(a => a.status === 'sold').length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg. Price</p>
              <p className="stat-value">{myArtworks.length ? formatCurrency(myArtworks.reduce((s, a) => s + a.price, 0) / myArtworks.length) : '$0'}</p>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="sGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7a14" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff7a14" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={v => '$' + v} />
                <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="sales" stroke="#ff7a14" fill="url(#sGrad2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Messages tab (basic UI) */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          {[
            { from: 'James Wilson', msg: 'Hi! I am very interested in purchasing "Chromatic Storm". Can we discuss pricing?', time: '2h ago', avatar: 'https://picsum.photos/seed/visitor/40/40' },
            { from: 'Sophie Laurent', msg: 'Would you be interested in featuring your work in our next exhibition?', time: '1d ago', avatar: 'https://picsum.photos/seed/curator/40/40' },
            { from: 'Admin Gallery', msg: 'Your artwork "Silent Bloom" has been approved and is now live.', time: '2d ago', avatar: 'https://picsum.photos/seed/admin/40/40' },
          ].map((m, i) => (
            <div key={i} className="card p-4 flex items-start gap-4 hover:border-primary-700 transition-colors cursor-pointer">
              <img src={m.avatar} alt={m.from} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white">{m.from}</p>
                  <p className="text-xs text-gray-500">{m.time}</p>
                </div>
                <p className="text-sm text-gray-400 truncate">{m.msg}</p>
              </div>
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
            </div>
          ))}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Reply</h3>
            <textarea placeholder="Type your message…" rows={3} className="input resize-none mb-3" />
            <button className="btn btn-primary btn-sm">Send Message</button>
          </div>
        </div>
      )}

      {/* Upload/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gallery-border">
              <h2 className="font-display text-xl font-bold text-white">
                {editId ? 'Edit Artwork' : 'Upload New Artwork'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gallery-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="input-label">Title *</label>
                  <input required className="input" placeholder="Artwork title" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Category *</label>
                  <select required className="input" value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-gallery-surface">{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Price (USD) *</label>
                  <input required type="number" min="1" className="input" placeholder="e.g. 1500" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Medium</label>
                  <input className="input" placeholder="e.g. Oil on canvas" value={form.medium}
                    onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Year</label>
                  <input type="number" className="input" placeholder={new Date().getFullYear()} value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Image URL (thumbnail)</label>
                  <input className="input" placeholder="https://..." value={form.thumbnail}
                    onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} />
                  {form.thumbnail && (
                    <img src={form.thumbnail} alt="Preview" className="mt-2 h-24 rounded-xl object-cover border border-gallery-border"
                      onError={e => e.target.remove()} />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Description *</label>
                  <textarea required rows={3} className="input resize-none" placeholder="Describe your artwork…"
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Cultural & Historical Context</label>
                  <textarea rows={2} className="input resize-none" placeholder="Cultural or historical background…"
                    value={form.culturalHistory} onChange={e => setForm(f => ({ ...f, culturalHistory: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Tags (comma-separated)</label>
                  <input className="input" placeholder="abstract, blue, nature" value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                  {loading ? 'Saving...' : editId ? 'Update Artwork' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
