import { motion } from "framer-motion";
import { Code, Lightbulb, Cpu, Wrench, BrainCircuit, CircuitBoard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";

const events = [
  {
    id: "circuit-debugging",
    title: "Circuit Debugging",
    description: "Test your troubleshooting skills by identifying and fixing faults in complex circuits.",
    price: 150,
    duration: "2 hours",
    teamSize: "2 members",
    category: "Technical",
    icon: <CircuitBoard className="w-6 h-6" />,
  },
  {
    id: "code-surge",
    title: "Code Surge",
    description: "A competitive coding event focused on embedded systems and microcontroller programming.",
    price: 100,
    duration: "3 hours",
    teamSize: "Individual",
    category: "Coding",
    icon: <Code className="w-6 h-6" />,
  },
  {
    id: "innovolt",
    title: "InnoVolt",
    description: "Present your innovative ideas and projects in the field of electrical engineering.",
    price: 200,
    duration: "Full day",
    teamSize: "3-4 members",
    category: "Innovation",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    id: "robo-war",
    title: "Robo War",
    description: "Build and battle your robots in an intense combat arena. May the best bot win!",
    price: 500,
    duration: "Full day",
    teamSize: "4-5 members",
    category: "Robotics",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: "tech-quiz",
    title: "ElectroQuiz",
    description: "Test your knowledge on electrical and electronics engineering concepts.",
    price: 100,
    duration: "1.5 hours",
    teamSize: "2 members",
    category: "Quiz",
    icon: <BrainCircuit className="w-6 h-6" />,
  },
  {
    id: "project-expo",
    title: "Project Expo",
    description: "Showcase your EEE projects and innovations to a panel of industry experts.",
    price: 250,
    duration: "Full day",
    teamSize: "3-5 members",
    category: "Exhibition",
    icon: <Wrench className="w-6 h-6" />,
  },
];

const FeaturedEvents = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm font-body uppercase tracking-wider text-primary mb-4">
            Featured Events
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-electric">Power Up</span> Your Skills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            From circuit debugging to robotics battles, explore our lineup of 
            electrifying events designed to challenge and inspire.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={event.id} {...event} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
