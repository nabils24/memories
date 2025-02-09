// components/Timeline.tsx
import React from "react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

// Data dummy dengan sentuhan humor
const timelineData: TimelineItem[] = [
  {
    date: "2025-01-01",
    title: "Pesta Tahun Baru Pink",
    description:
      "Memulai tahun dengan pesta kucing berwarna pink dan balon-balon ajaib! 🎈🐱",
  },
  {
    date: "2025-02-14",
    title: "Valentine Gokil",
    description:
      "Hari penuh cinta dengan selfie absurd, filter pink, dan cokelat yang berlimpah. 😘📸",
  },
  {
    date: "2025-03-17",
    title: "Hari Ajaib Pink",
    description:
      "Merayakan hari dengan kostum unicorn dan hujan confetti pink, bikin hari makin berwarna! 🦄🌈",
  },
];

const Timeline: React.FC = () => {
  return (
    <div className="relative border-l-4 border-pink-300 bg-pink-50 p-6 rounded-lg shadow-lg">
      {timelineData.map((item, index) => (
        <div key={index} className="mb-10 ml-6 relative">
          {/* Icon timeline lucu */}
          <span className="absolute -left-5 flex items-center justify-center w-10 h-10 bg-pink-500 rounded-full ring-4 ring-pink-200">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {/* Contoh icon: lingkaran dengan tanda seru (bisa diartikan sebagai momen "spesial") */}
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
            </svg>
          </span>
          {/* Konten timeline dengan gaya lucu */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-pink-100 shadow-md">
            <h3 className="mb-1 text-xl font-bold text-pink-700">{item.title}</h3>
            <time className="block mb-2 text-sm font-medium text-pink-500">
              {item.date}
            </time>
            <p className="text-base text-gray-700 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
