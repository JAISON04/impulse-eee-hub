import { motion } from "framer-motion";
import { Code, Lightbulb, Cpu, Wrench, BrainCircuit, CircuitBoard, Zap, Shield, Timer, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";
import EventCard from "@/components/EventCard";

const allEvents = [
  {
    id: "circuit-debugging",
    title: "Circuit Debugging",
    description: "Test your troubleshooting skills by identifying and fixing faults in complex circuits. Navigate through various difficulty levels and prove your debugging prowess.",
    price: 150,
    duration: "2 hours",
    teamSize: "2 members",
    category: "Technical",
    icon: <CircuitBoard className="w-6 h-6" />,
  },
  {
    id: "code-surge",
    title: "Code Surge",
    description: "A competitive coding event focused on embedded systems and microcontroller programming. Solve real-world challenges in limited time.",
    price: 100,
    duration: "3 hours",
    teamSize: "Individual",
    category: "Coding",
    icon: <Code className="w-6 h-6" />,
  },
  {
    id: "innovolt",
    title: "InnoVolt",
    description: "Present your innovative ideas and projects in the field of electrical engineering. Showcase solutions that can transform the industry.",
    price: 200,
    duration: "Full day",
    teamSize: "3-4 members",
    category: "Innovation",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    id: "robo-war",
    title: "Robo War",
    description: "Build and battle your robots in an intense combat arena. May the best bot win! Strategy meets engineering in this ultimate showdown.",
    price: 500,
    duration: "Full day",
    teamSize: "4-5 members",
    category: "Robotics",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: "tech-quiz",
    title: "ElectroQuiz",
    description: "Test your knowledge on electrical and electronics engineering concepts. Multiple rounds of increasing difficulty await!",
    price: 100,
    duration: "1.5 hours",
    teamSize: "2 members",
    category: "Quiz",
    icon: <BrainCircuit className="w-6 h-6" />,
  },
  {
    id: "project-expo",
    title: "Project Expo",
    description: "Showcase your EEE projects and innovations to a panel of industry experts. Win recognition and networking opportunities.",
    price: 250,
    duration: "Full day",
    teamSize: "3-5 members",
    category: "Exhibition",
    icon: <Wrench className="w-6 h-6" />,
  },
  {
    id: "power-systems",
    title: "Power Grid Challenge",
    description: "Design and optimize power distribution systems. Minimize losses and maximize efficiency in this strategic event.",
    price: 150,
    duration: "2.5 hours",
    teamSize: "2-3 members",
    category: "Technical",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: "safety-protocol",
    title: "Safety First",
    description: "Learn and demonstrate electrical safety protocols. Test your knowledge on industrial safety standards and practices.",
    price: 100,
    duration: "1.5 hours",
    teamSize: "2 members",
    category: "Safety",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: "speed-wiring",
    title: "Speed Wiring",
    description: "Race against time to complete complex wiring challenges. Precision and speed will determine the winner.",
    price: 150,
    duration: "1 hour",
    teamSize: "Individual",
    category: "Hands-on",
    icon: <Timer className="w-6 h-6" />,
  },
  {
    id: "treasure-hunt",
    title: "Electro Treasure Hunt",
    description: "Solve electrical engineering clues to find hidden treasures across the campus. A fun blend of knowledge and adventure.",
    price: 100,
    duration: "2 hours",
    teamSize: "3 members",
    category: "Fun",
    icon: <Trophy className="w-6 h-6" />,
  },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm font-body uppercase tracking-wider text-primary mb-4">
              All Events
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-electric">Technical Events</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
              Explore our complete lineup of technical events, competitions, and activities.
              Choose your challenge and register to participate!
            </p>
          </motion.div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map((event, index) => (
              <EventCard key={event.id} {...event} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
