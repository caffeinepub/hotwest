import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Package,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "../../backend.d";
import { useClearCart } from "../../hooks/useQueries";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Array<
    [{ productId: bigint; quantity: bigint }, Product | undefined]
  >;
  cartTotal: number;
  onClearCart: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const STEP_LABELS = ["Order", "Details", "Payment", "Done"];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      {([1, 2, 3, 4] as Step[]).map((step) => {
        const isDone = currentStep > step;
        const isActive = currentStep === step;
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              className={`flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                isDone
                  ? "w-7 h-7 bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : isActive
                    ? "w-7 h-7 bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1"
                    : "w-7 h-7 bg-accent text-muted-foreground"
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5" /> : step}
            </div>
            <span
              className={`text-[10px] font-semibold hidden sm:block transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              {STEP_LABELS[step - 1]}
            </span>
            {step < 4 && (
              <div
                className={`w-6 h-0.5 rounded-full transition-all duration-300 ${currentStep > step ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step 1: Order Summary
function OrderSummaryStep({
  cartItems,
  cartTotal,
  onNext,
}: {
  cartItems: CheckoutModalProps["cartItems"];
  cartTotal: number;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="max-h-64 pr-1">
        <ul className="space-y-2.5">
          {cartItems.map(([cartItem, product], index) => {
            if (!product) return null;
            const qty = Number(cartItem.quantity);
            const imgSrc = product.imageUrl?.trim()
              ? product.imageUrl
              : `https://placehold.co/48x48/e8f5e9/2e7d32?text=${encodeURIComponent(product.name.slice(0, 4))}`;
            return (
              <li
                key={String(cartItem.productId)}
                data-ocid={`checkout.item.${index + 1}`}
                className="flex items-center gap-3 p-2.5 bg-accent/40 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent shrink-0">
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/48x48/e8f5e9/2e7d32?text=Item";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Qty: {qty}</p>
                </div>
                <p className="text-sm font-bold text-primary shrink-0">
                  ₹{(product.price * qty).toLocaleString("en-IN")}
                </p>
              </li>
            );
          })}
        </ul>
      </ScrollArea>

      <Separator />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Shipping
          </span>
          <span className="text-primary font-semibold">FREE</span>
        </div>
        <Separator className="my-1" />
        <div className="flex justify-between font-black text-base">
          <span>Total</span>
          <span className="text-primary">
            ₹{cartTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <Button
        data-ocid="checkout.next_button"
        onClick={onNext}
        className="w-full bg-primary hover:bg-green-700 text-primary-foreground font-bold h-11 shadow-md shadow-primary/20 group"
      >
        Continue
        <ChevronRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}

// Step 2: Customer Details
function CustomerDetailsStep({
  details,
  onChange,
  onNext,
  onBack,
}: {
  details: CustomerDetails;
  onChange: (d: CustomerDetails) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  const validate = () => {
    const e: Partial<CustomerDetails> = {};
    if (!details.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(details.phone))
      e.phone = "Enter a valid 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
      e.email = "Enter a valid email";
    if (!details.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="checkout-name" className="text-sm font-semibold">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="checkout-name"
            data-ocid="checkout.name_input"
            placeholder="Rahul Sharma"
            value={details.name}
            onChange={(e) => onChange({ ...details, name: e.target.value })}
            className={`mt-1 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="checkout-phone" className="text-sm font-semibold">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="checkout-phone"
            data-ocid="checkout.phone_input"
            placeholder="9876543210"
            value={details.phone}
            onChange={(e) =>
              onChange({
                ...details,
                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
              })
            }
            className={`mt-1 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
            autoComplete="tel"
            inputMode="numeric"
            type="tel"
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="checkout-email" className="text-sm font-semibold">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="checkout-email"
            data-ocid="checkout.email_input"
            placeholder="rahul@example.com"
            type="email"
            value={details.email}
            onChange={(e) => onChange({ ...details, email: e.target.value })}
            className={`mt-1 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="checkout-address" className="text-sm font-semibold">
            Delivery Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="checkout-address"
            data-ocid="checkout.address_input"
            placeholder="House No., Street, City, State - PIN Code"
            value={details.address}
            onChange={(e) => onChange({ ...details, address: e.target.value })}
            className={`mt-1 min-h-[80px] resize-none ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
            autoComplete="street-address"
          />
          {errors.address && (
            <p className="text-xs text-destructive mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          data-ocid="checkout.back_button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-11"
        >
          <ChevronLeft className="mr-1.5 w-4 h-4" />
          Back
        </Button>
        <Button
          data-ocid="checkout.next_button"
          onClick={handleNext}
          className="flex-[2] bg-primary hover:bg-green-700 text-primary-foreground font-bold h-11 shadow-md shadow-primary/20 group"
        >
          Continue to Payment
          <ChevronRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}

// Step 3: FamPay Payment
function FamPayStep({
  cartTotal,
  onNext,
  onBack,
}: {
  cartTotal: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const upiId = "hotwest@fampay";
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=HotWest&am=${cartTotal}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = upiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* FamPay header card */}
      <div className="rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        {/* Brand bar */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2.5 flex items-center justify-between">
          <img
            src="/assets/generated/fampay-logo-transparent.dim_300x100.png"
            alt="FamPay"
            className="h-8 object-contain"
          />
          <span className="text-xs font-bold bg-black/20 text-black/80 px-2 py-0.5 rounded-full">
            UPI Payment
          </span>
        </div>

        {/* Amount */}
        <div className="px-4 py-4 text-center">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">
            Amount to Pay
          </p>
          <p className="font-black text-3xl text-foreground">
            ₹{cartTotal.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Including free shipping
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center px-4 pb-3">
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm">
            <img
              src={qrUrl}
              alt="Scan to pay via UPI"
              className="w-36 h-36 object-contain"
            />
            <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium">
              Scan with any UPI app
            </p>
          </div>
        </div>

        {/* UPI ID copy */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-amber-200 px-3 py-2.5">
            <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="flex-1 text-sm font-mono font-semibold text-foreground">
              {upiId}
            </span>
            <button
              type="button"
              data-ocid="checkout.copy_upi_button"
              onClick={handleCopy}
              aria-label="Copy UPI ID"
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FamPay CTA */}
      <a
        href={upiDeepLink}
        data-ocid="checkout.pay_fampay_button"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-black font-black text-base shadow-lg shadow-amber-300/40 hover:shadow-xl hover:shadow-amber-400/40 transition-all active:scale-[0.98]"
      >
        <img
          src="/assets/generated/fampay-logo-transparent.dim_300x100.png"
          alt=""
          className="h-5 object-contain"
          aria-hidden="true"
        />
        Pay via FamPay App
      </a>

      <p className="text-center text-xs text-muted-foreground -mt-1">
        Or pay via any other UPI app using the QR or UPI ID above
      </p>

      <div className="flex gap-2">
        <Button
          data-ocid="checkout.back_button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-11"
        >
          <ChevronLeft className="mr-1.5 w-4 h-4" />
          Back
        </Button>
        <Button
          data-ocid="checkout.confirm_payment_button"
          variant="outline"
          onClick={onNext}
          className="flex-[2] h-11 border-primary/40 text-primary hover:bg-primary/5 font-semibold"
        >
          <Check className="mr-1.5 w-4 h-4" />I have completed the payment
        </Button>
      </div>
    </div>
  );
}

// Step 4: Order Confirmed
function OrderConfirmedStep({
  orderNumber,
  onClose,
}: {
  orderNumber: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <CheckCircle2 className="w-11 h-11 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="text-xl font-black text-foreground">
          Order Confirmed! 🎉
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
          Thank you for shopping with HotWest! Your order has been placed and
          will be delivered soon.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full bg-accent/50 rounded-2xl px-5 py-4 border border-border"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
          Order Number
        </p>
        <p className="font-mono font-black text-2xl text-primary tracking-wider">
          #{orderNumber}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="text-xs text-muted-foreground bg-accent/40 rounded-xl px-4 py-3 w-full flex items-center gap-2"
      >
        <Truck className="w-4 h-4 text-primary shrink-0" />
        <span>
          You'll receive a confirmation SMS on your registered mobile number.
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full"
      >
        <Button
          data-ocid="checkout.success_continue_button"
          onClick={onClose}
          className="w-full bg-primary hover:bg-green-700 text-primary-foreground font-bold h-12 shadow-md shadow-primary/20"
        >
          Continue Shopping
        </Button>
      </motion.div>
    </div>
  );
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [orderNumber] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const clearCartMutation = useClearCart();

  const handleClose = () => {
    onClose();
    // Reset after dialog closes
    setTimeout(() => {
      setStep(1);
      setCustomerDetails({ name: "", phone: "", email: "", address: "" });
    }, 300);
  };

  const handleConfirmOrder = async () => {
    setStep(4);
    try {
      await clearCartMutation.mutateAsync();
      onClearCart();
    } catch {
      // ignore — cart state will resync
    }
  };

  const stepTitles: Record<Step, string> = {
    1: "Order Summary",
    2: "Delivery Details",
    3: "Pay with FamPay",
    4: "Order Confirmed",
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        data-ocid="checkout.modal"
        className="max-w-lg w-full p-0 gap-0 overflow-hidden rounded-2xl"
      >
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="font-black text-lg text-foreground">
            {stepTitles[step]}
          </DialogTitle>
        </DialogHeader>

        <StepIndicator currentStep={step} />

        <Separator />

        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              {step === 1 && (
                <OrderSummaryStep
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <CustomerDetailsStep
                  details={customerDetails}
                  onChange={setCustomerDetails}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <FamPayStep
                  cartTotal={cartTotal}
                  onNext={handleConfirmOrder}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <OrderConfirmedStep
                  orderNumber={orderNumber}
                  onClose={handleClose}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
