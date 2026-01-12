'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = 'Image' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updateSlidePosition = () => {
      if (slidesRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        slidesRef.current.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
      }
    };
    
    updateSlidePosition();
    window.addEventListener('resize', updateSlidePosition);
    return () => window.removeEventListener('resize', updateSlidePosition);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(images.length - 1);
    } else if (index >= images.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    goToSlide(currentIndex - 1);
  };

  const handleNext = () => {
    goToSlide(currentIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - go to next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - go to previous
      handlePrev();
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full my-8">
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl h-[450px] overflow-hidden rounded-lg shadow-lg"
        style={{ maxWidth: '600px' }}
      >
        <div
          ref={slidesRef}
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ width: `${images.length * 100}%` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((imageUrl, index) => {
            const isCloudinaryUrl = imageUrl?.startsWith('http') || imageUrl?.includes('cloudinary');
            const processedUrl = isCloudinaryUrl
              ? convertCloudinaryUrlToWebFormat(imageUrl)
              : imageUrl.startsWith('/')
              ? imageUrl
              : `/images/${imageUrl}`;

            return (
              <div
                key={index}
                className="flex-shrink-0 w-full h-full relative"
                style={{ width: `${100 / images.length}%` }}
              >
                <Image
                  src={processedUrl}
                  alt={`${alt} ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized={isCloudinaryUrl}
                  priority={index === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Left arrow button - hidden on mobile */}
        {!isMobile && images.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-300 transition-colors z-10 border-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow button - hidden on mobile */}
        {!isMobile && images.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-300 transition-colors z-10 border-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === currentIndex
                  ? 'bg-gray-800'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
