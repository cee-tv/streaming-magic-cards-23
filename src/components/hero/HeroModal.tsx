import { Movie } from "@/services/tmdb";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { ArrowLeft, Play, Download, Plus, Check } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { toast } from "sonner";
import { EpisodesList } from "../movie/EpisodesList";

interface HeroModalProps {
  movie: Movie;
  showModal: boolean;
  trailerKey: string | null;
  movieDetails: any;
  seasonDetails: any;
  selectedSeason: number;
  selectedEpisode: number;
  onClose: () => void;
  onPlayClick: () => void;
  onSeasonChange: (season: string) => void;
  onEpisodeSelect: (episodeNumber: number) => void;
}

export const HeroModal = ({
  movie,
  showModal,
  trailerKey,
  movieDetails,
  seasonDetails,
  selectedSeason,
  selectedEpisode,
  onClose,
  onPlayClick,
  onSeasonChange,
  onEpisodeSelect,
}: HeroModalProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const handleWatchlistToggle = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast.success("Removed from watchlist");
    } else {
      addToWatchlist(movie);
      toast.success("Added to watchlist");
    }
  };

  return (
    <DialogContent className="max-w-3xl h-[90vh] p-0 bg-black overflow-y-auto">
      <DialogTitle className="sr-only">{movie.title || movie.name}</DialogTitle>
      <DialogDescription className="sr-only">Details for {movie.title || movie.name}</DialogDescription>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Return</span>
        </Button>
        {trailerKey ? (
          <div className="relative">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button 
                  className="rounded-full bg-white hover:bg-white/90 text-black"
                  onClick={onPlayClick}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white hover:border-white bg-black/30 text-white"
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist(movie.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white hover:border-white bg-black/30 text-white"
                  onClick={() => {
                    const downloadUrl = movie.media_type === 'movie'
                      ? `https://dl.vidsrc.vip/movie/${movie.id}`
                      : `https://dl.vidsrc.vip/tv/${movie.id}/${selectedSeason}/${selectedEpisode}`;
                    window.open(downloadUrl, '_blank');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
            <p className="text-white">No trailer available</p>
          </div>
        )}
      </div>
      <div className="p-4 mt-2">
        <h2 className="text-2xl font-bold mb-2 text-white">{movie.title || movie.name}</h2>
        <p className="text-gray-400 mb-4">{movie.overview}</p>

        {movie.media_type === 'tv' && movieDetails?.seasons && seasonDetails?.episodes && (
          <EpisodesList
            seasons={movieDetails.seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={onSeasonChange}
            episodes={seasonDetails.episodes}
            onEpisodeSelect={onEpisodeSelect}
          />
        )}
      </div>
    </DialogContent>
  );
};