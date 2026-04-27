import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Image, BarChart3, ShoppingBag,
  Upload, TrendingUp, MessageSquare, Heart, Clock, Compass,
  BookOpen, Star, LogOut, Palette, ChevronRight, X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const roleLinks = {
  admin: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/artworks', label: 'Approve Artworks', icon: Image },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ],
  artist: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/artist/upload', label: 'Upload Artwork', icon: Upload },
    { path: '/artist/artworks', label: 'My Artworks', icon: Image },
    { path: '/artist/sales', label: 'Sales & Revenue', icon: TrendingUp },
    { path: '/artist/messages', label: 'Messages', icon: MessageSquare },
  ],
  curator: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/curator/exhibitions', label: 'Exhibitions', icon: BookOpen },
    { path: '/curator/collections', label: 'Collections', icon: Palette },
    { path: '/curator/featured', label: 'Featured Works', icon: Star },
  ],
  visitor: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/artworks', label: 'Browse Art', icon: Compass },
    { path: '/cart', label: 'Cart', icon: ShoppingBag },
    { path: '/visitor/orders', label: 'My Orders', icon: Clock },
    { path: '/visitor/wishlist', label: 'Wishlist', icon: Heart },
  ],
};

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = roleLinks[user?.role] || roleLinks.visitor;

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col h-full w-64 bg-gallery-surface border-r border-gallery-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gallery-border">
        <div className="flex items-center gap-3">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary-700" />
            : <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
          }
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <span className="badge badge-primary capitalize">{user?.role}</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink key={link.path} to={link.path} end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gallery-border space-y-1">
        <NavLink to="/artworks" className="sidebar-link" onClick={onClose}>
          <Palette className="w-4 h-4" /> Browse Gallery
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
