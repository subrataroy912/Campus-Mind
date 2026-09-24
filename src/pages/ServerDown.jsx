import { ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerDown() {
 
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8 text-center">
      <div className="mb-6">
        <ServerCrash className="h-16 w-16 sm:h-20 sm:w-20 text-destructive animate-bounce motion-reduce:animate-none" />
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
        Oops! The hamsters took a coffee break ☕
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
        Our servers are taking an unexpected nap. We are working hard to wake
        them up. Check your connection or give it another shot!
      </p>
      <Button onClick={handleRetry} size="lg" className="min-h-11 gap-2 text-sm font-semibold">
        <RefreshCw className="h-4 w-4" />
        Wake Them Up
      </Button>
    </div>
  );
}
