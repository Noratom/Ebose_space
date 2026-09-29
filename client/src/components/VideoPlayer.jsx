import React, { useState } from 'react';
import { Youtube, Instagram, Play, Film, ExternalLink } from 'lucide-react';

export function formatVideoEmbed(url) {
  if (!url || typeof url !== 'string') return { type: 'none', embedUrl: '' };

  const trimmed = url.trim();

  // TikTok detection
  if (trimmed.includes('tiktok.com')) {
    const match = trimmed.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      return {
        type: 'tiktok',
        embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}`,
        originalUrl: trimmed
      };
    }
    return { type: 'tiktok', embedUrl: trimmed, originalUrl: trimmed };
  }

  // Instagram detection
  if (trimmed.includes('instagram.com')) {
    const reelMatch = trimmed.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (reelMatch && reelMatch[2]) {
      return {
        type: 'instagram',
        embedUrl: `https://www.instagram.com/p/${reelMatch[2]}/embed/`,
        originalUrl: trimmed
      };
    }
    return { type: 'instagram', embedUrl: `${trimmed.replace(/\/$/, '')}/embed/`, originalUrl: trimmed };
  }

  // YouTube detection
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';
    if (trimmed.includes('watch?v=')) {
      videoId = trimmed.split('watch?v=')[1]?.split('&')[0];
    } else if (trimmed.includes('youtu.be/')) {
      videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
    } else if (trimmed.includes('embed/')) {
      videoId = trimmed.split('embed/')[1]?.split('?')[0];
    }
    if (videoId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
        originalUrl: trimmed
      };
    }
  }

  return { type: 'youtube', embedUrl: trimmed, originalUrl: trimmed };
}

export default function VideoPlayer({ youtubeUrl, instagramUrl, tiktokUrl, title = 'Recipe Video Tutorial' }) {
  // Determine active media platforms
  const mediaList = [];

  if (youtubeUrl) {
    const ytData = formatVideoEmbed(youtubeUrl);
    if (ytData.embedUrl) mediaList.push({ id: 'youtube', label: '🎥 YouTube Tutorial', ...ytData });
  }

  if (instagramUrl) {
    const igData = formatVideoEmbed(instagramUrl);
    if (igData.embedUrl) mediaList.push({ id: 'instagram', label: '📸 Instagram Reel', ...igData });
  }

  if (tiktokUrl) {
    const ttData = formatVideoEmbed(tiktokUrl);
    if (ttData.embedUrl) mediaList.push({ id: 'tiktok', label: '🎵 TikTok Video', ...ttData });
  }

  // Fallback default if only one raw URL was passed into youtubeUrl
  if (mediaList.length === 0 && youtubeUrl) {
    const fallback = formatVideoEmbed(youtubeUrl);
    mediaList.push({ id: fallback.type || 'youtube', label: '🎥 Video Tutorial', ...fallback });
  }

  const [activeTabId, setActiveTabId] = useState(mediaList[0]?.id || 'youtube');

  if (mediaList.length === 0) return null;

  const currentMedia = mediaList.find(m => m.id === activeTabId) || mediaList[0];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      marginBottom: '2rem'
    }}>
      {/* Video Player Header Bar with Multi-Platform Selector Tabs */}
      <div style={{
        backgroundColor: 'var(--brand-espresso)',
        color: '#FFFFFF',
        padding: '0.8rem 1.2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Film size={18} color="var(--brand-cream)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Ebose’s Video Cooking Tutorial
          </span>
        </div>

        {/* Platform Selection Pills */}
        {mediaList.length > 1 && (
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.2rem', borderRadius: '100px' }}>
            {mediaList.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveTabId(m.id)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: activeTabId === m.id ? 'var(--brand-chestnut)' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {m.id === 'youtube' && <Youtube size={13} />}
                {m.id === 'instagram' && <Instagram size={13} />}
                {m.id === 'tiktok' && <span>🎵</span>}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Embed Container Frame */}
      <div style={{ position: 'relative', paddingBottom: currentMedia.type === 'tiktok' ? '120%' : '56.25%', height: 0, overflow: 'hidden', backgroundColor: '#000000' }}>
        <iframe
          src={currentMedia.embedUrl}
          title={`${title} - ${currentMedia.label}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* External Link Notice */}
      {currentMedia.originalUrl && (
        <div style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Watch on official platform:</span>
          <a
            href={currentMedia.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--brand-chestnut)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
          >
            <span>Open in {currentMedia.type === 'tiktok' ? 'TikTok' : currentMedia.type === 'instagram' ? 'Instagram' : 'YouTube'}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
