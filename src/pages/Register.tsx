import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, School, Calendar, Phone, Mail, IndianRupee, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  college: z.string().min(2, "College name is required").max(200),
  year: z.string().min(1, "Please select your year of study"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email address"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const eventsInfo: Record<string, { title: string; price: number }> = {
  "circuit-debugging": { title: "Circuit Debugging", price: 10 },
  "code-surge": { title: "Code Surge", price: 100 },
  "innovolt": { title: "InnoVolt", price: 200 },
  "robo-war": { title: "Robo War", price: 500 },
  "tech-quiz": { title: "ElectroQuiz", price: 100 },
  "project-expo": { title: "Project Expo", price: 250 },
  "power-systems": { title: "Power Grid Challenge", price: 150 },
  "safety-protocol": { title: "Safety First", price: 100 },
  "speed-wiring": { title: "Speed Wiring", price: 150 },
  "treasure-hunt": { title: "Electro Treasure Hunt", price: 100 },
};

const yearLabels: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
};

const Register = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const event = eventId ? eventsInfo[eventId] : null;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.displayName || "",
    },
  });

  const initiatePayment = async (registrationId: string, orderId: string, keyId: string, amount: number, data: RegistrationFormData) => {
    const options = {
      key: keyId,
      amount: amount,
      currency: "INR",
      name: "IMPULSE 2025",
      description: `Registration for ${event?.title}`,
      order_id: orderId,
      handler: async (response: any) => {
        try {
          // Verify payment on backend
          const { data: verifyData, error } = await supabase.functions.invoke("verify-razorpay-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId,
            },
          });

          if (error) throw error;

          if (verifyData.success) {
            // Send confirmation email
            try {
              await supabase.functions.invoke("send-confirmation-email", {
                body: {
                  name: data.name,
                  email: data.email,
                  event: event?.title,
                  college: data.college,
                  year: yearLabels[data.year] || data.year,
                  amount: event?.price,
                  transactionId: response.razorpay_payment_id,
                },
              });
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
            }

            toast({
              title: "Payment Successful!",
              description: "Your registration is complete. A confirmation email has been sent.",
            });
            navigate("/profile");
          } else {
            throw new Error(verifyData.error || "Payment verification failed");
          }
        } catch (err: any) {
          console.error("Payment verification error:", err);
          toast({
            title: "Payment Verification Failed",
            description: "Please contact support with your payment ID.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      theme: {
        color: "#00d4ff",
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
          toast({
            title: "Payment Cancelled",
            description: "You can try again when ready.",
          });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const onSubmit = async (data: RegistrationFormData) => {
    if (!event || !eventId) return;
    
    setIsSubmitting(true);
    
    try {
      // First, save registration to database with pending status
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const { data: registration, error: insertError } = await supabase
        .from("registrations")
        .insert({
          name: data.name,
          email: data.email,
          phone: `+91 ${data.phone}`,
          college: data.college,
          year: yearLabels[data.year] || data.year,
          event: event.title,
          event_id: eventId,
          amount: event.price,
          payment_status: "pending",
          transaction_id: transactionId,
          user_id: user?.uid,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: event.price,
          receipt: registration.id,
          notes: {
            eventId,
            eventName: event.title,
            registrationId: registration.id,
          },
        },
      });

      if (orderError) throw orderError;

      // Open Razorpay checkout
      initiatePayment(registration.id, orderData.orderId, orderData.keyId, orderData.amount, data);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

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
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link to={`/events/${eventId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Event
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Zap className="w-4 h-4 text-primary animate-pulse-glow" />
              <span className="text-sm font-body uppercase tracking-wider text-primary">
                Event Registration
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-electric">{event.title}</span>
            </h1>
            <p className="text-muted-foreground font-body">
              Fill in your details to register for this event
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-primary/20 rounded-xl p-8 electric-border"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="bg-muted/50 border-border focus:border-primary"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* College */}
              <div className="space-y-2">
                <Label htmlFor="college" className="font-body flex items-center gap-2">
                  <School className="w-4 h-4 text-primary" />
                  College Name
                </Label>
                <Input
                  id="college"
                  placeholder="Enter your college name"
                  className="bg-muted/50 border-border focus:border-primary"
                  {...register("college")}
                />
                {errors.college && (
                  <p className="text-sm text-destructive">{errors.college.message}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="font-body flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Year of Study
                </Label>
                <Select onValueChange={(value) => setValue("year", value)}>
                  <SelectTrigger className="bg-muted/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-body flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter your 10-digit phone number"
                  className="bg-muted/50 border-border focus:border-primary"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-muted/50 border-border focus:border-primary"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Price Summary */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground font-body">Registration Fee</span>
                  <span className="font-display text-2xl font-bold text-primary flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {event.price}
                  </span>
                </div>
                <Button
                  type="submit"
                  variant="electric"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Info Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-muted-foreground text-sm mt-6 font-body"
          >
            By registering, you agree to our terms and conditions. 
            Payment confirmation will be sent to your email.
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
