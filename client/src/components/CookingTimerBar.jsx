import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Clock, BellRing } from 'lucide-react';

export default function CookingTimerBar({ initialMinutes = 15, label = 'Simmer Timer', isOpen = false, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const audioCtxRef = useRef(null);

  // Play audio chime alert when timer hits 00:00 using Web Audio API
  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create double chime tone (880Hz -> 1174Hz)
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(880, now, 0.4);
      playTone(1174, now + 0.3, 0.6);
      playTone(880, now + 0.8, 0.4);
      playTone(1174, now + 1.1, 0.8);
    } catch (e) {
      console.warn('Could not play chime audio:', e);
    }
  };

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
    setIsRunning(true);
    setIsFinished(false);
  }, [initialMinutes, isOpen]);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playChimeSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleReset = () => {
    setSecondsLeft(initialMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '2rem',
      zIndex: 2000,
      backgroundColor: isFinished ? '#DC2626' : 'var(--brand-espresso)',
      color: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '0.9rem 1.4rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      border: '2px solid var(--brand-chestnut)',
      animation: isFinished ? 'badgeBounce 0.5s infinite' : 'scaleIn 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isFinished ? <BellRing size={24} className="heart-pop-active" /> : <Clock size={22} color="var(--brand-cream)" />}
        <div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, opacity: 0.85, display: 'block' }}>
            {isFinished ? '🔔 TIMER COMPLETE!' : label}
          </span>
          <strong style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em' }}>
            {formattedTime}
          </strong>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          onClick={handleReset}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Reset Timer"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            padding: '0.3rem',
            marginLeft: '0.4rem'
          }}
          title="Close Timer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
