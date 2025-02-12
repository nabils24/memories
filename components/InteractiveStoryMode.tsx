// components/InteractiveStoryMode.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface StoryPage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const storyPages: StoryPage[] = [
  {
    id: "page1",
    title: "Awal Mula",
    description:
      "Di suatu hari yang cerah, segalanya dimulai dengan senyuman dan pertemuan yang tak terlupakan.",
    imageUrl: "/images/story1.jpg", // Pastikan gambar ini ada di folder public/images
  },
  {
    id: "page2",
    title: "Pertemuan Pertama",
    description:
      "Momen ketika dunia seakan berhenti, dan semuanya menjadi lebih berwarna. Sebuah pertemuan yang ajaib!",
    imageUrl: "/images/story2.jpg",
  },
  {
    id: "page3",
    title: "Petualangan Bersama",
    description:
      "Setiap langkah membawa petualangan baru—penuh tawa, kejutan, dan kenangan manis.",
    imageUrl: "/images/story3.jpg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
    },
  },
};

const imageVariants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
};

const textVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const InteractiveStoryMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < storyPages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentPage = storyPages[currentIndex];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 p-4">
      <div className="max-w-3xl w-full bg-white bg-opacity-80 rounded-xl shadow-2xl overflow-hidden">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={currentPage.id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-6"
          >
            <motion.h2
              variants={textVariants}
              className="text-4xl font-extrabold text-center text-pink-800 mb-4"
            >
              {currentPage.title}
            </motion.h2>
            <motion.div
              className="relative h-80 w-full rounded-lg overflow-hidden mb-6"
              variants={imageVariants}
            >
              <Image
                src={currentPage.imageUrl}
                alt={currentPage.title}
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <motion.p
              variants={textVariants}
              className="text-xl text-center text-gray-800 mb-6"
            >
              {currentPage.description}
            </motion.p>
            <motion.div
              className="flex justify-between items-center"
              variants={textVariants}
            >
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <div className="text-gray-700">
                {currentIndex + 1} / {storyPages.length}
              </div>
              <button
                onClick={handleNext}
                disabled={currentIndex === storyPages.length - 1}
                className="px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 transition disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl mt-6">
        <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-pink-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / storyPages.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveStoryMode;
