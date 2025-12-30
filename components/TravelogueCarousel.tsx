'use client';

import { useRef } from 'react';
import { travelogues, Travelogue } from '@/lib/data';
import TravelogueCard from './TravelogueCard';

export default function TravelogueCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 指定的三個遊記 ID
  const featuredIds = ['riga-2025-07', 'vienna-2025-07', 'prague-2022-07'];
  
  // 分離出指定的三個和其他遊記
  const featured: Travelogue[] = [];
  const others: Travelogue[] = [];
  
  travelogues.forEach(travelogue => {
    if (featuredIds.includes(travelogue.id)) {
      featured.push(travelogue);
    } else {
      others.push(travelogue);
    }
  });
  
  // 按照指定順序排列 featured
  const sortedFeatured = featuredIds
    .map(id => featured.find(t => t.id === id))
    .filter((t): t is Travelogue => t !== undefined);
  
  // 其他遊記按日期排序（最新的在前）
  const sortedOthers = others.sort((a, b) => b.date.localeCompare(a.date));
  
  // 合併：先顯示指定的三個，然後是其他
  const allTravelogues = [...sortedFeatured, ...sortedOthers];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {allTravelogues.map((travelogue) => (
          <div key={travelogue.id} className="flex-shrink-0 w-80">
            <TravelogueCard travelogue={travelogue} />
          </div>
        ))}
      </div>
      
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors z-10"
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors z-10"
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

