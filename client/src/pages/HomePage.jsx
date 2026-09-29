import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import IngredientFinder from '../components/IngredientFinder';
import SocialFeed from '../components/SocialFeed';

export default function HomePage() {
  const { recipes, setActiveRecipe, setCurrentPage, setSelectedCategory, showToast } = useRecipeContext();
  const [activeTab, setActiveTab] = useState('QUICK + EASY');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleCookbookSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Success! Free Ebose's Space Cookbook sent to ${email} 📚`);
    setFirstName('');
    setEmail('');
  };

  const handleCategoryPill = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage('recipes');
  };

  const tabbedRecipes = recipes.slice(0, 4);

  return (
    <div className="animate-fade-in-up">
      <div className="container">
        {/* 1. FEATURED 4-COLUMN VERTICAL GRID */}
        <section className="feature-columns-grid">
          <div className="feature-column-card" onClick={() => handleCategoryPill('Nigerian & West African')}>
            <img src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80" alt="Dinner" />
            <div className="feature-column-pill">DINNER</div>
          </div>

          <div className="feature-column-card" onClick={() => handleCategoryPill('30-Min Meals')}>
            <img src="https://images.unsplash.com/photo-1555949258-eb67b2808200?auto=format&fit=crop&w=600&q=80" alt="Quick and Easy" />
            <div className="feature-column-pill">QUICK AND EASY</div>
          </div>

          <div className="feature-column-card" onClick={() => handleCategoryPill('Soups & Stews')}>
            <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80" alt="Soups" />
            <div className="feature-column-pill">SOUPS</div>
          </div>

          <div className="feature-column-card" onClick={() => handleCategoryPill('Desserts & Treats')}>
            <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80" alt="Desserts" />
            <div className="feature-column-pill">DESSERTS & TREATS</div>
          </div>
        </section>

        {/* 2. CIRCULAR CATEGORY ICONS ROW */}
        <section className="circle-categories-row">
          {[
            { label: 'QUICK AND EASY', img: 'https://images.unsplash.com/photo-1555949258-eb67b2808200?auto=format&fit=crop&w=200&q=80', cat: '30-Min Meals' },
            { label: 'DINNER', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=200&q=80', cat: 'Nigerian & West African' },
            { label: 'VEGETARIAN', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80', cat: 'Healthy & Fusion' },
            { label: 'HEALTHY', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80', cat: 'Healthy & Fusion' },
            { label: 'SOUPS', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=200&q=80', cat: 'Soups & Stews' },
            { label: 'SWEETS', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=200&q=80', cat: 'Desserts & Treats' }
          ].map((item, idx) => (
            <div key={idx} className="circle-category-item" onClick={() => handleCategoryPill(item.cat)}>
              <img src={item.img} alt={item.label} className="circle-category-img" />
              <span className="circle-category-label">{item.label}</span>
            </div>
          ))}
        </section>

        {/* Interactive "What's in Your Fridge?" Finder */}
        <IngredientFinder />

        {/* 3. AS SEEN IN PRESS BANNER */}
        <section className="press-banner">
          <span>AS SEEN IN</span>
          <div className="press-logos">
            <div>BuzzFeed</div>
            <div>PureWow</div>
            <div>BRIT+CO</div>
            <div>POPSUGAR</div>
            <div>THE EVERYGIRL</div>
            <div>kitchn</div>
          </div>
        </section>

        {/* 4. MAIN EDITORIAL GRID */}
        <section className="main-editorial-grid">
          {/* Left Column: Latest & Greatest Posts */}
          <div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--brand-chestnut)',
              textTransform: 'uppercase',
              marginBottom: '1.8rem',
              borderBottom: '1px solid var(--border-medium)',
              paddingBottom: '0.6rem'
            }}>
              THE LATEST & GREATEST
            </div>

            {recipes.map((post) => (
              <article key={post.id} className="editorial-post-card">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="editorial-post-img"
                  onClick={() => {
                    setActiveRecipe(post);
                    setCurrentPage('detail');
                  }}
                />
                <div>
                  <div className="editorial-post-date">SEPTEMBER 29, 2026</div>
                  <h3
                    className="editorial-post-title"
                    onClick={() => {
                      setActiveRecipe(post);
                      setCurrentPage('detail');
                    }}
                  >
                    {post.title}
                  </h3>
                  <p className="editorial-post-excerpt">
                    {post.description || post.subtitle}
                  </p>
                  <span
                    className="continue-reading-link"
                    onClick={() => {
                      setActiveRecipe(post);
                      setCurrentPage('detail');
                    }}
                  >
                    CONTINUE READING →
                  </span>
                </div>
              </article>
            ))}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={() => setCurrentPage('recipes')}
                style={{
                  backgroundColor: 'var(--brand-chestnut)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.8rem 2.2rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                VIEW MORE RECENT POSTS
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside>
            <div className="sidebar-widget">
              <div className="sidebar-widget-title">RECIPE COLLECTIONS</div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                {[
                  { name: 'Nigerian Party Jollof', count: 42 },
                  { name: '30-Minute Suya Pasta', count: 88 },
                  { name: 'Lumpy Egusi & Soups', count: 35 },
                  { name: 'Street Snacks & Puff Puff', count: 19 },
                  { name: 'High-Protein Keto Grilled', count: 64 }
                ].map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => setCurrentPage('recipes')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontWeight: 500
                    }}
                  >
                    <span>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar Promo */}
            <div style={{
              backgroundColor: 'var(--brand-espresso)',
              color: '#FFFFFF',
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#E1D4C2' }}>
                EBOSE’S SPACE
              </span>
              <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: '0.5rem 0' }}>
                20 Healthy Prep Meals
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#BEB5A9', marginBottom: '1rem' }}>
                Make-ahead meals for effortless weekday dinners.
              </p>
              <button
                onClick={() => setCurrentPage('recipes')}
                style={{
                  backgroundColor: 'var(--brand-chestnut)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                EXPLORE NOW
              </button>
            </div>
          </aside>
        </section>

        {/* 5. BIO BLOCK */}
        <section className="ebose-bio-block">
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--brand-chestnut)', textTransform: 'uppercase' }}>
              HI! I’M EBOSE.
            </div>
            <h3 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--brand-espresso)', margin: '0.2rem 0 1rem 0' }}>
              welcome to my space!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              I'm a culinary creator, storyteller, and home chef. Welcome to Ebose's Space! Favorite things include spicy Yaji suya, smoky Jollof, and delicious desserts.
            </p>
            <button
              onClick={() => setCurrentPage('about')}
              style={{
                backgroundColor: 'var(--brand-chestnut)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.6rem 1.4rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                cursor: 'pointer'
              }}
            >
              LEARN MORE
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
            alt="Ebose in the kitchen"
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />

          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
            alt="Ebose cooking"
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
        </section>

        {/* 6. TABBED FILTER COLLECTION */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="tabbed-filter-bar">
            {['QUICK + EASY', 'POPULAR DISHES', 'VEGETARIAN'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tabbed-filter-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="stagger-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {tabbedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      </div>

      {/* 7. DARK COOKBOOK EMAIL OPT-IN BANNER */}
      <section className="dark-cookbook-banner" id="newsletter-signup">
        <div className="dark-cookbook-content">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
            alt="Ebose's Space Cookbook"
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)' }}
          />

          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '2.2rem', color: '#E1D4C2', display: 'block' }}>
              get it now
            </span>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.8rem', letterSpacing: '0.02em' }}>
              EBOSE’S SPACE TOP 25 RECIPES COOKBOOK
            </h2>
            <p style={{ color: '#BEB5A9', fontSize: '0.95rem', marginBottom: '1.8rem', lineHeight: 1.6 }}>
              The eBook includes our most popular 25 recipes in a beautiful, easy-to-download PDF format. Enter your email and we'll send it right over!
            </p>

            <form onSubmit={handleCookbookSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ flex: 1, minWidth: '140px', padding: '0.75rem 1rem', border: 'none', borderRadius: '2px', outline: 'none' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 2, minWidth: '200px', padding: '0.75rem 1rem', border: 'none', borderRadius: '2px', outline: 'none' }}
                required
              />
              <button type="submit" className="go-btn">
                GO
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Instagram & Youtube Section */}
      <SocialFeed />
    </div>
  );
}
