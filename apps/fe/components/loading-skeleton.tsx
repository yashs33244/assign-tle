export function ContestCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col animate-pulse">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-start">
          <div className="h-5 w-24 bg-muted rounded-full"></div>
          <div className="h-8 w-8 bg-muted rounded-md"></div>
        </div>
        <div className="h-6 w-3/4 bg-muted rounded mt-4"></div>
      </div>
      <div className="p-6 pt-2 flex-grow">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded-full"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded-full"></div>
            <div className="h-4 w-40 bg-muted rounded"></div>
          </div>
          <div className="mt-3">
            <div className="h-5 w-28 bg-muted rounded-full mt-2"></div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="h-9 w-full bg-muted rounded"></div>
      </div>
    </div>
  )
}

export function ContestGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ContestCardSkeleton key={i} />
      ))}
    </div>
  )
}

