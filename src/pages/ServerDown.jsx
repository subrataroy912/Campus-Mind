import { ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerDown() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6">
        <ServerCrash className="h-20 w-20 text-destructive animate-bounce" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
        Oops! The hamsters took a coffee break ☕
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Our servers are taking an unexpected nap. We are working hard to wake them up. Check your connection or give it another shot!
      </p>
      <Button onClick={handleRetry} size="lg" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Wake Them Up
      </Button>
    </div>
  );
}