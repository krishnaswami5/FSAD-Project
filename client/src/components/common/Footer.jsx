import { Link } from 'react-router-dom';
import { Palette, Mail, Camera, MessageCircle, Code2, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gallery-surface border-t border-gallery-border mt-auto">
    <div className="container-max px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Aura<span className="text-gradient">Gallery</span></span>
          </Link>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            A premier platform connecting artists, collectors, and curators worldwide. Discover, collect, and celebrate extraordinary art.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { icon: Camera, href: '#', label: 'Instagram' },
              { icon: MessageCircle, href: '#', label: 'Twitter' },
              { icon: Mail, href: '#', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href}
                className="p-2 rounded-lg bg-gallery-card border border-gallery-border text-gray-400 hover:text-white hover:border-primary-600 transition-all"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
          <ul className="space-y-2">
            {['Artworks', 'Virtual Tour', 'Artists', 'Exhibitions', 'Pricing'].map(item => (
              <li key={item}>
                <Link to={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2">
            {['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map(item => (
              <li key={item}>
                <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gallery-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} AuraGallery. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500" /> for art lovers worldwide
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
