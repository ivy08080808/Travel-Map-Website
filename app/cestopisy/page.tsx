import TravelogueList from "@/components/TravelogueList";

export default function CestopisyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          Travelogues
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Read about my adventures and journeys around the world. 
          Each travelogue is a story about people, places, and experiences I've had.
        </p>
        <TravelogueList />
      </div>
    </div>
  );
}
