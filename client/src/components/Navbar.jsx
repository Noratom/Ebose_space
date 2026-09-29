import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Search, Heart, Lock, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    favorites, 
    setActiveRecipe,
    currentPage,
    setCurrentPage,
    isAdminLoggedIn,
    setIsAdminLoginOpen,
    theme,
    toggleTheme
  } = useRecipeContext();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = (page) => {
    setActiveRecipe(null);
    if (page === 'admin' && !isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-medium)' }}>
      {/* Top Announcement Bar */}
      <div className="top-notification-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
        <span>♥ OUR RECIPES, YOUR INBOX. </span>
        <button 
          onClick={() => {
            const footerEl = document.getElementById('newsletter-signup');
            if (footerEl) footerEl.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 800,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.78rem',
            letterSpacing: '0.1em'
          }}
        >
          SIGN UP
        </button>

        {/* Subtle Staff Login Trigger Icon */}
        <button
          onClick={() => handleNavClick('admin')}
          title="Staff Login"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            padding: '0 0.2rem',
            marginLeft: 'auto'
          }}
        >
          <Lock size={12} />
        </button>
      </div>

      <div className="container" style={{ padding: '1.4rem 1.5rem 0.8rem 1.5rem' }}>
        {/* Main Header Bar: Logo & Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.8rem'
        }}>
          {/* Centered Isolated Vector Brand Logo (No background block!) */}
          <div 
            onClick={() => handleNavClick('home')} 
            style={{ cursor: 'pointer', textAlign: 'center', flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <Logo color="var(--brand-espresso)" height={85} />
          </div>

          {/* Desktop Right Navigation Menu */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            <button
              onClick={() => handleNavClick('home')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentPage === 'home' ? 'var(--brand-chestnut)' : 'var(--brand-espresso)',
                cursor: 'pointer'
              }}
            >
              HOME
            </button>

            <button
              onClick={() => handleNavClick('about')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentPage === 'about' ? 'var(--brand-chestnut)' : 'var(--brand-espresso)',
                cursor: 'pointer'
              }}
            >
              ABOUT
            </button>

            <button
              onClick={() => handleNavClick('recipes')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentPage === 'recipes' ? 'var(--brand-chestnut)' : 'var(--brand-espresso)',
                cursor: 'pointer'
              }}
            >
              RECIPES
            </button>

            <button
              onClick={() => handleNavClick('saved')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: currentPage === 'saved' ? 'var(--brand-chestnut)' : 'var(--brand-espresso)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Heart size={14} fill={favorites.length > 0 ? 'var(--brand-chestnut)' : 'none'} color="var(--brand-chestnut)" />
              <span>SAVED ({favorites.length})</span>
            </button>

            {/* Clean Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--brand-espresso)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Search recipes"
            >
              <Search size={18} />
            </button>

            {/* Midnight Espresso Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                cursor: 'pointer',
                color: 'var(--brand-espresso)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease'
              }}
              title={theme === 'dark' ? 'Switch to Warm Cream Alabaster Daytime Mode' : 'Switch to Midnight Espresso Night Mode'}
            >
              {theme === 'dark' ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="var(--brand-chestnut)" />}
            </button>
          </nav>
        </div>

        {/* Sub-tagline */}
        <div className="brand-tagline">
          SIMPLE RECIPES MADE FOR <span>real, actual, everyday life.</span>
        </div>

        {/* Collapsible Search Input Bar */}
        {isSearchOpen && (
          <div style={{
            maxWidth: '560px',
            margin: '0 auto 1.5rem auto',
            position: 'relative',
            animation: 'fadeIn 0.2s ease'
          }}>
            <input
              type="text"
              placeholder="Search Jollof, Suya, Egusi, 30-min dinners..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentPage !== 'recipes') handleNavClick('recipes');
              }}
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1.2rem 0.75rem 2.8rem',
                borderRadius: '100px',
                border: '2px solid var(--brand-chestnut)',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '1.0rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-chestnut)' }} />
          </div>
        )}
      </div>
    </header>
  );
}
