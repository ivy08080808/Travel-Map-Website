export interface Travelogue {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  route: string;
}

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export type TransportMode = 'airplane' | 'car' | 'walking' | 'train' | 'bus' | 'boat';

export interface TripLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  date?: string;
  transportMode?: TransportMode;
  description?: string;
  link?: string; // Link to travelogue/blog post
}

export interface Trip {
  id: string;
  title: string;
  year: string;
  color: string; // Hex color code
  distance?: string; // e.g., "16,960 miles / 27,295 kilometres"
  description?: string;
  locations: TripLocation[];
}

export const travelogues: Travelogue[] = [
  {
    id: "taipei-1",
    title: "Taipei, Taiwan",
    description: "My journey in Taipei, Taiwan - exploring the vibrant city and its culture.",
    coverImage: "/images/taipei.jpg",
    date: "2022",
    route: "/cestopisy/taipei"
  },
  {
    id: "athens",
    title: "Athens, Greece",
    description: "Discovering the ancient history and beautiful architecture of Athens, Greece.",
    coverImage: "/images/athens.jpg",
    date: "2022",
    route: "/cestopisy/athens"
  },
  {
    id: "vienna",
    title: "Vienna, Austria",
    description: "Exploring the imperial city of Vienna with its rich cultural heritage.",
    coverImage: "/images/vienna.jpg",
    date: "2022",
    route: "/cestopisy/vienna"
  },
  {
    id: "prague",
    title: "Prague, Czech Republic",
    description: "Wandering through the charming streets and historic landmarks of Prague.",
    coverImage: "/images/prague.jpg",
    date: "2022",
    route: "/cestopisy/prague"
  },
  {
    id: "poznan",
    title: "Poznań, Poland",
    description: "Experiencing the culture and history of Poznań, Poland.",
    coverImage: "/images/poznan.jpg",
    date: "2022",
    route: "/cestopisy/poznan"
  },
  {
    id: "berlin",
    title: "Berlin, Germany",
    description: "Exploring the dynamic city of Berlin with its fascinating history and modern culture.",
    coverImage: "/images/berlin.jpg",
    date: "2022",
    route: "/cestopisy/berlin"
  },
  {
    id: "singapore",
    title: "Singapore",
    description: "Discovering the modern city-state of Singapore with its diverse culture and cuisine.",
    coverImage: "/images/singapore.jpg",
    date: "2022",
    route: "/cestopisy/singapore"
  },
  {
    id: "taipei-2",
    title: "Taipei, Taiwan (Return)",
    description: "Returning to Taipei, Taiwan - reflecting on the journey and experiences.",
    coverImage: "/images/taipei-return.jpg",
    date: "2022",
    route: "/cestopisy/taipei-return"
  },
  {
    id: "tokyo",
    title: "Tokyo, Japan",
    description: "Exploring the vibrant metropolis of Tokyo - a blend of traditional and modern Japan.",
    coverImage: "/images/tokyo.jpg",
    date: "2023",
    route: "/cestopisy/tokyo"
  },
  {
    id: "osaka",
    title: "Osaka, Japan",
    description: "Discovering Osaka's delicious food scene and friendly atmosphere.",
    coverImage: "/images/osaka.jpg",
    date: "2023",
    route: "/cestopisy/osaka"
  },
  {
    id: "kyoto",
    title: "Kyoto, Japan",
    description: "Immersing in Kyoto's ancient temples, gardens, and traditional culture.",
    coverImage: "/images/kyoto.jpg",
    date: "2023",
    route: "/cestopisy/kyoto"
  }
];

export const mapMarkers: MapMarker[] = [
  {
    id: "1",
    name: "Pacific Crest Trail",
    lat: 39.8283,
    lng: -120.5795,
    description: "Pacific Crest Trail - 4,265 km long hike"
  },
  {
    id: "2",
    name: "Yosemite National Park",
    lat: 37.8651,
    lng: -119.5383,
    description: "One of the most beautiful national parks in the USA"
  },
  {
    id: "3",
    name: "Pyrenees",
    lat: 42.6667,
    lng: 1.0000,
    description: "Mountain range between France and Spain"
  },
  {
    id: "4",
    name: "Dolomites",
    lat: 46.4333,
    lng: 11.8500,
    description: "Alpine mountain range in Italy"
  },
  {
    id: "5",
    name: "Colombia",
    lat: 4.5709,
    lng: -74.2973,
    description: "Adventure in South America"
  }
];

// 旅行路線數據 - 按年份從新到舊排序
export const trips: Trip[] = [
  {
    id: "trip-2023-january",
    title: "2023 January - Japan",
    year: "2023",
    color: "#d946ef", // 紫色
    description: "Journey to Japan in January 2023",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2023", transportMode: "airplane", link: "/cestopisy/taipei" },
      { id: 2, name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, transportMode: "airplane", link: "/cestopisy/tokyo" },
      { id: 3, name: "Osaka, Japan", lat: 34.6937, lng: 135.5023, transportMode: "train", link: "/cestopisy/osaka" },
      { id: 4, name: "Kyoto, Japan", lat: 35.0116, lng: 135.7681, transportMode: "train", link: "/cestopisy/kyoto" },
      { id: 5, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, transportMode: "airplane", link: "/cestopisy/taipei" },
    ]
  },
  {
    id: "trip-2022-july",
    title: "2022 July - Europe and Singapore",
    year: "2022",
    color: "#3b82f6", // 藍色（跟地圖標記一樣）
    description: "From Greece, Vienna, Prague, Poznań, Berlin, to Singapore",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "13 May", transportMode: "airplane", link: "/cestopisy/taipei" },
      { id: 2, name: "Athens, Greece", lat: 37.9838, lng: 23.7275, date: "July 2022", transportMode: "airplane", link: "/cestopisy/athens" },
      { id: 3, name: "Vienna, Austria", lat: 48.2082, lng: 16.3738, date: "15 Apr", transportMode: "airplane", link: "/cestopisy/vienna" },
      { id: 4, name: "Prague, Czech Republic", lat: 50.0755, lng: 14.4378, transportMode: "bus", link: "/cestopisy/prague" },
      { id: 5, name: "Poznań, Poland", lat: 52.4064, lng: 16.9252, transportMode: "bus", link: "/cestopisy/poznan" },
      { id: 6, name: "Berlin, Germany", lat: 52.5200, lng: 13.4050, transportMode: "bus", link: "/cestopisy/berlin" },
      { id: 7, name: "Singapore", lat: 1.3521, lng: 103.8198, transportMode: "airplane", link: "/cestopisy/singapore" },
      { id: 8, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, transportMode: "airplane", link: "/cestopisy/taipei" },
    ]
  },
];
