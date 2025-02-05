"use client";

import { Card, CardContent } from '@/components/ui/card';
import { MessageCircleHeart as MessageHeart, Heart, Compass } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageHeart':
        return <MessageHeart className="w-8 h-8" />;
      case 'Heart':
        return <Heart className="w-8 h-8" />;
      case 'Compass':
        return <Compass className="w-8 h-8" />;
      default:
        return <Heart className="w-8 h-8" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link href={`/category/${category.id}`} key={category.id}>
          <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-transparent hover:border-pink-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4 text-pink-500 transform group-hover:scale-110 transition-transform duration-300">
                {getIcon(category.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}