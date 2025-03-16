"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContestStore } from "@/store/useContestStore"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface BookmarkButtonProps {
  contestId: string
}

export function BookmarkButton({ contestId }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useContestStore()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const bookmarked = isBookmarked(contestId)

  const handleToggleBookmark = async () => {
    setIsLoading(true)
    try {
      await toggleBookmark(contestId, !bookmarked)
      toast({
        title: bookmarked ? "Contest unbookmarked" : "Contest bookmarked",
        description: bookmarked ? "Contest removed from your bookmarks" : "Contest added to your bookmarks",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
    </Button>
  )
}

