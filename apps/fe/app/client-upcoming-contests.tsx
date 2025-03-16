// components/client-upcoming-contests.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Use dynamic import with SSR disabled in this client component
const UpcomingContests = dynamic(
  () => import("@/app/upcoming-contests").then((mod) => mod.UpcomingContests),
  { ssr: false }
);

export function ClientUpcomingContests() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-center">
          <p>Loading contests...</p>
        </div>
      </div>
    );
  }

  return <UpcomingContests />;
}
