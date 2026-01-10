import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, School, Phone, Zap, IndianRupee, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CircuitBackground from '@/components/CircuitBackground';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  event: string;
  event_id: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
      } else {
        setRegistrations(data || []);
      }
      setLoadingRegistrations(false);
    };

    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Zap className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/20 rounded-xl p-8 mb-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-background" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {user.displayName || 'Welcome!'}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Registered Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Your Registered Events
            </h2>

            {loadingRegistrations ? (
              <div className="text-center py-12">
                <Zap className="w-8 h-8 text-primary animate-pulse mx-auto" />
                <p className="text-muted-foreground mt-4">Loading your registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="bg-card border border-primary/20 rounded-xl p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  No Registrations Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't registered for any events. Explore our exciting lineup!
                </p>
                <Button variant="electric" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg, index) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg font-bold text-foreground">
                            {reg.event}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-mono ${
                              reg.payment_status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : reg.payment_status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {reg.payment_status === 'completed' ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {reg.payment_status}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <School className="w-4 h-4" />
                            <span className="truncate">{reg.college}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{reg.year}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{reg.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-mono">
                            <IndianRupee className="w-4 h-4" />
                            <span>{reg.amount}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Registered on {formatDate(reg.created_at)}
                        </p>
                      </div>
                      {reg.payment_status === 'completed' && (
                        <Button variant="circuit" size="sm" asChild>
                          <Link to={`/events/${reg.event_id}`}>View Event</Link>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
