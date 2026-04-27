import { Outlet, Link } from 'react-router-dom';
import { Palette } from 'lucide-react';

const AuthLayout = () => (
  <div className="min-h-screen flex bg-hero-gradient">
    {/* Left — decorative */}
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      <Link to="/" className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-md">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-2xl text-white">Aura<span className="text-gradient">Gallery</span></span>
      </Link>
      <div className="z-10">
        <blockquote className="font-display text-3xl font-medium text-white leading-relaxed mb-4">
          "Art is not what you see, but what you make others see."
        </blockquote>
        <p className="text-gray-400">— Edgar Degas</p>
      </div>
      <div className="z-10 grid grid-cols-3 gap-3">
        {['cosmos', 'bloom', 'neon'].map((seed, i) => (
          <img key={seed}
            src={`https://picsum.photos/seed/${seed}/200/200`}
            alt={`Gallery ${i + 1}`}
            className="w-full aspect-square object-cover rounded-xl opacity-60 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </div>

    {/* Right — form */}
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">Aura<span className="text-gradient">Gallery</span></span>
        </Link>
        <div className="card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
