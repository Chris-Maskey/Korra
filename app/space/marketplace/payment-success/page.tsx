"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const PaymentSuccess = () => {
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    const randomOrderId = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    setOrderNumber(randomOrderId);

    toast.success("Payment completed successfully!");
  }, []);

  return (
    <div className="container max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-2 border-green-100 shadow-lg">
          <CardHeader className="flex flex-col items-center pb-2 gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-center">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-center">
              Your transaction has been completed successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              You will receive a confirmation email shortly with the details of
              your purchase.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/space/markplace">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/space/feed">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
