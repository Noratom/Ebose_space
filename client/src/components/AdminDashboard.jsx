import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { X, Plus, Trash2, ChefHat, Youtube, Image, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdminOpen, setIsAdminOpen, addRecipe } = useRecipeContext();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Nigerian & West African');
  const [course, setCourse] = useState('Main Course');
  const [diet, setDiet] = useState('General');
  const [prepTime, setPrepTime] = useState('20 mins');
  const [cookTime, setCookTime] = useState('30 mins');
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tips, setTips] = useState('');

  // Dynamic list of ingredients
  const [ingredients, setIngredients] = useState([
    { amount: 2, unit: 'cups', metricAmount: 300, metricUnit: 'g', item: 'Long-grain parboiled rice' },
    { amount: 1, unit: 'tbsp', metricAmount: 15, metricUnit: 'g', item: 'Yaji spice blend' }
  ]);

  // Dynamic list of instructions
  const [instructions, setInstructions] = useState([
    'Rinse and prep all fresh ingredients.',
    'Sauté onions and garlic in hot oil until fragrant.'
  ]);

  if (!isAdminOpen) return null;

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: 1, unit: 'cup', metricAmount: 100, metricUnit: 'g', item: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert('Please provide at least a title and cover image URL');
      return;
    }

    // Convert YouTube URL to embed format if needed
    let formattedYt = youtubeUrl.trim();
    if (formattedYt.includes('watch?v=')) {
      formattedYt = formattedYt.replace('watch?v=', 'embed/');
    } else if (formattedYt.includes('youtu.be/')) {
      formattedYt = formattedYt.replace('youtu.be/', 'youtube.com/embed/');
    }

    addRecipe({
      title,
      subtitle,
      description: subtitle,
      category,
      course,
      diet,
      prepTime,
      cookTime,
      totalTime: `${parseInt(prepTime) + parseInt(cookTime)} mins`,
      servings,
      difficulty,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      youtubeUrl: formattedYt || 'https://www.youtube.com/embed/SRLjVm1_ueK',
      ingredients: ingredients.filter(i => i.item.trim()),
      instructions: instructions.filter(i => i.trim()),
      tips,
      author: 'Ebose'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ChefHat size={28} color="var(--brand-terracotta)" />
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
                Ebose’s Recipe Publisher Studio
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Publish new dishes directly to Ebose’s Kitchen Kronikles platform
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Recipe Title *</label>
              <input
                type="text"
                placeholder="e.g. Smoky Suya Ribs with Sweet Mango Chutney"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Subtitle / Short Teaser</label>
              <input
                type="text"
                placeholder="e.g. Succulent fall-off-the-bone ribs seasoned in northern Yaji spices..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              >
                <option value="Nigerian & West African">Nigerian & West African</option>
                <option value="30-Min Meals">30-Min Meals</option>
                <option value="Soups & Stews">Soups & Stews</option>
                <option value="Desserts & Treats">Desserts & Treats</option>
                <option value="Healthy & Fusion">Healthy & Fusion</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Dietary Restriction</label>
              <input
                type="text"
                placeholder="e.g. Gluten-Free, Dairy-Free, Keto"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Prep Time</label>
              <input
                type="text"
                placeholder="e.g. 15 mins"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Cook Time</label>
              <input
                type="text"
                placeholder="e.g. 30 mins"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard / Advanced</option>
              </select>
            </div>
          </div>

          {/* Media Links */}
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Cover Image URL *</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>YouTube Video Embed URL (@eboses_space)</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/embed/..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
            </div>
          </div>

          {/* Dynamic Ingredients Builder */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-forest)', fontWeight: 700 }}>Ingredients List</h4>
              <button
                type="button"
                onClick={handleAddIngredient}
                style={{
                  backgroundColor: 'var(--brand-terracotta-light)',
                  color: 'var(--brand-terracotta)',
                  border: 'none',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Plus size={14} /> Add Ingredient
              </button>
            </div>

            {ingredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr 40px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Qty"
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }}
                />
                <input
                  type="text"
                  placeholder="Unit (cup/tbsp)"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }}
                />
                <input
                  type="text"
                  placeholder="Ingredient name (e.g. Red Bell Peppers)"
                  value={ing.item}
                  onChange={(e) => handleIngredientChange(idx, 'item', e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Dynamic Instructions Builder */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-forest)', fontWeight: 700 }}>Instructions</h4>
              <button
                type="button"
                onClick={handleAddInstruction}
                style={{
                  backgroundColor: 'var(--brand-terracotta-light)',
                  color: 'var(--brand-terracotta)',
                  border: 'none',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Plus size={14} /> Add Step
              </button>
            </div>

            {instructions.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand-forest)', width: '24px' }}>{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="Describe step instruction..."
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  style={{ flex: 1, padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(idx)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Ebose Tip */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Ebose’s Kitchen Secret / Tip</label>
            <input
              type="text"
              placeholder="e.g. Double foiling the pot traps steam and prevents burnt rice!"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Sparkles size={16} /> Publish Recipe Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
