import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import ECookbookModal from './ECookbookModal';
import { Instagram, Youtube, Facebook, Shield } from 'lucide-react';

export default function Footer() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const { showToast, setCurrentPage } = useRecipeContext();

  const handleFooterSignup = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch {
      // Ignore API errors for fallback
    }

    setSubscribedEmail(email);
    setIsModalOpen(true);
    showToast(`Welcome! Download your complimentary E-Cookbook 🎉`);
    setFirstName('');
    setEmail('');
  };

  return (
    <footer className="pinch-footer">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand Navigation */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--brand-espresso)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              EBOSE’S SPACE
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><button onClick={() => setCurrentPage('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>About Ebose</button></li>
              <li><button onClick={() => setCurrentPage('recipes')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Recipe Index</button></li>
              <li><button onClick={() => setCurrentPage('saved')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Saved Favorites</button></li>
              <li><button onClick={() => setCurrentPage('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Contact & Media</button></li>
            </ul>
          </div>

          {/* Column 2: Food & Recipes */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--brand-espresso)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              FOOD & RECIPES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li>Nigerian Party Jollof</li>
              <li>30-Minute Suya Pasta</li>
              <li>Lumpy Egusi Soup</li>
              <li>Salted Honey Puff Puff</li>
              <li>Keto Suya Lamb Chops</li>
            </ul>
          </div>

          {/* Column 3: Signup Box */}
          <div style={{
            backgroundColor: 'var(--brand-espresso)',
            color: '#FFFFFF',
            padding: '1.8rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.4rem', color: '#FFFFFF', display: 'block' }}>
              signup
            </span>
            <h5 style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: '#E1D4C2' }}>
              FOR EMAIL UPDATES & FREE ECOOKBOOK
            </h5>

            <form onSubmit={handleFooterSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', border: 'none', borderRadius: '2px', fontSize: '0.88rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', border: 'none', borderRadius: '2px', fontSize: '0.88rem' }}
                required
              />
              <button type="submit" className="go-btn" style={{ width: '100%', marginTop: '0.2rem' }}>
                GO
              </button>
            </form>
          </div>
        </div>

        {/* Social Icons Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <a href="https://www.instagram.com/eboses_kitchen_kronikles" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-espresso)' }}>
            <Instagram size={22} />
          </a>
          <a href="https://youtube.com/@eboses_space" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-espresso)' }}>
            <Youtube size={22} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-espresso)' }}>
            <Facebook size={22} />
          </a>
        </div>

        {/* Copyright & Admin Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-medium)',
          paddingTop: '1.5rem'
        }}>
          <div>
            © {new Date().getFullYear()} Ebose’s Space. All Rights Reserved.
          </div>
          <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <span>Privacy Policy • Terms</span>
            <span>•</span>
            <button
              onClick={() => setCurrentPage('admin')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-chestnut)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.78rem',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Shield size={12} /> Admin Portal Access
            </button>
          </div>
        </div>
      </div>

      {/* Automated E-Cookbook Lead Magnet Modal */}
      <ECookbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriberEmail={subscribedEmail}
      />
    </footer>
  );
}
