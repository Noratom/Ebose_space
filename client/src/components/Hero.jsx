import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Search, Flame, Clock, Sparkles } from 'lucide-react';

export default function Hero() {
  const { setSearchQuery, setSelectedCategory, setActiveRecipe } = useRecipeContext();

  const quickPills = [
    { label: 'Smoky Jollof Rice', query: 'Jollof' },
    { label: 'Suya Prawn Pasta', query: 'Suya' },
    { label: 'Royal Egusi Soup', query: 'Egusi' },
    { label: 'Puff Puff Treats', query: 'Puff' },
    { label: '30-Minute Meals', category: '30-Min Meals' }
  ];

  const handlePillClick = (pill) => {
    setActiveRecipe(null);
    if (pill.category) {
      setSelectedCategory(pill.category);
    } else {
      setSearchQuery(pill.query);
    }
  };

  return (
    <section style={{
      position: 'relative',
      padding: '4rem 1.5rem 3.5rem 1.5rem',
      backgroundColor: 'var(--bg-tertiary)',
      borderBottom: '1px solid var(--border-light)',
      overflow: 'hidden'
    }}>
      {/* Soft background decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 107, 67, 0.08) 0%, rgba(250, 247, 242, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container-narrow" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="badge badge-terracotta" style={{ marginBottom: '1.2rem', padding: '0.4rem 1rem' }}>
          <Flame size={14} />
          <span>Curated Recipes by Ebose</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
          fontWeight: 800,
          color: 'var(--brand-forest)',
          lineHeight: 1.15,
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          Simple, Flavorful & <br />
          <span style={{ fontStyle: 'italic', color: 'var(--brand-terracotta)', fontWeight: 600 }}>Unapologetically Delicious</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '640px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          Explore authentic West African soul food, modern 30-minute fusion meals, and irresistible desserts — complete with interactive serving scalers and YouTube video walkthroughs!
        </p>

        {/* Quick Search Suggestions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          marginTop: '1.5rem'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Trending Now:</span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePillClick(pill)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                padding: '0.4rem 0.9rem',
                borderRadius: '100px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--brand-forest)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-terracotta)';
                e.currentTarget.style.color = 'var(--brand-terracotta)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.color = 'var(--brand-forest)';
              }}
            >
              <Sparkles size={12} color="var(--brand-terracotta)" />
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
