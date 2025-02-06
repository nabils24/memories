"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Image as ImageIcon, Music, Video, X, Plus, MessageCircleHeart, Heart, Compass } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link';
import { format } from 'date-fns';

import { uploadPhoto, uploadVideo, uploadMusic } from '@/lib/supabase/upload.js';
import memoriesSB from '@/lib/supabase/memories.js';
import categoriesSB from '@/lib/supabase/categories.js';
import musicSB from '@/lib/supabase/music.js';
import titleSB from '@/lib/supabase/title.js';

const availableIcons = [
  { name: 'MessageHeart', icon: MessageCircleHeart },
  { name: 'Heart', icon: Heart },
  { name: 'Compass', icon: Compass },
];

export default function AdminPage() {

  const siapakamu = sessionStorage.getItem("siapakamu");

  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false);
  const [create, setCreate] = useState(false);

  // State for tracking original and modified data
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState([]);
  const [titleData, setTitleData] = useState('');
  const [originalData, setOriginalData] = useState({
    memories: [],
    categories: [],
    backgroundMusic: [],
    titleData: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all data on component mount
  const fetchAllData = async () => {
    try {
      const [memoriesData, categoriesData, musicData, titleData] = await Promise.all([
        memoriesSB.getMemories(),
        categoriesSB.getCategories(),
        musicSB.getMusic(),
        titleSB.getTitle()
      ]);

      setMemories(memoriesData);
      setCategories(categoriesData);
      setBackgroundMusic(musicData);
      setTitleData(titleData[0]?.title || '');

      // Store original data for change detection
      setOriginalData({
        memories: memoriesData,
        categories: categoriesData,
        backgroundMusic: musicData,
        titleData: titleData[0]?.title || ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  useEffect(() => {
    if (siapakamu !== "true") {
      window.location.href = "/siapakamu";
    }
  }, [siapakamu]);

  useEffect(() => {
    fetchAllData();
  }, [
  ]);

  // Check if there are unsaved changes
  const hasChanges = () => {
    return JSON.stringify(memories) !== JSON.stringify(originalData.memories) ||
      JSON.stringify(categories) !== JSON.stringify(originalData.categories) ||
      backgroundMusic !== originalData.backgroundMusic ||
      titleData !== originalData.titleData;
  };

  // Memory operations
  const handleAddMemory = async (type) => {
    try {
      setCreate(true);
      const newMemory = {
        type, // 'image' or 'video'
        url: '',
        caption: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: ''
      };
      const createdMemory = await memoriesSB.createMemory(newMemory);
      if (createdMemory) {
        setMemories(prevMemories => [...prevMemories, createdMemory]);
        fetchAllData();
        setCreate(false);
        toast({
          title: "Berhasil Menambahkan!",
          description: format(new Date(), 'yyyy-MM-dd')
        })

      }
    } catch (error) {
      console.error('Error adding memory:', error);
      toast({
        variant: "destructive",
        title: "Error adding memory",
        description: "Please try again."
      });
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      await memoriesSB.deleteMemory(id);
      setMemories(memories.filter(memory => memory.id !== id));
      toast({
        title: "Berhasil Menghapus!",
        description: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast({
        variant: "destructive",
        title: "Error deleting memory",
        description: "Please try again."
      });
    }
  };

  const handleUpdateMemory = async (id, field, value) => {
    const updatedMemory = memories.find(m => m.id === id);
    if (updatedMemory) {
      const newMemory = { ...updatedMemory, [field]: value };
      setMemories(memories.map(m => m.id === id ? newMemory : m));
    }
  };

  // Category operations
  const handleAddCategory = async () => {
    try {
      const newCategory = {
        name: '',
        description: '',
        icon: 'Heart'
      };
      const createdCategory = await categoriesSB.createCategory(newCategory);
      fetchAllData();
      setCategories([...categories, createdCategory]);
      toast({
        title: "Berhasil Menambahkan!",
        description: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        variant: "destructive",
        title: "Error adding category",
        description: "Please try again."
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesSB.deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      fetchAllData();
      toast({
        title: "Berhasil Menghapus!",
        description: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: "Please try again."
      });
    }
  };

  const handleUpdateCategory = (id, field, value) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  // Music operations
  const handleAddMusic = async () => {
    try {
      const newMusic = {
        music_url: '',
        playlist: '',
        name_music: ''
      };
      const createdMusic = await musicSB.createMusic(newMusic);
      setBackgroundMusic([...backgroundMusic, createdMusic]);
      fetchAllData();
      toast({
        title: "Berhasil Menambahkan!",
        description: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Error adding music:', error);
      toast({
        variant: "destructive",
        title: "Error adding music",
        description: "Please try again."
      });
    }
  };

  const handleUpdateMusic = (id, field, value) => {
    setBackgroundMusic(backgroundMusic.map(music =>
      music.id === id ? { ...music, [field]: value } : music
    ));
  };

  const handleDeletemusic = async (id) => {
    try {
      await musicSB.deleteMusic(id);
      setBackgroundMusic(backgroundMusic.filter(music => music.id !== id));
      toast({
        title: "Berhasil Menghapus!",
        description: format(new Date(), 'yyyy-MM-dd')
      })
    } catch (error) {
      console.error('Error deleting music:', error);
      toast({
        variant: "destructive",
        title: "Error deleting music",
        description: "Please try again."
      });
    }
  };


  // File upload handler
  const handleFileUpload = async (memory, file) => {
    try {
      let url;
      if (memory.type === 'image') {
        url = await uploadPhoto(file);
      } else if (memory.type === 'video') {
        url = await uploadVideo(file);
      }

      if (url) {
        url = 'https://gyditryslflaxxjupqvi.supabase.co/storage/v1/object/public/' + url.fullPath;
        const updatedMemory = { ...memory, url };
        await memoriesSB.updateMemory(memory.id, updatedMemory);
        setMemories(memories.map(m =>
          m.id === memory.id ? updatedMemory : m
        ));
        toast({
          title: "Berhasil Upload!",
          description: format(new Date(), 'yyyy-MM-dd')
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: error.error
      });
    }
  };

  const handleMusicUpload = async (music, file) => {
    try {
      setIsUploading(true);
      let url = await uploadMusic(file);
      if (url) {
        url = 'https://gyditryslflaxxjupqvi.supabase.co/storage/v1/object/public/' + url.fullPath;
        const updatedMusic = { ...music, music_url: url };
        await musicSB.updateMusic(music.id, updatedMusic);
        setBackgroundMusic(backgroundMusic.map(m =>
          m.id === music.id ? updatedMusic : m
        ));
        fetchAllData();
        toast({
          title: "Berhasil Upload!",
          description: format(new Date(), 'yyyy-MM-dd')
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: "Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Save all changes
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save memories changes
      const memoriesPromises = memories.map(memory => {
        const originalMemory = originalData.memories.find(m => m.id === memory.id);
        if (!originalMemory || JSON.stringify(memory) !== JSON.stringify(originalMemory)) {
          return memoriesSB.updateMemory(memory.id, memory);
        }
        return Promise.resolve();
      });

      // Save categories changes
      const categoriesPromises = categories.map(category => {
        const originalCategory = originalData.categories.find(c => c.id === category.id);
        if (!originalCategory || JSON.stringify(category) !== JSON.stringify(originalCategory)) {
          return categoriesSB.updateCategory(category.id, category);
        }
        return Promise.resolve();
      });

      // Save background music if changed
      const musicPromises = backgroundMusic.map(music => {
        const originalMusic = originalData.backgroundMusic.find(m => m.id === music.id);
        if (!originalMusic || JSON.stringify(music) !== JSON.stringify(originalMusic)) {
          return musicSB.updateMusic(music.id, music);
        }
        return Promise.resolve();
      });

      // Save title if changed
      const titlePromise = titleData !== originalData.titleData
        ? titleSB.updateTitle({ title: titleData })
        : Promise.resolve();

      await Promise.all([
        ...memoriesPromises,
        ...categoriesPromises,
        ...musicPromises,
        titlePromise
      ]);

      // Update original data after successful save
      setOriginalData({
        memories,
        categories,
        backgroundMusic,
        titleData
      });
      toast({
        title: "Berhasil Menyimpan!",
        description: "Simpan!"
      })

    } catch (error) {
      console.error('Error saving changes:', error);

    } finally {
      setIsLoading(false);
    }
  };

  //HandleBackToMemories
  const handleBackToMemories = async () => {
    sessionStorage.removeItem("siapakamu");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges() || isLoading}
              className="px-8"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>

            <Button onClick={handleBackToMemories} variant="outline" className="w-full md:w-auto">Back to Memories</Button>

          </div>
        </div>

        <Tabs defaultValue="memories" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="memories">Memory</TabsTrigger>
            <TabsTrigger value="categories">Category</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="title">Title</TabsTrigger>
          </TabsList>

          {/* Memories Tab DONE */}
          <TabsContent value="memories" className="space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={() => handleAddMemory('image')}
                className="flex items-center gap-2"
                disabled={create}
              >
                <ImageIcon className="w-4 h-4" />
                {create ? "Mengirim..." : "Add Image"}
              </Button>
              <Button
                onClick={() => handleAddMemory('video')}
                className="flex items-center gap-2"
                disabled={create}
              >
                <Video className="w-4 h-4" />
                {create ? "Mengirim..." : "Add Video"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memories.map((memory) => (
                <Card key={memory?.id || crypto.randomUUID()} className="relative">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 z-10"
                    onClick={() => memory?.id && handleDeleteMemory(memory.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>File Upload {memory?.type === 'image' ? 'image' : 'video'}</Label>
                      {memory?.type && (
                        <Input
                          type="file"
                          accept={memory.type === 'image' ? 'image/*' : 'video/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && memory) {
                              handleFileUpload(memory, file);
                            }
                          }}
                        />
                      )}
                      {memory?.url && memory?.type && (
                        <div className="mt-2">
                          {memory.type === 'image' ? (
                            <img
                              src={memory.url}
                              alt={memory.caption || 'Memory image'}
                              className="max-h-40 object-cover rounded-md"
                            />
                          ) : (
                            <video
                              src={memory.url}
                              className="max-h-40 w-full"
                              controls
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Caption</Label>
                      <Input
                        value={memory?.caption || ''}
                        onChange={(e) => memory?.id && handleUpdateMemory(memory.id, 'caption', e.target.value)}
                        placeholder="Enter caption"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={memory?.date || ''}
                        onChange={(e) => memory?.id && handleUpdateMemory(memory.id, 'date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={memories.find(m => m.id === memory?.id)?.category || ''}
                        onValueChange={(value) => memory?.id && handleUpdateMemory(memory.id, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {categories.find(cat => cat.id === memory?.category)?.name || 'Select category'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category?.id} value={category?.id || ''}>
                              {category?.name || 'Unnamed Category'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>



                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {memories.length === 0 && (
              <div className="text-center text-gray-500">
                No memories available. Add a new memory to get started.
              </div>
            )}
          </TabsContent>

          {/* Categories Tab DONE */}
          <TabsContent value="categories" className="space-y-6">
            <Button
              onClick={handleAddCategory}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="relative">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 z-10"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={category.name || ''}
                        onChange={(e) => handleUpdateCategory(category.id, 'name', e.target.value)}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={category.description || ''}
                        onChange={(e) => handleUpdateCategory(category.id, 'description', e.target.value)}
                        placeholder="Enter category description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={category.icon || 'Heart'}
                        onValueChange={(value) => handleUpdateCategory(category.id, 'icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center gap-2">
                                <icon.icon className="w-4 h-4" />
                                {icon.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Music Tab DONE*/}
          <TabsContent value="music" className="space-y-6">
            <Button
              onClick={handleAddMusic}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Music
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {backgroundMusic.map((music) => (
                <Card key={music.id} className="relative">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 z-10"
                    onClick={() => handleDeletemusic(music.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Music Upload(MP3 Only)</Label>
                      <Input
                        type="file"
                        accept="audio/mp3"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleMusicUpload(music, file);
                          }
                        }}
                      />
                      {music.music_url && (
                        <audio controls>
                          <source src={music.music_url} type="audio/mp3" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Urutan lagu</Label>
                      <Input
                        value={music.playlist || ''}
                        onChange={(e) => handleUpdateMusic(music.id, 'playlist', e.target.value)}
                        placeholder="Enter playlist"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama musik</Label>
                      <Input
                        value={music.name_music || ''}
                        onChange={(e) => handleUpdateMusic(music.id, 'name_music', e.target.value)}
                        placeholder="Enter music name"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>

          {/* Title Tab */}
          <TabsContent value="title">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={titleData}
                    onChange={(e) => setTitleData(e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}