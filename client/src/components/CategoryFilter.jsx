import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Utensils, Clock, Soup, Cookie, Leaf, SlidersHorizontal } from 'lucide-react';

export default function CategoryFilter() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedDiet, 
    setSelectedDiet,
    setActiveRecipe
  } = useRecipeContext();

  const categories = [
    { name: 'All', icon: Utensils },
    { name: 'Nigerian & West African', icon: Utensils },
    { name: '30-Min Meals', icon: Clock },
    { name: 'Soups & Stews', icon: Soup },
    { name: 'Desserts & Treats', icon: Cookie },
    { name: 'Healthy & Fusion', icon: Leaf }
  ];

  const diets = ['All', 'Dairy-Free', 'Gluten-Free', 'Pescatarian', 'Vegetarian', 'Keto / High-Protein'];

  const handleCategorySelect = (catName) => {
    setActiveRecipe(null);
    setSelectedCategory(catName);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 0.5rem 1.5rem' }}>
      {/* Category Hub Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '100px',
                border: isActive ? '2px solid var(--brand-forest)' : '1px solid var(--border-light)',
                backgroundColor: isActive ? 'var(--brand-forest)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-subheading)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.25s ease',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? '#FFFFFF' : 'var(--brand-terracotta)'} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Dietary Restrictions Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px dashed var(--border-medium)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <SlidersHorizontal size={14} />
          <span>Dietary Preference:</span>
        </div>

        {diets.map((diet) => {
          const isSelected = selectedDiet === diet;
          return (
            <button
              key={diet}
              onClick={() => setSelectedDiet(diet)}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '100px',
                border: isSelected ? '1px solid var(--brand-terracotta)' : '1px solid transparent',
                backgroundColor: isSelected ? 'var(--brand-terracotta-light)' : 'transparent',
                color: isSelected ? 'var(--brand-terracotta)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {diet}
            </button>
          );
        })}
      </div>
    </div>
  );
}
