type MarketplaceLayoutProps = {
  children: React.ReactNode;
};

const AdoptionLayout = ({ children }: MarketplaceLayoutProps) => {
  return <main className="max-w-screen-xl mx-auto">{children}</main>;
};

export default AdoptionLayout;
