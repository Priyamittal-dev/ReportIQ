import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import './index.css';

function App() {
  const [accepted, setAccepted] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  
  // Floating hearts logic
  const hearts = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    size: Math.random() * 20 + 10
  }));

  const handleNoHover = () => {
    if (noBtnRef.current) {
      // Calculate random position within window bounds
      const x = Math.random() * (window.innerWidth - 150);
      const y = Math.random() * (window.innerHeight - 60);
      
      noBtnRef.current.style.position = 'fixed';
      noBtnRef.current.style.left = `${Math.max(0, x)}px`;
      noBtnRef.current.style.top = `${Math.max(0, y)}px`;
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  return (
    <>
      {/* Background Hearts */}
      {hearts.map((h) => (
        <Heart 
          key={h.id}
          className="heart"
          color="#ff4d6d"
          fill="#ffb3c1"
          style={{ 
            left: h.left, 
            animationDuration: h.animationDuration,
            animationDelay: h.animationDelay,
            width: `${h.size}px`,
            height: `${h.size}px`
          }} 
        />
      ))}

      <div className="container">
        {!accepted ? (
          <>
            <h1>Will you marry me? 💍</h1>
            <p className="message">
              You are the best thing that has ever happened to me. I want to spend the rest of my life making you smile, laughing together, and building our beautiful future.
            </p>
            
            <div className="buttons">
              <button className="yes-btn" onClick={handleYesClick}>
                YES! ❤️
              </button>
              <button 
                ref={noBtnRef}
                className="no-btn" 
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
              >
                No 😢
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>She said YES! 🎊❤️</h1>
            <p className="message">
              I can't wait to spend forever with you. I love you!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Heart color="#c9184a" fill="#ff4d6d" size={48} />
              <Heart color="#c9184a" fill="#ff4d6d" size={48} />
              <Heart color="#c9184a" fill="#ff4d6d" size={48} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
