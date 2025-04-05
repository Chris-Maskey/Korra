import Image from "next/image";

interface ProductImageProps {
  imageUrl: string;
  productName: string;
  priority?: boolean;
}

export function ProductImage({
  imageUrl,
  productName,
  priority = true,
}: ProductImageProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={productName}
        width={600}
        height={600}
        className="object-cover w-full h-[400px] md:h-[500px]"
        priority={priority}
      />
    </div>
  );
}
