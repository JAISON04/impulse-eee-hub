import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, IndianRupee, ArrowLeft, Calendar, MapPin, CheckCircle, Code, Lightbulb, Cpu, Wrench, BrainCircuit, CircuitBoard, Zap, Shield, Timer, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";
import { Button } from "@/components/ui/button";

const eventsData: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  teamSize: string;
  category: string;
  icon: React.ReactNode;
  rules: string[];
  prizes: string[];
  venue: string;
  time: string;
}> = {
  "circuit-debugging": {
    title: "Circuit Debugging",
    description: "Test your troubleshooting skills by identifying and fixing faults in complex circuits.",
    longDescription: "Put your practical knowledge to the test in this hands-on circuit debugging competition. Participants will be given faulty circuits with various issues - from loose connections to component failures. Your task is to diagnose and fix these issues within the time limit. The event features multiple rounds with increasing difficulty, testing your understanding of circuit theory and practical troubleshooting skills.",
    price: 150,
    duration: "2 hours",
    teamSize: "2 members",
    category: "Technical",
    icon: <CircuitBoard className="w-8 h-8" />,
    rules: [
      "Teams of 2 members only",
      "All debugging tools will be provided",
      "No external resources or phones allowed",
      "Judging based on accuracy and speed",
      "Decision of judges is final"
    ],
    prizes: ["1st Prize: ₹5,000", "2nd Prize: ₹3,000", "3rd Prize: ₹1,500"],
    venue: "EEE Lab 101",
    time: "10:00 AM - 12:00 PM"
  },
  "code-surge": {
    title: "Code Surge",
    description: "A competitive coding event focused on embedded systems and microcontroller programming.",
    longDescription: "Code Surge challenges your programming skills in the domain of embedded systems. Write efficient code for microcontrollers, solve hardware-software interface problems, and demonstrate your understanding of low-level programming concepts. This individual event tests your ability to think algorithmically while considering hardware constraints.",
    price: 100,
    duration: "3 hours",
    teamSize: "Individual",
    category: "Coding",
    icon: <Code className="w-8 h-8" />,
    rules: [
      "Individual participation only",
      "Languages: C, C++, Python",
      "Internet access restricted",
      "Code must compile and run correctly",
      "Plagiarism leads to disqualification"
    ],
    prizes: ["1st Prize: ₹4,000", "2nd Prize: ₹2,500", "3rd Prize: ₹1,000"],
    venue: "Computer Lab 3",
    time: "2:00 PM - 5:00 PM"
  },
  "innovolt": {
    title: "InnoVolt",
    description: "Present your innovative ideas and projects in the field of electrical engineering.",
    longDescription: "InnoVolt is our flagship innovation showcase event where aspiring engineers present their groundbreaking ideas and working prototypes. Whether it's a renewable energy solution, smart grid innovation, or an IoT-based electrical system, this is your platform to shine. Present to industry experts and potentially win incubation opportunities!",
    price: 200,
    duration: "Full day",
    teamSize: "3-4 members",
    category: "Innovation",
    icon: <Lightbulb className="w-8 h-8" />,
    rules: [
      "Team size: 3-4 members",
      "Working prototype mandatory",
      "15-minute presentation + 5-minute Q&A",
      "Submit abstract before Feb 3",
      "All IP remains with participants"
    ],
    prizes: ["1st Prize: ₹15,000 + Incubation Support", "2nd Prize: ₹8,000", "3rd Prize: ₹4,000"],
    venue: "Main Auditorium",
    time: "9:00 AM - 5:00 PM"
  },
  "robo-war": {
    title: "Robo War",
    description: "Build and battle your robots in an intense combat arena.",
    longDescription: "The ultimate test of engineering and strategy! Build a combat robot and battle it out in our specially designed arena. Your robot must be capable of disabling opponents while protecting itself. This event combines mechanical engineering, electronics, and strategic thinking. May the strongest bot prevail!",
    price: 500,
    duration: "Full day",
    teamSize: "4-5 members",
    category: "Robotics",
    icon: <Cpu className="w-8 h-8" />,
    rules: [
      "Team size: 4-5 members",
      "Robot weight limit: 15kg",
      "Dimensions: Max 50x50x50 cm",
      "No flame/liquid weapons",
      "Battery voltage limit: 24V"
    ],
    prizes: ["1st Prize: ₹20,000", "2nd Prize: ₹10,000", "3rd Prize: ₹5,000"],
    venue: "Open Ground Arena",
    time: "10:00 AM - 6:00 PM"
  },
  "tech-quiz": {
    title: "ElectroQuiz",
    description: "Test your knowledge on electrical and electronics engineering concepts.",
    longDescription: "Think you know your EEE fundamentals? ElectroQuiz puts your theoretical knowledge to the test across multiple rounds. From basic circuit analysis to advanced power systems, from semiconductor physics to control systems - be prepared for questions that challenge every aspect of your engineering knowledge.",
    price: 100,
    duration: "1.5 hours",
    teamSize: "2 members",
    category: "Quiz",
    icon: <BrainCircuit className="w-8 h-8" />,
    rules: [
      "Teams of 2 members",
      "3 rounds: Written, Buzzer, Rapid Fire",
      "No negative marking in Round 1",
      "Top 10 teams qualify for finals",
      "No electronic devices allowed"
    ],
    prizes: ["1st Prize: ₹3,000", "2nd Prize: ₹2,000", "3rd Prize: ₹1,000"],
    venue: "Seminar Hall A",
    time: "11:00 AM - 12:30 PM"
  },
  "project-expo": {
    title: "Project Expo",
    description: "Showcase your EEE projects and innovations to industry experts.",
    longDescription: "Project Expo is the perfect platform to display your academic and personal projects to a wider audience. Set up your booth, demonstrate your working project, and interact with industry professionals, faculty, and fellow students. The best projects will receive certificates of excellence and exciting prizes.",
    price: 250,
    duration: "Full day",
    teamSize: "3-5 members",
    category: "Exhibition",
    icon: <Wrench className="w-8 h-8" />,
    rules: [
      "Team size: 3-5 members",
      "Project must be in working condition",
      "Poster presentation required",
      "Space: 3x3 feet per team",
      "Power supply will be provided"
    ],
    prizes: ["Best Project: ₹10,000", "Best Innovation: ₹5,000", "People's Choice: ₹3,000"],
    venue: "Exhibition Hall",
    time: "9:00 AM - 4:00 PM"
  },
  "power-systems": {
    title: "Power Grid Challenge",
    description: "Design and optimize power distribution systems.",
    longDescription: "Take on the role of a power systems engineer in this simulation-based challenge. Design efficient power distribution networks, optimize load flow, and minimize transmission losses. This event tests your understanding of power systems concepts and your ability to make strategic decisions under constraints.",
    price: 150,
    duration: "2.5 hours",
    teamSize: "2-3 members",
    category: "Technical",
    icon: <Zap className="w-8 h-8" />,
    rules: [
      "Team size: 2-3 members",
      "Software simulation based",
      "Multiple scenarios to solve",
      "Judging on efficiency and cost",
      "Time management is crucial"
    ],
    prizes: ["1st Prize: ₹5,000", "2nd Prize: ₹3,000", "3rd Prize: ₹1,500"],
    venue: "Power Systems Lab",
    time: "2:00 PM - 4:30 PM"
  },
  "safety-protocol": {
    title: "Safety First",
    description: "Learn and demonstrate electrical safety protocols.",
    longDescription: "Electrical safety is paramount in our field. This event combines theoretical knowledge with practical demonstrations of safety protocols. Learn about industrial safety standards, first aid for electrical accidents, and proper handling of high-voltage equipment. Perfect for those who want to excel in industrial safety roles.",
    price: 100,
    duration: "1.5 hours",
    teamSize: "2 members",
    category: "Safety",
    icon: <Shield className="w-8 h-8" />,
    rules: [
      "Teams of 2 members",
      "Written test + Practical demo",
      "Safety gear will be provided",
      "Focus on industrial standards",
      "Bonus points for first aid knowledge"
    ],
    prizes: ["1st Prize: ₹2,500", "2nd Prize: ₹1,500", "3rd Prize: ₹750"],
    venue: "Safety Training Room",
    time: "3:00 PM - 4:30 PM"
  },
  "speed-wiring": {
    title: "Speed Wiring",
    description: "Race against time to complete complex wiring challenges.",
    longDescription: "How fast can you wire a circuit correctly? Speed Wiring tests your practical skills under pressure. Complete residential and industrial wiring setups as quickly as possible while maintaining safety standards. Precision matters - a single wrong connection means penalties!",
    price: 150,
    duration: "1 hour",
    teamSize: "Individual",
    category: "Hands-on",
    icon: <Timer className="w-8 h-8" />,
    rules: [
      "Individual participation",
      "All tools and materials provided",
      "Safety compliance mandatory",
      "Penalties for incorrect wiring",
      "Multiple difficulty levels"
    ],
    prizes: ["1st Prize: ₹3,000", "2nd Prize: ₹2,000", "3rd Prize: ₹1,000"],
    venue: "Workshop Hall",
    time: "11:00 AM - 12:00 PM"
  },
  "treasure-hunt": {
    title: "Electro Treasure Hunt",
    description: "Solve electrical engineering clues to find hidden treasures.",
    longDescription: "A unique blend of fun and learning! Teams navigate across the campus solving clues based on electrical engineering concepts. Each clue leads to the next, ultimately revealing the hidden treasure. Quick thinking, teamwork, and a solid EEE foundation will guide you to victory!",
    price: 100,
    duration: "2 hours",
    teamSize: "3 members",
    category: "Fun",
    icon: <Trophy className="w-8 h-8" />,
    rules: [
      "Teams of 3 members",
      "Campus-wide event",
      "Phones allowed for clue hints only",
      "No running inside buildings",
      "First team to finish wins"
    ],
    prizes: ["1st Prize: ₹4,000", "2nd Prize: ₹2,500", "3rd Prize: ₹1,000"],
    venue: "Starts at Main Gate",
    time: "9:00 AM - 11:00 AM"
  },
};

const EventDetail = () => {
  const { eventId } = useParams();
  const event = eventId ? eventsData[eventId] : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Event Not Found</h1>
          <Button variant="circuit" asChild>
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-primary/20 rounded-xl p-8 electric-border"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
                    {event.icon}
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-xs font-body uppercase tracking-wider text-primary mb-3">
                      {event.category}
                    </span>
                    <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient-electric">
                      {event.title}
                    </h1>
                    <p className="text-muted-foreground font-body">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-primary/20 rounded-xl p-8"
              >
                <h2 className="font-display text-xl font-bold mb-4 text-foreground">
                  About This Event
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {event.longDescription}
                </p>
              </motion.div>

              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-primary/20 rounded-xl p-8"
              >
                <h2 className="font-display text-xl font-bold mb-4 text-foreground">
                  Rules & Guidelines
                </h2>
                <ul className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-body">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Prizes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-primary/20 rounded-xl p-8"
              >
                <h2 className="font-display text-xl font-bold mb-4 text-foreground">
                  Prizes
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {event.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border text-center ${
                        index === 0
                          ? "bg-primary/10 border-primary/50"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <span className={`font-body font-semibold ${index === 0 ? "text-primary" : "text-foreground"}`}>
                        {prize}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-primary/30 rounded-xl p-6 sticky top-24"
              >
                <h3 className="font-display text-lg font-bold mb-4 text-foreground">
                  Event Details
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Date</p>
                      <p className="font-body font-semibold text-foreground">February 6, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Time</p>
                      <p className="font-body font-semibold text-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Venue</p>
                      <p className="font-body font-semibold text-foreground">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Team Size</p>
                      <p className="font-body font-semibold text-foreground">{event.teamSize}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-body">Registration Fee</span>
                    <span className="font-display text-2xl font-bold text-primary flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {event.price}
                    </span>
                  </div>
                </div>

                <Button variant="electric" size="lg" className="w-full" asChild>
                  <Link to={`/register/${eventId}`}>
                    Register Now
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
