import React, { useEffect, useRef, useState } from 'react';
import { X, Sliders, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Artwork } from './PopoutCard';
import { sound } from '../audio/soundEngine';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  mode: '3d' | '5d' | '8d' | 'anaglyph';
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  mode,
}) => {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [customDepth, setCustomDepth] = useState(2.8);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

  useEffect(() => {
    if (artwork) {
      sound.playWarp();
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff0055', '#a855f7'],
      });
    }
  }, [artwork]);

  if (!artwork) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setRotY(dragStartRef.current.rotY + dx * 0.4);
    setRotX(dragStartRef.current.rotX - dy * 0.4);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1);
    setCustomDepth(2.8);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="modal-theater"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1600px' }}
      >
        {/* Top Bar */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="dimension-pill">{artwork.dimension}</span>
            <h2 className="modal-title">{artwork.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={24} />
          </button>
        </div>

        {/* 3D Interactive Stage */}
        <div
          className="modal-3d-stage"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className={`theater-card mode-${mode}`}
            style={{
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {/* Holographic Aura */}
            <div className="theater-aura" />

            {/* Behind Frame Glow */}
            <div className="theater-glow-frame" />

            {/* The Image popping out */}
            <div
              className="theater-popout-img-box"
              style={{
                transform: `translateZ(${Math.round(80 * customDepth)}px)`,
              }}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className="theater-img"
              />
              <div className="screen-reflection" />
            </div>

            {/* Floating Particle Shards Layer */}
            <div
              className="theater-shards-layer"
              style={{
                transform: `translateZ(${Math.round(130 * customDepth)}px)`,
              }}
            >
              <div className="floating-shard shard-1" />
              <div className="floating-shard shard-2" />
              <div className="floating-shard shard-3" />
            </div>
          </div>
        </div>

        {/* Modal Controls Dock */}
        <div className="modal-dock">
          <div className="dock-hint">
            <span>🖱️ Drag to rotate 3D angle freely</span>
          </div>

          <div className="dock-controls">
            <div className="dock-slider-item">
              <Sliders size={16} />
              <span>Pop-Out: {customDepth.toFixed(1)}x</span>
              <input
                type="range"
                min="1.0"
                max="4.5"
                step="0.2"
                value={customDepth}
                onChange={(e) => setCustomDepth(parseFloat(e.target.value))}
                className="neon-range-slider mini"
              />
            </div>

            <div className="dock-btn-group">
              <button
                className="dock-tool-btn"
                onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                className="dock-tool-btn"
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                className="dock-tool-btn"
                onClick={handleReset}
                title="Reset View"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
