"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface DonationModalContextType {
  isOpen: boolean;
  postId: string;
  postOwnerId: string;
  openModal: (postId: string, postOwnerId: string) => void;
  closeModal: () => void;
}

const DonationModalContext = createContext<
  DonationModalContextType | undefined
>(undefined);

export const DonationModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState("");
  const [postOwnerId, setPostOwnerId] = useState("");

  const openModal = (postId: string, postOwnerId: string) => {
    setPostId(postId);
    setPostOwnerId(postOwnerId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <DonationModalContext.Provider
      value={{ isOpen, postId, postOwnerId, openModal, closeModal }}
    >
      {children}
    </DonationModalContext.Provider>
  );
};

export const useDonationModal = () => {
  const context = useContext(DonationModalContext);
  if (context === undefined) {
    throw new Error(
      "useDonationModal must be used within a DonationModalProvider",
    );
  }
  return context;
};
