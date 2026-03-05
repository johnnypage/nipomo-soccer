import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, type Product } from "@shared/shopCatalog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingBag, Clock, X } from "lucide-react";

function DeadlineCountdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Closed");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft === "Closed") {
    return (
      <div className="bg-crimson/20 border border-crimson/40 rounded-lg p-4 text-center">
        <p className="text-crimson font-heading font-semibold text-lg">Pre-order window has closed</p>
      </div>
    );
  }

  return (
    <div className="bg-slate/10 border border-slate/20 rounded-lg p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-warmwhite/70 text-sm mb-1">
        <Clock className="h-4 w-4" />
        <span>Pre-order closes in</span>
      </div>
      <p className="font-integral text-warmwhite text-2xl tracking-wide">{timeLeft}</p>
    </div>
  );
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-warmwhite/80 hover:text-warmwhite transition-colors"
      >
        <X className="h-8 w-8" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function ProductCard({ product, isOpen, onImageClick }: { product: Product; isOpen: boolean; onImageClick?: (src: string, alt: string) => void }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const needsSize = !!product.sizes?.length;
  const needsColor = !!product.colors?.length;
  const canAdd = isOpen && (!needsSize || selectedSize) && (!needsColor || selectedColor);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name}${selectedSize ? ` - ${selectedSize}` : ""}${selectedColor ? ` - ${selectedColor}` : ""}`,
    });
  }

  return (
    <div className="bg-slate/10 border border-slate/20 rounded-xl p-5 flex flex-col">
      {product.image && (
        <div
          className="mb-4 -mx-5 -mt-5 overflow-hidden rounded-t-xl bg-slate/20 cursor-pointer"
          onClick={() => onImageClick?.(product.image!, product.name)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="mb-4">
        <h3 className="font-heading font-bold text-warmwhite text-lg">{product.name}</h3>
        {product.description && (
          <p className="text-warmwhite/60 text-sm mt-1">{product.description}</p>
        )}
        <p className="text-crimson font-bold text-xl mt-2">{formatPrice(product.price)}</p>
      </div>

      <div className="space-y-3 mt-auto">
        {needsSize && (
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="bg-slate/20 border-slate/30 text-warmwhite">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="bg-night border-slate/30">
              {product.sizes!.map((size) => (
                <SelectItem key={size} value={size} className="text-warmwhite">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {needsColor && (
          <div className="flex items-center gap-2">
            {product.colors!.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === c.name
                    ? "border-crimson scale-110"
                    : "border-slate/40 hover:border-warmwhite/60"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {selectedColor && (
              <span className="text-warmwhite/60 text-sm ml-1">{selectedColor}</span>
            )}
          </div>
        )}

        <Button
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default function Shop() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const { data, isLoading } = useQuery<{
    products: Product[];
    isOpen: boolean;
    deadline: string | null;
  }>({
    queryKey: ["/api/shop/products"],
  });

  return (
    <div className="min-h-screen bg-night flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-integral text-warmwhite text-4xl md:text-5xl uppercase tracking-wide mb-3">
              Club Shop
            </h1>
            <p className="text-warmwhite/60 text-lg max-w-2xl mx-auto">
              Pre-order your Nipomo SC gear. All items are made to order and will be
              available for pickup at the club approximately 2 weeks after the pre-order window closes.
            </p>
          </div>

          {data?.deadline && (
            <div className="max-w-md mx-auto mb-10">
              <DeadlineCountdown deadline={data.deadline} />
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate/10 border border-slate/20 rounded-xl p-5 h-64 animate-pulse" />
              ))}
            </div>
          ) : data?.products.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isOpen={data.isOpen}
                  onImageClick={(src, alt) => setLightbox({ src, alt })}
                />
              ))}
            </div>
          ) : (
            <p className="text-warmwhite/60 text-center py-12">No products available right now.</p>
          )}
        </div>
      </main>
      <Footer />

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
