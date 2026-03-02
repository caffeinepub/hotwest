import { Toaster } from "@/components/ui/sonner";
import { Tag } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Category, type Product } from "./backend.d";
import { CartDrawer } from "./components/shop/CartDrawer";
import { CategoryBar } from "./components/shop/CategoryBar";
import { Footer } from "./components/shop/Footer";
import { HeroSection } from "./components/shop/HeroSection";
import { Navbar } from "./components/shop/Navbar";
import { ProductGrid } from "./components/shop/ProductGrid";
import { useActor } from "./hooks/useActor";
import {
  useAddToCart,
  useGetAllProducts,
  useGetCart,
  useGetProductsByCategory,
  useSearchProducts,
  useSeedProducts,
} from "./hooks/useQueries";

type View = "home" | "products";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [seeded, setSeeded] = useState(false);

  const { actor, isFetching: actorLoading } = useActor();
  const seedProducts = useSeedProducts();
  const addToCartMutation = useAddToCart();
  const { data: cartItems = [] } = useGetCart();

  // Determine which products to show
  const allProductsQuery = useGetAllProducts();
  const categoryProductsQuery = useGetProductsByCategory(selectedCategory);
  const searchResultsQuery = useSearchProducts(searchQuery);

  const cartItemCount = cartItems.reduce(
    (sum, [item]) => sum + Number(item.quantity),
    0,
  );

  // Seed products once on first actor load
  // biome-ignore lint/correctness/useExhaustiveDependencies: seedProducts.mutate is stable, intentionally omitted
  useEffect(() => {
    if (actor && !actorLoading && !seeded) {
      setSeeded(true);
      seedProducts.mutate(undefined, {
        onError: () => {
          // Seed errors are silent — products may already exist
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor, actorLoading, seeded]);

  const handleAddToCart = useCallback(
    async (product: Product) => {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: BigInt(1),
      });
      toast.success(`${product.name} added to cart`, {
        description: `₹${product.price.toLocaleString("en-IN")}`,
        duration: 2500,
      });
    },
    [addToCartMutation],
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedCategory(null);
    }
  }, []);

  const handleCategorySelect = useCallback((category: Category | null) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setView("products");
  }, []);

  // Resolve which products to display
  const getDisplayProducts = (): Product[] => {
    if (searchQuery) {
      return searchResultsQuery.data ?? [];
    }
    if (selectedCategory) {
      return categoryProductsQuery.data ?? [];
    }
    return allProductsQuery.data ?? [];
  };

  const isProductsLoading = (() => {
    if (searchQuery) return searchResultsQuery.isLoading;
    if (selectedCategory) return categoryProductsQuery.isLoading;
    return allProductsQuery.isLoading;
  })();

  const displayProducts = getDisplayProducts();

  const getGridTitle = () => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (selectedCategory) {
      const labels: Record<string, string> = {
        electronics: "Electronics",
        fashion: "Fashion",
        homeKitchen: "Home & Kitchen",
        sports: "Sports",
        beauty: "Beauty",
        toys: "Toys",
      };
      return labels[selectedCategory] ?? selectedCategory;
    }
    return "All Products";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" richColors />

      <Navbar
        cartItemCount={cartItemCount}
        onCartOpen={() => setCartOpen(true)}
        onNavigate={(v) => {
          setView(v);
          if (v === "home") {
            setSelectedCategory(null);
            setSearchQuery("");
          }
        }}
        activeView={view}
        onSearch={handleSearch}
      />

      <main className="flex-1">
        {/* Home view */}
        {view === "home" && (
          <>
            <HeroSection onShopNow={() => setView("products")} />

            {/* Featured Categories section on home */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="font-display font-black text-3xl text-foreground">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground mt-1">
                  Explore our wide range of product categories
                </p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    cat: Category.electronics,
                    label: "Electronics",
                    emoji: "📱",
                    bg: "from-blue-50 to-blue-100/50",
                  },
                  {
                    cat: Category.fashion,
                    label: "Fashion",
                    emoji: "👗",
                    bg: "from-pink-50 to-pink-100/50",
                  },
                  {
                    cat: Category.homeKitchen,
                    label: "Home & Kitchen",
                    emoji: "🏠",
                    bg: "from-yellow-50 to-yellow-100/50",
                  },
                  {
                    cat: Category.sports,
                    label: "Sports",
                    emoji: "⚽",
                    bg: "from-orange-50 to-orange-100/50",
                  },
                  {
                    cat: Category.beauty,
                    label: "Beauty",
                    emoji: "💄",
                    bg: "from-purple-50 to-purple-100/50",
                  },
                  {
                    cat: Category.toys,
                    label: "Toys",
                    emoji: "🎮",
                    bg: "from-green-50 to-accent",
                  },
                ].map(({ cat, label, emoji, bg }, i) => (
                  <motion.button
                    key={cat}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategorySelect(cat)}
                    className={`bg-gradient-to-b ${bg} rounded-2xl p-4 text-center border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="text-3xl mb-2">{emoji}</div>
                    <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {label}
                    </p>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Featured Products on home */}
            <section className="py-4 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-display font-black text-3xl text-foreground">
                    Featured Products
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Handpicked deals just for you
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView("products")}
                  className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
                >
                  View All
                  <Tag className="w-3.5 h-3.5" />
                </button>
              </motion.div>
              <ProductGrid
                products={allProductsQuery.data?.slice(0, 10) ?? []}
                isLoading={allProductsQuery.isLoading}
                onAddToCart={handleAddToCart}
              />
            </section>
          </>
        )}

        {/* Products view */}
        {view === "products" && (
          <>
            <CategoryBar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ProductGrid
                products={displayProducts}
                isLoading={isProductsLoading}
                onAddToCart={handleAddToCart}
                title={getGridTitle()}
              />
            </div>
          </>
        )}
      </main>

      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
