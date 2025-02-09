import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Sparkles, Heart, Stars, Gift, Cake, PartyPopper } from 'lucide-react';
import { Room } from './components/Room';
import { CakeCeremony } from './components/CakeCeremony';
import { FinalMessage } from './components/FinalMessage';
import bgMusic from './components/epp.mp3';
import { PhotoGallery } from './components/PhotoGallery';

function BgMusic({ isPlaying }) {
  const audioRef = useRef(new Audio(bgMusic));

  useEffect(() => {
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return null;
}

function FloatingIcon({ Icon, delay }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: [-20, 0, -20],
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    >
      <Icon className="text-pink-300/70" size={24} />
    </motion.div>
  );
}

function App() {
  const [stage, setStage] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showSongMessage, setShowSongMessage] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

  const initializeMusic = () => {
    if (!isMusicPlaying) {
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
        if (currentMessageIndex === messages.length - 2) {
          setShowButtons(true);
        }
      }
    }, 3000); // Increased slightly to allow for smoother transitions

    return () => clearTimeout(messageTimer);
  }, [currentMessageIndex]);

  const handleButtonClick = () => {
    setShowSongMessage(true);
  };

  const handleSongChoice = () => {
    initializeMusic();
    setShowSongMessage(false);
    setShowFinalMessage(true);
    setTimeout(() => {
      setStage(1);
      setIsLightOn(true);
    }, 2500);
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    setIsMusicPlaying(prev => !prev);
  };

  const messages = [
    "Hey Alafia✨ It's your special day!",
    "I've prepared something magical just for you...",
    "before you begin, i want to say you are the best girl i have ever met...",
  ];

  const messageVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      y: 20
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        scale: {
          type: "spring",
          damping: 15,
          stiffness: 100
        }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      y: -20,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const floatingIcons = [Stars, Gift, Cake, PartyPopper, Heart];

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen relative overflow-hidden"
            style={{
              background: `
                linear-gradient(
                  45deg,
                  rgba(255, 111, 241, 0.3),
                  rgba(111, 0, 255, 0.3)
                ),
                radial-gradient(
                  circle at top left,
                  rgba(255, 82, 168, 0.5),
                  transparent 50%
                ),
                radial-gradient(
                  circle at top right,
                  rgba(148, 0, 255, 0.5),
                  transparent 50%
                ),
                radial-gradient(
                  circle at bottom left,
                  rgba(255, 0, 128, 0.5),
                  transparent 50%
                ),
                radial-gradient(
                  circle at bottom right,
                  rgba(106, 0, 255, 0.5),
                  transparent 50%
                ),
                linear-gradient(
                  to bottom right,
                  #FF1493,
                  #4B0082
                )
              `
            }}
          >
            {/* Animated Background Overlay */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(255, 182, 255, 0.15) 0%, transparent 40%)',
                  'radial-gradient(circle at 80% 80%, rgba(255, 182, 255, 0.15) 0%, transparent 40%)',
                  'radial-gradient(circle at 20% 20%, rgba(255, 182, 255, 0.15) 0%, transparent 40%)'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {floatingIcons.map((Icon, index) => (
                Array.from({ length: 3 }).map((_, i) => (
                  <FloatingIcon
                    key={`${index}-${i}`}
                    Icon={Icon}
                    delay={index * 0.5 + i}
                  />
                ))
              ))}
            </div>

            {/* Sparkle Effect */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center">
              <div className="max-w-2xl w-full mx-4">
                <AnimatePresence mode="wait">
                  {!showSongMessage && !showFinalMessage ? (
                    <motion.div
                      key="message"
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="mb-6"
                      >
                        <Sparkles className="text-yellow-300 mx-auto" size={40} />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentMessageIndex}
                          variants={messageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="text-3xl font-bold text-white mb-8 text-center"
                        >
                          {messages[currentMessageIndex]}
                        </motion.p>
                      </AnimatePresence>

                      {showButtons && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="space-x-4 flex justify-center"
                        >
                          {['Yes, please!', 'Show me!'].map((text, index) => (
                            <motion.button
                              key={text}
                              onClick={handleButtonClick}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all
                                ${index === 0
                                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500'
                                  : 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500'
                                }
                                hover:shadow-xl hover:brightness-110`}
                              style={{
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                              }}
                            >
                              {text}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : showSongMessage ? (
                    <motion.div
                      key="song-message"
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="mb-6"
                      >
                        <Music2 className="text-pink-300 mx-auto" size={40} />
                      </motion.div>

                      <p className="text-3xl font-bold text-white mb-8 text-center">
                        I have dedicated a song only for you. Would you like to hear it?
                      </p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="space-x-4 flex justify-center"
                      >
                        {['Yes, play it!', 'Of course!'].map((text, index) => (
                          <motion.button
                            key={text}
                            onClick={handleSongChoice}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all
                              ${index === 0
                                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500'
                                : 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500'
                              }
                              hover:shadow-xl hover:brightness-110`}
                            style={{
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            {text}
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="final"
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <motion.p
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-3xl font-bold text-white text-center"
                      >
                        Lesssssss Gooooooooo!✨
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );


      // use this if you dont want to use photogallery
      case 1:
        return (
          <Room
            isLightOn={isLightOn}
            onComplete={() => setStage(2)}
          />
        );
      case 2:
        return <CakeCeremony onComplete={() => setStage(3)} />;
      case 3:
        return <FinalMessage />;
      default:
        return null;


      // uncomment the following code if you want to use the photogallery and comment the code above

      // case 1:
      //   return (
      //     <Room 
      //       isLightOn={isLightOn} 
      //       onComplete={() => setStage(2)} 
      //     />
      //   );
      // case 2:
      //   return <CakeCeremony onComplete={() => setStage(3)} />;
      // case 3:
      //   return <PhotoGallery onComplete={() => setStage(4)} />;
      // case 4:
      //   return <FinalMessage />;
      // default:
      //   return null;
      
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur p-4 rounded-full shadow-lg hover:shadow-xl border border-white/20"
        style={{
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
      >
        {isMusicPlaying ? (
          <Music2 size={24} className="text-pink-500 animate-pulse" />
        ) : (
          <Music size={24} className="text-white" />
        )}
      </motion.button>


      <BgMusic isPlaying={isMusicPlaying} />

      <AnimatePresence mode="wait">
        {renderStage()}
      </AnimatePresence>
    </div>
  );
}

export default App;