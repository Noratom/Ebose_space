import React from 'react';
import { RecipeProvider, useRecipeContext } from './context/RecipeContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import RecipeIndexPage from './pages/RecipeIndexPage';
import RecipeCardDetail from './components/RecipeCardDetail';
import SavedRecipesPage from './pages/SavedRecipesPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import FavoritesDrawer from './components/FavoritesDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminEditorModal from './components/RecipeEditorModal';
import AdminLoginModal from './components/AdminLoginModal';
import Footer from './components/Footer';

function MainAppContent() {
  const { currentPage, activeRecipe, toastMessage } = useRecipeContext();

  // If in Admin Portal mode, render dedicated Admin view
  if (currentPage === 'admin') {
    return (
      <>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'var(--brand-espresso)',
            color: '#FFFFFF',
            padding: '0.9rem 1.5rem',
            borderRadius: '100px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 2000,
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {toastMessage}
          </div>
        )}
        <AdminPage />
        <AdminEditorModal />
        <AdminDashboard />
        <AdminLoginModal />
      </>
    );
  }

  const renderCurrentPage = () => {
    if (activeRecipe || currentPage === 'detail') {
      return <RecipeCardDetail />;
    }

    switch (currentPage) {
      case 'recipes':
        return <RecipeIndexPage />;
      case 'saved':
        return <SavedRecipesPage />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--brand-espresso)',
          color: '#FFFFFF',
          padding: '0.9rem 1.5rem',
          borderRadius: '100px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 2000,
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid var(--brand-chestnut)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Sticky Navigation */}
      <Navbar />

      {/* Main Dynamic View Area */}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Drawers & Modals */}
      <FavoritesDrawer />
      <AdminEditorModal />
      <AdminDashboard />
      <AdminLoginModal />

      {/* Mobile Fixed Action Bar */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <MainAppContent />
    </RecipeProvider>
  );
}
