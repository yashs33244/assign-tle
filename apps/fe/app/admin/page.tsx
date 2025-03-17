"use client";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPastContests, addPCDLink } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Youtube } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [pcdLinks, setPcdLinks] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pastContests"],
    queryFn: fetchPastContests,
  });

  // Extract contests array from the response and provide a default empty array
  const pastContests = data?.contests || [];

  const mutation = useMutation({
    mutationFn: addPCDLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pastContests"] });
      toast({
        title: "PCD link added",
        description: "The PCD link has been successfully added to the contest",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add PCD link",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (contestId: string, value: string) => {
    setPcdLinks((prev) => ({
      ...prev,
      [contestId]: value,
    }));
  };

  const handleSubmit = (contestId: string) => {
    const youtubeLink = pcdLinks[contestId];
    if (!youtubeLink) return;

    // Match the backend API structure - we send contestId and youtubeLink
    mutation.mutate({ contestId, youtubeLink });

    // Clear the input after submission
    setPcdLinks((prev) => ({
      ...prev,
      [contestId]: "",
    }));
  };

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
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage PCD links for past contests
          </p>
        </div>

        {pastContests.length > 0 ? (
          <div className="space-y-4">
            {pastContests.map((contest) => (
              <Card key={contest.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{contest.name}</CardTitle>
                  <CardDescription>
                    {contest.platform} •{" "}
                    {new Date(contest.startTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">
                          YouTube PCD Link
                        </span>
                      </div>
                      <Input
                        placeholder="Enter YouTube PCD link"
                        value={pcdLinks[contest.id] || ""}
                        onChange={(e) =>
                          handleInputChange(contest.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        onClick={() => handleSubmit(contest.id)}
                        disabled={!pcdLinks[contest.id]}
                      >
                        Add Link
                      </Button>
                      <Link
                        href={contest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Check if contest has PCDs and display them */}
                  {contest.pcd && contest.pcd.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        Existing PCD Links:
                      </h3>
                      {contest.pcd.map((pcd) => (
                        <div
                          key={pcd.id}
                          className="p-3 bg-muted rounded-md mb-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Youtube className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium">
                                {pcd.isAutoFetched ? "Auto-fetched" : "Manual"}{" "}
                                PCD
                              </span>
                            </div>
                            <Link
                              href={pcd.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {pcd.youtubeLink}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added: {new Date(pcd.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 p-4 bg-muted rounded-full">
              <Youtube className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No past contests found
            </h2>
            <p className="text-muted-foreground max-w-md">
              There are no past contests available to add PCD links to. Contests
              will appear here once they've concluded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
