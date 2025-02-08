import React from "react";

type AdoptionLayoutProps = {
  children: React.ReactNode;
};

const AdoptionLayout = ({ children }: AdoptionLayoutProps) => {
  return <main className="max-w-screen-xl mx-auto">{children}</main>;
};

export default AdoptionLayout;
