import React, { useState } from 'react';
import { ParticleWarp } from './components/ParticleWarp';
import { PopoutCard } from './components/PopoutCard';
import type { Artwork } from './components/PopoutCard';
import { ControlBar } from './components/ControlBar';
import { ArtworkModal } from './components/ArtworkModal';
import { Sparkles, Compass, Shield, Cpu, Zap } from 'lucide-react';

const ARTWORKS: Artwork[] = [
  {
    id: 'cyber-dragon',
    title: 'NEON CYBER DRAGON',
    subtitle: 'Holographic Frame Breach',
    dimension: '8D HYPER-POP',
    image: '/images/cyber_dragon.jpg',
    description:
      'Shattered holographic glass explodes forward into real physical space as a dual-headed neon dragon lunges right out of the frame.',
    tags: ['Cyberpunk', 'Hologram', 'PopOut', 'GlassBreach'],
    depthRatio: 1.3,
    stats: {
      intensity: '99.8%',
      freq: '840 THz',
      parsecs: '0.02 ly',
    },
  },
  {
    id: 'cosmic-portal',
    title: 'COSMIC SINGULARITY',
    subtitle: 'Dimension Warp Inversion',
    dimension: '8D COSMIC',
    image: '/images/cosmic_portal.jpg',
    description:
      'An accretion disk gravitational wormhole rupturing beyond the confines of its frame, spilling starry spiral galaxy arms into the room.',
    tags: ['Cosmic', 'BlackHole', 'Wormhole', 'DeepSpace'],
    depthRatio: 1.2,
    stats: {
      intensity: '100%',
      freq: '999 EHz',
      parsecs: 'Infinity',
    },
  },
  {
    id: 'cyber-jaguar',
    title: 'CYBERNETIC APEX PANTHER',
    subtitle: 'Laser Grid Rupture',
    dimension: '5D HOLOGRAPH',
    image: '/images/cyber_jaguar.jpg',
    description:
      'Electrified robotic predator lunging straight out of a glowing curved monitor with razor chrome claws reaching directly for the viewer.',
    tags: ['Robotics', 'Mecha', 'Predator', 'NeonTokyo'],
    depthRatio: 1.35,
    stats: {
      intensity: '97.4%',
      freq: '612 THz',
      parsecs: '0.001 ly',
    },
  },
  {
    id: 'crystal-phoenix',
    title: 'ASTRAL CRYSTAL PHOENIX',
    subtitle: 'Solar Relic Ascension',
    dimension: '8D TRANSCENDENT',
    image: '/images/crystal_phoenix.jpg',
    description:
      'A blazing crystal phoenix bursting out of an ancient rune portal, radiant crystalline wings expanding outward far past the borders.',
    tags: ['Astral', 'Phoenix', 'CrystalFire', 'AncientTech'],
    depthRatio: 1.3,
    stats: {
      intensity: '98.9%',
      freq: '780 THz',
      parsecs: 'Solar Core',
    },
  },
];

export const App: React.FC = () => {
  const [mode, setMode] = useState<'3d' | '5d' | '8d' | 'anaglyph'>('8d');
  const [depth, setDepth] = useState<number>(2.5);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <div className={`dimension-root mode-${mode}`}>
      {/* Dynamic Background Particle Warp Canvas */}
      <ParticleWarp mode={mode} />

      {/* Futuristic Background Ambient Glows */}
      <div className="ambient-spotlight ambient-left" />
      <div className="ambient-spotlight ambient-right" />

      <div className="app-container">
        {/* Top Futuristic Header */}
        <header className="app-header">
          <div className="brand-logo">
            <div className="logo-holo-cube">
              <span className="cube-inner">8D</span>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">
                DIMENSION<span className="text-glow">X</span>
              </h1>
              <p className="brand-subtitle">HYPER-DEPTH 3D / 5D / 8D VISUAL ENGINE</p>
            </div>
          </div>

          <div className="header-status">
            <div className="status-pill">
              <span className="pulse-dot" />
              <span>OUT-OF-SCREEN DEPTH: ACTIVE</span>
            </div>
            <div className="status-pill tech">
              <Cpu size={14} />
              <span>STEREOSCOPIC TILT ON</span>
            </div>
          </div>
        </header>

        {/* Hero Banner Text */}
        <section className="hero-section">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>MIND-BLOWING 3D POP-OUT EFFECT</span>
          </div>
          <h2 className="hero-heading">
            Images Breaking <span className="gradient-text">Out of the Screen</span>
          </h2>
          <p className="hero-desc">
            Move your mouse or tilt your mobile phone to experience true stereoscopic depth.
            Characters, claws, and cosmic debris literally float in the space in front of your display.
          </p>
        </section>

        {/* Interactive Control Dashboard */}
        <ControlBar
          mode={mode}
          setMode={setMode}
          depth={depth}
          setDepth={setDepth}
        />

        {/* Spotlight Showcase (Hero Artwork) */}
        <section className="spotlight-section">
          <div className="section-label">
            <Zap size={16} />
            <span>FEATURED POP-OUT BREACH</span>
          </div>
          <div className="spotlight-card-wrapper">
            <PopoutCard
              artwork={ARTWORKS[0]}
              mode={mode}
              depthMultiplier={depth}
              onOpenModal={(art) => setSelectedArtwork(art)}
              isSpotlight={true}
            />
          </div>
        </section>

        {/* Full Gallery Grid */}
        <section className="gallery-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Hyper-Dimensional Gallery</h3>
              <p className="section-subtitle">
                Hover, drag, or tap any artifact to inspect in 360° Pop-Out 3D
              </p>
            </div>
            <div className="gallery-counter">
              <span>{ARTWORKS.length} EXPANSIONS ONLINE</span>
            </div>
          </div>

          <div className="gallery-grid">
            {ARTWORKS.map((artwork) => (
              <PopoutCard
                key={artwork.id}
                artwork={artwork}
                mode={mode}
                depthMultiplier={depth}
                onOpenModal={(art) => setSelectedArtwork(art)}
              />
            ))}
          </div>
        </section>

        {/* Interactive Features Explainer Footer */}
        <section className="tech-specs-section">
          <div className="specs-grid">
            <div className="spec-card">
              <div className="spec-icon">
                <Compass size={24} />
              </div>
              <h4>Multi-Axis Parallax</h4>
              <p>
                Real-time matrix transformations dynamically calculate viewing angles, simulating
                spatial optics right before your eyes.
              </p>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <Zap size={24} />
              </div>
              <h4>Frame-Breaking Depth</h4>
              <p>
                Elements defy standard 2D viewports by protruding past borders at calculated Z-index
                elevations up to 140px.
              </p>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <Shield size={24} />
              </div>
              <h4>Mobile Gyroscope Engine</h4>
              <p>
                Physical phone rotation seamlessly maps to stereoscopic axes for an effortless
                holographic viewing experience.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <p>© 2026 DIMENSION-X • 8D Stereoscopic Pop-Out Visual Matrix</p>
        </footer>
      </div>

      {/* 3D Inspection Lightbox Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        mode={mode}
      />
    </div>
  );
};
export default App;
