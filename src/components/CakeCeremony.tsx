import React from 'react';
import { motion } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { Sparkles } from 'lucide-react';

interface CakeCeremonyProps {
  onComplete: () => void;
}

export const CakeCeremony: React.FC<CakeCeremonyProps> = ({ onComplete }) => {
  const [isCut, setIsCut] = React.useState(false);
  const [knifePosition, setKnifePosition] = React.useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = React.useState<{ x: number; y: number }[]>([]);
  const [sliceOffset, setSliceOffset] = React.useState(0);

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], down, velocity }) => {
      if (down && !isCut) {
        setKnifePosition({ x: mx, y: my });
        if (my > 100) {
          setSliceOffset(Math.min(100, my - 100));
        }
        if (my > 200 && velocity[1] > 0.5) {
          setIsCut(true);
          createConfetti();
          setTimeout(onComplete, 3000);
        }
      }
    },
  });

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setConfetti(newConfetti);
  };

  return (
    <motion.div
      className="w-full h-screen bg-pink-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-3xl mb-8 text-pink-600 font-semibold text-center">
        {!isCut ? (
          <span>✨ Drag down to cut the cake! ✨</span>
        ) : (
          <span>🎉 Happy Birthday Madam Jiiii! 🎉</span>
        )}
      </div>

      <div className="relative w-80 h-80" {...bind()} style={{ touchAction: 'none' }}>
        {/* Cake Base */}
        <motion.div
          className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-pink-200 to-pink-300 rounded-lg shadow-lg"
          style={{
            transformOrigin: 'center bottom',
            transform: isCut ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {/* Cake Layers */}
          <div className="absolute bottom-0 w-full">
            <div className="h-32 bg-gradient-to-b from-pink-300 to-pink-400 rounded-t-lg">
              {/* Frosting drips */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-6 h-8 bg-pink-200"
                  style={{
                    left: `${i * 14.28}%`,
                    borderRadius: '0 0 12px 12px',
                  }}
                  initial={{ y: -8 }}
                  animate={{ y: [-8, -6, -8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Cake Slice (appears when cutting) */}
          {sliceOffset > 0 && (
            <motion.div
              className="absolute w-full"
              style={{
                height: `${sliceOffset}%`,
                bottom: 0,
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(to bottom, #f9a8d4 0%, #f472b6 100%)',
                transformOrigin: 'bottom center',
              }}
              animate={isCut ? { y: 20, opacity: 0 } : {}}
            />
          )}

          {/* Candles */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-full w-2 h-8"
              style={{
                left: `${30 + i * 20}%`,
                background: 'linear-gradient(to bottom, #fcd34d 0%, #fbbf24 100%)',
                transformOrigin: 'bottom center',
              }}
              animate={isCut ? { scaleY: 0 } : {
                rotate: [0, 2, -2, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4"
                style={{
                  background: 'radial-gradient(circle, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Knife */}
        {!isCut && (
          <motion.div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              width: 40,
              height: 120,
              x: knifePosition.x,
              y: knifePosition.y,
              rotate: Math.min(45, Math.max(-45, knifePosition.x * 0.2)),
            }}
          >
            <div className="w-full h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full" />
            <div className="w-4 h-40 mx-auto bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg" />
          </motion.div>
        )}

        {/* Confetti */}
        {isCut && confetti.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: pos.x, y: pos.y, scale: 0 }}
            animate={{
              y: [pos.y, pos.y - 200],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Sparkles className="text-yellow-500" size={24} />
          </motion.div>
        ))}
      </div>

      {isCut && (
        <motion.div
          className="mt-8 text-2xl text-pink-600 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Make a wish! ⭐️
        </motion.div>
      )}
    </motion.div>
  );
};