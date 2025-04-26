"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Database } from "@/database.types";
import { useEffect, useState } from "react";
import { useChangeOrderStatus } from "../../hooks/dashboard/use-change-order-status";

type MarketplaceOrder = {
  id: string;
  order_date: string;
  total_price: number;
  quantity: number;
  order_status: Database["public"]["Enums"]["order_status"];
  item: {
    id: string;
    item_name: string;
    item_price: number;
    image_url: string;
  } | null;
  user: {
    id: string;
    full_name: string;
  } | null;
};

type MarketplaceOrderProps = {
  marketplaceOrders: MarketplaceOrder[];
};

const MarketplaceTable = ({ marketplaceOrders }: MarketplaceOrderProps) => {
  const { mutateAsync: changeOrderStatus, isPending } = useChangeOrderStatus();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState(marketplaceOrders);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  useEffect(() => {
    setData(marketplaceOrders);
    setCurrentPage(1);
  }, [marketplaceOrders]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOrderStatusChange = (
    orderId: string,
    newStatus: Database["public"]["Enums"]["order_status"],
  ) => {
    changeOrderStatus({ orderId, orderStatus: newStatus });
  };

  const formatOrderStatus = (
    status: Database["public"]["Enums"]["order_status"],
  ) => {
    switch (status) {
      case "PROCESSING":
        return "⏳ Processing";
      case "PACKAGING":
        return "📦 Packaging";
      case "READY _FOR_SHIPPING":
        return "🚚 Ready for Shipping";
      case "ON_THE_WAY":
        return "🚚 On the Way";
      case "SHIPPED":
        return "✅ Shipped";
      default:
        return status;
    }
  };

  const orderStatuses: Database["public"]["Enums"]["order_status"][] = [
    "PROCESSING",
    "PACKAGING",
    "READY _FOR_SHIPPING",
    "ON_THE_WAY",
    "SHIPPED",
  ];

  return (
    <div>
      <Table>
        <TableCaption>Recent marketplace orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Order #</TableHead>
            <TableHead className="text-center">Buyer Name</TableHead>
            <TableHead className="text-center">Item Purchased</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">Order Status</TableHead>
            <TableHead className="text-center">Order Amount (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium text-center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="text-center">
                {order.user?.full_name}
              </TableCell>
              <TableCell className="text-center">
                {order.item?.item_name}
              </TableCell>
              <TableCell className="text-center">{order.quantity}</TableCell>
              <TableCell className="text-center">
                <Select
                  value={order.order_status}
                  onValueChange={(newValue) =>
                    handleOrderStatusChange(
                      order.id,
                      newValue as Database["public"]["Enums"]["order_status"],
                    )
                  }
                >
                  <SelectTrigger className="text-center" disabled={isPending}>
                    <SelectValue
                      placeholder={formatOrderStatus(order.order_status)}
                      className="text-center"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-center">
                    {orderStatuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-center"
                      >
                        {formatOrderStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">
                ${order.total_price?.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant={"ghost"}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant={"ghost"}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default MarketplaceTable;
