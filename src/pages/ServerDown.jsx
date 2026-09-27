import { Wrench, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerDown() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8 text-center">
      <div className="mb-6">
        <Wrench className="h-16 w-16 sm:h-20 sm:w-20 text-primary animate-pulse motion-reduce:animate-none" />
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
        We're polishing things up 🛠️
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
        We are currently performing some scheduled maintenance to improve your experience. We'll be back up and running shortly!
      </p>
      <Button onClick={handleRetry} size="lg" className="min-h-11 gap-2 text-sm font-semibold">
        <RefreshCw className="h-4 w-4" />
        Check Status
      </Button>
    </div>
  );
}
