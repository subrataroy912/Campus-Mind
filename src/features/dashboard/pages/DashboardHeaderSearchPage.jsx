import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function DashboardHeaderSearchPage() {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is still pending, We are working hard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardHeaderSearchPage;
