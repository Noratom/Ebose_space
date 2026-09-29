import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { X, Trash2, Heart, ArrowRight, Clock } from 'lucide-react';

export default function FavoritesDrawer() {
  const { 
    favorites, 
    recipes, 
    isFavoritesOpen, 
    setIsFavoritesOpen, 
    toggleFavorite,
    setActiveRecipe
  } = useRecipeContext();

  if (!isFavoritesOpen) return null;

  const savedRecipes = recipes.filter(r => favorites.includes(r.id));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.4rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={22} fill="var(--brand-terracotta)" color="var(--brand-terracotta)" />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-forest)', fontWeight: 700 }}>
              Saved Recipes ({savedRecipes.length})
            </h3>
          </div>
          <button
            onClick={() => setIsFavoritesOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.5rem' }}>
          {savedRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--text-muted)' }}>
              <Heart size={48} strokeWidth={1} color="var(--border-medium)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--brand-forest)' }}>
                Your saved recipe box is empty
              </p>
              <p style={{ fontSize: '0.88rem' }}>
                Click the heart icon on any recipe to bookmark it for quick access!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-tertiary)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 
                      onClick={() => {
                        setActiveRecipe(recipe);
                        setIsFavoritesOpen(false);
                      }}
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--brand-forest)',
                        cursor: 'pointer',
                        lineHeight: 1.3,
                        marginBottom: '0.2rem'
                      }}
                    >
                      {recipe.title}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} /> {recipe.totalTime || recipe.cookTime}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    title="Remove from saved"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '0.4rem'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedRecipes.length > 0 && (
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
            <button
              onClick={() => {
                if (savedRecipes.length > 0) {
                  setActiveRecipe(savedRecipes[0]);
                  setIsFavoritesOpen(false);
                }
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Cook First Saved Recipe</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
