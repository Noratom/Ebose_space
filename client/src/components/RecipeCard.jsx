import React from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Heart, Star, Clock, Flame, PlayCircle } from 'lucide-react';

export default function RecipeCard({ recipe }) {
  const { toggleFavorite, isFavorite, setActiveRecipe } = useRecipeContext();
  const favorite = isFavorite(recipe.id);

  return (
    <div className="recipe-card-box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Cover Image Container */}
      <div 
        onClick={() => setActiveRecipe(recipe)}
        style={{
          position: 'relative',
          height: '240px',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: '#EAE5DB'
        }}
      >
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          aria-label="Favorite recipe"
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s ease'
          }}
        >
          <Heart 
            size={18} 
            fill={favorite ? '#DC2626' : 'none'} 
            color={favorite ? '#DC2626' : '#4B5563'} 
            className={favorite ? 'heart-pop-active' : ''}
          />
        </button>

        {/* Featured / Trending Badge */}
        {recipe.trending && (
          <div style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            backgroundColor: 'var(--brand-forest)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: '100px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <Flame size={12} color="var(--brand-gold)" />
            Trending
          </div>
        )}

        {/* YouTube Video Indicator */}
        {recipe.youtubeUrl && (
          <div style={{
            position: 'absolute',
            bottom: '0.85rem',
            left: '0.85rem',
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <PlayCircle size={14} color="#FF0000" />
            <span>Video Guide</span>
          </div>
        )}
      </div>

      {/* Content Metadata */}
      <div 
        onClick={() => setActiveRecipe(recipe)}
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div>
          {/* Rating & Timing Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Star size={16} fill="var(--brand-gold)" color="var(--brand-gold)" />
              <span>{recipe.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({recipe.reviewsCount})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Clock size={14} />
              <span>{recipe.totalTime || recipe.cookTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--brand-forest)',
            lineHeight: 1.3,
            marginBottom: '0.4rem'
          }}>
            {recipe.title}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            {recipe.subtitle || recipe.description}
          </p>
        </div>

        {/* Footer Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.8rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <span className="badge badge-terracotta">{recipe.category}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            By {recipe.author}
          </span>
        </div>
      </div>
    </div>
  );
}
