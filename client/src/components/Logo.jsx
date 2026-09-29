import React, { useState } from 'react';

export default function Logo({ color = 'var(--brand-espresso)', height = 85, isDarkBg = false }) {
  const [imageError, setImageError] = useState(false);

  if (!imageError) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: `${height}px`,
          cursor: 'pointer',
          userSelect: 'none'
        }}
        className="logo-image-wrapper"
      >
        <img
          src="/logo-clean.png"
          alt="Ebose's Space"
          onError={() => setImageError(true)}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
            // If on dark background, invert logo to crisp white; otherwise show natural dark espresso tone
            filter: isDarkBg ? 'brightness(0) invert(1)' : 'none'
          }}
        />
      </div>
    );
  }

  // Fallback vector SVG if image fails to load
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: `${height}px`,
        cursor: 'pointer',
        userSelect: 'none'
      }}
      className="logo-vector-wrapper"
    >
      <svg
        viewBox="0 0 300 300"
        style={{
          height: '100%',
          width: 'auto',
          overflow: 'visible'
        }}
      >
        <path
          d="M 150 18 A 132 132 0 1 1 149.9 18"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray="750"
          strokeDashoffset="20"
        />
        <text
          x="150"
          y="168"
          textAnchor="middle"
          fill={color}
          style={{
            fontFamily: "'Playfair Display', 'Brush Script MT', cursive, serif",
            fontSize: "62px",
            fontStyle: "italic",
            fontWeight: "500",
            letterSpacing: "-0.01em"
          }}
        >
          Ebose's space
        </text>
      </svg>
    </div>
  );
}
