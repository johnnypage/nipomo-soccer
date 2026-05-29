import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupRequest } from "@shared/challengeValidation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginRequest = z.infer<typeof loginSchema>;

const inputClasses =
  "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";

export default function SignupForm() {
  const { toast } = useToast();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const signupForm = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", consentGiven: false },
  });

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const activeForm = mode === "signup" ? signupForm : loginForm;
  const isSubmitting = activeForm.formState.isSubmitting;

  async function onSignupSubmit(data: SignupRequest) {
    try {
      await apiRequest("POST", "/api/auth/signup", data);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    }
  }

  async function onLoginSubmit(data: LoginRequest) {
    try {
      await apiRequest("POST", "/api/auth/login", data);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-warmwhite mb-2">Check your email</h2>
        <p className="text-warmwhite/55 max-w-sm mx-auto">
          We sent a login link to{" "}
          <span className="text-warmwhite font-medium">{submittedEmail}</span>. Click it to get
          started.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-warmwhite/40 text-sm">
          <Mail className="w-4 h-4" />
          <span>Check your spam folder if you don't see it</span>
        </div>
      </div>
    );
  }

  if (mode === "login") {
    return (
      <div className="space-y-6">
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <div>
            <label className="block text-warmwhite/70 text-sm mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClasses}
              {...loginForm.register("email")}
            />
            {loginForm.formState.errors.email && (
              <p className="text-crimson text-sm mt-1">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Login Link"
            )}
          </button>
        </form>

        <p className="text-center text-warmwhite/40 text-sm">
          New here?{" "}
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="text-gold hover:text-gold/80 font-medium transition-colors"
          >
            Sign up instead
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
        <div>
          <label className="block text-warmwhite/70 text-sm mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClasses}
            {...signupForm.register("email")}
          />
          {signupForm.formState.errors.email && (
            <p className="text-crimson text-sm mt-1">
              {signupForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            className="mt-1 h-4 w-4 rounded border-warmwhite/30 bg-warmwhite/5 text-crimson focus:ring-gold accent-crimson"
            {...signupForm.register("consentGiven")}
          />
          <label htmlFor="consent" className="text-warmwhite/55 text-sm leading-relaxed">
            By signing up, you consent to your child's first name and challenge participation being
            displayed on the public leaderboard.
          </label>
        </div>
        {signupForm.formState.errors.consentGiven && (
          <p className="text-crimson text-sm">
            {signupForm.formState.errors.consentGiven.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Login Link"
          )}
        </button>
      </form>

      <p className="text-center text-warmwhite/40 text-sm">
        Already signed up?{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-gold hover:text-gold/80 font-medium transition-colors"
        >
          Request a new login link
        </button>
      </p>
    </div>
  );
}
