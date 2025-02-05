"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Heart } from 'lucide-react';

interface Memory {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: string;
}

interface FeaturedSliderProps {
  memories: Memory[];
}

export default function FeaturedSlider({ memories }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % memories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [memories.length]);

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % memories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((current) => (current - 1 + memories.length) % memories.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      
      {memories.map((memory, index) => (
        <div
          key={memory.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {memory.type === 'image' ? (
            <Image
              src={memory.url}
              alt={memory.caption}
              fill
              className="object-cover"
              priority={index === currentIndex}
            />
          ) : (
            <video
              src={memory.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{memory.caption}</h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(memory.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {memories.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}