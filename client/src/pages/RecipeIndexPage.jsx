import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Search, Star, Trophy } from 'lucide-react';

export default function RecipeIndexPage() {
  const { 
    recipes, 
    searchQuery, 
    setSearchQuery, 
    setActiveRecipe, 
    setCurrentPage, 
    setSelectedCategory,
    setSelectedDiet
  } = useRecipeContext();

  const [selectedFilterTag, setSelectedFilterTag] = useState(null);

  const handleTaxonomyClick = (type, value) => {
    if (type === 'category') {
      setSelectedCategory(value);
    } else if (type === 'diet') {
      setSelectedDiet(value);
    } else {
      setSearchQuery(value);
    }
    setSelectedFilterTag(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter recipes if search query or tag is active
  const filteredRecipes = recipes.filter(r => {
    if (!searchQuery.trim() && !selectedFilterTag) return true;
    const query = (searchQuery || selectedFilterTag).toLowerCase();
    return (
      r.title.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      (r.diet && r.diet.toLowerCase().includes(query)) ||
      r.ingredients.some(i => i.item.toLowerCase().includes(query))
    );
  });

  return (
    <div className="animate-fade-in-up" style={{ backgroundColor: '#FFFFFF' }}>
      {/* ========================================================================= */}
      {/* 1. PLUM HEADER BANNER WITH SEARCH (Screenshot 1)                        */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: 'var(--brand-plum)',
        color: '#FFFFFF',
        padding: '3rem 1.5rem 4rem 1.5rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container-narrow">
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#E2D5E0',
            textTransform: 'uppercase',
            marginBottom: '0.8rem'
          }}>
            EBOSE’S KITCHEN KRONIKLES › RECIPES
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.4rem',
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: '1.2rem'
          }}>
            Recipes
          </h1>

          <p style={{
            color: '#EADCE8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 2rem auto'
          }}>
            We've organized these recipes every way we could think of so you don't have to! Dietary restrictions, weeknight dinners, meal prep recipes, some of our most tried-and-true... no matter how you browse, we're sure you'll find just what you were looking for.
          </p>
        </div>

        {/* Overlapping Prominent Search Bar (Screenshot 1) */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          position: 'absolute',
          bottom: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by keyword"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedFilterTag(null);
              }}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem 0.9rem 3.2rem',
                borderRadius: '2px',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-md)',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        {/* Active Filter Indicator Tag */}
        {selectedFilterTag && (
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            padding: '0.8rem',
            backgroundColor: 'var(--brand-terracotta-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--brand-terracotta)',
            fontWeight: 700
          }}>
            Showing recipes tagged with "{selectedFilterTag}" —{' '}
            <button
              onClick={() => {
                setSelectedFilterTag(null);
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDiet('All');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--brand-plum)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 800 }}
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MOST LOVED RECIPES SECTION (Screenshot 1 & 2)                          */}
        {/* ========================================================================= */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-gold)', marginBottom: '0.4rem' }}>
              <Trophy size={20} />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-plum)' }}>
                MOST LOVED RECIPES
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
              Out of all the many recipes on Ebose’s Kitchen Kronikles, these are our shining stars - the recipes we come back to again and again (and again).
            </p>
          </div>

          {/* 3-Column Compact Grid from Screenshots */}
          <div className="stagger-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.8rem',
            marginBottom: '2.5rem'
          }}>
            {filteredRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setActiveRecipe(r);
                  setCurrentPage('detail');
                }}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={r.imageUrl}
                  alt={r.title}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--brand-charcoal)',
                    lineHeight: 1.3,
                    marginBottom: '0.3rem'
                  }}>
                    {r.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.2rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="var(--brand-gold)" color="var(--brand-gold)" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {r.reviewsCount || 128} REVIEWS / {r.rating} AVERAGE
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              style={{
                backgroundColor: 'var(--brand-plum)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.8rem 2.2rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              + VIEW ALL RECIPES
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TAXONOMY BULLETED GRIDS (Screenshots 2, 3, 4 & 5)                      */}
        {/* ========================================================================= */}
        
        {/* TAXONOMY SECTION HELPER COMPONENT */}
        {[
          {
            title: 'POPULAR CATEGORIES',
            items: ['Quick and Easy', 'Instant Pot', 'Meal Prep', 'Vegan', 'Vegetarian', 'Air Fryer', 'Pasta', 'Tacos', 'Bowls', 'Soups', 'Salads', 'Dinner', 'Kid-Friendly', 'Most Popular', 'All Recipes'],
            type: 'category'
          },
          {
            title: 'RECIPES BY MEAL TYPE',
            items: ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Snacks', 'Desserts', 'Drinks'],
            type: 'category'
          },
          {
            title: 'RECIPES BY COURSE',
            items: ['Appetizer', 'Soups', 'Salads', 'Sauces', 'Sides', 'Desserts', 'Snacks', 'Baking', 'Sandwiches', 'Main Dishes'],
            type: 'category'
          },
          {
            title: 'RECIPES BY DIET',
            items: ['Dairy-Free', 'Gluten-Free', 'Kid-Friendly', 'Healthy', 'Sugar-Free', 'Vegan', 'Vegetarian'],
            type: 'diet'
          },
          {
            title: 'RECIPES BY SEASON',
            items: ['Spring', 'Summer', 'Fall', 'Winter'],
            type: 'tag'
          },
          {
            title: 'RECIPES BY METHOD',
            items: ['Air Fryer', 'Casserole', 'Instant Pot', 'Slow Cooker', 'Sheet Pan', 'Stovetop'],
            type: 'tag'
          },
          {
            title: 'RECIPES BY INGREDIENT',
            items: ['5 Ingredients', 'Avocado', 'Bacon', 'Bell Pepper', 'Berry', 'Broccoli', 'Carrot', 'Cauliflower', 'Chocolate', 'Eggs', 'Fish and Seafood', 'Jalapeño', 'Kale', 'Legume', 'Lemon', 'Lime', 'Meat and Chicken', 'Mushroom', 'Pasta', 'Peanut Butter', 'Pumpkin', 'Quinoa', 'Rice', 'Salmon', 'Spinach', 'Sweet Potato', 'Tofu', 'Tomato', 'Zucchini'],
            type: 'ingredient'
          },
          {
            title: 'RECIPES BY SERIES',
            items: ['Feeding a Broken Heart', 'Holiday Series', 'Plant-Powered January', 'SOS Series', 'The Soup Series', 'Sugar Free January'],
            type: 'tag'
          }
        ].map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '3.5rem' }}>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--brand-charcoal)',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--border-medium)',
              paddingBottom: '0.6rem',
              marginBottom: '1.2rem'
            }}>
              {section.title}
            </h3>

            {/* 3-Column Bulleted List exact matching screenshots */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.8rem 2rem'
            }}>
              {section.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  onClick={() => handleTaxonomyClick(section.type, item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--brand-plum)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--brand-plum)', display: 'inline-block' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
