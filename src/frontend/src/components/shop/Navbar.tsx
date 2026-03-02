import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  cartItemCount: number;
  onCartOpen: () => void;
  onNavigate: (view: "home" | "products") => void;
  activeView: string;
  onSearch: (query: string) => void;
}

export function Navbar({
  cartItemCount,
  onCartOpen,
  onNavigate,
  activeView,
  onSearch,
}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onNavigate("products");
      setSearchOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      onSearch(e.target.value.trim());
    } else {
      onSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/hotwest-logo-transparent.dim_200x200.png"
              alt="hotwest logo"
              className="w-9 h-9 object-contain"
            />
            <span className="font-display text-xl font-bold text-primary tracking-tight">
              hotwest
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              data-ocid="navbar.home_link"
              onClick={() => onNavigate("home")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === "home"
                  ? "bg-accent text-primary font-semibold"
                  : "text-foreground hover:bg-accent hover:text-primary"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="navbar.products_link"
              onClick={() => onNavigate("products")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === "products"
                  ? "bg-accent text-primary font-semibold"
                  : "text-foreground hover:bg-accent hover:text-primary"
              }`}
            >
              Products
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-open"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <Input
                      ref={searchRef}
                      data-ocid="navbar.search_input"
                      placeholder="Search products…"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="h-9 text-sm border-primary/30 focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        onSearch("");
                      }}
                      className="h-9 w-9 p-0 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="search-closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchOpen(true)}
                      className="h-9 w-9 p-0 hover:bg-accent hover:text-primary"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              data-ocid="navbar.cart_button"
              onClick={onCartOpen}
              className="relative p-2 rounded-lg hover:bg-accent transition-colors text-foreground hover:text-primary"
              aria-label={`Cart (${cartItemCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-3 space-y-1">
                <button
                  type="button"
                  data-ocid="navbar.home_link"
                  onClick={() => {
                    onNavigate("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === "home"
                      ? "bg-accent text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  data-ocid="navbar.products_link"
                  onClick={() => {
                    onNavigate("products");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === "products"
                      ? "bg-accent text-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  Products
                </button>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-1 pt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-ocid="navbar.search_input"
                      placeholder="Search products…"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-9 text-sm"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
