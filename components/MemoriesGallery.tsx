"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, Sparkles, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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

const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const downloadMedia = async (url: string, fileName: string): Promise<boolean> => {
  try {
    // Tambahkan timestamp untuk mencegah cache
    const timeStamp = new Date().getTime();
    const mediaUrl = `${url}?t=${timeStamp}`;

    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Buat URL untuk download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    // Berikan waktu untuk proses download
    await new Promise(resolve => setTimeout(resolve, 1500));

    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(`Gagal mengunduh media: ${error.message}`);
  }
};

const openInstagram = () => {
  return new Promise<boolean>((resolve) => {
    try {
      // Coba buka Instagram
      window.location.href = 'instagram://story-camera';

      // Check jika Instagram terbuka
      setTimeout(() => {
        if (document.hidden) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 2000);
    } catch (error) {
      resolve(false);
    }
  });
};

export default function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShareToInstagram = async () => {
    if (!selectedMemory) return;

    setIsProcessing(true);

    try {
      if (!isMobileDevice()) {
        toast({
          title: "Perangkat Tidak Didukung",
          description: "Fitur ini hanya tersedia di perangkat mobile",
          duration: 5000,
        });
        return;
      }

      // Generate nama file
      const timestamp = new Date().getTime();
      const fileExtension = selectedMemory.type === 'image' ? 'jpg' : 'mp4';
      const fileName = `memory_${timestamp}.${fileExtension}`;

      // Step 1: Download media
      toast({
        title: "Memproses",
        description: "Sedang mengunduh media...",
        duration: 2000,
      });

      await downloadMedia(selectedMemory.url, fileName);

      // Step 2: Buka Instagram
      toast({
        title: "Berhasil",
        description: "Media telah disimpan, membuka Instagram...",
        duration: 2000,
      });

      const instagramOpened = await openInstagram();

      if (!instagramOpened) {
        // Instagram tidak terinstall
        const isAndroid = /Android/i.test(navigator.userAgent);
        const storeUrl = isAndroid
          ? 'https://play.google.com/store/apps/details?id=com.instagram.android'
          : 'https://apps.apple.com/id/app/instagram/id389801252';

        window.location.href = storeUrl;

        toast({
          title: "Instagram Tidak Ditemukan",
          description: "Silakan install Instagram terlebih dahulu",
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Error full process:', error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat memproses media",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ... Rest of the component code (render part) stays the same ...

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
              <div className="text-center space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedMemory.caption}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {new Date(selectedMemory.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleShareToInstagram}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Memproses...' : 'Bagikan ke Instagram'}
                  </Button>
                </div>

                {isMobileDevice() ? (
                  <p className="text-sm text-gray-500">
                    Media akan disimpan ke galeri dan Instagram akan terbuka otomatis
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Fitur ini hanya tersedia di perangkat mobile
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}