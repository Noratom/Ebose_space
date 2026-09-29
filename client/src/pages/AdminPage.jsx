import React, { useState, useEffect } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { 
  ChefHat, LayoutDashboard, BookOpen, MessageSquare, Users, Plus, 
  Trash2, Edit3, Star, Search, ArrowLeft, Download, CheckCircle, Save, 
  FileText, LogOut, Lock, Copy, Flame, Tags, Shield, RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const { 
    recipes, 
    setActiveRecipe, 
    setCurrentPage, 
    isAdminLoggedIn,
    setIsAdminLoginOpen,
    logoutAdmin,
    adminUser,
    showToast,
    setSelectedCategory,
    openCreateRecipeModal,
    openEditRecipeModal,
    duplicateRecipe,
    deleteRecipe,
    updateRecipe,
    taxonomies,
    updateTaxonomies,
    siteContent: globalSiteContent,
    updateSiteContent
  } = useRecipeContext();

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍲');
  const [newCatDesc, setNewCatDesc] = useState('');
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6E473B');

  // Active Sidebar Section: 'overview' | 'recipes' | 'content' | 'taxonomies' | 'reviews' | 'subscribers' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [adminSearch, setAdminSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const [stats, setStats] = useState({
    totalRecipes: recipes.length,
    totalReviews: 12,
    avgPlatformRating: 4.9,
    subscribersCount: 8,
    subscribers: ['ebose.fan@example.com', 'chioma.cooks@example.com', 'marcus.t@example.com']
  });

  const [formContent, setFormContent] = useState(globalSiteContent);

  useEffect(() => {
    if (globalSiteContent) {
      setFormContent(globalSiteContent);
    }
  }, [globalSiteContent]);

  // Reply Form State
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAnalytics();
    }
  }, [recipes, isAdminLoggedIn]);

  const handleAddTeamMember = () => {
    const newMember = {
      id: 'team-' + Date.now(),
      name: 'NEW TEAM MEMBER',
      role: 'RECIPE DEVELOPER',
      bio: 'Shares culinary expertise and creates exciting new dishes for the community.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    setFormContent(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember]
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setFormContent(prev => {
      const updated = [...(prev.teamMembers || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teamMembers: updated };
    });
  };

  const handleRemoveTeamMember = (index) => {
    setFormContent(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size too large. Max limit is 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="container-narrow" style={{ backgroundColor: '#FFFFFF', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '2px solid var(--brand-chestnut)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-espresso)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem auto'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--brand-espresso)', fontWeight: 800, marginBottom: '0.6rem' }}>
            Staff Authentication Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            The Admin Portal is restricted to authorized staff. Please log in with your credentials to access management tools.
          </p>
          <button onClick={() => setIsAdminLoginOpen(true)} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Log In to Admin Portal
          </button>
        </div>
      </div>
    );
  }

  // Action Handlers
  const handleSaveSiteContent = async (e) => {
    e.preventDefault();
    await updateSiteContent(formContent);
  };

  const handleToggleTrending = async (recipe) => {
    updateRecipe(recipe.id, { trending: !recipe.trending });
  };

  const handleStaffReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    try {
      const res = await fetch(`/api/recipes/${replyingReview.recipeId}/reviews/${replyingReview.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: replyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Official staff reply posted! 💬');
        setReplyingReview(null);
        setReplyText('');
        fetchAnalytics();
      }
    } catch {
      alert('Error saving reply');
    }
  };

  const handleDeleteReview = async (recipeId, reviewId) => {
    if (!window.confirm('Delete this review comment?')) return;
    try {
      const res = await fetch(`/api/recipes/${recipeId}/reviews/${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Review removed');
        fetchAnalytics();
      }
    } catch (e) {
      alert('Failed to remove review');
    }
  };

  const handleExportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Email Address"].concat(stats.subscribers || []).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eboses_space_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers list exported to CSV! 📥');
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          r.category.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const sidebarNavItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'recipes', label: 'Recipes Manager', icon: BookOpen, count: recipes.length },
    { id: 'content', label: 'Site Section Editor', icon: FileText },
    { id: 'taxonomies', label: 'Categories & Tags', icon: Tags },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, count: stats.totalReviews },
    { id: 'subscribers', label: 'Newsletter Subscribers', icon: Users, count: stats.subscribersCount },
    { id: 'settings', label: 'Security & Backup', icon: Shield }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Header Bar */}
      <header style={{
        backgroundColor: 'var(--brand-espresso)',
        color: '#FFFFFF',
        padding: '0.9rem 1.8rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src="/logo-clean.png" alt="Logo" style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
              Ebose’s Space — CMS & Creator Suite
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#E1D4C2', fontWeight: 600 }}>
              Logged in as {adminUser ? adminUser.username : 'Ebose'} ({adminUser ? adminUser.role : 'Head Admin'})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={openCreateRecipeModal}
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <Plus size={15} /> + Add Recipe
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.45rem 0.9rem',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={15} />
            <span>Public Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 0.9rem',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Workspace (Sidebar + Main Content Panel) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)' }}>
        {/* Modern Sidebar Navigation Panel */}
        <aside style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--border-medium)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--brand-chestnut)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '0.6rem' }}>
              ADMIN MENU
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--brand-espresso)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--brand-espresso)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Icon size={18} color={isActive ? 'var(--brand-cream)' : 'var(--brand-chestnut)'} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span style={{
                        backgroundColor: isActive ? 'var(--brand-chestnut)' : 'var(--bg-tertiary)',
                        color: isActive ? '#FFFFFF' : 'var(--brand-espresso)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '100px'
                      }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <strong>Ebose’s Space CMS v2.4</strong>
            <div style={{ color: '#10B981', fontWeight: 700, marginTop: '0.2rem' }}>● System Live & Healthy</div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '1.8rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--brand-espresso)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  Welcome back, Ebose! 👋
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Here is an overview of Ebose’s Space recipes, community reviews, and email subscribers.
                </p>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Published Recipes</span>
                  <strong style={{ fontSize: '2.2rem', color: 'var(--brand-espresso)', display: 'block', margin: '0.3rem 0' }}>{recipes.length}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}>● All recipes live on site</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Reviews</span>
                  <strong style={{ fontSize: '2.2rem', color: 'var(--brand-espresso)', display: 'block', margin: '0.3rem 0' }}>{stats.totalReviews || 12}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--brand-chestnut)', fontWeight: 600 }}>⭐ Avg Rating: {stats.avgPlatformRating || 4.9}</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Club Subscribers</span>
                  <strong style={{ fontSize: '2.2rem', color: 'var(--brand-espresso)', display: 'block', margin: '0.3rem 0' }}>{stats.subscribersCount || 8}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--brand-chestnut)', fontWeight: 600 }}>📬 Weekly Newsletter</span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--brand-espresso)', fontWeight: 700, marginBottom: '1rem' }}>
                  Quick Creator Actions
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={openCreateRecipeModal} className="btn btn-primary">
                    <Plus size={16} /> Publish New Recipe
                  </button>
                  <button onClick={() => setActiveTab('content')} className="btn btn-secondary">
                    <FileText size={16} /> Edit Site Section Text
                  </button>
                  <button onClick={handleExportSubscribers} className="btn btn-outline">
                    <Download size={16} /> Export Subscribers CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECIPES MANAGER */}
          {activeTab === 'recipes' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              {/* Header & Controls Bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: '280px' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search by title or ingredient..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.8rem 0.55rem 2.4rem',
                        borderRadius: '100px',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      padding: '0.55rem 0.9rem',
                      borderRadius: '100px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--brand-espresso)'
                    }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Nigerian & West African">Nigerian & West African</option>
                    <option value="Dinner & Main Courses">Dinner & Main Courses</option>
                    <option value="Breakfast & Brunch">Breakfast & Brunch</option>
                    <option value="Desserts & Sweet Treats">Desserts & Sweet Treats</option>
                    <option value="Soups & Stews">Soups & Stews</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: '100px', border: '1px solid var(--border-medium)' }}>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: '100px',
                        border: 'none',
                        backgroundColor: viewMode === 'table' ? 'var(--brand-espresso)' : 'transparent',
                        color: viewMode === 'table' ? '#FFFFFF' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: '100px',
                        border: 'none',
                        backgroundColor: viewMode === 'grid' ? 'var(--brand-espresso)' : 'transparent',
                        color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Grid Cards
                    </button>
                  </div>

                  <button onClick={openCreateRecipeModal} className="btn btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>
                    <Plus size={16} /> + Create New Recipe
                  </button>
                </div>
              </div>

              {/* TABLE VIEW MODE */}
              {viewMode === 'table' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-medium)' }}>
                        <th style={{ padding: '0.8rem 1rem' }}>Recipe Title</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Category</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Prep / Cook</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Rating</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Trending</th>
                        <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecipes.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: 'var(--brand-espresso)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <img src={r.imageUrl} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                              <div>
                                <div>{r.title}</div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{r.id}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.8rem 1rem' }}>
                            <span className="badge badge-terracotta">{r.category}</span>
                          </td>
                          <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {r.prepTime || '15m'} / {r.cookTime || '20m'}
                          </td>
                          <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>⭐ {r.rating}</td>
                          <td style={{ padding: '0.8rem 1rem' }}>
                            <button
                              onClick={() => handleToggleTrending(r)}
                              style={{
                                padding: '0.25rem 0.7rem',
                                borderRadius: '100px',
                                border: 'none',
                                backgroundColor: r.trending ? 'var(--brand-terracotta-light)' : '#EFEFEF',
                                color: r.trending ? 'var(--brand-chestnut)' : 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              {r.trending ? '🔥 Trending' : 'Normal'}
                            </button>
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                              <button
                                onClick={() => openEditRecipeModal(r)}
                                title="Edit Recipe Details"
                                style={{
                                  padding: '0.45rem 0.75rem',
                                  border: '1px solid var(--brand-chestnut)',
                                  borderRadius: '6px',
                                  background: 'var(--brand-espresso)',
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  fontWeight: 700,
                                  fontSize: '0.78rem'
                                }}
                              >
                                <Edit3 size={13} /> Edit
                              </button>
                              <button
                                onClick={() => duplicateRecipe(r.id)}
                                title="Duplicate Recipe"
                                style={{ padding: '0.45rem', border: '1px solid var(--border-medium)', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer' }}
                              >
                                <Copy size={14} color="var(--brand-chestnut)" />
                              </button>
                              <button
                                onClick={() => {
                                  setActiveRecipe(r);
                                  setCurrentPage('detail');
                                }}
                                title="View Recipe Page"
                                style={{ padding: '0.45rem', border: '1px solid var(--border-medium)', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer' }}
                              >
                                <BookOpen size={14} color="var(--brand-espresso)" />
                              </button>
                              <button
                                onClick={() => deleteRecipe(r.id, r.title)}
                                title="Delete Recipe"
                                style={{ padding: '0.45rem', border: '1px solid #FCA5A5', borderRadius: '6px', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* GRID VIEW MODE */}
              {viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', marginTop: '1rem' }}>
                  {filteredRecipes.map((r) => (
                    <div key={r.id} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ position: 'relative', height: '160px' }}>
                        <img src={r.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span className="badge badge-terracotta" style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
                          {r.category}
                        </span>
                        {r.trending && (
                          <span style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800 }}>
                            🔥 Trending
                          </span>
                        )}
                      </div>

                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-espresso)', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                          {r.title}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                          ⏱ {r.cookTime} • ⭐ {r.rating} ({r.reviewsCount || 1} reviews)
                        </span>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-light)' }}>
                          <button
                            onClick={() => openEditRecipeModal(r)}
                            style={{
                              flex: 1,
                              padding: '0.45rem',
                              backgroundColor: 'var(--brand-espresso)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Edit3 size={13} /> Edit Recipe
                          </button>

                          <button
                            onClick={() => duplicateRecipe(r.id)}
                            style={{ padding: '0.45rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                            title="Duplicate"
                          >
                            <Copy size={14} color="var(--brand-chestnut)" />
                          </button>

                          <button
                            onClick={() => deleteRecipe(r.id, r.title)}
                            style={{ padding: '0.45rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SITE SECTION CONTENT & CHEF/TEAM PROFILE EDITOR */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveSiteContent} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Header Action Bar */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.4rem 1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', fontWeight: 800, margin: 0 }}>
                    Website CMS — Site Content, Chef & Team Profiles
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Edit brand taglines, Chef Ebose’s profile, and team members with image uploads</span>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.8rem' }}>
                  <Save size={16} /> Save All Live Content
                </button>
              </div>

              {/* 1. BRAND & ANNOUNCEMENT BAR TEXTS */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-espresso)', fontWeight: 800, marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--brand-terracotta-light)' }}>
                  1. Brand Banners & Header Announcements
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      Header Sub-tagline Text (Under Logo)
                    </label>
                    <input
                      type="text"
                      value={formContent.headerTagline || ''}
                      onChange={(e) => setFormContent({ ...formContent, headerTagline: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      Top Announcement Bar Notice Text
                    </label>
                    <input
                      type="text"
                      value={formContent.topNoticeText || ''}
                      onChange={(e) => setFormContent({ ...formContent, topNoticeText: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      Recipes Catalog Page Intro Text
                    </label>
                    <textarea
                      rows={2}
                      value={formContent.recipesPageIntro || ''}
                      onChange={(e) => setFormContent({ ...formContent, recipesPageIntro: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. CHEF EBOSE PROFILE EDITOR */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-espresso)', fontWeight: 800, marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--brand-terracotta-light)' }}>
                  👩‍🍳 2. Chef Ebose’s Founder Profile & Story
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                        Chef Title / Role Designation
                      </label>
                      <input
                        type="text"
                        value={formContent.chefTitle || 'FOUNDER & HEAD CHEF'}
                        onChange={(e) => setFormContent({ ...formContent, chefTitle: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                        Story Section Headline Title
                      </label>
                      <input
                        type="text"
                        value={formContent.aboutMeTitle || 'HI, MY NAME IS ebose!'}
                        onChange={(e) => setFormContent({ ...formContent, aboutMeTitle: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  {/* Chef Portrait Image Upload / Link */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      Chef Ebose Profile Portrait Photo
                    </label>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={formContent.chefImage || ''}
                        onChange={(e) => setFormContent({ ...formContent, chefImage: e.target.value })}
                        style={{ flex: 1, minWidth: '220px', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.9rem' }}
                      />
                      <label style={{
                        backgroundColor: 'var(--brand-chestnut)',
                        color: '#FFFFFF',
                        padding: '0.65rem 1.2rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}>
                        📁 Upload Chef Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files?.[0], (url) => setFormContent({ ...formContent, chefImage: url }))}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {formContent.chefImage && (
                        <img
                          src={formContent.chefImage}
                          alt="Chef preview"
                          style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-chestnut)' }}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      About Me Main Bio Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={formContent.aboutMeText || ''}
                      onChange={(e) => setFormContent({ ...formContent, aboutMeText: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)' }}>
                      Chef’s Favorite Things & Passion Statement
                    </label>
                    <textarea
                      rows={2}
                      value={formContent.aboutMeFavorites || ''}
                      onChange={(e) => setFormContent({ ...formContent, aboutMeFavorites: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. TEAM MEMBERS PROFILE EDITOR */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--brand-terracotta-light)' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--brand-espresso)', fontWeight: 800, margin: 0 }}>
                      👥 3. Kitchen Kronikles Team Profiles ({formContent.teamMembers?.length || 0} members)
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage names, roles, bios, and avatar photos for team members displayed on the About page</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                  >
                    <Plus size={15} /> + Add Team Member
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {(formContent.teamMembers || []).map((member, idx) => (
                    <div key={member.id || idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={member.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={member.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-chestnut)' }}
                          />
                          <div>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--brand-espresso)' }}>{member.name || `Team Member ${idx + 1}`}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{member.role || 'Role'}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTeamMember(idx)}
                          style={{ padding: '0.45rem 0.7rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>Full Name</label>
                          <input
                            type="text"
                            value={member.name || ''}
                            onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>Role Title</label>
                          <input
                            type="text"
                            value={member.role || ''}
                            onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.8rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>Profile Image (URL or Upload File)</label>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={member.imageUrl || ''}
                            onChange={(e) => handleTeamMemberChange(idx, 'imageUrl', e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                          />
                          <label style={{
                            backgroundColor: 'var(--brand-espresso)',
                            color: '#FFFFFF',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}>
                            📁 Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e.target.files?.[0], (url) => handleTeamMemberChange(idx, 'imageUrl', url))}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>Bio Narrative</label>
                        <textarea
                          rows={2}
                          value={member.bio || ''}
                          onChange={(e) => handleTeamMemberChange(idx, 'bio', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Save Button */}
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>
                  <Save size={18} /> Save All Live Content & Profiles
                </button>
              </div>

            </form>
          )}

          {/* TAB 4: CATEGORIES & TAXONOMIES MANAGER */}
          {activeTab === 'taxonomies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* CATEGORIES MANAGER PANEL */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', fontWeight: 800 }}>
                      Recipe Categories Manager
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage website recipe categories, icons, and descriptions</span>
                  </div>
                </div>

                {/* Add New Category Form */}
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-medium)' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--brand-espresso)', marginBottom: '0.8rem' }}>+ Create New Category</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr button', gap: '0.8rem', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Icon</span>
                      <input
                        type="text"
                        placeholder="🍲"
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '1.2rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Category Name</span>
                      <input
                        type="text"
                        placeholder="e.g. Seafood & Grills"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Short Description</span>
                      <input
                        type="text"
                        placeholder="Short summary for category card..."
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newCatName.trim()) return alert('Please enter a category name');
                        const updatedCats = [
                          ...(taxonomies.categories || []),
                          {
                            id: `cat-${Date.now()}`,
                            name: newCatName.trim(),
                            icon: newCatIcon.trim() || '🍲',
                            description: newCatDesc.trim() || 'Delicious recipe collection',
                            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                          }
                        ];
                        updateTaxonomies({ ...taxonomies, categories: updatedCats });
                        setNewCatName('');
                        setNewCatDesc('');
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
                    >
                      <Plus size={15} /> Add Category
                    </button>
                  </div>
                </div>

                {/* Existing Categories Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-medium)' }}>
                        <th style={{ padding: '0.7rem 0.9rem' }}>Icon</th>
                        <th style={{ padding: '0.7rem 0.9rem' }}>Category Name</th>
                        <th style={{ padding: '0.7rem 0.9rem' }}>Description</th>
                        <th style={{ padding: '0.7rem 0.9rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(taxonomies.categories || []).map((cat) => (
                        <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.7rem 0.9rem', fontSize: '1.4rem' }}>{cat.icon || '🍲'}</td>
                          <td style={{ padding: '0.7rem 0.9rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>{cat.name}</td>
                          <td style={{ padding: '0.7rem 0.9rem', color: 'var(--text-secondary)' }}>{cat.description}</td>
                          <td style={{ padding: '0.7rem 0.9rem', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"?`)) {
                                  const filtered = (taxonomies.categories || []).filter(c => c.id !== cat.id);
                                  updateTaxonomies({ ...taxonomies, categories: filtered });
                                }
                              }}
                              style={{ padding: '0.35rem 0.6rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DIETARY & SPECIAL TAGS PANEL */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', fontWeight: 800 }}>
                      Dietary & Special Recipe Tags
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage tags like Gluten-Free, Vegan, Dairy-Free, and High Protein</span>
                  </div>
                </div>

                {/* Add New Tag Form */}
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-medium)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Tag Name</span>
                    <input
                      type="text"
                      placeholder="e.g. Keto Friendly, Nut-Free, Low Carb"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Badge Color</span>
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      style={{ width: '60px', height: '36px', padding: '2px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newTagName.trim()) return alert('Please enter a tag name');
                      const updatedTags = [
                        ...(taxonomies.dietaryTags || []),
                        { id: `tag-${Date.now()}`, name: newTagName.trim(), color: newTagColor }
                      ];
                      updateTaxonomies({ ...taxonomies, dietaryTags: updatedTags });
                      setNewTagName('');
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', marginTop: '1.1rem' }}
                  >
                    <Plus size={15} /> Add Tag
                  </button>
                </div>

                {/* Tags List Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {(taxonomies.dietaryTags || []).map((tag) => (
                    <div
                      key={tag.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: `${tag.color || 'var(--brand-chestnut)'}15`,
                        color: tag.color || 'var(--brand-chestnut)',
                        border: `1px solid ${tag.color || 'var(--brand-chestnut)'}40`,
                        padding: '0.4rem 0.8rem',
                        borderRadius: '100px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      <span>🏷️ {tag.name}</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove tag "${tag.name}"?`)) {
                            const filtered = (taxonomies.dietaryTags || []).filter(t => t.id !== tag.id);
                            updateTaxonomies({ ...taxonomies, dietaryTags: filtered });
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION & STAFF REPLIES */}
          {activeTab === 'reviews' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', marginBottom: '1.2rem', fontWeight: 800 }}>
                Community Reviews Moderation & Staff Replies
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {recipes.flatMap(r => (r.reviews || []).map(rev => ({ ...rev, recipeTitle: r.title, recipeId: r.id }))).map(rev => (
                  <div key={rev.id} style={{ padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-sidebar)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div>
                        <strong style={{ color: 'var(--brand-espresso)' }}>{rev.userName}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>on "{rev.recipeTitle}"</span>
                        <span style={{ fontWeight: 700, color: 'var(--brand-chestnut)', marginLeft: '0.5rem' }}>⭐ {rev.rating}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setReplyingReview(rev)}
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.recipeId, rev.id)}
                          style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem', backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FCA5A5', borderRadius: '100px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)' }}>"{rev.comment}"</p>

                    {/* Staff Reply Display */}
                    {rev.staffReply && (
                      <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', backgroundColor: 'var(--brand-terracotta-light)', borderLeft: '3px solid var(--brand-chestnut)', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--brand-chestnut)' }}>Ebose (Head Chef):</strong> {rev.staffReply.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Staff Reply Modal */}
              {replyingReview && (
                <form onSubmit={handleStaffReplySubmit} style={{ marginTop: '1.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--brand-espresso)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Reply to {replyingReview.userName}'s review
                  </h4>
                  <textarea
                    rows={2}
                    placeholder="Write an official staff response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-medium)', marginBottom: '0.6rem' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setReplyingReview(null)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>Post Reply</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', fontWeight: 800 }}>
                    Ebose’s Space Club Email Subscribers ({stats.subscribers ? stats.subscribers.length : 0})
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Opt-in newsletter subscribers for weekly recipe drops</span>
                </div>
                <button onClick={handleExportSubscribers} className="btn btn-secondary">
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <ul style={{ listStyle: 'none', padding: 0 }}>
                {(stats.subscribers || []).map((email, idx) => (
                  <li key={idx} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem' }}>
                    <CheckCircle size={16} color="var(--brand-chestnut)" />
                    <span>{email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 7: SECURITY & DATABASE BACKUP */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--brand-espresso)', fontWeight: 800, marginBottom: '1.2rem' }}>
                Security & Recipe Database Backup
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-espresso)', marginBottom: '0.4rem' }}>Download JSON Database Backup</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Download a complete backup of all recipes, ingredients, instructions, and community ratings.</p>
                  <a href="/api/admin/backup" download="eboses_space_recipes_backup.json" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <Download size={16} /> Download Backup (.JSON)
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
