import React, { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Routing Page: 'home' | 'recipes' | 'detail' | 'saved' | 'about' | 'admin'
  const [currentPage, setCurrentPage] = useState('home');

  // Admin / Staff Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem('ebose_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(() => {
    return isAdminLoggedIn ? { username: 'Ebose', role: 'Head Admin' } : null;
  });

  // Active view & filtering states
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customization & Drawers
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ebose_favorites');
      return saved ? JSON.parse(saved) : ['ebose-rec-001', 'ebose-rec-002'];
    } catch {
      return ['ebose-rec-001', 'ebose-rec-002'];
    }
  });
  
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ebose_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('ebose_theme', next);
      } catch (e) {
        console.error(e);
      }
      showToast(next === 'dark' ? 'Midnight Espresso Dark Mode Enabled 🌙' : 'Warm Cream Alabaster Daytime Mode ☀️');
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch recipes from Express API backend
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDiet !== 'All') params.append('diet', selectedDiet);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecipes(data.recipes);
      } else {
        throw new Error(data.message || 'Failed to fetch recipes');
      }
    } catch (err) {
      console.warn('API error, falling back to local dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const [taxonomies, setTaxonomies] = useState({
    categories: [
      { id: 'cat-1', name: 'Nigerian & West African', icon: '🍲', description: 'Authentic party classics, rich soups, and spicy grills.', imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-2', name: 'Dinner & Main Courses', icon: '🍽️', description: 'Satisfying weeknight meals for family and friends.', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-3', name: 'Breakfast & Brunch', icon: '🥞', description: 'Fluffy pancakes, egg skillets, and morning delights.', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-4', name: 'Desserts & Sweet Treats', icon: '🍰', description: 'Decadent cakes, pastries, and sweet endings.', imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-5', name: 'Soups & Stews', icon: '🥣', description: 'Hearty slow-simmered broths and rich pepper sauces.', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-6', name: 'Quick & Easy', icon: '⚡', description: 'Delicious recipes ready in 30 minutes or less.', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-7', name: 'Healthy & Fresh', icon: '🥗', description: 'Nutrient-packed salads, bowls, and wholesome eats.', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
      { id: 'cat-8', name: 'Smoothies & Drinks', icon: '🍹', description: 'Refreshing tropical juices, coolers, and shakes.', imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' }
    ],
    dietaryTags: [
      { id: 'tag-1', name: 'Dairy-Free', color: '#6E473B' },
      { id: 'tag-2', name: 'Gluten-Free', color: '#D97706' },
      { id: 'tag-3', name: 'Vegan', color: '#059669' },
      { id: 'tag-4', name: 'Vegetarian', color: '#10B981' },
      { id: 'tag-5', name: 'Nut-Free', color: '#2563EB' },
      { id: 'tag-6', name: 'High Protein', color: '#DC2626' },
      { id: 'tag-7', name: 'Meal Prep', color: '#7C3AED' }
    ]
  });

  const [siteContent, setSiteContent] = useState({
    headerTagline: "SIMPLE RECIPES MADE FOR real, actual, everyday life.",
    topNoticeText: "♥ OUR RECIPES, YOUR INBOX. SIGN UP",
    recipesPageIntro: "We've organized these recipes every way we could think of so you don't have to! Dietary restrictions, weeknight dinners, meal prep recipes, some of our most tried-and-true...",
    chefTitle: "FOUNDER & HEAD CHEF",
    chefImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    chefKitchenImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    aboutMeTitle: "HI, MY NAME IS ebose!",
    aboutMeSubtitle: "And Ebose’s Kitchen Kronikles is my little corner of the internet!",
    aboutMeText: "I’m the voice, author, and creator behind Ebose’s Kitchen Kronikles. What started as a passionate culinary hobby celebrating authentic West African heritage has now grown into a full-fledged food destination that reaches food lovers across the globe each month, with content featured on The Kitchn, CNN, Refinery29, Brit + Co, POPSUGAR, The Everymom, PureWow, and more.",
    aboutMeFavorites: "My favorite things in life are a big plate of smoky party Jollof rice with fried plantains, spicy Yaji suya skewers, sunny days, and sharing video walkthroughs with our amazing community on YouTube @eboses_space and Instagram @eboses_kitchen_kronikles.",
    teamMembers: [
      {
        id: "team-1",
        name: "EBOSE",
        role: "FOUNDER & HEAD CHEF",
        bio: "Ebose is the voice, author, and recipe developer behind Ebose’s Kitchen Kronikles. She develops recipes and writes content for the blog, Instagram, and YouTube channel. What started as a casual hobby has grown into a full-fledged culinary business.",
        imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "team-2",
        name: "CHEF MARCUS",
        role: "CULINARY ADVISOR & TASTE TESTER",
        bio: "Marcus is the chief culinary consultant, taste tester, and video production strategist at Kitchen Kronikles. Day-to-day, you’ll see him behind the scenes ensuring every recipe yields perfection.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "team-3",
        name: "AMINA",
        role: "COMMUNICATIONS MANAGER",
        bio: "Amina is the Communications Manager at Ebose’s Kitchen Kronikles. She manages day-to-day community interaction with readers and brands — answering recipe questions on posts and coordinating brand partnerships.",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      }
    ]
  });

  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/site-content');
      const data = await res.json();
      if (data.success && data.content) {
        setSiteContent(data.content);
      }
    } catch (e) {
      console.warn('Using default site content:', e);
    }
  };

  const updateSiteContent = async (newContent) => {
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      const data = await res.json();
      if (data.success) {
        setSiteContent(newContent);
        showToast('Website content updated live! 🎨');
      }
    } catch (e) {
      alert('Failed to update site content');
    }
  };

  const fetchTaxonomies = async () => {
    try {
      const res = await fetch('/api/taxonomies');
      const data = await res.json();
      if (data.success && data.taxonomies) {
        setTaxonomies(data.taxonomies);
      }
    } catch (e) {
      console.warn('Using default taxonomies:', e);
    }
  };

  const updateTaxonomies = async (newTaxonomies) => {
    try {
      const res = await fetch('/api/admin/taxonomies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaxonomies)
      });
      const data = await res.json();
      if (data.success) {
        setTaxonomies(newTaxonomies);
        showToast('Categories & Tags updated successfully! 🏷️');
      }
    } catch (e) {
      alert('Failed to update taxonomies');
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchTaxonomies();
    fetchSiteContent();
  }, [selectedCategory, selectedDiet, searchQuery]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('ebose_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Admin Login Handler
  const loginAdmin = (username, password) => {
    // Standard staff/admin login credential check (Default: admin / admin123)
    if ((username.toLowerCase() === 'admin' || username.toLowerCase() === 'ebose') && password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminUser({ username: 'Ebose', role: 'Head Admin' });
      sessionStorage.setItem('ebose_admin_auth', 'true');
      setIsAdminLoginOpen(false);
      setCurrentPage('admin');
      showToast('Welcome Ebose! Admin Authentication Verified 🔐');
      return true;
    } else {
      return false;
    }
  };

  // Admin Logout Handler
  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    sessionStorage.removeItem('ebose_admin_auth');
    setCurrentPage('home');
    showToast('Logged out of Admin Portal');
  };

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      const exists = prev.includes(recipeId);
      if (exists) {
        showToast('Removed recipe from your saved favorites');
        return prev.filter(id => id !== recipeId);
      } else {
        showToast('Saved to your Ebose’s Space favorites! ❤️');
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const openCreateRecipeModal = () => {
    setEditingRecipe(null);
    setIsEditorOpen(true);
  };

  const openEditRecipeModal = (recipe) => {
    setEditingRecipe(recipe);
    setIsEditorOpen(true);
  };

  // Add new recipe via API
  const addRecipe = async (newRecipeData) => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipeData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Recipe published to Ebose’s Space! 🎉');
        await fetchRecipes();
        setIsAdminOpen(false);
        setIsEditorOpen(false);
        setActiveRecipe(data.recipe);
        setCurrentPage('detail');
      } else {
        alert(data.message || 'Error publishing recipe');
      }
    } catch (err) {
      alert('Failed to add recipe. Make sure backend is running.');
    }
  };

  // Update existing recipe via API
  const updateRecipe = async (id, updatedRecipeData) => {
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipeData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated "${data.recipe.title}" successfully! ✨`);
        setRecipes(prev => prev.map(r => r.id === id || r.slug === id ? data.recipe : r));
        if (activeRecipe && (activeRecipe.id === id || activeRecipe.slug === id)) {
          setActiveRecipe(data.recipe);
        }
        setIsEditorOpen(false);
        setEditingRecipe(null);
      } else {
        alert(data.message || 'Error updating recipe');
      }
    } catch (err) {
      alert('Failed to update recipe');
    }
  };

  // Duplicate recipe via API
  const duplicateRecipe = async (id) => {
    try {
      const res = await fetch(`/api/recipes/${id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Duplicated as "${data.recipe.title}"! 📋`);
        setRecipes(prev => [data.recipe, ...prev]);
        openEditRecipeModal(data.recipe);
      } else {
        alert(data.message || 'Error duplicating recipe');
      }
    } catch (err) {
      alert('Failed to duplicate recipe');
    }
  };

  // Delete recipe via API
  const deleteRecipe = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this recipe'}"?`)) return;
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted "${title}" successfully`);
        setRecipes(prev => prev.filter(r => r.id !== id && r.slug !== id));
        if (activeRecipe && (activeRecipe.id === id || activeRecipe.slug === id)) {
          setActiveRecipe(null);
          setCurrentPage('home');
        }
      } else {
        alert(data.message || 'Error deleting recipe');
      }
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  // Add Review
  const addReview = async (recipeId, reviewData) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thank you for rating Ebose’s recipe! ⭐');
        setRecipes(prev => prev.map(r => r.id === recipeId ? data.recipe : r));
        if (activeRecipe && activeRecipe.id === recipeId) {
          setActiveRecipe(data.recipe);
        }
      }
    } catch (err) {
      alert('Error submitting review');
    }
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      loading,
      error,
      currentPage,
      setCurrentPage,
      isAdminLoggedIn,
      isAdminLoginOpen,
      setIsAdminLoginOpen,
      adminUser,
      loginAdmin,
      logoutAdmin,
      activeRecipe,
      setActiveRecipe,
      selectedCategory,
      setSelectedCategory,
      selectedDiet,
      setSelectedDiet,
      searchQuery,
      setSearchQuery,
      unitSystem,
      setUnitSystem,
      favorites,
      toggleFavorite,
      isFavorite,
      isFavoritesOpen,
      setIsFavoritesOpen,
      isAdminOpen,
      setIsAdminOpen,
      editingRecipe,
      setEditingRecipe,
      isEditorOpen,
      setIsEditorOpen,
      taxonomies,
      setTaxonomies,
      updateTaxonomies,
      siteContent,
      setSiteContent,
      updateSiteContent,
      theme,
      toggleTheme,
      openCreateRecipeModal,
      openEditRecipeModal,
      addRecipe,
      updateRecipe,
      duplicateRecipe,
      deleteRecipe,
      addReview,
      toastMessage,
      showToast
    }}>
      {children}
    </RecipeContext.Provider>
  );
};
