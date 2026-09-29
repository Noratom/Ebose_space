import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { Instagram, Youtube, Facebook, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const { showToast, setCurrentPage, siteContent } = useRecipeContext();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Welcome! Free recipes sent to ${email} 🎉`);
    setFirstName('');
    setEmail('');
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* Top Breadcrumb & Title Container */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        {/* Breadcrumbs */}
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: '0.6rem'
        }}>
          EBOSE’S KITCHEN KRONIKLES › ABOUT ME
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.2rem',
          fontWeight: 500,
          color: 'var(--brand-plum)',
          lineHeight: 1.1,
          marginBottom: '2.5rem'
        }}>
          About Me
        </h1>

        {/* ========================================================================= */}
        {/* 1. HERO SPLIT SECTION (From Screenshot 1)                                */}
        {/* ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 440px) 1fr',
          gap: '3.5rem',
          alignItems: 'start',
          marginBottom: '4rem'
        }}>
          {/* Left Large Portrait Image */}
          <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <img
              src={siteContent?.chefImage || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"}
              alt="Ebose in the kitchen"
              style={{ width: '100%', height: '480px', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Right Text Content */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-subheading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--brand-charcoal)',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              {siteContent?.aboutMeTitle || "HI, MY NAME IS ebose!"}
            </h2>

            <p style={{
              fontSize: '1.15rem',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              color: 'var(--brand-plum)',
              marginBottom: '1.5rem',
              lineHeight: 1.4
            }}>
              {siteContent?.aboutMeSubtitle || "And Ebose’s Kitchen Kronikles is my little corner of the internet!"}
            </p>

            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.4rem' }}>
              {siteContent?.aboutMeText || "I’m the voice, author, and creator behind Ebose’s Kitchen Kronikles. What started as a passionate culinary hobby celebrating authentic West African heritage has now grown into a full-fledged food destination that reaches food lovers across the globe each month."}
            </p>

            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {siteContent?.aboutMeFavorites || "My favorite things in life are a big plate of smoky party Jollof rice with fried plantains, spicy Yaji suya skewers, sunny days, and sharing video walkthroughs with our amazing community."}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PLUM SIGNUP & FOLLOW BAR (From Screenshot 1 Middle Banner)             */}
      {/* ========================================================================= */}
      <section style={{
        backgroundColor: 'var(--brand-plum)',
        color: '#FFFFFF',
        padding: '2.2rem 0',
        marginBottom: '4rem'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          {/* Follow Us Social Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FFFFFF' }}>
              FOLLOW US
            </span>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <a href="https://www.instagram.com/eboses_kitchen_kronikles" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
                <Instagram size={22} />
              </a>
              <a href="https://youtube.com/@eboses_space" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
                <Youtube size={22} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
                <Facebook size={22} />
              </a>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.4rem', color: '#FFFFFF', marginRight: '0.4rem' }}>
              signup
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em', uppercase: 'true', color: '#E2D5E0', marginRight: '0.6rem' }}>
              FOR EMAIL UPDATES
            </span>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ padding: '0.65rem 0.9rem', border: 'none', borderRadius: '2px', fontSize: '0.88rem', minWidth: '130px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.65rem 0.9rem', border: 'none', borderRadius: '2px', fontSize: '0.88rem', minWidth: '180px' }}
              required
            />
            <button type="submit" className="go-btn">
              GO
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "I LOVE FOOD!" SECTION (From Screenshot 2)                            */}
      {/* ========================================================================= */}
      <div className="container-narrow" style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-subheading)',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--brand-charcoal)',
          marginBottom: '1.2rem'
        }}>
          I LOVE FOOD!
        </h2>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
          In this space, I am always sharing fresh, flavorful, and soul-satisfying recipes that I love to make and eat in my real, actual, everyday life. If I wouldn't eat it in real life, I won't put it on the blog. My goal is to inspire you with food that is both approachable AND exciting, whether you're cooking for yourself, your family, or your friends. I want you to be so excited about these recipes that you eagerly await 5pm when you can go home and start cooking.
        </p>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          On a related note, I absolutely LOVE seeing the food that you're making. It will make my day if you tag <a href="https://www.instagram.com/eboses_kitchen_kronikles" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-plum)', fontWeight: 700 }}>@eboses_kitchen_kronikles</a> in your Instagram photos and stories! We love to shout out our favorites on Fridays with our Reader Awards on Instagram Stories.
        </p>

        {/* Large Kitchen Lifestyle Photo */}
        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '3.5rem' }}>
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
            alt="Ebose preparing recipes in the kitchen"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 4. "GOING DEEPER" SECTION (From Screenshot 3)                            */}
        {/* ========================================================================= */}
        <h2 style={{
          fontFamily: 'var(--font-subheading)',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--brand-charcoal)',
          marginBottom: '1.2rem'
        }}>
          GOING DEEPER
        </h2>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Along with all the recipes, I also use the blog to share bits and pieces of my life outside the kitchen — from photos of my favorite culinary trips, to reflections on flavor fusion, to life with family.
        </p>

        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          <li style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: 'var(--brand-charcoal)' }}>West African Culinary Heritage:</strong> From authentic firewood party Jollof to royal lumpy Egusi soup, exploring the deep roots of soul food traditions.
          </li>
          <li style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: 'var(--brand-charcoal)' }}>30-Minute Dinner Rush:</strong> Modern fusion dishes designed for busy weeknights when you want gourmet flavor without hours in the kitchen.
          </li>
          <li style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: 'var(--brand-charcoal)' }}>Kitchen Kronikles Community:</strong> Video walkthroughs and step-by-step reels on <a href="https://youtube.com/@eboses_space" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-plum)', fontWeight: 700 }}>YouTube @eboses_space</a> and Instagram.
          </li>
        </ul>
      </div>

      {/* ========================================================================= */}
      {/* 5. BLUE "FOOD BLOGGER PRO / STUDIO" BANNER (From Screenshot 3 Bottom)     */}
      {/* ========================================================================= */}
      <section style={{
        backgroundColor: '#0984C5',
        color: '#FFFFFF',
        padding: '3.5rem 0',
        marginBottom: '4rem'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
              START & GROW YOUR FOOD BLOG WITH
            </span>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#0984C5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              margin: '0 auto',
              boxShadow: 'var(--shadow-md)'
            }}>
              KITCHEN STUDIO
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-subheading)', fontWeight: 800, marginBottom: '0.8rem' }}>
              EBOSE’S KITCHEN KRONIKLES STUDIO
            </h3>
            <p style={{ fontSize: '0.98rem', color: '#E2F2FB', lineHeight: 1.7 }}>
              As we grew the blog into a full culinary brand, we built a community around recipe development, food photography, and digital video production. We love sharing resources and helping fellow home chefs share their culinary creations!
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. "OUR TEAM" SECTION (From Screenshot 4)                                */}
      {/* ========================================================================= */}
      <div className="container-narrow" style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: 'var(--font-subheading)',
          fontSize: '1.6rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: 'var(--brand-charcoal)',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          OUR TEAM
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
          We have an entire team behind us at Ebose’s Kitchen Kronikles who are experts in recipe development, video production, reader support, and social media. They are EVERYTHING!
        </p>

        {/* Team Members List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', textAlign: 'left' }}>
          {(siteContent?.teamMembers || [
            {
              name: 'EBOSE',
              role: 'FOUNDER & HEAD CHEF',
              bio: 'Ebose is the voice, author, and recipe developer behind Ebose’s Kitchen Kronikles. She develops recipes and writes content for the blog, Instagram, and YouTube channel.',
              imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80'
            },
            {
              name: 'CHEF MARCUS',
              role: 'CULINARY ADVISOR & TASTE TESTER',
              bio: 'Marcus is the chief culinary consultant, taste tester, and video production strategist at Kitchen Kronikles.',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            },
            {
              name: 'AMINA',
              role: 'COMMUNICATIONS MANAGER',
              bio: 'Amina is the Communications Manager at Ebose’s Kitchen Kronikles. She manages day-to-day community interaction with readers and brands.',
              imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            }
          ]).map((member, idx) => (
            <div key={member.id || idx} style={{ display: 'flex', gap: '2rem', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <img
                src={member.imageUrl || member.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={member.name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '3px solid var(--brand-chestnut)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-subheading)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: 'var(--brand-plum)',
                    margin: 0
                  }}>
                    {member.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--brand-chestnut)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                    {member.role}
                  </span>
                </div>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
