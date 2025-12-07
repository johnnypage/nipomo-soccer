import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({ name: "", email: "", phone: "", program: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: "Nipomo, California",
    },
    {
      icon: Mail,
      label: "Email",
      value: "admin@nipomosc.org",
    },
    {
      icon: Clock,
      label: "Website",
      value: "NipomoSoccer.com",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-4">
            Join the Movement
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
            BE PART OF THE FUTURE
          </h2>
          <p className="text-warmwhite/70 max-w-2xl mx-auto">
            Be part of the future of soccer in Nipomo. Whether you are a parent, a player, 
            a coach, or a sponsor, there is a place for you here.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-slate/20 rounded-md p-8">
            <h3 className="font-heading font-semibold text-xl text-warmwhite mb-6">
              Send Us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="bg-night border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                    required
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-night border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-night border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                    required
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => handleChange("program", value)}
                    required
                  >
                    <SelectTrigger 
                      className="bg-night border-slate/30 text-warmwhite"
                      data-testid="select-program"
                    >
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roots">Roots - Community Recreational Soccer</SelectItem>
                      <SelectItem value="rise">Rise - Spring Development League</SelectItem>
                      <SelectItem value="reign">Reign - Competitive Club Soccer</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="sponsor">Sponsorship</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="bg-night border-slate/30 text-warmwhite placeholder:text-warmwhite/40 min-h-[120px]"
                  required
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite"
                data-testid="button-submit-contact"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-xl text-warmwhite mb-6">
              Contact Information
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-crimson" />
                  </div>
                  <div>
                    <p className="text-warmwhite/60 text-sm">{item.label}</p>
                    <p className="text-warmwhite font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate/10 rounded-md p-6 border border-slate/20">
              <h4 className="font-heading font-semibold text-warmwhite mb-2">
                Player Pathway
              </h4>
              <p className="text-warmwhite/70 text-sm mb-4">
                Roots → Rise → Reign. A connected journey from first steps to advanced 
                competition. Selection for Reign is earned through performance in Roots and Rise.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-warmwhite/80">Registration Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
