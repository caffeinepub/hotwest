import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Shield, Truck } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onShopNow: () => void;
}

const perks = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Shield, label: "Secure Payments" },
  { icon: RefreshCw, label: "Easy Returns" },
];

export function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-accent">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/8" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 items-center gap-8 min-h-[480px]">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-12 lg:py-16 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              India's Fastest Growing Dropship Store
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-foreground"
            >
              Shop the{" "}
              <span className="text-primary relative">
                Hottest
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                >
                  <path
                    d="M2 6 Q50 2 100 4 Q150 6 198 2"
                    stroke="oklch(0.42 0.155 145)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Deals Online
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-muted-foreground text-lg max-w-md leading-relaxed"
            >
              Discover premium products across electronics, fashion, home &
              kitchen, and more — delivered straight to your door.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                data-ocid="hero.shop_now_button"
                onClick={onShopNow}
                size="lg"
                className="bg-primary hover:bg-green-700 text-primary-foreground font-semibold px-8 shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onShopNow}
                className="border-primary/30 text-primary hover:bg-accent hover:border-primary/60 font-semibold"
              >
                View All Deals
              </Button>
            </motion.div>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-5 pt-2"
            >
              {perks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="hidden lg:flex items-center justify-center py-8"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 -m-6 rounded-3xl border-2 border-dashed border-primary/15 animate-[spin_40s_linear_infinite]" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
                <img
                  src="/assets/generated/hero-banner.dim_1200x500.jpg"
                  alt="Shop hottest deals at hotwest"
                  className="w-full max-w-lg object-cover"
                  loading="eager"
                />
                {/* Overlay chip */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <p className="font-display font-bold text-primary text-sm">
                    🔥 Trending Now
                  </p>
                  <p className="text-xs text-muted-foreground">Updated daily</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative bg-primary/5 border-t border-primary/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-primary/10">
          {[
            { value: "10,000+", label: "Products" },
            { value: "50,000+", label: "Happy Customers" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-4">
              <p className="font-display font-black text-xl text-primary">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
