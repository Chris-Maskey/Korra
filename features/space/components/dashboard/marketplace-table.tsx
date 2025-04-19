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
import { useEffect, useState } from "react";

type MarketplaceOrder = {
  id: string;
  order_date: string;
  total_price: number;
  quantity: number;
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
              <TableCell className="text-center">🚚 Shipped</TableCell>
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
