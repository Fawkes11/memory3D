
import { motion } from "motion/react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onStartGame: () => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">

      {/* Animated background grid */}
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5"></div>
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(6, 182, 212, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-20 w-16 h-16 border border-cyan-400/30 rotate-45"
        animate={{
          rotate: [45, 405],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 rounded-full"
        animate={{
          y: [-10, 10, -10],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute bottom-32 left-32 w-20 h-20 border-2 border-lime-400/30 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.h1
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="block font-medium bg-gradient-to-r from-cyan-400 via-magenta-400 to-lime-400 bg-clip-text text-transparent pb-2">
            MEMORY FLIP
          </span>
          <span className="block font-medium bg-gradient-to-r from-lime-400 via-cyan-400 to-magenta-400 bg-clip-text text-transparent">
            GAME
          </span>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-magenta-400/20 to-lime-400/20 blur-xl -z-10"></div>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-gray-300 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Pon a prueba tu memoria en este desafío futurista.
          Encuentra todos los pares y conviértete en el maestro
          de la memoria.
        </motion.p>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button
            onClick={onStartGame}
            className="relative group bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-400 hover:to-magenta-400 text-white px-12 py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
          >
            <span className="relative z-10">
              COMENZAR JUEGO
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-magenta-500/50 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
          </Button>
        </motion.div>

        {/* Instructions button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            <HelpCircle className="w-4 h-4" />
            INSTRUCCIONES
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-lime-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </div>
  );
}