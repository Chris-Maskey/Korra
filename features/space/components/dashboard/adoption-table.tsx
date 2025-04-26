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
import { Database } from "@/database.types";
import { useEffect, useState } from "react";

import { formatDate } from "date-fns";

type AdoptionList = {
  adoption_status: Database["public"]["Enums"]["adoption_status"];
  created_at: string | null;
  id: string;
  image_url: string;
  pet_age: number;
  pet_age_unit: Database["public"]["Enums"]["pet_age-Unit"] | null;
  pet_description: string;
  pet_name: string;
  pet_type: string;
  user_id: string;
};

type AdoptionListProps = {
  adoptionList: AdoptionList[];
};

const AdoptionTable = ({ adoptionList }: AdoptionListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState(adoptionList);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  useEffect(() => {
    setData(adoptionList);
    setCurrentPage(1);
  }, [adoptionList]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const adoptionStatus = (
    status: Database["public"]["Enums"]["adoption_status"],
  ) => {
    switch (status) {
      case "ADOPTED":
        return "Adopted";
      case "AVAILABLE":
        return "Available";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Listed Adoptions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Adoption #</TableHead>
            <TableHead className="text-center">Pet</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Age</TableHead>
            <TableHead className="text-center">Adoption Status</TableHead>
            <TableHead className="text-center">Listed Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((adoption, index) => (
            <TableRow key={adoption.id}>
              <TableCell className="font-medium text-center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="text-center">{adoption.pet_name}</TableCell>
              <TableCell className="text-center">{adoption.pet_type}</TableCell>
              <TableCell className="text-center">
                {adoption.pet_age} {adoption.pet_age_unit}
              </TableCell>
              <TableCell className="text-center">
                {adoptionStatus(adoption.adoption_status)}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(adoption.created_at ?? "", "dd/MM/yyyy")}
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

export default AdoptionTable;
