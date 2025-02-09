import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Gift, Sparkles, Trash2, Music } from 'lucide-react';

const DecorationType = {
  HEART: 0,
  STAR: 1,
  GIFT: 2
};

const COLORS = {
  [DecorationType.HEART]: ['text-pink-500', 'text-red-500', 'text-purple-500'],
  [DecorationType.STAR]: ['text-yellow-400', 'text-purple-500', 'text-blue-400'],
  [DecorationType.GIFT]: ['text-red-500', 'text-green-500', 'text-blue-500']
};

// Musical notes for each decoration type
const NOTES = {
  [DecorationType.HEART]: ['C4', 'E4', 'G4'],
  [DecorationType.STAR]: ['D4', 'F4', 'A4'],
  [DecorationType.GIFT]: ['E4', 'G4', 'B4']
};

interface Decoration {
  id: string;
  x: number;
  y: number;
  type: number;
  size: number;
  color: string;
  rotation: number;
  note: string;
}

interface RoomProps {
  onComplete: () => void;
  isLightOn: boolean;
}

export const Room: React.FC<RoomProps> = ({ onComplete, isLightOn }) => {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [selectedTool, setSelectedTool] = useState(DecorationType.HEART);
  const [selectedDecoration, setSelectedDecoration] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const playNote = (note: string) => {
    if (isMuted || !audioContext.current) return;

    // Convert note name to frequency
    const noteToFreq: { [key: string]: number } = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63,
      'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
      'B4': 493.88
    };

    const frequency = noteToFreq[note];
    
    // Create and configure oscillator
    const osc = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.5);
  };

  const addDecoration = (x: number, y: number) => {
    if (isErasing) return;
    
    const note = NOTES[selectedTool][Math.floor(Math.random() * NOTES[selectedTool].length)];
    playNote(note);
    
    const newDecoration: Decoration = {
      id: `dec-${Date.now()}`,
      x,
      y,
      type: selectedTool,
      size: Math.random() * 16 + 24,
      color: COLORS[selectedTool][Math.floor(Math.random() * COLORS[selectedTool].length)],
      rotation: Math.random() * 360,
      note
    };
    setDecorations([...decorations, newDecoration]);
  };

  const handleDecorationClick = (e: React.MouseEvent, decoration: Decoration) => {
    e.stopPropagation();
    if (isErasing) {
      setDecorations(decorations.filter(d => d.id !== decoration.id));
      playNote(decoration.note); // Play note when removing
    } else {
      setSelectedDecoration(selectedDecoration === decoration.id ? null : decoration.id);
      playNote(decoration.note); // Play note when selecting
    }
  };

  const renderDecoration = (decoration: Decoration) => {
    const isSelected = selectedDecoration === decoration.id;
    const props = {
      size: decoration.size,
      className: `${decoration.color} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`,
      style: { 
        transform: `rotate(${decoration.rotation}deg)`,
        animation: 'sparkle 1.5s infinite'
      }
    };

    switch (decoration.type) {
      case DecorationType.HEART:
        return <Heart {...props} />;
      case DecorationType.STAR:
        return <Star {...props} />;
      case DecorationType.GIFT:
        return <Gift {...props} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`w-full h-screen relative transition-all duration-1000 ${
        isLightOn ? 'bg-pink-50' : 'bg-gray-900'
      } ${isErasing ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        addDecoration(e.clientX - rect.left, e.clientY - rect.top);
      }}
    >
      {isLightOn && (
        <>
          {/* Toolbar */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex gap-2">
            {Object.values(DecorationType).map((type) => (
              <motion.button
                key={type}
                className={`p-2 rounded-full ${
                  selectedTool === type ? 'bg-pink-100' : 'hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTool(type);
                  setIsErasing(false);
                }}
              >
                {type === DecorationType.HEART && <Heart className="text-pink-500" />}
                {type === DecorationType.STAR && <Star className="text-yellow-400" />}
                {type === DecorationType.GIFT && <Gift className="text-red-500" />}
              </motion.button>
            ))}
            <motion.button
              className={`p-2 rounded-full ${
                isErasing ? 'bg-red-100' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsErasing(!isErasing);
              }}
            >
              <Trash2 className="text-red-500" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-full ${
                isMuted ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
            >
              <Music className={isMuted ? 'text-gray-400' : 'text-blue-500'} />
            </motion.button>
          </div>

          {/* Decorations */}
          {decorations.map((decoration) => (
            <motion.div
              key={decoration.id}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: decoration.x - decoration.size / 2,
                y: decoration.y - decoration.size / 2
              }}
              whileHover={{ scale: 1.1 }}
              drag={!isErasing}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                const updatedDecorations = decorations.map(d => {
                  if (d.id === decoration.id) {
                    return {
                      ...d,
                      x: d.x + info.offset.x,
                      y: d.y + info.offset.y
                    };
                  }
                  return d;
                });
                setDecorations(updatedDecorations);
                playNote(decoration.note); // Play note when finishing drag
              }}
              onClick={(e) => handleDecorationClick(e, decoration)}
            >
              {renderDecoration(decoration)}
            </motion.div>
          ))}

          {/* Continue Button */}
          {decorations.length >= 6 && (
            <motion.button
              className="fixed bottom-8 right-8 bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
            >
              <Sparkles className="w-5 h-5" />
              Continue to Cake Ceremony →
            </motion.button>
          )}

          <style jsx>{`
            @keyframes sparkle {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.1) rotate(5deg); }
            }
          `}</style>
        </>
      )}
    </motion.div>
  );
};

export default Room;