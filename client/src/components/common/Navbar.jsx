import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Bell, Menu, X, Moon, Sun, User, LogOut,
  LayoutDashboard, Palette, Compass, Settings, ChevronDown
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { toggleNotifications, markAllRead, unreadCount } from '../../redux/slices/notificationSlice';
import { formatRelative } from '../../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { count: cartCount, toggle: toggleCart } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifCount = useSelector(unreadCount);
  const notifications = useSelector(s => s.notifications.items);
  const notifOpen = useSelector(s => s.notifications.isOpen);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [darkMode]);

  useEffect(() => {
    const handle = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        if (notifOpen) dispatch(toggleNotifications());
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [notifOpen]);

  const handleLogout = async () => { await logout(); navigate('/'); setProfileOpen(false); };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/artworks', label: 'Artworks' },
    { path: '/virtual-tour', label: 'Virtual Tour' },
  ];

  const typeIcon = { info: '💬', success: '✅', warning: '⚠️', error: '❌' };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="container-max flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Aura<span className="text-gradient">Gallery</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink key={link.path} to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-primary-400 bg-primary-900/30' : 'text-gray-300 hover:text-white hover:bg-white/5'}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button onClick={() => setDarkMode(d => !d)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated && (
            <>
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => dispatch(toggleNotifications())}
                  className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Bell className="w-4 h-4" />
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 card border-gallery-border shadow-card-hover z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gallery-border">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        <button onClick={() => dispatch(markAllRead())} className="text-xs text-primary-400 hover:text-primary-300">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-500 text-sm py-6">No notifications</p>
                        ) : notifications.map(n => (
                          <div key={n.id} className={`flex gap-3 p-3 border-b border-gallery-border/50 hover:bg-gallery-surface transition-colors ${!n.read ? 'bg-primary-900/10' : ''}`}>
                            <span className="text-base flex-shrink-0">{typeIcon[n.type]}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-relaxed ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.message}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{formatRelative(n.createdAt)}</p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button onClick={toggleCart} className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-all"
                >
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                    : <div className="w-7 h-7 rounded-lg bg-primary-700 flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                  }
                  <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 card border-gallery-border shadow-card-hover z-50 overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-gallery-border">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className="badge badge-primary mt-1 capitalize">{user?.role}</span>
                      </div>
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gallery-surface transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gallery-surface transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-gallery-border"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <NavLink key={link.path} to={link.path} end={link.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-primary-400 bg-primary-900/30' : 'text-gray-300 hover:text-white hover:bg-white/5'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-300">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full mt-2">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
