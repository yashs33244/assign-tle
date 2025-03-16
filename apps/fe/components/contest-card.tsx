"use client";
import { useState, useEffect } from "react";
import type { Contest, PastContest } from "@/types/contest";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/bookmark-button";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow, format, isPast, addMinutes } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContestCardProps {
  contest: Contest | PastContest;
  isPastContest?: boolean;
}

export function ContestCard({
  contest,
  isPastContest = false,
}: ContestCardProps) {
  // Use client-side rendering only to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle date calculations only on client side
  const startTime = new Date(contest.startTime);
  const endTime =
    "endTime" in contest && contest.endTime
      ? new Date(contest.endTime)
      : addMinutes(startTime, contest.duration || 0);

  // These state checks will only run on the client
  const isEnded = isClient ? isPast(endTime) : false;
  const isLive = isClient ? isPast(startTime) && !isEnded : false;

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      Codeforces: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      LeetCode:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      HackerRank:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      CodeChef: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      AtCoder:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      TopCoder: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    };
    return colors[platform] || colors["Other"];
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${getPlatformColor(contest.platform)}`}>
            {contest.platform}
          </Badge>
          {isClient && <BookmarkButton contestId={contest.id} />}
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">
          {contest.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{isClient ? format(startTime, "PPP") : "Loading..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {isClient
                ? `${format(startTime, "p")} - ${format(endTime, "p")}`
                : "Loading..."}
            </span>
          </div>
          <div className="mt-3">
            {isClient &&
              (isLive ? (
                <Badge variant="destructive" className="mt-2">
                  LIVE NOW
                </Badge>
              ) : isEnded ? (
                <Badge variant="outline" className="mt-2">
                  Ended
                </Badge>
              ) : (
                <Badge variant="secondary" className="mt-2">
                  Starts {formatDistanceToNow(startTime, { addSuffix: true })}
                </Badge>
              ))}
          </div>
          {isClient &&
            isPastContest &&
            "pcdLink" in contest &&
            contest.pcdLink && (
              <div className="mt-4">
                <Link
                  href={contest.pcdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Watch PCD</span>
                  </Button>
                </Link>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full flex items-center gap-2">
            <span>Visit Contest</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
