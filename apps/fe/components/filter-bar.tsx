"use client"

import type { Platform } from "@/types/contest"
import { useContestStore } from "@/store/useContestStore"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FilterBar() {
  const { selectedPlatforms, togglePlatformFilter, selectAllPlatforms, clearPlatformFilters } = useContestStore()

  const platforms: Platform[] = ["Codeforces", "LeetCode", "HackerRank", "CodeChef", "AtCoder", "TopCoder", "Other"]

  return (
    <div className="flex items-center space-x-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter Platforms</span>
            {selectedPlatforms.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                {selectedPlatforms.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Platforms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {platforms.map((platform) => (
            <DropdownMenuCheckboxItem
              key={platform}
              checked={selectedPlatforms.includes(platform)}
              onCheckedChange={() => togglePlatformFilter(platform)}
            >
              {platform}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <div className="flex justify-between p-2">
            <Button variant="outline" size="sm" onClick={selectAllPlatforms} className="text-xs">
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearPlatformFilters} className="text-xs">
              Clear All
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

