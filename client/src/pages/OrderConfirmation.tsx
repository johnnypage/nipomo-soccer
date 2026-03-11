import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clearCart();

    // Read session_id from the URL and record the order server-side
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    setSaving(true);
    fetch(`/api/shop/order-from-session?session_id=${encodeURIComponent(sessionId)}`)
      .catch(() => {})
      .finally(() => setSaving(false));
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-risegreen/20 flex items-center justify-center">
              {saving ? (
                <Loader2 className="h-8 w-8 text-risegreen animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-risegreen" data-testid="icon-order-confirmed" />
              )}
            </div>
          </div>
          <h1 className="font-integral text-warmwhite text-3xl uppercase tracking-wide mb-3" data-testid="text-order-confirmed">
            Order Confirmed!
          </h1>
          <p className="text-warmwhite/60 text-lg mb-2">
            Thank you for your order. You'll receive a confirmation email from Stripe shortly.
          </p>
          <p className="text-warmwhite/50 text-sm mb-8">
            We'll notify you when your items are ready for pickup at the club.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop">
              <Button className="bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-slate/30 text-warmwhite hover:bg-slate/20" data-testid="button-go-home">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
