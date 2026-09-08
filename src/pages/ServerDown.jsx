import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerDown() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <ServerCrash className="h-20 w-20 text-destructive mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
        Service Unavailable
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Our servers are currently unreachable or undergoing maintenance. Please check your connection or try again later.
      </p>
      <Button onClick={handleRetry} size="lg">
        Try Again
      </Button>
    </div>
  );
}