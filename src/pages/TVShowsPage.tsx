import { Navigation } from "@/components/Navigation";
import { TVShows } from "@/components/TVShows";
import { Hero } from "@/components/Hero";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/services/tmdb";
import { useState, useEffect } from "react";

const TVShowsPage = () => {
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: trending = [] } = useQuery({
    queryKey: ["trending", "tv"],
    queryFn: () => tmdb.getTrending("tv"),
  });

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (trending.length > 0) {
        setCurrentShowIndex((prev) => 
          prev === trending.length - 1 ? 0 : prev + 1
        );
      }
    }, 10000); // Changed to 10 seconds

    return () => clearInterval(interval);
  }, [trending.length, isPaused]);

  const randomShow = trending.length > 0 
    ? trending[currentShowIndex]
    : null;

  if (!randomShow) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navigation onMediaTypeChange={() => {}} />
      <Hero 
        movie={randomShow} 
        onModalOpen={() => setIsPaused(true)}
        onModalClose={() => setIsPaused(false)}
      />
      <div className="pt-4">
        <TVShows />
      </div>
    </div>
  );
};

export default TVShowsPage;