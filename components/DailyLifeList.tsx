import { dailyLife } from '@/lib/data';
import DailyLifeCard from './DailyLifeCard';

interface DailyLifeListProps {
  limit?: number; // Optional limit, if not provided, show all
}

export default function DailyLifeList({ limit }: DailyLifeListProps = {}) {
  // Sort daily life by date (newest first)
  const sortedDailyLife = [...dailyLife]
    .sort((a, b) => {
      // Compare dates (format: "YYYY-MM-DD")
      return b.date.localeCompare(a.date);
    });

  // Apply limit if provided
  const displayDailyLife = limit ? sortedDailyLife.slice(0, limit) : sortedDailyLife;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Daily Life
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDailyLife.map((item) => (
            <DailyLifeCard key={item.id} dailyLife={item} />
          ))}
        </div>
      </div>
    </section>
  );
}


