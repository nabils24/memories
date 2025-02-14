"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CelebrationConfetti from './CelebrationConfetti';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Heart,
  Sparkles,
  Camera,
  Candy,
  Loader2,
  Share2,
  Bookmark,
  Download,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Memory {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: string;
  category: string;
}

interface Comment {
  id: number;
  text: string;
  timestamp: number;
}

interface MemoriesGalleryProps {
  memories: Memory[];
}

// Fungsi untuk mengecek perangkat mobile
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Fungsi untuk mengunduh media dengan menambahkan timestamp agar cache dilewati
const downloadMedia = async (url: string, fileName: string): Promise<boolean> => {
  try {
    const timeStamp = new Date().getTime();
    const mediaUrl = `${url}?t=${timeStamp}`;
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    // Berikan waktu untuk proses download
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  } catch (error: any) {
    console.error('Download error:', error);
    throw new Error(`Gagal mengunduh media: ${error.message}`);
  }
};

// Fungsi untuk membuka Instagram
const openInstagram = () => {
  return new Promise<boolean>((resolve) => {
    try {
      window.location.href = 'instagram://story-camera';
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

// Komponen LazyVideo: hanya me-render video ketika sudah terlihat pada viewport
const LazyVideo = ({
  src,
  className,
  ...props
}: {
  src: string;
  className?: string;
  [key: string]: any;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        <video src={src} {...props} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

// Variants untuk animasi modal
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

export default function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // State untuk like (count & boolean)
  const [likes, setLikes] = useState<{ [key: number]: { count: number; liked: boolean } }>({});
  // State untuk komentar per memory
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  // State untuk bookmark (favorit)
  const [bookmarks, setBookmarks] = useState<{ [key: number]: boolean }>({});
  // State untuk view count
  const [views, setViews] = useState<{ [key: number]: number }>({});
  // State untuk mengacak urutan memories
  const [shuffledMemories, setShuffledMemories] = useState<Memory[]>(memories);
  // State untuk filter berdasarkan kategori
  // (tambahan opsi "Bookmarked" untuk menampilkan memory favorit)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // State untuk fullscreen mode pada modal
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // State untuk input komentar
  const [commentInput, setCommentInput] = useState('');

  // Inisialisasi likes, komentar, bookmarks, dan views dari localStorage (jika ada)
  useEffect(() => {
    const storedLikes = localStorage.getItem('memoryLikes');
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    } else {
      const initialLikes: { [key: number]: { count: number; liked: boolean } } = {};
      memories.forEach((memory) => {
        initialLikes[memory.id] = { count: 0, liked: false };
      });
      setLikes(initialLikes);
    }
    const storedComments = localStorage.getItem('memoryComments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
    const storedBookmarks = localStorage.getItem('memoryBookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
    const storedViews = localStorage.getItem('memoryViews');
    if (storedViews) {
      setViews(JSON.parse(storedViews));
    }
  }, [memories]);

  // Update urutan memories jika prop berubah
  useEffect(() => {
    setShuffledMemories(memories);
  }, [memories]);

  // Setiap kali modal dibuka, tambahkan view count untuk memory yang dipilih
  useEffect(() => {
    if (selectedMemory) {
      setViews((prev) => {
        const newCount = (prev[selectedMemory.id] || 0) + 1;
        const updated = { ...prev, [selectedMemory.id]: newCount };
        localStorage.setItem('memoryViews', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedMemory]);

  // Fungsi untuk toggle like dan menyimpan ke localStorage
  const handleToggleLike = (id: number) => {
    setLikes((prev) => {
      const current = prev[id] || { count: 0, liked: false };
      const newLiked = !current.liked;
      const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);
      const newLikes = { ...prev, [id]: { count: newCount, liked: newLiked } };
      localStorage.setItem('memoryLikes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  // Fungsi untuk toggle bookmark dan menyimpan ke localStorage
  const handleToggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const newBookmarks = { ...prev, [id]: !prev[id] };
      localStorage.setItem('memoryBookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  // Fungsi untuk membagikan memory melalui Web Share API atau fallback ke clipboard
  const handleShare = async (memory: Memory) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.caption,
          text: memory.caption,
          url: memory.url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(memory.url);
        toast({
          title: 'Link disalin',
          description: 'Link memory telah disalin ke clipboard',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Gagal menyalin',
          description: 'Tidak dapat menyalin link ke clipboard',
          variant: 'destructive',
          duration: 3000,
        });
      }
    }
  };

  // Fungsi untuk membagikan ke Instagram
  const handleShareToInstagram = async () => {
    if (!selectedMemory) return;
    setIsProcessing(true);
    try {
      if (!isMobileDevice()) {
        toast({
          title: 'Perangkat Tidak Didukung',
          description: 'Fitur ini hanya tersedia di perangkat mobile',
          duration: 5000,
        });
        return;
      }
      const timestamp = new Date().getTime();
      const fileExtension = selectedMemory.type === 'image' ? 'jpg' : 'mp4';
      const fileName = `memory_${timestamp}.${fileExtension}`;
      toast({
        title: 'Memproses',
        description: 'Sedang mengunduh media...',
        duration: 2000,
      });
      await downloadMedia(selectedMemory.url, fileName);
      toast({
        title: 'Berhasil',
        description: 'Media telah disimpan, membuka Instagram...',
        duration: 2000,
      });
      const instagramOpened = await openInstagram();
      if (!instagramOpened) {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const storeUrl = isAndroid
          ? 'https://play.google.com/store/apps/details?id=com.instagram.android'
          : 'https://apps.apple.com/id/app/instagram/id389801252';
        window.location.href = storeUrl;
        toast({
          title: 'Instagram Tidak Ditemukan',
          description: 'Silakan install Instagram terlebih dahulu',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error full process:', error);
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan saat memproses media',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Fungsi untuk mengacak urutan memories
  const handleShuffle = () => {
    const shuffled = [...shuffledMemories].sort(() => Math.random() - 0.5);
    setShuffledMemories(shuffled);
  };

  // Filter memories berdasarkan kategori yang dipilih
  const filteredMemories = shuffledMemories.filter((memory) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Bookmarked') return bookmarks[memory.id];
    return memory.category === selectedCategory;
  });

  // Dapatkan daftar kategori unik dari memories
  const categories = Array.from(new Set(memories.map((memory) => memory.category)));

  // Toggle fullscreen mode di modal
  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      if (modalRef.current && modalRef.current.requestFullscreen) {
        await modalRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Tambah komentar untuk memory yang dipilih
  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMemory || !commentInput.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      text: commentInput,
      timestamp: Date.now(),
    };
    setComments((prev) => {
      const updated = {
        ...prev,
        [selectedMemory.id]: [...(prev[selectedMemory.id] || []), newComment],
      };
      localStorage.setItem('memoryComments', JSON.stringify(updated));
      return updated;
    });
    setCommentInput('');
  };

  // Fungsi untuk mengunduh media (tombol Download di modal)
  const handleDownload = async () => {
    if (!selectedMemory) return;
    try {
      const timestamp = new Date().getTime();
      const fileExtension = selectedMemory.type === 'image' ? 'jpg' : 'mp4';
      const fileName = `memory_${timestamp}.${fileExtension}`;
      toast({
        title: 'Memproses',
        description: 'Sedang mengunduh media...',
        duration: 2000,
      });
      await downloadMedia(selectedMemory.url, fileName);
      toast({
        title: 'Berhasil',
        description: 'Media telah diunduh',
        duration: 2000,
      });
    } catch (error: any) {
      console.error('Download failed:', error);
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan saat mengunduh media',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <div>
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row sm:space-x-4 items-center w-full">
          <div className="flex flex-col sm:flex-row sm:space-x-4 items-center w-full sm:w-auto">
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">{selectedCategory}</SelectTrigger>
              <SelectContent>
          <SelectGroup>
            <SelectItem value="All">Semua</SelectItem>
            <SelectItem value="Bookmarked">Bookmarked</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleShuffle} variant="outline" className="w-full sm:w-auto mt-4 sm:mt-0">
            Acak Memories
          </Button>
        </div>
      </header>

      {/* Grid gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {filteredMemories.map((memory, index) => (
          <motion.div
            key={memory.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            whileDrag={{ scale: 1.05 }}
            whileHover={{ scale: 1.03, rotate: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
          >
            <Card
              className="group cursor-pointer rounded-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-float"
              onClick={() => setSelectedMemory(memory)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  {memory.type === 'image' ? (
                    <Image
                      src={memory.url}
                      alt={memory.caption}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <LazyVideo
                      src={memory.url}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                  )}
                  {/* Overlay animasi saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="transform -rotate-12 transition-transform group-hover:rotate-0">
                      <Heart className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  {/* Tombol Bookmark */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBookmark(memory.id);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${bookmarks[memory.id] ? 'text-yellow-500' : 'text-gray-500'}`}
                    />
                  </button>
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
                  <div className="flex items-center text-gray-600 mt-1">
                    <Candy className="w-4 h-4 mr-1" />
                    <span className="text-sm">{memory.category}</span>
                  </div>
                  {/* Baris tombol Like dan Share */}
                  <div className="mt-2 flex items-center justify-between">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(memory.id);
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <Heart
                        className={`w-5 h-5 ${likes[memory.id]?.liked ? 'text-red-500' : 'text-gray-500'}`}
                      />
                      <span className="text-sm text-gray-600">
                        {likes[memory.id]?.count || 0}
                      </span>
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(memory);
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-1 focus:outline-none"
                    >
                      <Share2 className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Share</span>
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal untuk detail memory */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        {selectedMemory?.confetti === true ? (
          <CelebrationConfetti />
        ) : (
          <div></div>
        )}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent
                ref={modalRef}
                className="w-full max-w-full sm:max-w-4xl lg:w-max bg-white backdrop-blur-sm p-4 sm:p-6"
              >
                <DialogTitle className="sr-only">
                  {selectedMemory.caption || 'Memory Details'}
                </DialogTitle>
                <div className="space-y-4">
                  {/* Header modal: tombol fullscreen */}
                  <div className="flex justify-start">
                    <button
                      onClick={handleToggleFullscreen}
                      className="p-2 rounded-md border border-gray-300"
                      title="Toggle Fullscreen"
                    >
                      <motion.span whileTap={{ rotate: 360 }}>
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5 text-gray-800" />
                        ) : (
                          <Maximize className="w-5 h-5 text-gray-800" />
                        )}
                      </motion.span>
                    </button>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {selectedMemory.type === 'image' ? (
                      <Image
                        src={selectedMemory.url}
                        alt={selectedMemory.caption}
                        fill
                        loading="lazy"
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
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        {selectedMemory.caption}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {new Date(selectedMemory.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dilihat: {views[selectedMemory.id] || 0} kali
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Fitur ini hanya tersedia di perangkat mobile untuk Instagram.
                    </p>
                  </div>

                  {/* Bagian komentar */}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Komentar
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                      <AnimatePresence>
                        {(comments[selectedMemory.id] || []).map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-2 bg-gray-100 rounded-md text-left"
                          >
                            <p className="text-gray-700">{comment.text}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {!(comments[selectedMemory.id] || []).length && (
                        <p className="text-gray-500 text-sm">Belum ada komentar.</p>
                      )}
                    </div>
                    <form
                      onSubmit={handleAddComment}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Tulis komentar..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      />
                      <Button type="submit" className="w-full sm:w-auto">
                        Kirim
                      </Button>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}
