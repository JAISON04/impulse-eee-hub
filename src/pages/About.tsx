import { motion } from "framer-motion";
import { Target, Users, Award, Zap, Lightbulb, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";

const About = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Our Mission",
      description: "To inspire and empower the next generation of electrical and electronics engineers through hands-on learning and innovation.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation Focus",
      description: "We believe in pushing boundaries and encouraging creative solutions to real-world electrical engineering challenges.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Building a vibrant community of students, faculty, and industry professionals who share a passion for EEE.",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Learning First",
      description: "Every event and workshop is designed to provide practical knowledge that goes beyond textbooks.",
    },
  ];

  const team = [
    { name: "Dr. Rajesh Kumar", role: "Faculty Coordinator", department: "HOD, EEE" },
    { name: "Priya Sharma", role: "Student Coordinator", department: "4th Year EEE" },
    { name: "Arjun Menon", role: "Technical Lead", department: "4th Year EEE" },
    { name: "Sneha Patel", role: "Event Manager", department: "3rd Year EEE" },
  ];

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
              About IMPULSE
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <span className="text-gradient-electric">Powering Innovation</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
              IMPULSE is the flagship technical symposium of the Department of Electrical and 
              Electronics Engineering, bringing together the brightest minds in the field.
            </p>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-primary/20 rounded-xl p-8 md:p-12 mb-16 electric-border"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                  <h2 className="font-display text-2xl font-bold">What is IMPULSE?</h2>
                </div>
                <p className="text-muted-foreground font-body mb-4 leading-relaxed">
                  IMPULSE is more than just a symposium—it's a celebration of electrical and 
                  electronics engineering. Since its inception, IMPULSE has been the premier 
                  platform for students to showcase their talents, learn from industry experts, 
                  and network with like-minded individuals.
                </p>
                <p className="text-muted-foreground font-body leading-relaxed">
                  This year, we're back bigger and better with exciting technical events, 
                  hands-on workshops, and opportunities to win amazing prizes. Whether you're 
                  a circuit enthusiast, a coding wizard, or a robotics fanatic, IMPULSE has 
                  something for everyone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "10+", label: "Events" },
                  { value: "500+", label: "Participants" },
                  { value: "₹50K+", label: "Prize Pool" },
                  { value: "5", label: "Workshops" },
                ].map((stat, index) => (
                  <div key={index} className="bg-muted/30 border border-border rounded-lg p-4 text-center">
                    <div className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-primary/20 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-body text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              <span className="text-gradient-electric">Our Team</span>
            </h2>
            <p className="text-muted-foreground font-body">
              The passionate individuals behind IMPULSE 2025
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-primary/20 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-body text-sm mb-1">{member.role}</p>
                <p className="text-muted-foreground font-body text-xs">{member.department}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
