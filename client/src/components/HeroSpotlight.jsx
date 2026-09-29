import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Flame, Star, Clock, ArrowRight, PlayCircle, Heart } from 'lucide-react';

export default function HeroSpotlight() {
  const { recipes, setActiveRecipe, setCurrentPage, toggleFavorite, isFavorite } = useRecipeContext();
  const spotlightRecipe = recipes.find(r => r.featured) || recipes[0];

  if (!spotlightRecipe) return null;
  const favorite = isFavorite(spotlightRecipe.id);

  return (
    <section className="container" style={{ padding: '2rem 1.5rem 1rem 1.5rem' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center'
      }}>
        {/* Left Editorial Content */}
        <div style={{ padding: '2.5rem 2.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span className="badge badge-gold" style={{ padding: '0.35rem 0.8rem' }}>
              <Flame size={14} color="#B87808" /> Recipe of the Week
            </span>
            <span className="badge badge-forest">{spotlightRecipe.category}</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            color: 'var(--brand-forest)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '0.8rem'
          }}>
            {spotlightRecipe.title}
          </h2>

          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            {spotlightRecipe.description || spotlightRecipe.subtitle}
          </p>

          {/* Timing & Rating Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1.8rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <Star size={18} fill="var(--brand-gold)" color="var(--brand-gold)" />
              <span>{spotlightRecipe.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({spotlightRecipe.reviewsCount} reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Clock size={16} />
              <span>{spotlightRecipe.totalTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={() => {
                setActiveRecipe(spotlightRecipe);
                setCurrentPage('detail');
              }}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.6rem' }}
            >
              <span>Get Full Recipe</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => toggleFavorite(spotlightRecipe.id)}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.2rem' }}
            >
              <Heart size={16} fill={favorite ? 'var(--brand-terracotta)' : 'none'} color="var(--brand-terracotta)" />
              <span>{favorite ? 'Saved' : 'Save Recipe'}</span>
            </button>
          </div>
        </div>

        {/* Right Photo */}
        <div style={{
          height: '100%',
          minHeight: '340px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#EAE5DB'
        }}>
          <img
            src={spotlightRecipe.imageUrl}
            alt={spotlightRecipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {spotlightRecipe.youtubeUrl && (
            <div style={{
              position: 'absolute',
              bottom: '1.2rem',
              right: '1.2rem',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#FFFFFF',
              borderRadius: '100px',
              padding: '0.4rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backdropFilter: 'blur(4px)'
            }}>
              <PlayCircle size={16} color="#FF0000" />
              <span>Watch Video Tutorial</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
