import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../../backend.d";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => Promise<void>;
  title?: string;
}

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  title,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div data-ocid="products.loading_state">
        {title && (
          <div className="mb-6">
            <Skeleton className="h-7 w-48" />
          </div>
        )}
        <div
          data-ocid="products.grid"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {[
            "sk1",
            "sk2",
            "sk3",
            "sk4",
            "sk5",
            "sk6",
            "sk7",
            "sk8",
            "sk9",
            "sk10",
          ].map((id) => (
            <ProductSkeleton key={id} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        data-ocid="products.empty_state"
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
          <PackageSearch className="w-10 h-10 text-primary/60" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          No Products Found
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Try adjusting your search or browse a different category to find what
          you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-2xl text-foreground mb-6"
        >
          {title}
        </motion.h2>
      )}
      <div
        data-ocid="products.grid"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {products.map((product, index) => (
          <ProductCard
            key={String(product.id)}
            product={product}
            index={index}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
