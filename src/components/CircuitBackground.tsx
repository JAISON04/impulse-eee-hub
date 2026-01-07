import { motion } from "framer-motion";

const CircuitBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Grid */}
      <div className="absolute inset-0 circuit-grid opacity-30" />
      
      {/* Animated Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="hsl(195 100% 50%)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Horizontal Circuit Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0%"
            y1={`${15 + i * 20}%`}
            x2="100%"
            y2={`${15 + i * 20}%`}
            stroke="url(#electricGradient)"
            strokeWidth="1"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.3 },
              opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 }
            }}
          />
        ))}
        
        {/* Vertical Circuit Lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${10 + i * 12}%`}
            y1="0%"
            x2={`${10 + i * 12}%`}
            y2="100%"
            stroke="hsl(195 100% 50% / 0.1)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Circuit Nodes */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={`${10 + (i % 4) * 30}%`}
            cy={`${20 + Math.floor(i / 4) * 30}%`}
            r="3"
            fill="hsl(195 100% 50%)"
            filter="url(#glow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15
            }}
          />
        ))}
      </svg>
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-50" />
    </div>
  );
};

export default CircuitBackground;
