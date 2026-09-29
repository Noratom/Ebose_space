import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Home, UtensilsCrossed, Heart, Info } from 'lucide-react';

export default function MobileBottomNav() {
  const { 
    currentPage, 
    setCurrentPage, 
    setActiveRecipe, 
    favorites, 
    setIsFavoritesOpen 
  } = useRecipeContext();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
    { id: 'favorites', label: `Saved (${favorites.length})`, icon: Heart, action: () => setIsFavoritesOpen(true) },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-medium)',
      zIndex: 900,
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.45rem 0 0.65rem 0',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
    }} className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveRecipe(null);
                setCurrentPage(item.id);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: isActive ? 'var(--brand-plum)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              flex: 1
            }}
          >
            <Icon size={20} fill={item.id === 'favorites' && favorites.length > 0 ? 'var(--brand-plum)' : 'none'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
