import React, { useState } from 'react';
import { Volume2, VolumeX, Smartphone, Eye, Sparkles, Layers, Sliders, Zap } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface ControlBarProps {
  mode: '3d' | '5d' | '8d' | 'anaglyph';
  setMode: (mode: '3d' | '5d' | '8d' | 'anaglyph') => void;
  depth: number;
  setDepth: (depth: number) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  mode,
  setMode,
  depth,
  setDepth,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const handleToggleSound = () => {
    const active = sound.toggleSound();
    setIsAudioActive(active);
  };

  const handleModeChange = (newMode: '3d' | '5d' | '8d' | 'anaglyph') => {
    setMode(newMode);
    sound.playWarp();
  };

  return (
    <div className="control-bar-wrapper">
      <div className="control-bar-inner">
        {/* Mode Selector */}
        <div className="mode-toggle-group">
          <button
            className={`mode-tab-btn ${mode === '3d' ? 'active' : ''}`}
            onClick={() => handleModeChange('3d')}
            title="Standard 3D Stereoscopic Pop-Out"
          >
            <Layers size={16} />
            <span>3D POP-OUT</span>
          </button>

          <button
            className={`mode-tab-btn ${mode === '5d' ? 'active' : ''}`}
            onClick={() => handleModeChange('5d')}
            title="5D Holographic with Scanlines & Chromatic Aberration"
          >
            <Sparkles size={16} />
            <span>5D HOLO</span>
          </button>

          <button
            className={`mode-tab-btn ${mode === '8d' ? 'active hyper-pulse' : ''}`}
            onClick={() => handleModeChange('8d')}
            title="8D Hyper-Dimensional Warp with Particle Vortex"
          >
            <Zap size={16} />
            <span>8D HYPER-WARP</span>
          </button>

          <button
            className={`mode-tab-btn ${mode === 'anaglyph' ? 'active' : ''}`}
            onClick={() => handleModeChange('anaglyph')}
            title="Stereoscopic Red/Cyan 3D Glasses Mode"
          >
            <Eye size={16} />
            <span>ANAGLYPH 3D</span>
          </button>
        </div>

        {/* Depth Intensity Slider */}
        <div className="depth-slider-control">
          <div className="depth-header">
            <Sliders size={15} />
            <span className="depth-title">POP-OUT DEPTH:</span>
            <span className="depth-val">{depth.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="4.0"
            step="0.2"
            value={depth}
            onChange={(e) => setDepth(parseFloat(e.target.value))}
            className="neon-range-slider"
          />
          <div className="depth-presets">
            <button
              className={`preset-chip ${depth === 1.0 ? 'active' : ''}`}
              onClick={() => setDepth(1.0)}
            >
              Standard
            </button>
            <button
              className={`preset-chip ${depth === 2.5 ? 'active' : ''}`}
              onClick={() => setDepth(2.5)}
            >
              Extreme
            </button>
            <button
              className={`preset-chip ${depth === 4.0 ? 'active' : ''}`}
              onClick={() => setDepth(4.0)}
            >
              OUT OF SCREEN! 🔥
            </button>
          </div>
        </div>

        {/* Audio and Gyro indicator */}
        <div className="secondary-tools">
          <button
            className={`audio-toggle-btn ${isAudioActive ? 'active' : ''}`}
            onClick={handleToggleSound}
            title={isAudioActive ? 'Mute 8D Ambient Drone' : 'Unmute 8D Binaural Synthesizer'}
          >
            {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{isAudioActive ? '8D AUDIO ON' : '8D AUDIO'}</span>
          </button>

          <div className="gyro-badge" title="Tilt your smartphone to rotate 3D angle!">
            <Smartphone size={15} />
            <span>GYRO READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
