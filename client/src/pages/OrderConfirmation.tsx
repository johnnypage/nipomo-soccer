import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-risegreen/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-risegreen" />
            </div>
          </div>
          <h1 className="font-integral text-warmwhite text-3xl uppercase tracking-wide mb-3">
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
              <Button className="bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-slate/30 text-warmwhite hover:bg-slate/20">
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
