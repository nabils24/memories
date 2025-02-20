"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Music, Video, Image, UserPlus } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { Meteors } from "@/components/magicui/meteors";
import FeatureComponent from '@/components/FeatureComponent';
import { motion } from "framer-motion";
import Link from "next/link";

const reviews = [
    {
        name: "Soffie",
        username: "@soffie",
        body: "sumpah ini keren bangett kalian harus cobainn sihh",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "yono",
        username: "@yono@32",
        body: "keren sih bisa atur atur music disini mana bisa disesuain yang mana dimulai",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "haped",
        username: "@hxpeed",
        body: "sayangnya aku dah putus coba klo blum sii aku pakai ini web:(",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "ambon",
        username: "@ambon",
        body: "kerenn kerenn bisa gerak gerak mana bisa diatur atur",
        img: "https://avatar.vercel.sh/jane",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export default function Home() {
    return (
        <div className="min-h-screen bg-pink-100 flex flex-col items-center">
            {/* Section 1: JUMBOTRON */}
            
            <motion.section
                className="w-full max-w-6xl my-10 flex flex-col items-center text-center p-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Kiri: Text */}
                <div className="w-full p-6">
                    <h2 className="text-4xl font-bold text-pink-700">
                        🌟Simpan Kenangan Kamu🌟
                    </h2>
                    <p className="text-lg text-gray-600 mt-4">
                        Buat kenangan menjadi lebih menarik dengan platform kami yang penuh
                        warna dan fun!
                    </p>
                    <Link href="/auth/signup">
                        <Button className="mt-6 bg-pink-500 hover:bg-pink-600">
                            Daftar Sekarang Juga
                        </Button>
                    </Link>
                </div>
            </motion.section>

            {/* Section 2: Penjelasan Fitur */}
            <motion.section
                className="w-full max-w-4xl my-10 px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <FeatureComponent />
            </motion.section>

            {/* Section 3: Keamanan */}
            <motion.section
                className="w-full max-w-4xl my-10 px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-bold text-pink-700 text-center mb-6">
                    Keamanan kamu adalah prioritas kami
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <Card className="bg-white shadow-lg rounded-2xl">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-semibold text-pink-700">
                                Built for Privacy
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Setiap fitur dirancang untuk menjaga privasi Anda, memberikan rasa
                                aman saat digunakan.
                            </p>
                        </CardContent>
                    </Card>
                    {/* Card 2 */}
                    <Card className="bg-white shadow-lg rounded-2xl">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-semibold text-pink-700">
                                Keamanan Data
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Kami melindungi data Anda dengan teknologi enkripsi terbaik untuk
                                menjaga keamanan.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Section 4: Kenapa Pilih KenanganKita */}
            <motion.section
                className="w-full max-w-4xl my-10 px-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-bold text-pink-700 mb-4">
                    Kenapa Pilih KenanganKita?
                </h2>
                <p className="text-gray-600 text-lg">
                    Karena KenanganKita memiliki banyak fitur dan lebih simple namun lucu,
                    dan kami juga selalu update fitur-fitur terbaru.
                </p>
            </motion.section>

            {/* Section 5: Apa Kata Pengguna KenanganKita */}
            <motion.section
                className="w-full max-w-4xl my-10 px-6 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h2 className="text-3xl font-bold text-pink-700 text-center mb-6">
                    Apa Kata Pengguna KenanganKita?
                </h2>
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    <Marquee pauseOnHover className="[--duration:20s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    {/* Gradient overlay kiri */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-pink-100 to-transparent"></div>
                    {/* Gradient overlay kanan */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-pink-100 to-transparent"></div>
                </div>
            </motion.section>

            {/* Section 6: Frequently Asked Questions */}
            <motion.section
                className="w-full max-w-4xl my-10 px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-bold text-pink-700 text-center mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {/* FAQ 1 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-pink-700">
                            Apakah saya bisa upload video?
                        </h3>
                        <p className="text-gray-600 mt-2">Yaaa sangatt bisaaa.</p>
                    </div>
                    {/* FAQ 2 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-pink-700">
                            Apakah ada maksimal ukuran file?
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Karena masih tahap beta KenanganKita hanya memiliki batasan di 50 MB,
                            namun kedepannya kita bakal up agar KenanganFriends bisa upload banyak
                            kenangan lagiii.
                        </p>
                    </div>
                    {/* FAQ 3 */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-pink-700">
                            Apakah ini berbayar?
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Saat ini KenanganKita masih trial, jadi tunggu apa lagi, buruan cobain
                            sekarang!!
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="w-full bg-pink-700 text-white py-6 mt-10">
                <div className="w-full max-w-4xl mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} KenanganKita. All rights reserved.</p>
                    <p className="mt-2">Follow us on instagram <a href="https://instagram.com/kenangankita">@kenangankita</a></p>
                </div>
            </footer>
        </div>
    );
}
