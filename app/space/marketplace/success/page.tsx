"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/currency-formatter";
import { createOrder } from "@/features/space/actions/marketplace/order";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderDetails = useMemo(() => {
    const orderId = searchParams.get("orderId");
    const productId = searchParams.get("productId");
    const productName = searchParams.get("productName");
    const quantity = Number(searchParams.get("quantity"));
    const totalPrice = Number(searchParams.get("totalPrice"));

    if (!orderId || !productId) return null;

    return {
      orderId,
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

    createOrder(orderDetails.productId, orderDetails.quantity).catch((err) => {
      console.error("Failed to place order:", err);
    });
  }, [orderDetails, router]);

  if (!orderDetails) return null;

  return (
    <div className="max-w-lg mx-auto my-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center mt-12"
        >
          <CheckCircle className="h-32 w-32 text-green-500" />
        </motion.div>
        <h1 className="text-2xl font-bold mt-4">Order Successful!</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-5">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{orderDetails.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      Quantity: {orderDetails.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {formatPrice(orderDetails.totalPrice)}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">Order ID</span>
                <span className="font-mono bg-muted px-2 py-1 rounded-md">
                  {orderDetails.orderId.slice(0, 20)}...
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium">Total</span>
                <span className="font-bold text-base">
                  {formatPrice(orderDetails.totalPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full mt-1">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">What happens next?</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                You'll receive an email confirmation shortly. We'll process your
                order and notify you when it's on the way. You can track your
                order status in your account dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/space/marketplace">
            <Button className="w-full sm:w-auto text-sm">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/space/orders">
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              View My Orders
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
