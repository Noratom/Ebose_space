import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Lock, X, ShieldCheck, KeyRound, User } from 'lucide-react';

export default function AdminLoginModal() {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = useRecipeContext();
  const [username, setUsername] = useState('ebose');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(false);
    const success = loginAdmin(username, password);
    if (!success) {
      setLoginError(true);
    }
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
      zIndex: 1500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '420px',
        padding: '2.2rem 2rem',
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid var(--brand-chestnut)',
        position: 'relative'
      }}>
        <button
          onClick={() => setIsAdminLoginOpen(false)}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-espresso)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem auto',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--brand-espresso)', fontWeight: 800 }}>
            Staff & Creator Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Enter your credentials to access the Ebose's Space Admin Portal
          </p>
        </div>

        {loginError && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Incorrect username or password. (Default pass: admin123)
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)', textTransform: 'uppercase' }}>
              Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ebose or admin"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--brand-espresso)', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.9rem'
                }}
                required
              />
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)', padding: '0.6rem', borderRadius: '4px' }}>
            💡 Demo Passcode: <strong>admin123</strong>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            <ShieldCheck size={18} /> Log In to Admin Portal
          </button>
        </form>
      </div>
    </div>
  );
}
