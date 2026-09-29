import React from 'react';
import { Instagram, Youtube, Sparkles, ExternalLink, Heart } from 'lucide-react';

export default function SocialFeed() {
  const instagramPosts = [
    {
      id: 'ig-1',
      title: 'Sunday Jollof & Fried Croaker Fish platter 🐟🔥',
      likes: '3.4k',
      comments: '184',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.instagram.com/eboses_kitchen_kronikles'
    },
    {
      id: 'ig-2',
      title: 'Behind the scenes: Grinding fresh Suya Yaji spice mix 🌶️',
      likes: '2.8k',
      comments: '122',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.instagram.com/eboses_kitchen_kronikles'
    },
    {
      id: 'ig-3',
      title: 'Golden Puff Puff drizzled with organic honey 🍯✨',
      likes: '4.1k',
      comments: '210',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.instagram.com/eboses_kitchen_kronikles'
    },
    {
      id: 'ig-4',
      title: '20-Minute Creamy Suya Prawn Pasta night 🍝🍤',
      likes: '5.2k',
      comments: '340',
      image: 'https://images.unsplash.com/photo-1555949258-eb67b2808200?auto=format&fit=crop&w=600&q=80',
      link: 'https://www.instagram.com/eboses_kitchen_kronikles'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-light)',
      borderBottom: '1px solid var(--border-light)',
      padding: '4rem 1.5rem',
      marginTop: '2rem'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <div>
            <div className="badge badge-terracotta" style={{ marginBottom: '0.6rem' }}>
              <Instagram size={14} /> @eboses_kitchen_kronikles
            </div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--brand-forest)', fontWeight: 800 }}>
              Follow the Kitchen Kronikles Journey
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Real-time recipe video reels, kitchen bloopers, and community cooking tips.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <a
              href="https://www.instagram.com/eboses_kitchen_kronikles"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.88rem' }}
            >
              <Instagram size={16} color="#E1306C" />
              <span>Instagram</span>
              <ExternalLink size={14} />
            </a>

            <a
              href="https://youtube.com/@eboses_space"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              <Youtube size={16} color="#FF0000" />
              <span>Ebose’s Space on YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Instagram Grid Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                backgroundColor: 'var(--bg-tertiary)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.6rem',
                  right: '0.6rem',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  borderRadius: '100px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  <Instagram size={12} color="#FFFFFF" />
                  IG Reels
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#FFFFFF' }}>
                <p style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--brand-forest)',
                  lineHeight: 1.4,
                  margin: '0 0 0.5rem 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.title}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Heart size={14} fill="var(--brand-terracotta)" color="var(--brand-terracotta)" /> {post.likes}
                  </span>
                  <span>💬 {post.comments} comments</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
