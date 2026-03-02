# hotwest - FamPay Checkout Integration

## Current State
- Dropshipping storefront with product catalog, cart drawer, category browsing, search
- Cart drawer has a "Proceed to Checkout" button that shows a toast "Checkout coming soon!"
- No payment or checkout flow exists

## Requested Changes (Diff)

### Add
- CheckoutModal component: a multi-step checkout dialog that opens when user clicks "Proceed to Checkout"
  - Step 1: Order summary (items, total, free shipping)
  - Step 2: Customer details form (name, phone, email, address)
  - Step 3: FamPay payment screen with:
    - FamPay logo/branding
    - UPI QR code (static QR pointing to a UPI VPA like hotwest@fampay)
    - UPI ID display: hotwest@fampay
    - "Pay via FamPay" deep-link button that opens fampay://pay UPI deep link
    - Copy UPI ID button
    - Payment confirmation step after user claims to have paid
- Order confirmation screen after payment claimed

### Modify
- CartDrawer: update handleCheckout to open the checkout modal instead of showing a toast
- App.tsx: pass checkout open/close state down, or manage it in CartDrawer itself

### Remove
- "Checkout coming soon!" toast behavior

## Implementation Plan
1. Create CheckoutModal.tsx with 4 steps: summary → customer details → FamPay payment → confirmation
2. Use a static UPI VPA (hotwest@fampay) with a real QR code URL via an external QR service
3. Add FamPay deep link button: upi://pay?pa=hotwest@fampay&pn=HotWest&am=<total>&cu=INR
4. Update CartDrawer to open CheckoutModal on checkout button click
5. Validate customer details form fields before advancing
