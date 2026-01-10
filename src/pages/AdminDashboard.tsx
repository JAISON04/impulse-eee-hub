import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  DollarSign,
  Download,
  LogOut,
  Shield,
  Zap,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Mail,
  CheckCircle,
  Circle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
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
  transaction_id: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  attendance_marked: boolean;
  attendance_marked_at: string | null;
}

const events = [
  { id: 'all', name: 'All Events' },
  { id: 'circuit-debugging', name: 'Circuit Debugging' },
  { id: 'code-surge', name: 'Code Surge' },
  { id: 'innovolt', name: 'InnoVolt' },
  { id: 'robo-war', name: 'Robo War' },
  { id: 'tech-quiz', name: 'ElectroQuiz' },
  { id: 'project-expo', name: 'Project Expo' },
  { id: 'power-systems', name: 'Power Grid Challenge' },
  { id: 'safety-protocol', name: 'Safety First' },
  { id: 'speed-wiring', name: 'Speed Wiring' },
  { id: 'treasure-hunt', name: 'Electro Treasure Hunt' },
];

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [sendingOD, setSendingOD] = useState<string | null>(null);
  const [togglingAttendance, setTogglingAttendance] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch registrations',
        variant: 'destructive',
      });
    } else {
      setRegistrations((data as Registration[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    fetchRegistrations();

    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminEmail');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin');
  };

  const toggleAttendance = async (reg: Registration) => {
    setTogglingAttendance(reg.id);
    try {
      const newStatus = !reg.attendance_marked;
      const { error } = await supabase
        .from('registrations')
        .update({
          attendance_marked: newStatus,
          attendance_marked_at: newStatus ? new Date().toISOString() : null,
        })
        .eq('id', reg.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Attendance Marked" : "Attendance Unmarked",
        description: `${reg.name}'s attendance has been ${newStatus ? 'marked' : 'unmarked'}.`,
      });

      fetchRegistrations();
    } catch (error: any) {
      console.error('Error toggling attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attendance',
        variant: 'destructive',
      });
    } finally {
      setTogglingAttendance(null);
    }
  };

  const sendODLetter = async (reg: Registration) => {
    setSendingOD(reg.id);
    try {
      const { data, error } = await supabase.functions.invoke('send-od-letter', {
        body: {
          name: reg.name,
          email: reg.email,
          college: reg.college,
          year: reg.year,
          event: reg.event,
          eventDate: 'February 6, 2025',
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "OD Letter Sent",
          description: `OD letter has been sent to ${reg.email}`,
        });
      } else {
        throw new Error(data.error || 'Failed to send OD letter');
      }
    } catch (error: any) {
      console.error('Error sending OD letter:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OD letter',
        variant: 'destructive',
      });
    } finally {
      setSendingOD(null);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all' || reg.event_id === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const totalRegistrations = registrations.length;
  const totalAmount = registrations
    .filter((r) => r.payment_status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalAttendance = registrations.filter((r) => r.attendance_marked).length;
  
  const eventCounts = events.slice(1).map((event) => ({
    ...event,
    count: registrations.filter((r) => r.event_id === event.id).length,
  }));

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Year', 'Event', 'Amount', 'Payment Status', 'Attendance', 'Transaction ID', 'Razorpay Payment ID', 'Registered At'];
    const csvData = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.college,
      reg.year,
      reg.event,
      reg.amount,
      reg.payment_status,
      reg.attendance_marked ? 'Present' : 'Absent',
      reg.transaction_id || '',
      reg.razorpay_payment_id || '',
      formatDate(reg.created_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `impulse_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: `${filteredRegistrations.length} registrations exported to CSV.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm font-mono">
                  IMPULSE 2025 • Real-time Data
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-primary/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-mono">Total Registrations</p>
                <p className="text-3xl font-display font-bold text-foreground">{totalRegistrations}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-accent/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-mono">Total Collected</p>
                <p className="text-3xl font-display font-bold text-foreground">₹{totalAmount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-green-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-mono">Attendance</p>
                <p className="text-3xl font-display font-bold text-foreground">{totalAttendance}/{totalRegistrations}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-secondary/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-mono">Events</p>
                <p className="text-3xl font-display font-bold text-foreground">{events.length - 1}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Event-wise Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-primary/20 rounded-xl p-6 mb-8"
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Event-wise Registrations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {eventCounts.map((event) => (
              <div
                key={event.id}
                className="bg-background/50 border border-primary/10 rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-display font-bold text-primary">{event.count}</p>
                <p className="text-xs text-muted-foreground font-mono truncate" title={event.name}>
                  {event.name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-primary/30"
            />
          </div>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full md:w-64 bg-background/50 border-primary/30">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="circuit" onClick={exportToCSV} disabled={filteredRegistrations.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-primary/20 rounded-xl overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-primary/5">
                <TableHead className="font-mono text-primary">Attendance</TableHead>
                <TableHead className="font-mono text-primary">Name</TableHead>
                <TableHead className="font-mono text-primary">College</TableHead>
                <TableHead className="font-mono text-primary">Event</TableHead>
                <TableHead className="font-mono text-primary">Amount</TableHead>
                <TableHead className="font-mono text-primary">Status</TableHead>
                <TableHead className="font-mono text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((reg) => (
                <TableRow key={reg.id} className="border-primary/10 hover:bg-primary/5">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAttendance(reg)}
                      disabled={togglingAttendance === reg.id || reg.payment_status !== 'completed'}
                      className={reg.attendance_marked ? 'text-green-500' : 'text-muted-foreground'}
                    >
                      {togglingAttendance === reg.id ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : reg.attendance_marked ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{reg.name}</p>
                      <p className="text-sm text-muted-foreground">{reg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{reg.college}</p>
                      <p className="text-sm text-muted-foreground">{reg.year}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{reg.event}</TableCell>
                  <TableCell className="font-mono text-foreground">₹{reg.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-mono ${
                        reg.payment_status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : reg.payment_status === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {reg.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRegistration(reg)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendODLetter(reg)}
                        disabled={sendingOD === reg.id || reg.payment_status !== 'completed'}
                        title="Send OD Letter"
                        className="text-primary hover:text-primary"
                      >
                        {sendingOD === reg.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-mono">
                {registrations.length === 0
                  ? 'No registrations yet'
                  : 'No registrations match your search'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {selectedRegistration && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRegistration(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-primary/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Registration Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Name</span>
                  <span className="text-foreground">{selectedRegistration.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Email</span>
                  <span className="text-foreground">{selectedRegistration.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Phone</span>
                  <span className="text-foreground">{selectedRegistration.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">College</span>
                  <span className="text-foreground">{selectedRegistration.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Year</span>
                  <span className="text-foreground">{selectedRegistration.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Event</span>
                  <span className="text-foreground">{selectedRegistration.event}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Amount</span>
                  <span className="text-foreground font-mono">₹{selectedRegistration.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Transaction ID</span>
                  <span className="text-foreground font-mono text-sm">{selectedRegistration.transaction_id || 'N/A'}</span>
                </div>
                {selectedRegistration.razorpay_payment_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-mono text-sm">Razorpay ID</span>
                    <span className="text-foreground font-mono text-sm">{selectedRegistration.razorpay_payment_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-mono ${
                      selectedRegistration.payment_status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedRegistration.payment_status === 'failed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {selectedRegistration.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Attendance</span>
                  <span className={`flex items-center gap-1 ${selectedRegistration.attendance_marked ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {selectedRegistration.attendance_marked ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Present
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" /> Absent
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Registered</span>
                  <span className="text-foreground text-sm">
                    {formatDate(selectedRegistration.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="circuit"
                  className="flex-1"
                  onClick={() => {
                    sendODLetter(selectedRegistration);
                  }}
                  disabled={sendingOD === selectedRegistration.id || selectedRegistration.payment_status !== 'completed'}
                >
                  {sendingOD === selectedRegistration.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send OD Letter
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRegistration(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
