import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '@KenanganKita buat kenangan dengan mudah:)',
  openGraph: {
    images: 'https://i.ibb.co.com/gM3SSn2d/kita.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}><main>{children}</main><Toaster /></body>
    </html>
  );
}
