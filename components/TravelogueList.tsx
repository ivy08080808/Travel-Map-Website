import { travelogues } from '@/lib/data';
import TravelogueCard from './TravelogueCard';

interface TravelogueListProps {
  limit?: number; // Optional limit, if not provided, show all
}

export default function TravelogueList({ limit }: TravelogueListProps = {}) {
  // Sort travelogues by date (newest first)
  const sortedTravelogues = [...travelogues]
    .sort((a, b) => {
      // Compare dates (format: "YYYY-MM")
      return b.date.localeCompare(a.date);
    });

  // Apply limit if provided
  const displayTravelogues = limit ? sortedTravelogues.slice(0, limit) : sortedTravelogues;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Travelogues
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTravelogues.map((travelogue) => (
            <TravelogueCard key={travelogue.id} travelogue={travelogue} />
          ))}
        </div>
      </div>
    </section>
  );
}
