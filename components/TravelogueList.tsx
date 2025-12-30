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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto">
      {displayTravelogues.map((travelogue) => (
        <TravelogueCard key={travelogue.id} travelogue={travelogue} />
      ))}
    </div>
  );
}
