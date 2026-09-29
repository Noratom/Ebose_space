import React from 'react';
import { X, Download, BookOpen, CheckCircle, Sparkles } from 'lucide-react';

export default function ECookbookModal({ isOpen, onClose, subscriberEmail = '' }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate simulated downloadable E-Cookbook text file / PDF blob
    const content = `=====================================================
EBOSE'S SPACE — TOP 10 WEST AFRICAN SIGNATURE RECIPES
=====================================================

Thank you for subscribing to Ebose's Space newsletter (${subscriberEmail})!
Here is your official complimentary mini e-cookbook download.

RECIPES INCLUDED:
1. Authentic Smoky Party Jollof Rice
2. Creamy Suya Pepper Skillet Pasta
3. Lumpy Egusi Soup with Pounded Yam
4. Salted Honey Puff Puff & Chocolate Dip
5. Spicy Asun (Peppered Goat Meat)
6. Zobo Hibiscus Tropical Iced Tea
7. Soft Fluffy Agege Bread Skillet
8. Ghanaian Waakye with Shitto Sauce
9. Golden Fried Dodo Plantain Chips
10. Slow-Cooked Pepper Soup Broth

Made with love in Ebose's Space 🍲✨
Website: http://localhost:3000
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Eboses_Space_Top10_ECookbook.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(41, 28, 14, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '520px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.2rem 2rem',
        textAlign: 'center',
        border: '3px solid var(--brand-chestnut)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-espresso)'
          }}
        >
          <X size={18} />
        </button>

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
          <Sparkles size={32} color="var(--brand-cream)" />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: 'var(--brand-espresso)', fontWeight: 800, marginBottom: '0.4rem' }}>
          Welcome to Ebose’s Space! 🎉
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Your subscription for <strong>{subscriberEmail || 'your email'}</strong> is confirmed! As our gift, download your free copy of Ebose’s E-Cookbook below.
        </p>

        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-medium)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, color: 'var(--brand-espresso)', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
            <BookOpen size={18} color="var(--brand-chestnut)" />
            <span>Ebose’s Top 10 West African Classics</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Includes smoky party Jollof, Suya Skewers, Egusi Soup, and Salted Honey Puff Puff!
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.5rem', width: '100%', fontSize: '0.95rem' }}
          >
            <Download size={18} /> Download Free E-Cookbook PDF
          </button>

          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            Start Browsing Recipes
          </button>
        </div>
      </div>
    </div>
  );
}
