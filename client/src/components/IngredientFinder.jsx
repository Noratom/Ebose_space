import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Refrigerator, Sparkles, Check, RefreshCw } from 'lucide-react';

export default function IngredientFinder() {
  const { recipes, setSearchQuery, setActiveRecipe, setCurrentPage } = useRecipeContext();
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const commonIngredients = [
    'Rice', 'Prawns', 'Goat Meat', 'Plantain', 'Suya Spice', 
    'Egusi', 'Spinach', 'Beef', 'Nutmeg', 'Parmesan', 'Garlic'
  ];

  const toggleIngredient = (ing) => {
    setSelectedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleSearchByIngredients = () => {
    if (selectedIngredients.length === 0) return;
    setSearchQuery(selectedIngredients.join(' '));
    setActiveRecipe(null);
    setCurrentPage('recipes');
  };

  const clearSelection = () => {
    setSelectedIngredients([]);
    setSearchQuery('');
  };

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-xl)',
      border: '2px solid var(--brand-terracotta-light)',
      padding: '2.2rem 2rem',
      margin: '2rem auto',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }} className="container">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-terracotta-light)',
            color: 'var(--brand-terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Refrigerator size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
              What’s in Your Kitchen / Fridge?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Tap ingredients you have on hand, and we’ll match delicious Ebose recipes!
            </p>
          </div>
        </div>

        {selectedIngredients.length > 0 && (
          <button
            onClick={clearSelection}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={12} /> Reset Selection
          </button>
        )}
      </div>

      {/* Ingredient Pills List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.4rem' }}>
        {commonIngredients.map((ing) => {
          const isSelected = selectedIngredients.includes(ing);
          return (
            <button
              key={ing}
              onClick={() => toggleIngredient(ing)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '100px',
                border: isSelected ? '1.5px solid var(--brand-terracotta)' : '1px solid var(--border-medium)',
                backgroundColor: isSelected ? 'var(--brand-terracotta)' : 'var(--bg-primary)',
                color: isSelected ? '#FFFFFF' : 'var(--brand-forest)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {isSelected && <Check size={14} />}
              <span>{ing}</span>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      {selectedIngredients.length > 0 && (
        <button
          onClick={handleSearchByIngredients}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
        >
          <Sparkles size={16} />
          <span>Find Recipes with {selectedIngredients.join(', ')}</span>
        </button>
      )}
    </section>
  );
}
