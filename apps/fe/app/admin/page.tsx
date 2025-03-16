"use client"

import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPastContests, addPCDLink } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ExternalLink, Youtube } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [pcdLinks, setPcdLinks] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: pastContests = [], isLoading } = useQuery({
    queryKey: ["pastContests"],
    queryFn: fetchPastContests,
  })

  const mutation = useMutation({
    mutationFn: addPCDLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pastContests"] })
      toast({
        title: "PCD link added",
        description: "The PCD link has been successfully added to the contest",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add PCD link",
        variant: "destructive",
      })
    },
  })

  const handleInputChange = (contestId: string, value: string) => {
    setPcdLinks((prev) => ({
      ...prev,
      [contestId]: value,
    }))
  }

  const handleSubmit = (contestId: string) => {
    const pcdLink = pcdLinks[contestId]
    if (!pcdLink) return

    mutation.mutate({ contestId, pcdLink })

    // Clear the input after submission
    setPcdLinks((prev) => ({
      ...prev,
      [contestId]: "",
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-center">
              <p>Loading past contests...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage PCD links for past contests</p>
        </div>

        <div className="space-y-4">
          {pastContests.map((contest) => (
            <Card key={contest.id}>
              <CardHeader className="pb-2">
                <CardTitle>{contest.name}</CardTitle>
                <CardDescription>
                  {contest.platform} • {new Date(contest.startTime).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">PCD Link</span>
                    </div>
                    <Input
                      placeholder="Enter YouTube PCD link"
                      value={pcdLinks[contest.id] || ""}
                      onChange={(e) => handleInputChange(contest.id, e.target.value)}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={() => handleSubmit(contest.id)} disabled={!pcdLinks[contest.id]}>
                      Save Link
                    </Button>
                    <Link href={contest.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {contest.pcdLink && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Current PCD Link:</span>
                      </div>
                      <Link href={contest.pcdLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{contest.pcdLink}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

