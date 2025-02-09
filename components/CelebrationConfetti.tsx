// components/CelebrationConfetti.tsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const CelebrationConfetti: React.FC = () => {
    useEffect(() => {
        // Durasi animasi selama 3 detik
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        // Fungsi yang akan dipanggil berulang kali untuk menghasilkan confetti
        const frame = () => {
            // Mengeluarkan confetti dari sisi kiri dan kanan secara bersamaan
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#FFB6C1'],
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#FFB6C1'],
            });

            // Jika masih dalam durasi, lanjutkan animasi
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        // Mulai animasi confetti
        requestAnimationFrame(frame);
    }, []);

    return null; // Komponen ini tidak perlu menampilkan elemen HTML, hanya efek visual
};

export default CelebrationConfetti;
