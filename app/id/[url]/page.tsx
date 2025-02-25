"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemoriesGallery from '@/components/MemoriesGallery';
import FeaturedSlider from '@/components/FeaturedSlider';
import CategorySection from '@/components/CategorySection';
import MusicPlayer from '@/components/MusicPlayer';
import Loading from "@/components/Loading";

import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { HeartHandshake, Sparkles } from 'lucide-react';

import memoriesSB from '@/lib/supabase/memories.js';
import categoriesSB from '@/lib/supabase/categories.js';
import sliderSB from '@/lib/supabase/slider.js';
import titleSB from '@/lib/supabase/title.js';
import musicSB from '@/lib/supabase/music.js';
import userSB from '@/lib/supabase/user.js';

export default function Home({ params }) {
  const router = useRouter();
  const [user, setUser] = useState({
    id: null,
    name: null,
    avatar: null,
    created_at: null,
    update_at: null,
    uniq_url: null,
    user_id: null
  });
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [music, setMusic] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    async function fetchUserByURL() {
      try {
        const data = await userSB.getUserByUrl(params.url);
        if (!data || data.length === 0) {
          router.push("/404"); // Redirect ke halaman 404 jika user tidak ditemukan
          return;
        }
        setUser(data[0]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserByURL();
  }, [params.url, router]);

  useEffect(() => {
    async function fetchTitle() {
      try {
        const data = await titleSB.getByUIDTitle(user.user_id);
        if (!data || data.length === 0) {
          setTitle(params.url); // Gunakan nilai default jika tidak ada data title
        } else {
          setTitle(data[0].title);
        }
      } catch (error) {
        console.error("Error fetching title:", error);
        setTitle(params.url);
      }
    }
    fetchTitle();

    async function fetchMusic() {
      const data = await musicSB.getMusicByUser_ID(user.user_id);
      setMusic(data);
    }
    fetchMusic();

    async function fetchCategories() {
      const data = await categoriesSB.getByUIDCategories(user.user_id);
      setCategories(data);
    }
    fetchCategories();

    async function fetchMemories() {
      const data = await memoriesSB.getMemoriesByUser_ID(user.user_id);
      setMemories(data);
    }
    fetchMemories();
  }, [params.url, user]);

  const getRandomMemoryImage = () => {
    if (memories.length > 0) {
      const randomIndex = Math.floor(Math.random() * memories.length);
      return memories[randomIndex].image_url;
    }
    return user.avatar;
  };

  const getMetaDescription = () => {
    return `Explore the memories and journey of ${user.name || params.url}`;
  };

  if (!user.user_id) {
    return (
      <>
        <Head>
          <title>{title || params.url}</title>
        </Head>
        <Loading />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title || params.url}</title>
        <meta property="og:title" content={title || params.url} />
        <meta property="og:image" content={getRandomMemoryImage()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || params.url} />
        <meta name="twitter:image" content={getRandomMemoryImage()} />
        <meta name="description" content={getMetaDescription()} />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                {!title ? params.url : title}
              </h1>
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-6 h-6 text-pink-400" />
              <p className="text-lg text-gray-600">Our Journey Together</p>
            </div>
          </div>
          {!categories || categories.length === 0 ? (
            <div className="relative pb-24">
              <div className="absolute inset-0 bg-hearts opacity-5 pointer-events-none" />
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Yahh sepertinya belum ada kategori yang dibuat😔
              </h2>
            </div>
          ) : (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Our Memory Categories
              </h2>
              <CategorySection categories={categories} />
            </div>
          )}
          {!memories || memories.length === 0 ? (
            <div className="relative pb-24">
              <div className="absolute inset-0 bg-hearts opacity-5 pointer-events-none" />
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Yahh sepertinya belum ada memori yang dibuat😔
              </h2>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-hearts opacity-5 pointer-events-none" />
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Recent Memories
              </h2>
              <MemoriesGallery memories={memories} />
            </div>
          )}
          <MusicPlayer playlist={music} />
        </div>
      </main>
    </>
  );
}
