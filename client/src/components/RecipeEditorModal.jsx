import React, { useState, useEffect } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { X, Plus, Trash2, Edit3, Image, Video, Sparkles, Check, Eye, Layers, Flame, Star } from 'lucide-react';

export default function RecipeEditorModal() {
  const { isEditorOpen, setIsEditorOpen, editingRecipe, addRecipe, updateRecipe } = useRecipeContext();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'ingredients' | 'media' | 'preview'

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nigerian & West African');
  const [course, setCourse] = useState('Main Course');
  const [diet, setDiet] = useState('Dairy-Free');
  const [prepTime, setPrepTime] = useState('20 mins');
  const [cookTime, setCookTime] = useState('30 mins');
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [autoImportUrl, setAutoImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [tips, setTips] = useState('');
  const [trending, setTrending] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Nutrition state
  const [calories, setCalories] = useState(480);
  const [protein, setProtein] = useState('28g');
  const [carbs, setCarbs] = useState('42g');
  const [fat, setFat] = useState('18g');

  // Dynamic lists
  const [ingredients, setIngredients] = useState([
    { amount: 2, unit: 'cups', metricAmount: 300, metricUnit: 'g', item: 'Long-grain parboiled rice' }
  ]);

  const [instructions, setInstructions] = useState([
    'Rinse and prep all fresh ingredients thoroughly before cooking.',
    'Sauté onions and garlic in hot cooking oil until fragrant.'
  ]);

  const handleAutoImportSocial = async () => {
    if (!autoImportUrl.trim()) return alert('Please paste a TikTok, Instagram Reel, or YouTube video URL');
    setIsImporting(true);
    try {
      const res = await fetch('/api/admin/auto-import-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: autoImportUrl.trim() })
      });
      const data = await res.json();
      if (data.success && data.draft) {
        if (!title) setTitle(data.draft.title);
        if (data.draft.youtubeUrl) setYoutubeUrl(data.draft.youtubeUrl);
        if (data.draft.instagramUrl) setInstagramUrl(data.draft.instagramUrl);
        if (data.draft.tiktokUrl) setTiktokUrl(data.draft.tiktokUrl);
        if (!imageUrl) setImageUrl(data.draft.imageUrl);
        alert(`Successfully imported and formatted ${data.platform.toUpperCase()} video URL! 🎉`);
        setAutoImportUrl('');
      } else {
        alert(data.message || 'Could not parse video URL');
      }
    } catch {
      alert('Error importing social link');
    } finally {
      setIsImporting(false);
    }
  };

  // Load existing recipe data if in edit mode
  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setSubtitle(editingRecipe.subtitle || '');
      setDescription(editingRecipe.description || editingRecipe.subtitle || '');
      setCategory(editingRecipe.category || 'Nigerian & West African');
      setCourse(editingRecipe.course || 'Main Course');
      setDiet(editingRecipe.diet || 'General');
      setPrepTime(editingRecipe.prepTime || '20 mins');
      setCookTime(editingRecipe.cookTime || '30 mins');
      setServings(editingRecipe.servings || 4);
      setDifficulty(editingRecipe.difficulty || 'Medium');
      setImageUrl(editingRecipe.imageUrl || '');
      setYoutubeUrl(editingRecipe.youtubeUrl || '');
      setInstagramUrl(editingRecipe.instagramUrl || '');
      setTiktokUrl(editingRecipe.tiktokUrl || '');
      setTips(editingRecipe.tips || '');
      setTrending(Boolean(editingRecipe.trending));
      setFeatured(Boolean(editingRecipe.featured));

      if (editingRecipe.nutrition) {
        setCalories(editingRecipe.nutrition.calories || 480);
        setProtein(editingRecipe.nutrition.protein || '28g');
        setCarbs(editingRecipe.nutrition.carbs || '42g');
        setFat(editingRecipe.nutrition.fat || '18g');
      }

      if (editingRecipe.ingredients && editingRecipe.ingredients.length > 0) {
        setIngredients(editingRecipe.ingredients);
      }
      if (editingRecipe.instructions && editingRecipe.instructions.length > 0) {
        setInstructions(editingRecipe.instructions);
      }
    } else {
      // Reset form for Create mode
      setTitle('');
      setSubtitle('');
      setDescription('');
      setCategory('Nigerian & West African');
      setCourse('Main Course');
      setDiet('Dairy-Free');
      setPrepTime('20 mins');
      setCookTime('30 mins');
      setServings(4);
      setDifficulty('Medium');
      setImageUrl('');
      setYoutubeUrl('');
      setTips('Cook with passion and fresh herbs for maximum flavor!');
      setTrending(false);
      setFeatured(false);
      setCalories(480);
      setProtein('28g');
      setCarbs('42g');
      setFat('18g');
      setIngredients([
        { amount: 2, unit: 'cups', metricAmount: 300, metricUnit: 'g', item: 'Long-grain parboiled rice' }
      ]);
      setInstructions([
        'Rinse and prep all fresh ingredients thoroughly before cooking.',
        'Sauté onions and garlic in hot cooking oil until fragrant.'
      ]);
    }
  }, [editingRecipe, isEditorOpen]);

  if (!isEditorOpen) return null;

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { amount: 1, unit: 'tbsp', metricAmount: 15, metricUnit: 'g', item: '' }]);
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
    if (!title.trim() || !imageUrl.trim()) {
      alert('Please fill in at least the Recipe Title and Cover Image URL');
      return;
    }

    // Format YouTube Embed URL if raw watch URL provided
    let formattedYt = youtubeUrl.trim();
    if (formattedYt.includes('watch?v=')) {
      formattedYt = formattedYt.replace('watch?v=', 'embed/');
    } else if (formattedYt.includes('youtu.be/')) {
      formattedYt = formattedYt.replace('youtu.be/', 'youtube.com/embed/');
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim() || subtitle.trim(),
      category,
      course,
      diet,
      prepTime,
      cookTime,
      totalTime: `${(parseInt(prepTime) || 15) + (parseInt(cookTime) || 20)} mins`,
      prepTimeMins: parseInt(prepTime) || 15,
      cookTimeMins: parseInt(cookTime) || 20,
      servings: parseInt(servings) || 4,
      difficulty,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      youtubeUrl: formattedYt || 'https://www.youtube.com/embed/SRLjVm1_ueK',
      instagramUrl: instagramUrl.trim() || 'https://www.instagram.com/eboses_kitchen_kronikles',
      tiktokUrl: tiktokUrl.trim() || '',
      ingredients: ingredients.filter(i => i.item && i.item.trim()),
      instructions: instructions.filter(i => i && i.trim()),
      tips: tips.trim() || 'Enjoy fresh with family and friends!',
      trending,
      featured,
      nutrition: { calories: parseInt(calories) || 480, protein, carbs, fat },
      author: 'Ebose'
    };

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, payload);
    } else {
      addRecipe(payload);
    }
  };

  const categoriesList = [
    'Nigerian & West African',
    'Dinner & Main Courses',
    'Breakfast & Brunch',
    'Desserts & Sweet Treats',
    'Soups & Stews',
    'Quick & Easy (under 30 mins)',
    'Healthy & Fresh',
    'Smoothies & Drinks'
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(41, 28, 14, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '2px solid var(--brand-chestnut)'
      }}>
        {/* Modal Header Bar */}
        <div style={{
          backgroundColor: 'var(--brand-espresso)',
          color: '#FFFFFF',
          padding: '1.2rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              backgroundColor: 'var(--brand-chestnut)',
              color: '#FFFFFF',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {editingRecipe ? <Edit3 size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
                {editingRecipe ? `Edit Recipe: "${editingRecipe.title}"` : 'Publish New Recipe to Ebose’s Space'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#E1D4C2' }}>
                {editingRecipe ? `ID: ${editingRecipe.id} — Live Content Management` : 'Fill out recipe details below to publish directly'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditorOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tab Controls */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '0 1.5rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            style={{
              padding: '0.85rem 1.2rem',
              border: 'none',
              borderBottom: activeTab === 'general' ? '3px solid var(--brand-chestnut)' : '3px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'general' ? 700 : 600,
              color: activeTab === 'general' ? 'var(--brand-espresso)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            1. Basic Info & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            style={{
              padding: '0.85rem 1.2rem',
              border: 'none',
              borderBottom: activeTab === 'ingredients' ? '3px solid var(--brand-chestnut)' : '3px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'ingredients' ? 700 : 600,
              color: activeTab === 'ingredients' ? 'var(--brand-espresso)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            2. Ingredients & Step-by-Step ({ingredients.length} items / {instructions.length} steps)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            style={{
              padding: '0.85rem 1.2rem',
              border: 'none',
              borderBottom: activeTab === 'media' ? '3px solid var(--brand-chestnut)' : '3px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'media' ? 700 : 600,
              color: activeTab === 'media' ? 'var(--brand-espresso)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            3. Media, Badges & Nutrition
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '0.85rem 1.2rem',
              border: 'none',
              borderBottom: activeTab === 'preview' ? '3px solid var(--brand-chestnut)' : '3px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'preview' ? 700 : 600,
              color: activeTab === 'preview' ? 'var(--brand-espresso)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Eye size={15} /> Live Card Preview
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
          
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                  Recipe Title <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Authentic Smoky Party Jollof Rice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                  Short Subtitle / Hook Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rich pepper reduction parboiled in basmati rice with sweet dodo"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                  Full Description Story
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell readers what makes this dish special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  >
                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Course Type
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Appetizer & Starter">Appetizer & Starter</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Dietary Classification
                  </label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Dairy-Free">Dairy-Free</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Nut-Free">Nut-Free</option>
                    <option value="General">General / All Diets</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Prep Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20 mins"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Cook Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 35 mins"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Servings Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Chef Level">Chef Level</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INGREDIENTS & INSTRUCTIONS */}
          {activeTab === 'ingredients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Dynamic Ingredients Section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-espresso)' }}>Ingredients List Builder</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Specify quantities, measurement units, and item descriptions</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={15} /> Add Ingredient
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {ingredients.map((ing, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Qty"
                        value={ing.amount}
                        onChange={(e) => handleIngredientChange(idx, 'amount', parseFloat(e.target.value) || 1)}
                        style={{ width: '70px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Unit (tbsp, cups)"
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                        style={{ width: '110px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Ingredient name (e.g. Parboiled Basmati Rice)"
                        value={ing.item}
                        onChange={(e) => handleIngredientChange(idx, 'item', e.target.value)}
                        style={{ flex: 1, padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        style={{ padding: '0.45rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Instructions Section */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-espresso)' }}>Step-by-Step Cooking Method</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chronological instructions for preparing this recipe</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={15} /> Add Cooking Step
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {instructions.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{
                        backgroundColor: 'var(--brand-espresso)',
                        color: '#FFFFFF',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        flexShrink: 0,
                        marginTop: '0.2rem'
                      }}>
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        placeholder={`Step ${idx + 1} instructions...`}
                        value={step}
                        onChange={(e) => handleInstructionChange(idx, e.target.value)}
                        style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(idx)}
                        style={{ padding: '0.45rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '4px', cursor: 'pointer', marginTop: '0.2rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA, BADGES & NUTRITION */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Auto Import Social Link Quick Bar */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem 1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-chestnut)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  ⚡ Auto-Import Video Embed Link
                </span>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Paste TikTok, Instagram Reel, or YouTube video link..."
                    value={autoImportUrl}
                    onChange={(e) => setAutoImportUrl(e.target.value)}
                    style={{ flex: 1, padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAutoImportSocial}
                    disabled={isImporting}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}
                  >
                    {isImporting ? 'Importing...' : 'Auto-Import Video'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                  Cover Image (Upload File or Paste Web Link) <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ flex: 1, padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                    />
                    <label style={{
                      backgroundColor: 'var(--brand-chestnut)',
                      color: '#FFFFFF',
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      whiteSpace: 'nowrap'
                    }}>
                      📁 Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert('File too large. Please select an image under 10MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (evt) => setImageUrl(evt.target.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                      <img src={imageUrl} alt="Cover preview" style={{ width: '60px', height: '45px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-medium)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {imageUrl.startsWith('data:') ? '✅ Local image file uploaded (Base64 ready)' : '✅ Image URL connected'}
                      </span>
                      <button type="button" onClick={() => setImageUrl('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
                        Clear Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    🎥 YouTube Video Link / Embed URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    📸 Instagram Reel URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/reel/..."
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                    🎵 TikTok Video URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.tiktok.com/@user/video/..."
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                  Chef’s Special Tips & Advice
                </label>
                <textarea
                  rows={3}
                  placeholder="Secret spice blends, heat warnings, or substitution ideas..."
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                />
              </div>

              {/* Badges Toggles */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-chestnut)' }}
                  />
                  <span>🔥 Mark as Trending Recipe</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-chestnut)' }}
                  />
                  <span>⭐ Mark as Featured Recipe</span>
                </label>
              </div>

              {/* Nutrition Inputs */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-espresso)', marginBottom: '0.8rem' }}>
                  Nutrition Facts (per serving)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Calories (kcal)</span>
                    <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Protein</span>
                    <input type="text" value={protein} onChange={(e) => setProtein(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Carbs</span>
                    <input type="text" value={carbs} onChange={(e) => setCarbs(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Fat</span>
                    <input type="text" value={fat} onChange={(e) => setFat(e.target.value)} style={{ width: '100%', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--border-medium)' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE CARD PREVIEW */}
          {activeTab === 'preview' && (
            <div>
              <div style={{ marginBottom: '1.2rem', padding: '0.8rem 1rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', color: '#1E40AF', fontSize: '0.85rem' }}>
                ℹ️ <strong>Live Preview Mode:</strong> This card shows how your recipe will look on the public homepage and recipe catalog.
              </div>

              <div style={{ maxWidth: '380px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }} className="recipe-card">
                <div style={{ position: 'relative', width: '100%', height: '230px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {trending && <span className="card-badge badge-trending" style={{ position: 'absolute', top: '0.8rem', right: '0.8rem' }}>🔥 Trending</span>}
                  {featured && <span className="card-badge badge-terracotta" style={{ position: 'absolute', top: '0.8rem', left: '0.8rem' }}>⭐ Featured</span>}
                </div>
                <div className="card-content" style={{ padding: '1.2rem' }}>
                  <div className="card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="card-category" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-chestnut)', textTransform: 'uppercase' }}>{category}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>⏱ {cookTime}</span>
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>
                    {title || 'Untitled Recipe'}
                  </h3>
                  <p className="card-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {subtitle || 'Delicious dish made with love in Ebose’s Space.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Bottom Action Controls */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {activeTab !== 'preview' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="btn btn-secondary"
                >
                  <Eye size={16} /> Preview Card
                </button>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.8rem' }}>
                <Check size={18} />
                <span>{editingRecipe ? 'Save Changes & Update Recipe' : 'Publish New Recipe'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
