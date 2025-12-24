import TravelMap from "@/components/TravelMap";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Travel Map
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          Explore the map of my journeys and places I've visited during my adventures.
        </p>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TravelMap />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">83+ Countries</h3>
            <p className="text-gray-600">Visited around the world</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">15,938+ km</h3>
            <p className="text-gray-600">Hiked in the mountains</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">448+ Peaks</h3>
            <p className="text-gray-600">Mountain summits climbed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
