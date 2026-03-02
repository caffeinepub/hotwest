import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend.d";
import {
  useGetCart,
  useGetCartTotal,
  useRemoveFromCart,
  useUpdateCartItem,
} from "../../hooks/useQueries";
import { CheckoutModal } from "./CheckoutModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: cartItems = [], isLoading } = useGetCart();
  const { data: cartTotal = 0 } = useGetCartTotal();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleQuantityChange = async (
    productId: bigint,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      await removeItem.mutateAsync(productId);
    } else {
      await updateItem.mutateAsync({ productId, quantity: BigInt(newQty) });
    }
  };

  const handleRemove = async (productId: bigint) => {
    await removeItem.mutateAsync(productId);
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              data-ocid="cart.drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Your Cart
                  </h2>
                  {cartItems.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid="cart.close_button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      Your cart is empty
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Browse our products and add something you love!
                    </p>
                  </div>
                  <Button
                    onClick={onClose}
                    className="bg-primary hover:bg-green-700 text-primary-foreground font-semibold mt-2"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-5 py-3">
                    <ul className="space-y-3">
                      {cartItems.map(([cartItem, product], index) => {
                        if (!product) return null;
                        const qty = Number(cartItem.quantity);
                        const imgSrc = product.imageUrl?.trim()
                          ? product.imageUrl
                          : `https://placehold.co/80x80/e8f5e9/2e7d32?text=${encodeURIComponent(product.name.slice(0, 8))}`;

                        return (
                          <motion.li
                            key={String(cartItem.productId)}
                            data-ocid={`cart.item.${index + 1}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.04 }}
                            className="flex gap-3 p-3 bg-accent/40 rounded-xl"
                          >
                            {/* Product image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-accent shrink-0">
                              <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/80x80/e8f5e9/2e7d32?text=Item";
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <p className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
                                {product.name}
                              </p>
                              <p className="font-display font-bold text-primary text-sm">
                                ₹{(product.price * qty).toLocaleString("en-IN")}
                              </p>

                              {/* Quantity controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 bg-white rounded-lg border border-border p-0.5">
                                  <button
                                    type="button"
                                    data-ocid={`cart.quantity_minus_button.${index + 1}`}
                                    onClick={() =>
                                      handleQuantityChange(
                                        cartItem.productId,
                                        qty,
                                        -1,
                                      )
                                    }
                                    disabled={
                                      updateItem.isPending ||
                                      removeItem.isPending
                                    }
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-accent transition-colors disabled:opacity-50"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-7 text-center text-sm font-semibold">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    data-ocid={`cart.quantity_plus_button.${index + 1}`}
                                    onClick={() =>
                                      handleQuantityChange(
                                        cartItem.productId,
                                        qty,
                                        1,
                                      )
                                    }
                                    disabled={updateItem.isPending}
                                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-accent transition-colors disabled:opacity-50"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  data-ocid={`cart.remove_button.${index + 1}`}
                                  onClick={() =>
                                    handleRemove(cartItem.productId)
                                  }
                                  disabled={removeItem.isPending}
                                  className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="border-t border-border px-5 py-4 space-y-4 bg-white">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Shipping</span>
                        <span className="text-primary font-medium">Free</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-display font-black text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          ₹{cartTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <Button
                      data-ocid="cart.checkout_button"
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-green-700 text-primary-foreground font-bold text-base h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      🔒 Secure checkout · Free returns
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={
          cartItems.map(([item, product]) => [
            item,
            product ?? undefined,
          ]) as Array<
            [{ productId: bigint; quantity: bigint }, Product | undefined]
          >
        }
        cartTotal={cartTotal}
        onClearCart={() => {
          setCheckoutOpen(false);
          onClose();
          toast.success("Order placed! Thank you for shopping with HotWest.");
        }}
      />
    </>
  );
}
