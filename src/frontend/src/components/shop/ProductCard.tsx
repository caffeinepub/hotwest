import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Flame,
  Loader2,
  Package,
  ShoppingCart,
  Star,
  Timer,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product } from "../../backend.d";

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => Promise<void>;
}

const categoryLabels: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  homeKitchen: "Home & Kitchen",
  sports: "Sports",
  beauty: "Beauty",
  toys: "Toys",
};

// Fallback product images by product ID (for seeded products without imageUrl)
const PRODUCT_IMAGES: Record<number, string> = {
  1: "/assets/generated/product-electronics-1.dim_400x400.jpg",
  2: "/assets/generated/product-fashion-2.dim_400x400.jpg",
  3: "/assets/generated/product-home-2.dim_400x400.jpg",
  4: "/assets/generated/product-sports-1.dim_400x400.jpg",
  5: "/assets/generated/product-beauty-1.dim_400x400.jpg",
  6: "/assets/generated/product-toys-1.dim_400x400.jpg",
  7: "/assets/generated/product-electronics-2.dim_400x400.jpg",
  8: "/assets/generated/product-fashion-1.dim_400x400.jpg",
};

// Category fallback images
const CATEGORY_IMAGES: Record<string, string> = {
  electronics: "/assets/generated/product-electronics-1.dim_400x400.jpg",
  fashion: "/assets/generated/product-fashion-1.dim_400x400.jpg",
  homeKitchen: "/assets/generated/product-home-1.dim_400x400.jpg",
  sports: "/assets/generated/product-sports-2.dim_400x400.jpg",
  beauty: "/assets/generated/product-beauty-2.dim_400x400.jpg",
  toys: "/assets/generated/product-toys-2.dim_400x400.jpg",
};

const STAR_POSITIONS = ["s1", "s2", "s3", "s4", "s5"] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {STAR_POSITIONS.map((id, i) => (
        <Star
          key={id}
          className={`w-3.5 h-3.5 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
                ? "text-yellow-400 fill-yellow-200"
                : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CountdownTimer({
  initialSeconds,
}: {
  initialSeconds: number;
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isUrgent = timeLeft < 1800; // last 30 min

  return (
    <div
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
        isUrgent
          ? "bg-red-100 text-red-700 animate-pulse"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      <Timer className="w-3 h-3 shrink-0" />
      <span>Deal ends in {formatCountdown(timeLeft)}</span>
    </div>
  );
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const savings = product.originalPrice - product.price;

  // Deterministic values from product.id (no flicker on re-render)
  const productIdNum = Number(product.id);
  const stockCount = ((productIdNum * 7) % 5) + 3;
  const viewerCount = ((productIdNum * 13) % 35) + 12;

  // Countdown initial seconds: varies per card position + product id
  const initialCountdownSeconds =
    ((index % 3) + 2) * 3600 + ((productIdNum * 173) % 3600);

  // Badge type
  const isBestSeller = product.rating >= 4.5;

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const imgSrc = product.imageUrl?.trim()
    ? product.imageUrl
    : (PRODUCT_IMAGES[productIdNum] ??
      CATEGORY_IMAGES[product.category as string] ??
      "/assets/generated/product-electronics-1.dim_400x400.jpg");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
    >
      {/* Top badges row */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-1">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <Badge className="bg-destructive text-destructive-foreground font-black text-xs px-2 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </Badge>
        )}

        {/* Best Seller / Popular Pick badge */}
        <Badge
          className={`text-xs font-bold px-2 py-0.5 rounded-md shadow-sm ml-auto ${
            isBestSeller
              ? "bg-amber-400 text-amber-900 border-amber-500"
              : "bg-yellow-100 text-yellow-800 border-yellow-300"
          }`}
        >
          {isBestSeller ? "⭐ Best Seller" : "👍 Popular Pick"}
        </Badge>
      </div>

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-2xl">
          <span className="bg-white border border-border rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-accent">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              CATEGORY_IMAGES[product.category as string] ??
              "/assets/generated/product-electronics-1.dim_400x400.jpg";
          }}
        />

        {/* Viewing indicator overlay on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          <p className="text-xs font-semibold text-orange-300 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
            {viewerCount} people viewing this now
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full w-fit">
          {categoryLabels[product.category] ?? product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 text-foreground">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">
            ({Number(product.reviewCount).toLocaleString()})
          </span>
        </div>

        {/* Price + Savings */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-xl text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {/* Savings callout */}
          {savings > 0 && (
            <p className="text-xs font-bold text-emerald-600">
              🎉 You save ₹{savings.toLocaleString("en-IN")}!
            </p>
          )}
          {/* Free Shipping */}
          <div className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Truck className="w-3 h-3" />
            <span>Free Shipping</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer initialSeconds={initialCountdownSeconds} />

        {/* Scarcity + Stock row */}
        <div className="flex items-center justify-between gap-2">
          {product.inStock ? (
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-red-600 shrink-0" />
              <span className="text-xs font-bold text-red-600">
                Only {stockCount} left in stock!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs font-medium text-destructive">
                Out of Stock
              </span>
            </div>
          )}
          {product.inStock && (
            <div className="flex items-center gap-0.5">
              <CheckCircle className="w-3 h-3 text-primary shrink-0" />
              <span className="text-xs font-medium text-primary">In Stock</span>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          data-ocid={`product.add_to_cart_button.${index + 1}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || adding}
          size="sm"
          className={`w-full transition-all duration-200 font-semibold mt-auto ${
            added
              ? "bg-green-600 hover:bg-green-600 text-white"
              : "bg-primary hover:bg-green-700 text-primary-foreground shadow-sm hover:shadow-md hover:shadow-primary/20"
          }`}
        >
          {adding ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Adding…
            </>
          ) : added ? (
            <>
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </motion.article>
  );
}
