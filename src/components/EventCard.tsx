import { motion } from "framer-motion";
import { Clock, Users, IndianRupee, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  teamSize: string;
  category: string;
  icon: React.ReactNode;
  index: number;
}

const EventCard = ({
  id,
  title,
  description,
  price,
  duration,
  teamSize,
  category,
  icon,
  index,
}: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative bg-card border border-primary/20 rounded-xl p-6 h-full electric-border transition-all duration-300">
        {/* Category Badge */}
        <div className="absolute -top-3 left-6 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full">
          <span className="text-xs font-body uppercase tracking-wider text-primary">
            {category}
          </span>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 mt-2 group-hover:bg-primary/20 transition-colors">
          <div className="text-primary">{icon}</div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Details */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>{teamSize}</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold">
            <IndianRupee className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="circuit" className="w-full group/btn" asChild>
          <Link to={`/events/${id}`}>
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default EventCard;
