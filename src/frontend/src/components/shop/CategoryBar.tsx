import {
  Dumbbell,
  Gamepad2,
  Grid3X3,
  Home,
  Shirt,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Category } from "../../backend.d";

interface CategoryBarProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
}

const categories: {
  id: Category | null;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: null, label: "All", icon: Grid3X3 },
  { id: Category.electronics, label: "Electronics", icon: Smartphone },
  { id: Category.fashion, label: "Fashion", icon: Shirt },
  { id: Category.homeKitchen, label: "Home & Kitchen", icon: Home },
  { id: Category.sports, label: "Sports", icon: Dumbbell },
  { id: Category.beauty, label: "Beauty", icon: Sparkles },
  { id: Category.toys, label: "Toys", icon: Gamepad2 },
];

export function CategoryBar({
  selectedCategory,
  onCategorySelect,
}: CategoryBarProps) {
  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map(({ id, label, icon: Icon }, index) => {
            const isSelected = selectedCategory === id;
            return (
              <motion.button
                key={label}
                data-ocid={`category.tab.${index + 1}`}
                onClick={() => onCategorySelect(id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-accent text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
