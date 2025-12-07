import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

interface ContactFormDialogProps {
  trigger?: React.ReactNode;
  defaultProgram?: string;
}

export default function ContactFormDialog({ trigger, defaultProgram = "reign" }: ContactFormDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: defaultProgram,
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
      
      setFormData({ name: "", email: "", phone: "", program: defaultProgram, message: "" });
      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            className="bg-crimson hover:bg-crimson-dark text-warmwhite"
            data-testid="button-open-contact-dialog"
          >
            Join Interest List
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-night border-slate/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading font-semibold text-xl text-warmwhite">
            Join the Interest List
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                required
                data-testid="dialog-input-name"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                required
                data-testid="dialog-input-email"
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
                className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40"
                required
                data-testid="dialog-input-phone"
              />
            </div>
            <div>
              <Select
                value={formData.program}
                onValueChange={(value) => handleChange("program", value)}
                required
              >
                <SelectTrigger 
                  className="bg-slate/20 border-slate/30 text-warmwhite"
                  data-testid="dialog-select-program"
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
              className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40 min-h-[120px]"
              required
              data-testid="dialog-input-message"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite"
            data-testid="dialog-button-submit"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
