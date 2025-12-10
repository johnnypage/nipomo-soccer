import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Trophy, Users, Shield, Building, Heart, Mail, Phone, Loader2 } from "lucide-react";
import tournamentLogo from "@assets/image_1765347903367.png";

const divisions = ["10U", "11U", "12U", "13U", "14U", "15U", "16U"];

const benefits = [
  {
    icon: MapPin,
    title: "Easy Travel",
    description: "Nipomo sits in the middle of the state which makes it an ideal location for clubs from every region."
  },
  {
    icon: Calendar,
    title: "Smooth, Organized Experience",
    description: "Clear schedules, balanced brackets, and reliable match flow."
  },
  {
    icon: Shield,
    title: "Quality Officiating",
    description: "Referees assigned and supported by experienced officials."
  },
  {
    icon: Building,
    title: "Great Fields and Setup",
    description: "Clean fields, proper equipment, and a well staffed operations team."
  },
  {
    icon: Heart,
    title: "Family Friendly Environment",
    description: "Good food, clean facilities, and easy parking."
  }
];

export default function Tournament() {
  const { toast } = useToast();
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    clubName: "",
    contactName: "",
    email: "",
    phone: "",
    teamCount: "",
    notes: ""
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData & { divisions: string }) => {
      const response = await apiRequest("POST", "/api/tournament-interest", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Interest Submitted",
        description: "Thank you! We'll notify you when registration opens.",
      });
      setFormData({
        clubName: "",
        contactName: "",
        email: "",
        phone: "",
        teamCount: "",
        notes: ""
      });
      setSelectedDivisions([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit interest. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDivisionToggle = (division: string) => {
    setSelectedDivisions(prev => 
      prev.includes(division) 
        ? prev.filter(d => d !== division)
        : [...prev, division]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDivisions.length === 0) {
      toast({
        title: "Select Divisions",
        description: "Please select at least one division.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({
      ...formData,
      divisions: selectedDivisions.join(", ")
    });
  };

  return (
    <div className="min-h-screen bg-night">
      <Header />
      
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/95 to-night" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="w-full max-w-sm lg:max-w-md flex-shrink-0">
              <img 
                src={tournamentLogo} 
                alt="Reign Winter Classic" 
                className="w-full h-auto"
                data-testid="img-tournament-logo"
              />
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-iceblue mb-4">
                <Calendar className="h-5 w-5" />
                <span className="font-heading font-semibold text-lg">February 20-22, 2025</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-silver mb-6">
                <MapPin className="h-5 w-5" />
                <span className="font-body">Nipomo, California</span>
              </div>
              <p className="text-warmwhite/70 text-lg max-w-xl font-body leading-relaxed">
                The Reign Winter Classic is a new competitive tournament on the Central Coast hosted by Nipomo SC. 
                Teams from Northern California, Southern California, and the Central Valley are invited to join us 
                for a well run, three game weekend of competitive play.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-navy/40 border-navy/60">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-iceblue mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-warmwhite mb-2">Divisions</h3>
                <p className="text-warmwhite/80 font-body text-lg">10U through 16U</p>
              </CardContent>
            </Card>
            
            <Card className="bg-navy/40 border-navy/60">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-display text-silver mb-2">$</div>
                <h3 className="font-heading font-bold text-xl text-warmwhite mb-2">Entry Fees</h3>
                <div className="space-y-1 text-warmwhite/80 font-body">
                  <p>10U and 11U: <span className="text-iceblue font-semibold">$650</span></p>
                  <p>12U and up: <span className="text-iceblue font-semibold">$750</span></p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-navy/40 border-navy/60">
              <CardContent className="p-6 text-center">
                <Trophy className="h-10 w-10 text-iceblue mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-warmwhite mb-2">Game Guarantee</h3>
                <p className="text-warmwhite/80 font-body text-lg">Three games</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-night to-navy/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-warmwhite text-center mb-4">
            Why Teams Attend
          </h2>
          <p className="text-warmwhite/60 text-center mb-12 max-w-2xl mx-auto font-body">
            We're committed to providing an excellent tournament experience for players, coaches, and families.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-navy/30 border-navy/50">
                <CardContent className="p-6">
                  <benefit.icon className="h-8 w-8 text-silver mb-4" />
                  <h3 className="font-heading font-bold text-lg text-warmwhite mb-2">{benefit.title}</h3>
                  <p className="text-warmwhite/70 font-body">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-warmwhite mb-4">
              Submit Your Team Interest
            </h2>
            <p className="text-warmwhite/60 font-body max-w-xl mx-auto">
              This is not a commitment. It simply lets us plan divisions, communicate early details, 
              and give your club priority placement when registration opens.
            </p>
          </div>
          
          <Card className="bg-night border-navy/40">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clubName" className="text-warmwhite">Club Name</Label>
                    <Input 
                      id="clubName"
                      value={formData.clubName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clubName: e.target.value }))}
                      required
                      className="bg-navy/30 border-navy/50 text-warmwhite"
                      data-testid="input-club-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-warmwhite">Contact Name</Label>
                    <Input 
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      required
                      className="bg-navy/30 border-navy/50 text-warmwhite"
                      data-testid="input-contact-name"
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-warmwhite">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-navy/30 border-navy/50 text-warmwhite"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-warmwhite">Phone</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="bg-navy/30 border-navy/50 text-warmwhite"
                      data-testid="input-phone"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-warmwhite">Divisions Interested In</Label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {divisions.map((division) => (
                      <label
                        key={division}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                          selectedDivisions.includes(division)
                            ? "bg-iceblue text-navy font-semibold"
                            : "bg-navy/40 text-warmwhite/80 hover:bg-navy/60"
                        }`}
                        data-testid={`checkbox-division-${division.toLowerCase()}`}
                      >
                        <Checkbox
                          checked={selectedDivisions.includes(division)}
                          onCheckedChange={() => handleDivisionToggle(division)}
                          className="sr-only"
                        />
                        <span className="font-heading font-semibold">{division}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamCount" className="text-warmwhite">Number of Teams</Label>
                  <Input 
                    id="teamCount"
                    type="text"
                    placeholder="e.g., 2 teams"
                    value={formData.teamCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamCount: e.target.value }))}
                    required
                    className="bg-navy/30 border-navy/50 text-warmwhite"
                    data-testid="input-team-count"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-warmwhite">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Any questions or additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-navy/30 border-navy/50 text-warmwhite min-h-[100px]"
                    data-testid="input-notes"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="w-full bg-iceblue hover:bg-iceblue/90 text-navy font-semibold border-iceblue"
                  data-testid="button-submit-interest"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Team Interest"
                  )}
                </Button>
              </form>
              
              <p className="text-warmwhite/50 text-sm text-center mt-4 font-body">
                We will notify all interested teams as soon as registration opens in GotSport.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-warmwhite mb-6">Contact</h2>
          <p className="text-warmwhite/70 font-body mb-6">Questions about bringing your team?</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:info@nipomosc.org" 
              className="flex items-center gap-2 text-iceblue hover:text-iceblue/80 transition-colors"
              data-testid="link-tournament-email"
            >
              <Mail className="h-5 w-5" />
              <span className="font-body">info@nipomosc.org</span>
            </a>
            <div className="hidden sm:block w-px h-6 bg-navy/50" />
            <div className="flex items-center gap-2 text-silver">
              <Phone className="h-5 w-5" />
              <span className="font-body">Tournament Director: Adrian Dalton</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
