import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DATA_FILE = path.join(DATA_DIR, 'recipes.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'siteContent.json');
const TAXONOMIES_FILE = path.join(DATA_DIR, 'taxonomies.json');

app.use(cors());
app.use(express.json());

// Default Taxonomies Dataset
const defaultTaxonomies = {
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
};

const readTaxonomies = () => {
  try {
    if (!fs.existsSync(TAXONOMIES_FILE)) return defaultTaxonomies;
    return JSON.parse(fs.readFileSync(TAXONOMIES_FILE, 'utf8'));
  } catch {
    return defaultTaxonomies;
  }
};

const writeTaxonomies = (tax) => {
  try {
    fs.writeFileSync(TAXONOMIES_FILE, JSON.stringify(tax, null, 2), 'utf8');
  } catch (err) {
    console.error(err);
  }
};

// GET /api/taxonomies
app.get('/api/taxonomies', (req, res) => {
  res.json({ success: true, taxonomies: readTaxonomies() });
});

// POST /api/admin/taxonomies
app.post('/api/admin/taxonomies', (req, res) => {
  const taxonomies = req.body;
  writeTaxonomies(taxonomies);
  res.json({ success: true, message: 'Taxonomies updated successfully', taxonomies });
});

// Helper function to read recipes JSON
const readRecipes = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading recipes file:', err);
    return [];
  }
};

// Helper function to write recipes JSON
const writeRecipes = (recipes) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing recipes file:', err);
    return false;
  }
};

// Helper function to read subscribers
const readSubscribers = () => {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return ['ebose.fan@example.com', 'chioma.cooks@example.com', 'marcus.t@example.com'];
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return ['ebose.fan@example.com', 'chioma.cooks@example.com'];
  }
};

const writeSubscribers = (subs) => {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2), 'utf8');
  } catch (err) {
    console.error(err);
  }
};

// Default Site Content JSON
const defaultSiteContent = {
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
};

const readSiteContent = () => {
  try {
    if (!fs.existsSync(SITE_CONTENT_FILE)) return defaultSiteContent;
    const parsed = JSON.parse(fs.readFileSync(SITE_CONTENT_FILE, 'utf8'));
    return { ...defaultSiteContent, ...parsed };
  } catch {
    return defaultSiteContent;
  }
};

const writeSiteContent = (content) => {
  try {
    fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
  } catch (err) {
    console.error(err);
  }
};

// GET /api/site-content (Public)
app.get('/api/site-content', (req, res) => {
  res.json({ success: true, content: readSiteContent() });
});

// GET /api/admin/site-content (Admin)
app.get('/api/admin/site-content', (req, res) => {
  res.json({ success: true, content: readSiteContent() });
});

// POST /api/admin/site-content
app.post('/api/admin/site-content', (req, res) => {
  const content = req.body;
  writeSiteContent(content);
  res.json({ success: true, message: 'Site content updated successfully', content });
});

// GET /api/recipes - Filter & Search
app.get('/api/recipes', (req, res) => {
  let recipes = readRecipes();
  const { category, search, diet, course, featured, trending, maxTime } = req.query;

  if (category && category !== 'All') {
    recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (diet && diet !== 'All') {
    recipes = recipes.filter(r => r.diet && r.diet.toLowerCase().includes(diet.toLowerCase()));
  }

  if (course && course !== 'All') {
    recipes = recipes.filter(r => r.course && r.course.toLowerCase() === course.toLowerCase());
  }

  if (featured === 'true') {
    recipes = recipes.filter(r => r.featured === true);
  }

  if (trending === 'true') {
    recipes = recipes.filter(r => r.trending === true);
  }

  if (maxTime) {
    const max = parseInt(maxTime);
    recipes = recipes.filter(r => (r.cookTimeMins || 30) + (r.prepTimeMins || 15) <= max);
  }

  if (search) {
    const query = search.toLowerCase();
    recipes = recipes.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.subtitle.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.ingredients.some(ing => ing.item.toLowerCase().includes(query))
    );
  }

  res.json({
    success: true,
    count: recipes.length,
    recipes
  });
});

// GET /api/recipes/:id
app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === id || r.slug === id);

  if (!recipe) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  res.json({ success: true, recipe });
});

// POST /api/admin/auto-import-social - Auto parse TikTok/IG/YouTube video links
app.post('/api/admin/auto-import-social', (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl || typeof videoUrl !== 'string') {
    return res.status(400).json({ success: false, message: 'Please provide a valid video URL' });
  }

  const url = videoUrl.trim();
  let platform = 'unknown';
  let formattedUrl = url;
  let defaultCategory = 'Nigerian & West African';
  let titleDraft = 'New Recipe from Social Media';

  if (url.includes('tiktok.com')) {
    platform = 'tiktok';
    const match = url.match(/\/video\/(\d+)/);
    const videoId = match ? match[1] : '';
    formattedUrl = videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
    titleDraft = 'Ebose’s Viral TikTok Recipe';
  } else if (url.includes('instagram.com')) {
    platform = 'instagram';
    const match = url.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
    const reelId = match ? match[2] : '';
    formattedUrl = reelId ? `https://www.instagram.com/p/${reelId}/embed/` : `${url.replace(/\/$/, '')}/embed/`;
    titleDraft = 'Ebose’s Instagram Reel Special';
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube';
    let videoId = '';
    if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    formattedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    titleDraft = 'Ebose’s YouTube Masterclass Recipe';
  }

  res.json({
    success: true,
    platform,
    videoUrl: url,
    formattedUrl,
    draft: {
      title: titleDraft,
      category: defaultCategory,
      youtubeUrl: platform === 'youtube' ? formattedUrl : '',
      instagramUrl: platform === 'instagram' ? url : '',
      tiktokUrl: platform === 'tiktok' ? url : '',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      tips: `Original video tutorial available on ${platform.toUpperCase()}!`
    }
  });
});

// POST /api/recipes - Add New Recipe (Admin)
app.post('/api/recipes', (req, res) => {
  const newRecipe = req.body;

  if (!newRecipe.title || !newRecipe.category || !newRecipe.ingredients || !newRecipe.instructions) {
    return res.status(400).json({ success: false, message: 'Missing required recipe fields' });
  }

  const recipes = readRecipes();
  const id = `ebose-rec-${String(Date.now()).slice(-6)}`;
  const slug = newRecipe.slug || newRecipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const completeRecipe = {
    id,
    slug,
    title: newRecipe.title,
    subtitle: newRecipe.subtitle || '',
    description: newRecipe.description || newRecipe.subtitle || '',
    author: newRecipe.author || 'Ebose',
    category: newRecipe.category,
    course: newRecipe.course || 'Main Course',
    diet: newRecipe.diet || 'General',
    prepTime: newRecipe.prepTime || '15 mins',
    cookTime: newRecipe.cookTime || '20 mins',
    totalTime: newRecipe.totalTime || '35 mins',
    prepTimeMins: parseInt(newRecipe.prepTime) || 15,
    cookTimeMins: parseInt(newRecipe.cookTime) || 20,
    servings: parseInt(newRecipe.servings) || 4,
    difficulty: newRecipe.difficulty || 'Easy',
    rating: 5.0,
    reviewsCount: 1,
    youtubeUrl: newRecipe.youtubeUrl || 'https://www.youtube.com/embed/SRLjVm1_ueK',
    instagramUrl: newRecipe.instagramUrl || 'https://www.instagram.com/eboses_kitchen_kronikles',
    imageUrl: newRecipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    featured: newRecipe.featured || false,
    trending: newRecipe.trending || true,
    ingredients: newRecipe.ingredients,
    instructions: newRecipe.instructions,
    tips: newRecipe.tips || 'Cook with passion and love!',
    nutrition: newRecipe.nutrition || { calories: 480, protein: '28g', carbs: '42g', fat: '18g' },
    reviews: [
      {
        id: `rev-${Date.now()}`,
        userName: 'Ebose (Author)',
        rating: 5,
        date: new Date().toISOString().split('T')[0],
        comment: 'Freshly published recipe on Ebose’s Space!'
      }
    ]
  };

  recipes.unshift(completeRecipe);
  writeRecipes(recipes);

  res.status(201).json({ success: true, message: 'Recipe published successfully', recipe: completeRecipe });
});

// POST /api/recipes/:id/duplicate - Duplicate Recipe (Admin)
app.post('/api/recipes/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const recipes = readRecipes();
  const sourceRecipe = recipes.find(r => r.id === id || r.slug === id);

  if (!sourceRecipe) {
    return res.status(404).json({ success: false, message: 'Source recipe not found' });
  }

  const newId = `ebose-rec-${String(Date.now()).slice(-6)}`;
  const duplicated = {
    ...JSON.parse(JSON.stringify(sourceRecipe)),
    id: newId,
    title: `${sourceRecipe.title} (Copy)`,
    slug: `${sourceRecipe.slug}-copy-${Date.now()}`,
    reviewsCount: 0,
    rating: 5.0,
    reviews: []
  };

  recipes.unshift(duplicated);
  writeRecipes(recipes);

  res.status(201).json({ success: true, message: 'Recipe duplicated successfully', recipe: duplicated });
});

// PUT /api/recipes/:id - Edit Recipe (Admin)
app.put('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const recipes = readRecipes();
  const idx = recipes.findIndex(r => r.id === id || r.slug === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  recipes[idx] = { ...recipes[idx], ...updatedData };
  writeRecipes(recipes);

  res.json({ success: true, message: 'Recipe updated successfully', recipe: recipes[idx] });
});

// DELETE /api/recipes/:id - Delete Recipe (Admin)
app.delete('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  let recipes = readRecipes();
  const initialLength = recipes.length;
  recipes = recipes.filter(r => r.id !== id && r.slug !== id);

  if (recipes.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  writeRecipes(recipes);
  res.json({ success: true, message: 'Recipe deleted successfully' });
});

// POST /api/recipes/:id/reviews - Add Review
app.post('/api/recipes/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment, photoUrl } = req.body;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Name, rating, and comment are required' });
  }

  const recipes = readRecipes();
  const recipeIndex = recipes.findIndex(r => r.id === id || r.slug === id);

  if (recipeIndex === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    userName,
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    comment,
    photoUrl: photoUrl ? photoUrl.trim() : ''
  };

  const recipe = recipes[recipeIndex];
  recipe.reviews.unshift(newReview);

  const totalStars = recipe.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  recipe.rating = Number((totalStars / recipe.reviews.length).toFixed(2));
  recipe.reviewsCount = recipe.reviews.length;

  recipes[recipeIndex] = recipe;
  writeRecipes(recipes);

  res.json({ success: true, message: 'Review added successfully', recipe });
});

// POST /api/recipes/:recipeId/reviews/:reviewId/reply - Staff Reply to Review (Admin)
app.post('/api/recipes/:recipeId/reviews/:reviewId/reply', (req, res) => {
  const { recipeId, reviewId } = req.params;
  const { replyText } = req.body;

  if (!replyText) return res.status(400).json({ success: false, message: 'Reply text required' });

  const recipes = readRecipes();
  const recipeIndex = recipes.findIndex(r => r.id === recipeId || r.slug === recipeId);

  if (recipeIndex === -1) return res.status(404).json({ success: false, message: 'Recipe not found' });

  const recipe = recipes[recipeIndex];
  const review = recipe.reviews.find(rev => rev.id === reviewId);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  review.staffReply = {
    author: 'Ebose (Head Chef)',
    date: new Date().toISOString().split('T')[0],
    comment: replyText
  };

  recipes[recipeIndex] = recipe;
  writeRecipes(recipes);

  res.json({ success: true, message: 'Staff reply added', recipe });
});

// DELETE /api/recipes/:recipeId/reviews/:reviewId - Moderate/Delete Review (Admin)
app.delete('/api/recipes/:recipeId/reviews/:reviewId', (req, res) => {
  const { recipeId, reviewId } = req.params;
  const recipes = readRecipes();
  const recipeIndex = recipes.findIndex(r => r.id === recipeId || r.slug === recipeId);

  if (recipeIndex === -1) {
    return res.status(404).json({ success: false, message: 'Recipe not found' });
  }

  const recipe = recipes[recipeIndex];
  recipe.reviews = recipe.reviews.filter(rev => rev.id !== reviewId);
  recipe.reviewsCount = recipe.reviews.length;

  if (recipe.reviews.length > 0) {
    const totalStars = recipe.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    recipe.rating = Number((totalStars / recipe.reviews.length).toFixed(2));
  } else {
    recipe.rating = 5.0;
  }

  recipes[recipeIndex] = recipe;
  writeRecipes(recipes);

  res.json({ success: true, message: 'Review removed', recipe });
});

// GET /api/admin/analytics - Admin Stats
app.get('/api/admin/analytics', (req, res) => {
  const recipes = readRecipes();
  const subscribers = readSubscribers();

  const totalReviews = recipes.reduce((acc, r) => acc + (r.reviews ? r.reviews.length : 0), 0);
  const avgPlatformRating = (recipes.reduce((acc, r) => acc + r.rating, 0) / (recipes.length || 1)).toFixed(2);

  res.json({
    success: true,
    stats: {
      totalRecipes: recipes.length,
      totalReviews,
      avgPlatformRating: Number(avgPlatformRating),
      subscribersCount: subscribers.length,
      subscribers
    }
  });
});

// GET /api/admin/backup - Database Download
app.get('/api/admin/backup', (req, res) => {
  const recipes = readRecipes();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=eboses_space_backup.json');
  res.send(JSON.stringify(recipes, null, 2));
});

// POST /api/newsletter - Subscribe
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  const subs = readSubscribers();
  if (!subs.includes(email)) {
    subs.push(email);
    writeSubscribers(subs);
  }

  res.json({ success: true, message: `Welcome to Ebose's Space Club! Subscription confirmed for ${email}` });
});

// GET /api/subscribers (Admin)
app.get('/api/subscribers', (req, res) => {
  const subs = readSubscribers();
  res.json({ success: true, subscribers: subs });
});

app.listen(PORT, () => {
  console.log(`🍳 Ebose's Space API Server running on port ${PORT}`);
});
