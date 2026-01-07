import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-primary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <span className="font-display text-2xl font-bold text-glow">
                IMPULSE
              </span>
            </Link>
            <p className="text-muted-foreground font-body text-sm mb-4">
              The premier technical symposium of the Department of Electrical 
              and Electronics Engineering.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Events", "Workshops", "Schedule", "Register", "FAQs"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">
              Popular Events
            </h4>
            <ul className="space-y-2">
              {["Circuit Debugging", "Code Surge", "Robo War", "InnoVolt", "Tech Quiz"].map((event) => (
                <li key={event}>
                  <Link
                    to="/events"
                    className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                  >
                    {event}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                <Mail className="w-4 h-4 text-primary" />
                impulse@college.edu
              </li>
              <li className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-muted-foreground font-body text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Department of EEE, Engineering College
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-body text-sm text-center md:text-left">
            © 2025 IMPULSE - EEE Technical Symposium. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm font-body">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm font-body">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
