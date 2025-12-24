'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Travelogue } from '@/lib/data';

interface TravelogueCardProps {
  travelogue: Travelogue;
}

export default function TravelogueCard({ travelogue }: TravelogueCardProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 嘗試從 MongoDB 獲取完整數據
    fetch(`/api/travelogues/${travelogue.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.coverImage) setCoverImage(data.coverImage);
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.date) setDate(data.date);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [travelogue.id]);

  // 優先使用 MongoDB 中的數據，否則使用 data.ts 中的默認值
  const displayImage = coverImage || travelogue.coverImage;
  const displayTitle = title || travelogue.title;
  const displayDescription = description || travelogue.description;
  const displayDate = date || travelogue.date;

  // Check if coverImage is a Cloudinary URL or local path
  const isCloudinaryUrl =
    displayImage?.startsWith('http') ||
    displayImage?.includes('cloudinary');
  const imageUrl = isCloudinaryUrl
    ? displayImage
    : displayImage?.startsWith('/')
    ? displayImage
    : `/images/${displayImage}`;

  return (
    <Link href={travelogue.route}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        <div className="relative h-64 w-full bg-gray-200">
          {displayImage ? (
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              className="object-cover"
              unoptimized={isCloudinaryUrl}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
              <span className="text-white text-4xl font-bold opacity-50">
                {displayTitle.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {displayTitle}
            </h3>
            <span className="text-sm text-gray-500">{displayDate}</span>
          </div>
          <p className="text-gray-600 line-clamp-3">
            {displayDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}
