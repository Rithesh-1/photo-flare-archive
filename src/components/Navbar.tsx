
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, Menu, X, Image, Grid, Heart, Sparkles, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppConfig } from '@/context/AppConfigContext';
import { useDatabase } from '@/context/DatabaseContext';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { appName, logoUrl } = useAppConfig();
  const { isOffline, mode } = useDatabase();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { icon: <Image size={20} />, label: 'Photos', path: '/' },
    { icon: <Calendar size={20} />, label: 'Organize', path: '/organize' },
    { icon: <Grid size={20} />, label: 'Albums', path: '/albums' },
    { icon: <Heart size={20} />, label: 'Favorites', path: '/favorites' },
    { icon: <Sparkles size={20} />, label: 'Classifier', path: '/classifier' },
    { icon: <Settings size={20} />, label: 'Admin', path: '/admin' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
              ) : (
                <Image size={20} className="text-primary" />
              )}
            </div>
            <h1 className="text-xl font-medium text-photo-800 hidden md:block">{appName}</h1>
            {isOffline && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Offline
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-photo-600 hover:bg-primary/5 hover:text-photo-800"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center rounded-full bg-photo-100 transition-all duration-300 overflow-hidden",
            isSearchOpen ? "w-64" : "w-10"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={toggleSearch}
            >
              <Search size={20} className="text-photo-600" />
            </Button>
            <Input
              type="text"
              placeholder="Search photos..."
              className={cn(
                "border-none bg-transparent focus-visible:ring-0 transition-all duration-300 pl-0",
                isSearchOpen ? "w-full opacity-100" : "w-0 opacity-0"
              )}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute top-full left-0 right-0 glass-effect transition-all duration-300 overflow-hidden border-t",
        isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-photo-600 hover:bg-primary/5 hover:text-photo-800"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
