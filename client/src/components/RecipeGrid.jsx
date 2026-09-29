import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import RecipeCard from './RecipeCard';
import { Sparkles, Frown } from 'lucide-react';

export default function RecipeGrid() {
  const { recipes, loading, selectedCategory, selectedDiet, searchQuery, setSearchQuery, setSelectedCategory } = useRecipeContext();

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{
              height: '380px',
              backgroundColor: '#EAE5DB',
              borderRadius: 'var(--radius-lg)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Grid Title & Results Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: '1.8rem',
        borderBottom: '2px solid var(--border-light)',
        paddingBottom: '0.8rem'
      }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--brand-forest)', fontWeight: 700 }}>
          {selectedCategory === 'All' ? 'All Featured Recipes' : selectedCategory}
          {selectedDiet !== 'All' && <span style={{ fontSize: '1rem', color: 'var(--brand-terracotta)', fontWeight: 600, marginLeft: '0.6rem' }}>({selectedDiet})</span>}
        </h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Found
        </span>
      </div>

      {recipes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-medium)'
        }}>
          <Frown size={48} color="var(--brand-terracotta)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-forest)', marginBottom: '0.5rem' }}>
            No recipes found
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We couldn't find any recipes matching "{searchQuery}". Try searching for Jollof, Suya, Egusi, or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="btn btn-primary"
          >
            Clear All Search Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '2.2rem'
        }}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
