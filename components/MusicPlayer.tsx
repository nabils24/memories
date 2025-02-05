"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from "lucide-react";

interface Music {
  id: number;
  music_url: string;
  playlist: string;
  created_at: string;
  name_music: string;
}

interface MusicPlayerProps {
  playlist: Music[];
}

export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    if (!currentSong) return;

    audioRef.current = new Audio(currentSong.music_url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // AutoPlay saat lagu berganti
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
      <div className="max-w-md mx-auto flex flex-col items-center gap-2">
        {/* Nama Musik */}
        <div className="flex items-center gap-2 text-gray-800 font-medium">
          <Music className="h-5 w-5 text-pink-500" />
          <span>{currentSong?.name_music || "Unknown Song"}</span>
        </div>

        <div className="w-full flex items-center gap-4">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="hover:bg-pink-100"
          >
            <SkipBack className="h-6 w-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="hover:bg-pink-100"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="hover:bg-pink-100"
          >
            <SkipForward className="h-6 w-6" />
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-pink-100"
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          {/* Volume Slider */}
          <div className="flex-1">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
