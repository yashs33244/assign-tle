"use client";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContestStore } from "@/store/useContestStore";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BookmarkButtonProps {
  contestId: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({
  contestId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useContestStore();
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize bookmarked state from initialBookmarked prop or store
  useEffect(() => {
    const storeBookmarked = isBookmarked(contestId);
    setBookmarked(
      initialBookmarked !== undefined ? initialBookmarked : storeBookmarked
    );
  }, [contestId, initialBookmarked, isBookmarked]);

  const handleToggleBookmark = async () => {
    setIsLoading(true);
    try {
      await toggleBookmark(contestId, !bookmarked);
      setBookmarked(!bookmarked);

      // Invalidate the bookmarkedContests query to trigger a refetch
      //@ts-ignore
      queryClient.invalidateQueries(["bookmarkedContests"]);

      toast({
        title: bookmarked ? "Contest unbookmarked" : "Contest bookmarked",
        description: bookmarked
          ? "Contest removed from your bookmarks"
          : "Contest added to your bookmarks",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
}
