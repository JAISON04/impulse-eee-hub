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

// Mock registration data (in production, fetch from Firebase)
const mockRegistrations = [
  {
    id: '1',
    name: 'Arun Kumar',
    email: 'arun@college.edu',
    phone: '+91 9876543210',
    college: 'Anna University',
    year: '3rd Year',
    event: 'Circuit Design Challenge',
    eventId: 'circuit-design',
    amount: 200,
    paymentStatus: 'completed',
    registeredAt: '2025-01-20T10:30:00Z',
    transactionId: 'TXN001234',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@college.edu',
    phone: '+91 9876543211',
    college: 'IIT Madras',
    year: '2nd Year',
    event: 'Power Grid Simulation',
    eventId: 'power-grid',
    amount: 250,
    paymentStatus: 'completed',
    registeredAt: '2025-01-21T14:15:00Z',
    transactionId: 'TXN001235',
  },
  {
    id: '3',
    name: 'Rahul Menon',
    email: 'rahul@college.edu',
    phone: '+91 9876543212',
    college: 'VIT Chennai',
    year: '4th Year',
    event: 'Technical Paper Presentation',
    eventId: 'paper-presentation',
    amount: 150,
    paymentStatus: 'pending',
    registeredAt: '2025-01-22T09:00:00Z',
    transactionId: 'TXN001236',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha@college.edu',
    phone: '+91 9876543213',
    college: 'SRM University',
    year: '3rd Year',
    event: 'Robotics Workshop',
    eventId: 'robotics-workshop',
    amount: 300,
    paymentStatus: 'completed',
    registeredAt: '2025-01-22T11:45:00Z',
    transactionId: 'TXN001237',
  },
  {
    id: '5',
    name: 'Karthik Naidu',
    email: 'karthik@college.edu',
    phone: '+91 9876543214',
    college: 'BITS Pilani',
    year: '2nd Year',
    event: 'Circuit Design Challenge',
    eventId: 'circuit-design',
    amount: 200,
    paymentStatus: 'completed',
    registeredAt: '2025-01-23T16:20:00Z',
    transactionId: 'TXN001238',
  },
];

const events = [
  { id: 'all', name: 'All Events' },
  { id: 'circuit-design', name: 'Circuit Design Challenge' },
  { id: 'power-grid', name: 'Power Grid Simulation' },
  { id: 'paper-presentation', name: 'Technical Paper Presentation' },
  { id: 'robotics-workshop', name: 'Robotics Workshop' },
];

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<typeof mockRegistrations[0] | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
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

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all' || reg.eventId === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const totalRegistrations = registrations.length;
  const totalAmount = registrations
    .filter((r) => r.paymentStatus === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);
  const eventCounts = events.slice(1).map((event) => ({
    ...event,
    count: registrations.filter((r) => r.eventId === event.id).length,
  }));

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Year', 'Event', 'Amount', 'Payment Status', 'Transaction ID', 'Registered At'];
    const csvData = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.college,
      reg.year,
      reg.event,
      reg.amount,
      reg.paymentStatus,
      reg.transactionId,
      new Date(reg.registeredAt).toLocaleString(),
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
                  IMPULSE 2025
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventCounts.map((event) => (
              <div
                key={event.id}
                className="bg-background/50 border border-primary/10 rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-display font-bold text-primary">{event.count}</p>
                <p className="text-sm text-muted-foreground font-mono truncate">{event.name}</p>
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
          <Button variant="circuit" onClick={exportToCSV}>
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
                        reg.paymentStatus === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {reg.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRegistration(reg)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-mono">No registrations found</p>
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
              className="bg-card border border-primary/30 rounded-xl p-6 max-w-md w-full"
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
                  <span className="text-foreground font-mono text-sm">{selectedRegistration.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-mono ${
                      selectedRegistration.paymentStatus === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {selectedRegistration.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono text-sm">Registered</span>
                  <span className="text-foreground text-sm">
                    {new Date(selectedRegistration.registeredAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                variant="circuit"
                className="w-full mt-6"
                onClick={() => setSelectedRegistration(null)}
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
