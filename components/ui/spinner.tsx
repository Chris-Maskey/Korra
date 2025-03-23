import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        size === "sm" && "h-4 w-4 border-2",
        size === "md" && "h-8 w-8 border-[3px]",
        size === "lg" && "h-12 w-12 border-4",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
