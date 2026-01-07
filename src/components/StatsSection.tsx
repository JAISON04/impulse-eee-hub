import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const AnimatedStat = ({ value, label, suffix = "", delay = 0 }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="text-center">
      <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary text-glow mb-2">
        {count}{suffix}
      </div>
      <div className="font-body text-muted-foreground uppercase tracking-wider text-sm">
        {label}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: 500, label: "Expected Participants", suffix: "+" },
    { value: 10, label: "Technical Events", suffix: "+" },
    { value: 5, label: "Workshops" },
    { value: 50000, label: "Prize Pool", suffix: "₹" },
  ];

  return (
    <section className="py-20 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimatedStat
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  delay={index * 200}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
