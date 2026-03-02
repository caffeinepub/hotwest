import {
  Facebook,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "hotwest.in";

  return (
    <footer className="bg-green-800 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-black text-white">
                hotwest
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              hotwest — Quality products, unbeatable prices, delivered to your
              doorstep.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "Home",
                "Products",
                "New Arrivals",
                "Best Sellers",
                "Deals",
              ].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white">Categories</h4>
            <ul className="space-y-2">
              {[
                "Electronics",
                "Fashion",
                "Home & Kitchen",
                "Sports",
                "Beauty",
                "Toys",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                <span>123 Commerce Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-white/50 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-white/50 shrink-0" />
                <span>support@hotwest.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} hotwest · All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-0.5" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
