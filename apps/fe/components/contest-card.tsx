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
import { ExternalLink, Clock, Calendar, Timer } from "lucide-react";
import {
  formatDistanceToNow,
  format,
  isPast,
  addMinutes,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContestCardProps {
  contest: Contest | PastContest;
  isPastContest?: boolean;
  pcdLink?: string;
}

export function ContestCard({
  contest,
  isPastContest = false,
  pcdLink,
}: ContestCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>("Loading...");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startTime = new Date(contest.startTime);
  const endTime =
    "endTime" in contest && contest.endTime
      ? new Date(contest.endTime)
      : addMinutes(startTime, contest.duration || 0);

  const isEnded = isClient ? isPast(endTime) : false;
  const isLive = isClient ? isPast(startTime) && !isEnded : false;

  useEffect(() => {
    if (!isClient) return;

    const updateRemainingTime = () => {
      if (isLive) {
        const diffSeconds = differenceInSeconds(endTime, new Date());
        if (diffSeconds <= 0) {
          setRemainingTime("Ended");
          return;
        }

        const days = Math.floor(diffSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(diffSeconds % 60);

        if (days > 0) {
          setRemainingTime(`${days}d ${hours}h ${minutes}m remaining`);
        } else if (hours > 0) {
          setRemainingTime(`${hours}h ${minutes}m ${seconds}s remaining`);
        } else if (minutes > 0) {
          setRemainingTime(`${minutes}m ${seconds}s remaining`);
        } else {
          setRemainingTime(`${seconds}s remaining`);
        }
      } else if (!isPast(startTime)) {
        const diffSeconds = differenceInSeconds(startTime, new Date());
        const days = Math.floor(diffSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);

        if (days > 0) {
          setRemainingTime(`Starts in ${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setRemainingTime(`Starts in ${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setRemainingTime(`Starts in ${minutes}m`);
        } else {
          setRemainingTime(`Starts in less than a minute`);
        }
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [isClient, isLive, isPastContest, startTime, endTime]);

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
            <span>{format(startTime, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{`${format(startTime, "p")} - ${format(endTime, "p")}`}</span>
          </div>
          <div className="mt-3">
            {isLive ? (
              <div className="flex flex-col gap-1">
                <Badge variant="destructive" className="mt-2">
                  LIVE NOW
                </Badge>
                <div className="flex items-center gap-2 mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                  <Timer className="h-4 w-4" />
                  <span>{remainingTime}</span>
                </div>
              </div>
            ) : isEnded ? (
              <Badge variant="outline" className="mt-2">
                Ended
              </Badge>
            ) : (
              <div className="flex flex-col gap-1">
                <Badge variant="secondary" className="mt-2">
                  Upcoming
                </Badge>
                <div className="flex items-center gap-2 mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <Timer className="h-4 w-4" />
                  <span>{remainingTime}</span>
                </div>
              </div>
            )}
          </div>
          {isPastContest &&
            (pcdLink || ("pcdLink" in contest && contest.pcdLink)) && (
              <div className="mt-4">
                <Link
                  href={pcdLink || (contest as PastContest).pcdLink || ""}
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
