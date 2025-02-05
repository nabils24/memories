"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Sparkles } from 'lucide-react';

import memories from '@/lib/supabase/memories';


interface Memory {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: string;
}

interface MemoriesGalleryProps {
  memories: Memory[];
}

export default function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {memories.map((memory, index) => (
          <Card
            key={memory.id}
            className={`group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-float`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => setSelectedMemory(memory)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                {memory.type === 'image' ? (
                  <Image
                    src={memory.url}
                    alt={memory.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={memory.url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="transform -rotate-12 transition-transform group-hover:rotate-0">
                    <Heart className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-800">{memory.caption}</h3>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {new Date(memory.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm">
          <DialogTitle className="sr-only">
            {selectedMemory?.caption || 'Memory Details'}
          </DialogTitle>
          {selectedMemory && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                {selectedMemory.type === 'image' ? (
                  <Image
                    src={selectedMemory.url}
                    alt={selectedMemory.caption}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={selectedMemory.url}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">{selectedMemory.caption}</h2>
                <p className="text-gray-600 mt-1">
                  {new Date(selectedMemory.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}