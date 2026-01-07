import { motion } from "framer-motion";
import { Wrench, Clock, Users, IndianRupee, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";
import { Button } from "@/components/ui/button";

const workshops = [
  {
    id: "iot-workshop",
    title: "IoT & Smart Systems",
    description: "Learn to build IoT devices using ESP32, sensors, and cloud platforms. Hands-on experience with real hardware.",
    price: 500,
    duration: "4 hours",
    spots: "30 spots",
    date: "February 6, 9:00 AM",
  },
  {
    id: "pcb-design",
    title: "PCB Design Masterclass",
    description: "Master the art of PCB design using industry-standard tools. From schematic to manufacturing-ready files.",
    price: 400,
    duration: "3 hours",
    spots: "25 spots",
    date: "February 6, 2:00 PM",
  },
  {
    id: "matlab-simulink",
    title: "MATLAB & Simulink",
    description: "Power systems simulation and control design using MATLAB. Essential skills for every EEE engineer.",
    price: 350,
    duration: "3 hours",
    spots: "40 spots",
    date: "February 6, 10:00 AM",
  },
  {
    id: "embedded-systems",
    title: "Embedded C Programming",
    description: "Deep dive into embedded C programming for microcontrollers. Write efficient, low-level code.",
    price: 400,
    duration: "4 hours",
    spots: "30 spots",
    date: "February 6, 11:00 AM",
  },
];

const Workshops = () => {
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
              Learn From Experts
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-electric">Workshops</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
              Hands-on workshops conducted by industry professionals and academic experts.
              Gain practical skills that matter.
            </p>
          </motion.div>

          {/* Workshops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-card border border-primary/20 rounded-xl p-8 h-full electric-border transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {workshop.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{workshop.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground font-body mb-6">
                    {workshop.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{workshop.spots}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      <span>{workshop.price}</span>
                    </div>
                  </div>

                  <Button variant="circuit" className="w-full group/btn" asChild>
                    <Link to={`/register/${workshop.id}`}>
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Workshops;
