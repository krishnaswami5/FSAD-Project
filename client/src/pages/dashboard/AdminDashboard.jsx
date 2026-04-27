import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, Image, ShoppingBag, DollarSign, Check, X, Shield, Eye, UserCog, Trash2 } from 'lucide-react';
import { fetchUsers, deleteUser, updateUser } from '../../redux/slices/userSlice';
import { updateArtworkStatus } from '../../redux/slices/artworkSlice';
import { formatCurrency, formatDate, getRoleBadge } from '../../utils/formatters';

const CHART_COLORS = ['#c044f0', '#ff7a14', '#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#34d399'];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="stat-card">
    <div className="flex items-center justify-between mb-3">
      <p className="stat-label">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="stat-value">{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </motion.div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, analytics } = useSelector(s => s.users);
  const { pendingArtworks, artworks } = useSelector(s => s.artworks);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => dispatch(updateArtworkStatus({ id, status }));
  const handleDeleteUser = (id) => { if (confirm('Delete this user?')) dispatch(deleteUser(id)); };
  const handleRoleChange = (id, role) => dispatch(updateUser({ id, data: { role } }));
  const handleToggleActive = (id, isActive) => dispatch(updateUser({ id, data: { isActive: !isActive } }));

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'artworks', label: 'Artworks' },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">Admin Panel</p>
        <h1 className="font-display text-3xl font-bold text-white">Platform Overview</h1>
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

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} sub={`${users.length} in list`} color="bg-primary-700" />
            <StatCard icon={Image} label="Artworks" value={analytics.totalArtworks} sub={`${pendingArtworks.length} pending`} color="bg-blue-700" />
            <StatCard icon={ShoppingBag} label="Orders" value={analytics.totalOrders} sub="Completed" color="bg-accent-700" />
            <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(analytics.totalRevenue)} sub="All time" color="bg-green-700" />
          </div>

          {/* Monthly revenue chart */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analytics.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} />
                <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }}
                  formatter={v => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#c044f0" strokeWidth={2.5} dot={{ fill: '#c044f0', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Two charts side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Users by Role</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={analytics.usersByRole} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80}
                    label={({ _id, count }) => `${_id}: ${count}`}>
                    {analytics.usersByRole.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Artworks by Category</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.artworksByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {analytics.artworksByCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-white">Manage Users ({users.length})</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {u.avatar
                          ? <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                          : <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-xs font-bold text-white">{u.name?.[0]?.toUpperCase()}</div>
                        }
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                        className="bg-gallery-surface border border-gallery-border rounded-lg px-2 py-1 text-xs text-white">
                        {['admin', 'artist', 'curator', 'visitor'].map(r => (
                          <option key={r} value={r} className="capitalize">{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">{u.createdAt ? formatDate(u.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}>
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDeleteUser(u._id)} className="btn btn-danger btn-sm">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Artworks approval */}
      {activeTab === 'artworks' && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-white">Pending Approvals ({pendingArtworks.length})</h2>
          {pendingArtworks.length === 0 ? (
            <div className="card p-8 text-center">
              <Check className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-white font-medium">All clear! No pending artworks.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingArtworks.map(art => (
                <div key={art._id} className="card overflow-hidden">
                  <img src={art.thumbnail} alt={art.title}
                    className="w-full h-40 object-cover"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${art._id}/400/300`; }} />
                  <div className="p-4">
                    <p className="font-medium text-white mb-1">{art.title}</p>
                    <p className="text-xs text-gray-500 mb-1 capitalize">{art.category}</p>
                    {art.artist && <p className="text-xs text-gray-500">By {art.artist?.name}</p>}
                    <p className="text-primary-400 font-semibold text-sm mb-3">{formatCurrency(art.price)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusUpdate(art._id, 'approved')}
                        className="flex-1 btn btn-sm bg-green-700 hover:bg-green-600 text-white">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(art._id, 'rejected')}
                        className="flex-1 btn btn-danger btn-sm">
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All artworks table */}
          <h2 className="text-xl font-semibold text-white mt-8">All Artworks ({artworks.length})</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Artwork</th><th>Category</th><th>Price</th><th>Status</th><th>Views</th></tr></thead>
              <tbody>
                {artworks.slice(0, 10).map(art => (
                  <tr key={art._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={art.thumbnail} alt={art.title} className="w-10 h-10 rounded-lg object-cover"
                          onError={e => { e.target.src = `https://picsum.photos/seed/${art._id}/80/80`; }} />
                        <p className="text-sm font-medium text-white line-clamp-1">{art.title}</p>
                      </div>
                    </td>
                    <td><span className="text-xs text-gray-400 capitalize">{art.category}</span></td>
                    <td className="text-primary-400 text-sm font-medium">{formatCurrency(art.price)}</td>
                    <td><span className={`badge ${art.status === 'approved' ? 'badge-success' : art.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{art.status}</span></td>
                    <td className="text-xs text-gray-400">{art.views || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Platform Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} color="bg-primary-700" />
            <StatCard icon={Image} label="Artworks Listed" value={analytics.totalArtworks} color="bg-blue-700" />
            <StatCard icon={ShoppingBag} label="Orders Completed" value={analytics.totalOrders} color="bg-accent-700" />
            <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(analytics.totalRevenue)} color="bg-green-700" />
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Revenue Trend (12 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'K'} />
                <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3e', borderRadius: 12, color: '#fff' }}
                  formatter={v => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#c044f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
