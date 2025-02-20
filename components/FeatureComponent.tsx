"use client"

import React from 'react';
import {
    Sparkles, Lightbulb, Zap, FileText, PencilLine, Download,
    Search, FileSearch, Quote, ChartPie, File, BookOpenText,
    Bot, Diff, CodeXml, SearchCode, Brain, ImageIcon, Box,
    UserRound, Notebook, Youtube, Captions, BookAudio, MicVocal, AudioLines
} from 'lucide-react';

const FeatureSection = ({
    reverse = false,
    category,
    title,
    items,
    imageSrc,
    imageAlt
}) => {
    return (
        <div className={`flex flex-col${reverse ? '-reverse' : ''} md:flex-row gap-[24px] items-center rounded-[32px]`}>
            {/* Image Section */}
            <img
                alt={imageAlt}
                src={imageSrc}
                className="object-contain rounded-[24px] max-w-[360px] max-h-[360px]"
            />

            {/* Content Section */}
            <div className="flex flex-col gap-[16px] px-[20px] w-full">
                <div className="px-[12px] py-[6px] gap-[10px] rounded-[100px] bg-gray-100 w-fit">
                    <p className="text-[12px] font-semibold text-gray-700">{category}</p>
                </div>

                <h3 className="text-[22px] md:text-[24px] font-bold text-black">{title}</h3>

                <div className="flex flex-col gap-[12px]">
                    {items.map((item, index) => (
                        <FeatureItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ Icon, text }) => (
    <div className="flex flex-row gap-[12px] items-center">
        <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] shrink-0 rounded-[12px] border-[1px] border-gray-200 bg-white flex items-center justify-center">
            <Icon className="md:min-w-[20px] md:min-h-[20px] w-[14px] h-[14px] text-black shrink-0" />
        </div>
        <p className="text-[14px] md:text-[16px] font-semibold text-gray-700">{text}</p>
    </div>
);

const FeatureComponent = () => {
    const features = [
        {
            reverse: false,
            category: 'Upload',
            title: 'Upload Sepuasnya dengan kenangankita',
            imageSrc: 'https://gyditryslflaxxjupqvi.supabase.co/storage/v1/object/public/kenangankita_public_img//UploadKenangan.png',
            imageAlt: 'Feature 1',
            items: [
                { Icon: Sparkles, text: 'Video' },
                { Icon: Lightbulb, text: 'Image' }
            ]
        }, {
            reverse: false,
            category: 'Music',
            title: 'Upload Music kesukaan kamu',
            imageSrc: 'https://gyditryslflaxxjupqvi.supabase.co/storage/v1/object/public/kenangankita_public_img//UploadMusic.png',
            imageAlt: 'Feature 2',
            items: [
                { Icon: Sparkles, text: 'Music' },
            ]
        },
        // Tambahkan feature lainnya sesuai pola yang sama
    ];

    return (
        <div className="flex flex-col gap-[40px] md:gap-[60px]">
            <div className="flex flex-col gap-[10px]">
                <h2 className="text-[28px] md:text-[40px] font-bold text-black text-center">
                    Apa aja sih fitur yang ada di kenangankita?
                </h2>
            </div>

            {features.map((feature, index) => (
                <FeatureSection key={index} {...feature} />
            ))}
        </div>
    );
};

export default FeatureComponent;