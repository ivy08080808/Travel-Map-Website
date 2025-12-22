'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trips, Trip } from '@/lib/data';
import TransportIcon from './TransportIcon';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit map bounds to selected trip (only when trip is selected, not on location click)
function MapBounds({ trip }: { trip: Trip | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (trip && trip.locations.length > 0) {
      const bounds = L.latLngBounds(
        trip.locations.map(loc => [loc.lat, loc.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([50.0, 10.0], 3);
    }
  }, [trip, map]);

  return null;
}

export default function TravelMap() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Default center (Europe)
  const center: [number, number] = [50.0, 10.0];
  const zoom = 3;

  // Get all trips sorted by year (newest first)
  const sortedTrips = [...trips].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // Get route coordinates for selected trip
  const getRouteCoordinates = (trip: Trip): [number, number][] => {
    return trip.locations.map(loc => [loc.lat, loc.lng]);
  };

  return (
    <div className="flex h-[800px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left Sidebar - Trip List */}
      <div className="w-96 border-r border-gray-200 overflow-y-auto bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">All Trips By Chinghua Ivy Lu</h2>
        </div>
        
        {selectedTrip ? (
          // Selected Trip Details View
          <div className="p-4">
            <button
              onClick={() => setSelectedTrip(null)}
              className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back to all trips
            </button>
            
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrip.title}</h3>
              {selectedTrip.distance && (
                <p className="text-sm text-gray-600 mb-2">{selectedTrip.distance}</p>
              )}
              {selectedTrip.description && (
                <p className="text-sm text-gray-600">{selectedTrip.description}</p>
              )}
            </div>

            <div className="space-y-0">
              {selectedTrip.locations.map((location, index) => {
                const isLast = index === selectedTrip.locations.length - 1;
                const tripColor = selectedTrip.color || "#3b82f6"; // 使用路線的顏色
                
                const LocationContent = (
                  <div className="flex items-start gap-3 py-3 px-2 border-b border-gray-200 last:border-b-0">
                    {/* 圖標區域 - 圓圈 + 垂直線 */}
                    <div className="flex-shrink-0 flex flex-col items-center relative">
                      {/* 垂直連接線 - 從頂部開始（第一個地點從中間開始） */}
                      {index > 0 && (
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5"
                          style={{ 
                            backgroundColor: tripColor,
                            height: '50%'
                          }}
                        />
                      )}
                      
                      {/* 圓圈，中間是白色圖標 - 每個地點都有自己的圖標 */}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                        style={{ backgroundColor: tripColor }}
                      >
                        <div className="flex items-center justify-center w-full h-full">
                          <TransportIcon mode={location.transportMode} className="w-5 h-5" />
                        </div>
                      </div>
                      
                      {/* 垂直連接線 - 從圖標底部繼續到下一個地點 */}
                      {!isLast && (
                        <div 
                          className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5"
                          style={{ 
                            backgroundColor: tripColor,
                            height: '50%'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* 地點信息 */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="mb-0.5">
                        {location.link ? (
                          <Link 
                            href={location.link}
                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {location.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-gray-900">{location.name}</span>
                        )}
                      </div>
                      {location.date && (
                        <p className="text-xs text-gray-500">{location.date}</p>
                      )}
                      {location.description && (
                        <p className="text-xs text-gray-600 mt-1">{location.description}</p>
                      )}
                    </div>
                  </div>
                );

                return (
                  <div key={location.id}>
                    {LocationContent}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // All Trips List View
          <div className="divide-y divide-gray-200">
            {sortedTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="w-full p-4 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 group"
              >
                <div
                  className="w-1 h-16 rounded-full flex-shrink-0"
                  style={{ backgroundColor: trip.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                    {trip.title}
                  </h3>
                  {trip.distance && (
                    <p className="text-xs text-gray-500 mt-1">{trip.distance}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          
          <MapBounds trip={selectedTrip} />

          {/* Show all trips or selected trip */}
          {(selectedTrip ? [selectedTrip] : sortedTrips).map((trip) => {
            const routeCoords = getRouteCoordinates(trip);
            
            return (
              <div key={trip.id}>
                {/* Draw route line */}
                {routeCoords.length > 1 && (
                  <Polyline
                    positions={routeCoords}
                    pathOptions={{
                      color: trip.color,
                      weight: selectedTrip?.id === trip.id ? 4 : 2,
                      opacity: selectedTrip?.id === trip.id ? 0.8 : 0.4,
                    }}
                  />
                )}
                
                {/* Draw markers */}
                {trip.locations.map((location) => (
          <Marker
                    key={`${trip.id}-${location.id}`}
                    position={[location.lat, location.lng]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <TransportIcon mode={location.transportMode} className="w-5 h-5" />
                          {location.link ? (
                            <Link href={location.link} className="font-bold text-lg text-blue-600 hover:text-blue-800">
                              {location.name}
                            </Link>
                          ) : (
                            <h3 className="font-bold text-lg">{location.name}</h3>
                          )}
                        </div>
                        {location.date && (
                          <p className="text-sm text-gray-600">{location.date}</p>
                        )}
                        {location.description && (
                          <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">{trip.title}</p>
              </div>
            </Popup>
          </Marker>
        ))}
              </div>
            );
          })}
      </MapContainer>
      </div>
    </div>
  );
}
