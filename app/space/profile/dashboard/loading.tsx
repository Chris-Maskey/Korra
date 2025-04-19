import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <main className="h-[50rem] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin size-10 text-primary" />
        <span className="text-muted-foreground">Analyzing your profile</span>
      </div>
    </main>
  );
}
