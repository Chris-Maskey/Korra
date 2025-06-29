"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowLeft,
  Package,
  ShoppingBag,
  Receipt,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency-formatter";
import { createOrder } from "@/features/space/actions/marketplace/order";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderDetails = useMemo(() => {
    const orderId = searchParams.get("orderId");
    const vendorId = searchParams.get("vendorId");
    const productId = searchParams.get("productId");
    const productName = searchParams.get("productName");
    const quantity = Number(searchParams.get("quantity"));
    const totalPrice = Number(searchParams.get("totalPrice"));

    if (!orderId || !productId) return null;

    return {
      orderId,
      vendorId: vendorId || "",
      productId,
      productName: productName || "Product",
      quantity: isNaN(quantity) ? 1 : quantity,
      totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
    };
  }, [searchParams]);

  useEffect(() => {
    if (!orderDetails) {
      router.push("/space/marketplace");
      return;
    }

    createOrder(
      orderDetails.productId,
      orderDetails.quantity,
      orderDetails.vendorId
    ).catch((err) => {
      console.error("Failed to place order:", err);
    });
  }, [orderDetails, router]);

  if (!orderDetails) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-primary/10 p-6 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-xl font-bold text-center">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Thank you for your purchase
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Product summary */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {orderDetails.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {orderDetails.quantity}
                </p>
              </div>
            </div>
            <p className="font-semibold text-sm">
              {formatPrice(orderDetails.totalPrice)}
            </p>
          </div>

          {/* Order details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-muted-foreground">Order ID</span>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {orderDetails.orderId.slice(0, 8)}...
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="text-xs font-medium flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Confirmed
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-bold">
                {formatPrice(orderDetails.totalPrice)}
              </span>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <Package className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              We'll process your order and notify you when it's on the way.
              Check your email for confirmation details.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Link href="/space/marketplace" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Shop More
              </Button>
            </Link>
            {/* <Link href="/space/marketplace" className="flex-1">
              <Button size="sm" className="w-full">
                <Receipt className="w-3.5 h-3.5 mr-2" />
                My Orders
              </Button>
            </Link> */}
          </div>
        </div>

        <div className="bg-muted/30 px-6 py-3 text-xs text-center text-muted-foreground">
          A receipt has been sent to your email address
        </div>
      </motion.div>
    </div>
  );
}
