import Link from 'next/link';
import Image from 'next/image';
import { Travelogue } from '@/lib/data';

interface TravelogueCardProps {
  travelogue: Travelogue;
}

export default function TravelogueCard({ travelogue }: TravelogueCardProps) {
  return (
    <Link href={travelogue.route}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        <div className="relative h-64 w-full bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
            <span className="text-white text-4xl font-bold opacity-50">
              {travelogue.title.charAt(0)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {travelogue.title}
            </h3>
            <span className="text-sm text-gray-500">{travelogue.date}</span>
          </div>
          <p className="text-gray-600 line-clamp-3">
            {travelogue.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
