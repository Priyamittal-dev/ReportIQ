import React, { useRef, useState, useEffect } from 'react';
import { Eye, Sparkles, Maximize2 } from 'lucide-react';
import { sound } from '../audio/soundEngine';

export interface Artwork {
  id: string;
  title: string;
  subtitle: string;
  dimension: string;
  image: string;
  description: string;
  tags: string[];
  depthRatio: number;
  stats: {
    intensity: string;
    freq: string;
    parsecs: string;
  };
}

interface PopoutCardProps {
  artwork: Artwork;
  mode: '3d' | '5d' | '8d' | 'anaglyph';
  depthMultiplier: number;
  onOpenModal: (artwork: Artwork) => void;
  isSpotlight?: boolean;
}

export const PopoutCard: React.FC<PopoutCardProps> = ({
  artwork,
  mode,
  depthMultiplier,
  onOpenModal,
  isSpotlight = false,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -18 * (depthMultiplier * 0.4 + 0.6);
    const rotY = ((x - centerX) / centerX) * 22 * (depthMultiplier * 0.4 + 0.6);

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playPop();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Gyroscope tilt support for mobile phones
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        // gamma is left-to-right (-90 to 90)
        // beta is front-to-back (-180 to 180)
        const rotY = Math.max(-25, Math.min(25, event.gamma * 0.8 * depthMultiplier));
        const rotX = Math.max(-25, Math.min(25, (event.beta - 45) * -0.6 * depthMultiplier));
        setRotateX(rotX);
        setRotateY(rotY);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [depthMultiplier]);

  const popZ = Math.round(55 * depthMultiplier * artwork.depthRatio);
  const floatingHudZ = Math.round(85 * depthMultiplier);

  return (
    <div
      className={`popout-card-container ${isSpotlight ? 'spotlight-container' : ''} mode-${mode}`}
      style={{ perspective: '1200px' }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(artwork)}
    >
      <div
        className={`popout-card ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Holographic Specular Glare */}
        <div
          className="card-glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
            opacity: isHovered ? 0.7 : 0.2,
          }}
        />

        {/* Deep Backdrop Glow */}
        <div className="card-backdrop-glow" />

        {/* 3D Frame Base */}
        <div className="card-frame">
          <div className="frame-corner top-left" />
          <div className="frame-corner top-right" />
          <div className="frame-corner bottom-left" />
          <div className="frame-corner bottom-right" />

          <div className="card-header-hud">
            <span className="hud-badge">{artwork.dimension}</span>
            <div className="hud-dots">
              <span className="dot dot-live" />
              <span className="hud-label">POP-OUT ACTIVE</span>
            </div>
          </div>
        </div>

        {/* The 3D Pop-Out Image Canvas */}
        <div
          className="popout-image-layer"
          style={{
            transform: `translateZ(${popZ}px) scale(${1 + 0.03 * depthMultiplier})`,
          }}
        >
          {/* Anaglyph Cyan/Red Split Layers */}
          {mode === 'anaglyph' ? (
            <div className="anaglyph-wrapper">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="popout-img anaglyph-red"
                style={{ transform: `translateX(${-5 * depthMultiplier}px)` }}
              />
              <img
                src={artwork.image}
                alt={artwork.title}
                className="popout-img anaglyph-cyan"
                style={{ transform: `translateX(${5 * depthMultiplier}px)` }}
              />
            </div>
          ) : (
            <div className="popout-img-wrapper">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="popout-img"
              />
              {/* Shattered Dimensional Light Overlay */}
              <div className="dimensional-shine" />
            </div>
          )}

          {/* 5D Holographic Scanlines */}
          {(mode === '5d' || mode === '8d') && <div className="holo-scanlines" />}
        </div>

        {/* Floating 3D Telemetry HUD (Pops out even further than the image!) */}
        <div
          className="card-floating-hud"
          style={{
            transform: `translateZ(${floatingHudZ}px)`,
          }}
        >
          <div className="floating-badge-group">
            <span className="stat-pill">
              <Sparkles size={12} /> {artwork.stats.intensity}
            </span>
            <span className="stat-pill">
              <Eye size={12} /> {artwork.stats.freq}
            </span>
          </div>

          <button
            className="maximize-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(artwork);
            }}
            title="Full 3D Lightbox"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Bottom Content Info Card */}
        <div
          className="card-content-shelf"
          style={{
            transform: `translateZ(${Math.round(40 * depthMultiplier)}px)`,
          }}
        >
          <div className="shelf-title-row">
            <h3 className="artwork-title">{artwork.title}</h3>
            <span className="artwork-dim-tag">{artwork.dimension}</span>
          </div>
          <p className="artwork-desc">{artwork.description}</p>
          <div className="tags-row">
            {artwork.tags.map((tag, i) => (
              <span key={i} className="tech-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
