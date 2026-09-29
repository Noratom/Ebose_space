import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import VideoPlayer from './VideoPlayer';
import CookingTimerBar from './CookingTimerBar';
import { 
  ArrowLeft, Heart, Printer, Share2, Star, Clock, Users, Flame, 
  CheckSquare, Square, PlayCircle, Sparkles, ChefHat, Scale, MessageSquare, Camera
} from 'lucide-react';

export default function RecipeCardDetail() {
  const { 
    activeRecipe, 
    setActiveRecipe, 
    toggleFavorite, 
    isFavorite,
    addReview,
    showToast
  } = useRecipeContext();

  if (!activeRecipe) return null;

  // Recipe scaling state (1x, 2x, 3x or custom servings)
  const [servingsCount, setServingsCount] = useState(activeRecipe.servings || 4);
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  
  // Interactive cooking checkboxes
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  // Active Timer State
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timerLabel, setTimerLabel] = useState('Cooking Timer');
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('');

  const favorite = isFavorite(activeRecipe.id);
  const baseServings = activeRecipe.servings || 4;
  const scaleMultiplier = servingsCount / baseServings;

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStepCheck = (idx) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 📋');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert('Please fill out your name and review comment');
      return;
    }
    addReview(activeRecipe.id, {
      userName: reviewName.trim(),
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      photoUrl: reviewPhotoUrl.trim()
    });
    setReviewName('');
    setReviewComment('');
    setReviewPhotoUrl('');
  };

  // Helper to format scaled ingredient quantity
  const formatScaledAmount = (ing) => {
    if (unitSystem === 'metric' && ing.metricAmount) {
      const scaledMetric = (ing.metricAmount * scaleMultiplier);
      const rounded = Math.round(scaledMetric * 10) / 10;
      return `${rounded} ${ing.metricUnit || ''}`;
    }

    if (ing.amount) {
      const scaled = ing.amount * scaleMultiplier;
      // Convert decimal fractions to readable text if possible
      let display = Math.round(scaled * 100) / 100;
      if (display === 0.25) display = '1/4';
      else if (display === 0.33) display = '1/3';
      else if (display === 0.5) display = '1/2';
      else if (display === 0.75) display = '3/4';
      else if (display === 1.5) display = '1 1/2';
      else if (display === 2.5) display = '2 1/2';
      return `${display} ${ing.unit || ''}`;
    }

    return ing.unit || '';
  };

  return (
    <div className="recipe-detail-container container-narrow" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Back Button */}
      <button
        onClick={() => setActiveRecipe(null)}
        className="no-print"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          padding: '0.5rem 1rem',
          borderRadius: '100px',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--brand-forest)',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Recipes</span>
      </button>

      {/* Main Recipe Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <span className="badge badge-terracotta">{activeRecipe.category}</span>
          {activeRecipe.diet && <span className="badge badge-forest">{activeRecipe.diet}</span>}
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: 'var(--brand-forest)',
          lineHeight: 1.18,
          marginBottom: '0.8rem'
        }}>
          {activeRecipe.title}
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '1.2rem'
        }}>
          {activeRecipe.description || activeRecipe.subtitle}
        </p>

        {/* Author & Ratings metadata strip */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1rem 0',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-terracotta)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              EK
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Recipe By</span>
              <strong style={{ color: 'var(--brand-forest)' }}>{activeRecipe.author || 'Ebose'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={18} fill="var(--brand-gold)" color="var(--brand-gold)" />
            <strong style={{ fontSize: '1rem', color: 'var(--brand-forest)' }}>{activeRecipe.rating}</strong>
            <span style={{ color: 'var(--text-muted)' }}>({activeRecipe.reviewsCount} Reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
            <Clock size={16} />
            <span>Total Time: <strong>{activeRecipe.totalTime}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        maxHeight: '480px'
      }}>
        <img
          src={activeRecipe.imageUrl}
          alt={activeRecipe.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Quick Action Controls (Print, Jump to Recipe, Favorite, Share) */}
      <div className="no-print" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem 1.4rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <a
          href="#interactive-recipe-card"
          className="btn btn-primary"
          style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem' }}
        >
          <Sparkles size={16} />
          <span>Jump to Recipe Card</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => toggleFavorite(activeRecipe.id)}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Heart size={16} fill={favorite ? 'var(--brand-terracotta)' : 'none'} color="var(--brand-terracotta)" />
            <span>{favorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Printer size={16} />
            <span>Print</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Multi-Platform Video Tutorial Player (YouTube, Instagram Reels, TikTok) */}
      <VideoPlayer
        youtubeUrl={activeRecipe.youtubeUrl}
        instagramUrl={activeRecipe.instagramUrl}
        tiktokUrl={activeRecipe.tiktokUrl}
        title={activeRecipe.title}
      />

      {/* ========================================================================= */}
      {/* PINCH OF YUM SIGNATURE INTERACTIVE RECIPE CARD BOX                       */}
      {/* ========================================================================= */}
      <section 
        id="interactive-recipe-card" 
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--brand-forest)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.8rem',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '3rem'
        }}
      >
        {/* Card Header & Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--bg-tertiary)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-subheading)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--brand-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Ebose’s Kitchen Kronikles Card
            </span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
              {activeRecipe.title}
            </h2>
          </div>
          <ChefHat size={32} color="var(--brand-forest)" />
        </div>

        {/* Quick Recipe Specs grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.8rem',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Prep Time</span>
            <strong style={{ color: 'var(--brand-forest)', fontSize: '1rem' }}>{activeRecipe.prepTime}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Cook Time</span>
            <strong style={{ color: 'var(--brand-forest)', fontSize: '1rem' }}>{activeRecipe.cookTime}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Time</span>
            <strong style={{ color: 'var(--brand-forest)', fontSize: '1rem' }}>{activeRecipe.totalTime}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Difficulty</span>
            <strong style={{ color: 'var(--brand-forest)', fontSize: '1rem' }}>{activeRecipe.difficulty}</strong>
          </div>
        </div>

        {/* Serving Scaler & Unit System Controls (Signature Pinch of Yum Feature!) */}
        <div className="no-print" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--brand-terracotta-light)',
          padding: '0.9rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.8rem'
        }}>
          {/* Serving Scaler Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={18} color="var(--brand-terracotta)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand-forest)' }}>Servings:</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#FFFFFF', borderRadius: '100px', padding: '0.2rem', border: '1px solid var(--border-medium)' }}>
              <button
                onClick={() => setServingsCount(Math.max(1, servingsCount - 1))}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--brand-forest)'
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 800, padding: '0 0.6rem', fontSize: '0.95rem', color: 'var(--brand-terracotta)' }}>
                {servingsCount}
              </span>
              <button
                onClick={() => setServingsCount(servingsCount + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--brand-forest)'
                }}
              >
                +
              </button>
            </div>

            {/* Quick Multiplier Pills */}
            <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.4rem' }}>
              {[1, 2, 3].map(multiplier => (
                <button
                  key={multiplier}
                  onClick={() => setServingsCount(baseServings * multiplier)}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '100px',
                    border: '1px solid var(--brand-terracotta)',
                    backgroundColor: servingsCount === baseServings * multiplier ? 'var(--brand-terracotta)' : '#FFFFFF',
                    color: servingsCount === baseServings * multiplier ? '#FFFFFF' : 'var(--brand-terracotta)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {multiplier}x
                </button>
              ))}
            </div>
          </div>

          {/* Imperial vs Metric Unit Toggler */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={16} color="var(--brand-forest)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-forest)' }}>Units:</span>
            <div style={{
              display: 'inline-flex',
              backgroundColor: '#FFFFFF',
              borderRadius: '100px',
              padding: '0.2rem',
              border: '1px solid var(--border-medium)'
            }}>
              <button
                onClick={() => setUnitSystem('imperial')}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: unitSystem === 'imperial' ? 'var(--brand-forest)' : 'transparent',
                  color: unitSystem === 'imperial' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                US Customary
              </button>
              <button
                onClick={() => setUnitSystem('metric')}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: unitSystem === 'metric' ? 'var(--brand-forest)' : 'transparent',
                  color: unitSystem === 'metric' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Metric (g/ml)
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{
            fontSize: '1.35rem',
            color: 'var(--brand-forest)',
            fontWeight: 700,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>Ingredients</span>
            {scaleMultiplier !== 1 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-terracotta)', fontWeight: 600 }}>
                (Scaled for {servingsCount} servings)
              </span>
            )}
          </h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {activeRecipe.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <li
                  key={idx}
                  onClick={() => toggleIngredientCheck(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    opacity: isChecked ? 0.5 : 1,
                    textDecoration: isChecked ? 'line-through' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ marginTop: '0.15rem', color: isChecked ? 'var(--brand-terracotta)' : 'var(--border-medium)' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <div style={{ fontSize: '0.98rem', lineHeight: 1.4 }}>
                    <strong style={{ color: 'var(--brand-terracotta)', marginRight: '0.35rem' }}>
                      {formatScaledAmount(ing)}
                    </strong>
                    <span style={{ color: 'var(--text-primary)' }}>{ing.item}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{
            fontSize: '1.35rem',
            color: 'var(--brand-forest)',
            fontWeight: 700,
            marginBottom: '1.2rem'
          }}>
            Step-by-Step Instructions
          </h3>

          <ol style={{ listStyle: 'none', padding: 0 }}>
            {activeRecipe.instructions.map((step, idx) => {
              const isDone = !!checkedSteps[idx];
              const timeMatch = step.match(/(\d+)\s*(mins|minutes|min)/i);
              const detectedMins = timeMatch ? parseInt(timeMatch[1]) : null;

              return (
                <li
                  key={idx}
                  onClick={() => toggleStepCheck(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    marginBottom: '1.2rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isDone ? 'var(--bg-tertiary)' : '#FAF8F4',
                    border: isDone ? '1px solid var(--border-medium)' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? 'var(--brand-terracotta)' : 'var(--brand-forest)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.98rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      margin: 0,
                      textDecoration: isDone ? 'line-through' : 'none',
                      opacity: isDone ? 0.6 : 1
                    }}>
                      {step}
                    </p>

                    {detectedMins && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimerMinutes(detectedMins);
                          setTimerLabel(`Step ${idx + 1} (${detectedMins} Min Timer)`);
                          setIsTimerOpen(true);
                          showToast(`Started ${detectedMins} Min Timer for Step ${idx + 1} ⏱️`);
                        }}
                        style={{
                          marginTop: '0.6rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.8rem',
                          backgroundColor: 'var(--brand-chestnut)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '100px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <Clock size={13} />
                        <span>Start {detectedMins} Min Timer ⏱️</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Ebose's Secret Tips Box */}
        {activeRecipe.tips && (
          <div style={{
            backgroundColor: 'var(--brand-terracotta-light)',
            borderLeft: '4px solid var(--brand-terracotta)',
            padding: '1.2rem 1.4rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--brand-terracotta)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.4rem'
            }}>
              <Sparkles size={16} />
              Ebose’s Kitchen Tip
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              {activeRecipe.tips}
            </p>
          </div>
        )}

        {/* Nutrition Information */}
        {activeRecipe.nutrition && (
          <div style={{
            padding: '1rem 1.4rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 700 }}>
              Nutrition Facts (Per Serving)
            </h4>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--brand-forest)' }}>
              <div>Calories: <strong>{activeRecipe.nutrition.calories} kcal</strong></div>
              <div>Protein: <strong>{activeRecipe.nutrition.protein}</strong></div>
              <div>Carbs: <strong>{activeRecipe.nutrition.carbs}</strong></div>
              <div>Fat: <strong>{activeRecipe.nutrition.fat}</strong></div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* REVIEWS & COMMUNITY SECTION                                              */}
      {/* ========================================================================= */}
      <section className="no-print" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 1.8rem',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <MessageSquare size={22} color="var(--brand-terracotta)" />
          <h3 style={{ fontSize: '1.5rem', color: 'var(--brand-forest)', fontWeight: 700 }}>
            Community Reviews & Ratings ({activeRecipe.reviewsCount})
          </h3>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.4rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          border: '1px solid var(--border-light)'
        }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-forest)', marginBottom: '1rem', fontWeight: 700 }}>
            Tried this recipe? Leave a rating!
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Name</label>
              <input
                type="text"
                placeholder="e.g. Chioma"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Rating</label>
              <div style={{ display: 'flex', gap: '0.3rem', paddingTop: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Star
                      size={24}
                      fill={star <= reviewRating ? 'var(--brand-gold)' : 'none'}
                      color={star <= reviewRating ? 'var(--brand-gold)' : 'var(--border-medium)'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Comment / Notes</label>
            <textarea
              placeholder="Tell Ebose how it turned out! Did you make any fun tweaks?"
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.68rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
              }}
              required
            />
          </div>

          {/* Reader Photo Upload Input ("I Made This!") */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-chestnut)' }}>
              <Camera size={15} />
              <span>Add Photo of Your Dish ("I Made This! 📸") — Optional</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... (Image URL of your cooked dish)"
              value={reviewPhotoUrl}
              onChange={(e) => setReviewPhotoUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
            Submit Rating
          </button>
        </form>

        {/* Existing Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {activeRecipe.reviews && activeRecipe.reviews.length > 0 ? (
            activeRecipe.reviews.map((rev) => (
              <div key={rev.id} style={{
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FAF8F4',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <strong style={{ color: 'var(--brand-forest)', fontSize: '0.95rem' }}>{rev.userName}</strong>
                    {rev.photoUrl && (
                      <span style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '100px',
                        border: '1px solid #FDE68A'
                      }}>
                        I Made This! 📸
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? 'var(--brand-gold)' : 'none'}
                        color={i < rev.rating ? 'var(--brand-gold)' : 'var(--border-medium)'}
                      />
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>{rev.date}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>

                {/* Reader Photo Preview */}
                {rev.photoUrl && (
                  <div style={{ marginTop: '0.4rem' }}>
                    <img
                      src={rev.photoUrl}
                      alt="Cooked dish by reader"
                      style={{
                        maxWidth: '220px',
                        maxHeight: '160px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        border: '2px solid var(--brand-chestnut)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Be the first to review this recipe!</p>
          )}
        </div>
      </section>

      {/* Floating Interactive Cooking Timer */}
      <CookingTimerBar
        initialMinutes={timerMinutes}
        label={timerLabel}
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />
    </div>
  );
}
