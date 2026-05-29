import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/challenge/SignupForm";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { AlertCircle } from "lucide-react";

export default function ChallengeSignup() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/challenge" />;
  }

  const params = new URLSearchParams(window.location.search);
  const hasExpiredError = params.get("error") === "expired";

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
            Summer Skills Challenge
          </h1>
          <p className="text-warmwhite/55 max-w-lg mx-auto">
            Sign up to track your kids' progress, earn points, and win prizes all summer long.
          </p>
        </div>

        {hasExpiredError && (
          <div className="mb-6 flex items-center gap-3 bg-crimson/10 border border-crimson/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-5 h-5 text-crimson flex-shrink-0" />
            <p className="text-warmwhite/70 text-sm">
              That link has expired. Please request a new one.
            </p>
          </div>
        )}

        <SignupForm />
      </main>
      <Footer />
    </div>
  );
}
