"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <main className="h-full ">
      <div className="flex w-full items-center justify-end">
        <ModeToggle />
      </div>
      <h1 className="text-7xl font-bold tracking-tight">Korra</h1>
    </main>
  );
}
