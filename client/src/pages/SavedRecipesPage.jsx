import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Heart, ShoppingBag, Check, Printer, ArrowRight } from 'lucide-react';

export default function SavedRecipesPage() {
  const { favorites, recipes, setCurrentPage, setActiveRecipe } = useRecipeContext();
  const savedRecipes = recipes.filter(r => favorites.includes(r.id));

  const [checkedGroceryItems, setCheckedGroceryItems] = useState({});

  const toggleGroceryCheck = (idx) => {
    setCheckedGroceryItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Consolidate all ingredients from saved recipes into a single grocery list
  const allIngredients = savedRecipes.flatMap(r => 
    r.ingredients.map(ing => `${ing.amount || ''} ${ing.unit || ''} ${ing.item}`.trim())
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-terracotta" style={{ marginBottom: '0.6rem' }}>
          <Heart size={14} fill="var(--brand-terracotta)" /> Your Personal Recipe Box
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
          Saved Favorites & Meal Planner
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
          You have {savedRecipes.length} saved recipes. Generate an automated grocery list for your weekly store trip below!
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-medium)' }}>
          <Heart size={48} color="var(--brand-terracotta)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-forest)', marginBottom: '0.5rem' }}>Your recipe box is empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse Ebose’s recipe catalog and click the heart icon to save recipes here.</p>
          <button onClick={() => setCurrentPage('recipes')} className="btn btn-primary">
            Explore All Recipes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Saved Cards Grid */}
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-forest)', fontWeight: 700, marginBottom: '1.2rem' }}>
              Saved Dishes ({savedRecipes.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {savedRecipes.map(r => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </div>

          {/* Grocery Shopping List Generator */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.8rem',
            border: '2px solid var(--brand-forest)',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--bg-tertiary)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBag size={22} color="var(--brand-terracotta)" />
                <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
                  Automated Grocery List
                </h3>
              </div>
              <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-forest)' }}>
                <Printer size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Combined ingredients from your {savedRecipes.length} saved recipes:
            </p>

            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '380px', overflowY: 'auto' }}>
              {allIngredients.map((item, idx) => {
                const isChecked = !!checkedGroceryItems[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleGroceryCheck(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--border-light)',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      opacity: isChecked ? 0.5 : 1,
                      textDecoration: isChecked ? 'line-through' : 'none'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isChecked ? '1px solid var(--brand-terracotta)' : '1px solid var(--border-medium)',
                      backgroundColor: isChecked ? 'var(--brand-terracotta)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      {isChecked && <Check size={12} />}
                    </div>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
