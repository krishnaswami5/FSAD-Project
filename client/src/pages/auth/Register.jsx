import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const ROLES = ['visitor', 'artist', 'curator'];

const Register = () => {
  const { register, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'visitor' });
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== confirmPass) { setLocalError('Passwords do not match'); return; }
    if (form.password.length < 6) { setLocalError('Password must be at least 6 characters'); return; }
    await register(form);
  };

  const displayError = localError || error;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Join the Gallery</h1>
        <p className="text-gray-400 text-sm">Create your account and start your art journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {displayError}
          </div>
        )}

        <div>
          <label className="input-label">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input id="reg-name" type="text" placeholder="Your full name" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input pl-10" required />
          </div>
        </div>

        <div>
          <label className="input-label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input id="reg-email" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input pl-10" required />
          </div>
        </div>

        <div>
          <label className="input-label">I want to join as</label>
          <div className="relative">
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select id="reg-role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="input appearance-none capitalize">
              {ROLES.map(r => <option key={r} value={r} className="capitalize bg-gallery-surface">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {form.role === 'artist' && 'Upload and sell your artworks'}
            {form.role === 'curator' && 'Create exhibitions and curate collections'}
            {form.role === 'visitor' && 'Browse, buy, and collect artworks'}
          </p>
        </div>

        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="input pl-10 pr-10" required />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="input-label">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input id="reg-confirm-password" type={showPass ? 'text' : 'password'} placeholder="Confirm password"
              value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
              className="input pl-10" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
