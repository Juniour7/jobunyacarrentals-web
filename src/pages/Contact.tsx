import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Facebook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("✅ Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <Navbar />

      <section className="pt-32 pb-20 ">
        <div className="container mx-auto md:max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-heading text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-accent to-[#09d3ef] bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services or want a custom quote? We’d love
              to hear from you — drop us a message and our friendly team will
              respond promptly.
            </p>
          </motion.div>

          {/* 🟢 Contact Information Cards at the Top */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {/* Address */}
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 mx-auto">
                <MapPin className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-center mb-1">Address</h3>
              <p className="text-muted-foreground text-center text-sm">
                Kahawa Wendani, Nairobi
                <br />
                Kenya
              </p>
            </div>

            {/* Phone */}
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 mx-auto">
                <Phone className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-center mb-1">Call</h3>
              <p className="text-muted-foreground text-center">
                <a
                  href="tel:+254723565952"
                  className="hover:text-accent transition-colors text-sm"
                >
                  +254 723 565 952
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 mx-auto">
                <Mail className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-center mb-1">Email</h3>
              <span className="text-muted-foreground flex flex-wrap text-sm  text-center space-y-1">
                <a
                  href="mailto:info@jobunyacarrentals.co.ke"
                  className="hover:text-accent text-center"
                >
                  info@jobunyacarrentals.co.ke
                </a>
                <a
                  href="mailto:bookings@jobunyacarrentals.co.ke"
                  className="hover:text-accent text-center"
                >
                  bookings@jobunyacarrentals.co.ke
                </a>
              </span>
            </div>

            {/* Hours */}
            <div className="group bg-white/80 backdrop-blur-md border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4 group-hover:bg-accent/20 mx-auto">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-center mb-1">
                Business Hours
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                Mon–Fri: 8:00 AM – 6:00 PM
                <br />
                Sun: 9:00 AM – 4:00 PM
                <br />
                Sat: Closed
              </p>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <h3 className="font-heading text-xl font-semibold mb-4">Follow Us</h3>
            <a
              href="https://www.facebook.com/p/Jobunya-Car-Rentals-61576418253226/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-md border border-gray-100 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-accent/10"
            >
              <Facebook className="w-5 h-5 text-accent" />
              <span className="font-medium">Facebook</span>
            </a>
          </motion.div>

          {/* 📝 Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 md:max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-2xl font-semibold mb-6 text-gray-800 text-center">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="mt-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="mt-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="mt-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your rental needs..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="mt-2 min-h-[140px] focus-visible:ring-accent"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full mt-4 text-lg font-semibold py-6"
              >
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
