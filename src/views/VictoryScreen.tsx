import { motion } from 'motion/react';
import { Trophy, Timer, Target, Star, Home } from 'lucide-react';
import type { GameStats } from '@/store/gameStore';
import { Button } from '@/components/ui/button';


interface VictoryScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function VictoryScreen({ stats, onPlayAgain, onGoHome }: VictoryScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceRating = () => {
    if (stats.attempts <= 12) return { rating: 'PERFECTO', color: 'text-lime-400', stars: 3 };
    if (stats.attempts <= 16) return { rating: 'EXCELENTE', color: 'text-cyan-400', stars: 2 };
    if (stats.attempts <= 24) return { rating: 'BUENO', color: 'text-magenta-400', stars: 1 };
    return { rating: 'COMPLETADO', color: 'text-gray-400', stars: 0 };
  };

  const performance = getPerformanceRating();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Confetti particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -10,
              opacity: 0 
            }}
            animate={{ 
              y: window.innerHeight + 10,
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-lime-500/20 to-cyan-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center space-y-8 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Trophy icon */}
        <motion.div
          className="flex justify-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <Trophy className="w-24 h-24 text-yellow-400" />
            <motion.div
              className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Victory title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h1 className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            ¡GANASTE!
          </h1>
          <p className={`text-xl ${performance.color} mb-4`}>
            {performance.rating}
          </p>
          
          {/* Performance stars */}
          <div className="flex justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: i < performance.stars ? 1 : 0.3, 
                  opacity: i < performance.stars ? 1 : 0.3 
                }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              >
                <Star 
                  className={`w-6 h-6 ${
                    i < performance.stars 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-600'
                  }`} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game statistics */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Timer className="w-5 h-5" />
              <span>Tiempo</span>
            </div>
            <span className="font-mono text-white">{formatTime(stats.timeElapsed)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-magenta-400">
              <Target className="w-5 h-5" />
              <span>Intentos</span>
            </div>
            <span className="text-white">{stats.attempts}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lime-400">
              <Star className="w-5 h-5" />
              <span>Pares encontrados</span>
            </div>
            <span className="text-white ml-5">{stats.matches}</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-400 hover:to-magenta-400 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            JUGAR DE NUEVO
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-600 hover:border-cyan-400 hover:text-cyan-400 transition-colors py-3"
          >
            <Home className="w-4 h-4" />
            VOLVER AL INICIO
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom glow effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </div>
  );
}