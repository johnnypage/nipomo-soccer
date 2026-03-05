import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@shared/shopCatalog";
import { apiRequest } from "@/lib/queryClient";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await apiRequest("POST", "/api/shop/create-checkout-session", { items });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-night border-slate/30 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-warmwhite font-integral uppercase">
            Your Cart ({totalItems})
          </SheetTitle>
          <SheetDescription className="text-warmwhite/60">
            Review your items and checkout
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-warmwhite/40">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1">
              {items.map((item) => {
                const key = `${item.productId}|${item.size ?? ""}|${item.color ?? ""}`;
                return (
                  <div key={key} className="bg-slate/10 border border-slate/20 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-warmwhite font-heading font-semibold text-sm">
                          {item.name}
                        </p>
                        <div className="text-warmwhite/50 text-xs space-x-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-warmwhite/40 hover:text-crimson transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                          }
                          className="w-7 h-7 rounded bg-slate/20 text-warmwhite flex items-center justify-center hover:bg-slate/30"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-warmwhite text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                          }
                          className="w-7 h-7 rounded bg-slate/20 text-warmwhite flex items-center justify-center hover:bg-slate/30"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-warmwhite font-semibold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate/20 pt-4 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-warmwhite/70 font-heading">Total</span>
                <span className="text-warmwhite font-bold text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  "Checkout"
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
