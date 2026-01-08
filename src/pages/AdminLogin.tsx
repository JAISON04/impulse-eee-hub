import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CircuitBackground from '@/components/CircuitBackground';
import { useToast } from '@/hooks/use-toast';

// Admin credentials (in production, this should be handled securely via Firebase)
const ADMIN_EMAIL = "admin@impulse.edu";
const ADMIN_PASSWORD = "impulse2025admin";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store admin session
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('adminEmail', email);
      
      toast({
        title: "Welcome, Admin!",
        description: "You have successfully logged in.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <CircuitBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-2xl shadow-primary/10">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4"
            >
              <Shield className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Admin Portal
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              IMPULSE Management System
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <Lock className="w-4 h-4 text-primary" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-mono">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@impulse.edu"
                className="bg-background/50 border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-mono">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50 border-primary/30 focus:border-primary pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="circuit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>

          {/* Info Text */}
          <p className="text-center text-muted-foreground text-xs mt-6 font-mono">
            Authorized personnel only
          </p>

          {/* Electric decoration */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-primary to-accent rounded-full blur-sm" />
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <a
            href="/"
            className="text-primary hover:text-primary/80 transition-colors font-mono text-sm"
          >
            ← Back to Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
