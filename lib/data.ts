export interface Travelogue {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  route: string;
}

export interface DailyLife {
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
  // 2025 July - Europe
  { id: "milan-2025-07", title: "Milan, Italy", description: "Fashion capital and historic architecture in Milan.", coverImage: "/images/milan.jpg", date: "2025-07", route: "/Travelogues/milan-2025-07" },
  { id: "verona-2025-07", title: "Verona, Italy", description: "Romantic city of Romeo and Juliet in Verona.", coverImage: "/images/verona.jpg", date: "2025-07", route: "/Travelogues/verona-2025-07" },
  { id: "venice-2025-07", title: "Venice, Italy", description: "Canals and bridges in the floating city of Venice.", coverImage: "/images/venice.jpg", date: "2025-07", route: "/Travelogues/venice-2025-07" },
  { id: "vienna-2025-07", title: "Vienna, Austria", description: "Imperial streets and coffee houses in Vienna.", coverImage: "/images/vienna.jpg", date: "2025-07", route: "/Travelogues/vienna-2025-07" },
  { id: "budapest-2025-07", title: "Budapest, Hungary", description: "Thermal baths and Danube views in Budapest.", coverImage: "/images/budapest.jpg", date: "2025-07", route: "/Travelogues/budapest-2025-07" },
  { id: "warsaw-2025-07", title: "Warsaw, Poland", description: "Rebuilt old town and history in Warsaw.", coverImage: "/images/warsaw.jpg", date: "2025-07", route: "/Travelogues/warsaw-2025-07" },
  { id: "riga-2025-07", title: "Riga, Latvia", description: "Art Nouveau architecture in Riga.", coverImage: "/images/riga.jpg", date: "2025-07", route: "/Travelogues/riga-2025-07" },
  { id: "tallinn-2025-07", title: "Tallinn, Estonia", description: "Medieval old town in Tallinn.", coverImage: "/images/tallinn.jpg", date: "2025-07", route: "/Travelogues/tallinn-2025-07" },
  { id: "helsinki-2025-07", title: "Helsinki, Finland", description: "Design and seaside in Helsinki.", coverImage: "/images/helsinki.jpg", date: "2025-07", route: "/Travelogues/helsinki-2025-07" },
  { id: "vilnius-2025-07", title: "Vilnius, Lithuania", description: "Baroque architecture in Vilnius.", coverImage: "/images/vilnius.jpg", date: "2025-07", route: "/Travelogues/vilnius-2025-07" },

  // 2025 February - Korea (Seoul)
  { id: "seoul-2025-02", title: "Seoul, South Korea", description: "Exploring Seoul's food, culture, and cityscapes.", coverImage: "/images/seoul.jpg", date: "2025-02", route: "/Travelogues/seoul-2025-02" },

  // 2025 January - Kyushu (Fukuoka, Dazaifu, Yufuin)
  { id: "fukuoka-2025-01", title: "Fukuoka, Japan", description: "Exploring Fukuoka's food and harbor vibes.", coverImage: "/images/fukuoka.jpg", date: "2025-01", route: "/Travelogues/fukuoka-2025-01" },
  { id: "dazaifu-2025-01", title: "Dazaifu, Japan", description: "Shrines and heritage streets in Dazaifu.", coverImage: "/images/dazaifu.jpg", date: "2025-01", route: "/Travelogues/dazaifu-2025-01" },
  { id: "yufuin-2025-01", title: "Yufuin, Japan", description: "Onsen town and countryside views in Yufuin.", coverImage: "/images/yufuin.jpg", date: "2025-01", route: "/Travelogues/yufuin-2025-01" },

  // 2024 December - China
  { id: "beijing-2024-12", title: "Beijing, China", description: "Exploring Beijing's history and culture.", coverImage: "/images/beijing.jpg", date: "2024-12", route: "/Travelogues/beijing-2024-12" },
  { id: "nanjing-2024-12", title: "Nanjing, China", description: "Visiting the historic capital of Nanjing.", coverImage: "/images/nanjing.jpg", date: "2024-12", route: "/Travelogues/nanjing-2024-12" },
  { id: "hangzhou-2024-12", title: "Hangzhou, China", description: "Discovering West Lake and Hangzhou's charm.", coverImage: "/images/hangzhou.jpg", date: "2024-12", route: "/Travelogues/hangzhou-2024-12" },
  { id: "suzhou-2024-12", title: "Suzhou, China", description: "Exploring Suzhou's gardens and canals.", coverImage: "/images/suzhou.jpg", date: "2024-12", route: "/Travelogues/suzhou-2024-12" },
  { id: "shanghai-2024-12", title: "Shanghai, China", description: "Modern skyline and Bund views in Shanghai.", coverImage: "/images/shanghai.jpg", date: "2024-12", route: "/Travelogues/shanghai-2024-12" },

  // 2024 July - Japan (Osaka & Kyoto)
  { id: "osaka-2024-07", title: "Osaka, Japan", description: "Osaka eats and city vibes in midsummer.", coverImage: "/images/osaka.jpg", date: "2024-07", route: "/Travelogues/osaka-2024-07" },
  { id: "kyoto-2024-07", title: "Kyoto, Japan", description: "Temples and lanes of Kyoto in July.", coverImage: "/images/kyoto.jpg", date: "2024-07", route: "/Travelogues/kyoto-2024-07" },

  // 2024 June - Europe
  { id: "copenhagen-2024-06", title: "Copenhagen, Denmark", description: "Bikes, canals, and hygge in Copenhagen.", coverImage: "/images/copenhagen.jpg", date: "2024-06", route: "/Travelogues/copenhagen-2024-06" },
  { id: "utrecht-2024-06", title: "Utrecht, Netherlands", description: "Charming canals and cafes in Utrecht.", coverImage: "/images/utrecht.jpg", date: "2024-06", route: "/Travelogues/utrecht-2024-06" },
  { id: "amsterdam-2024-06", title: "Amsterdam, Netherlands", description: "Canals and museums in Amsterdam.", coverImage: "/images/amsterdam.jpg", date: "2024-06", route: "/Travelogues/amsterdam-2024-06" },
  { id: "antwerp-2024-06", title: "Antwerp, Belgium", description: "Diamonds and art in Antwerp.", coverImage: "/images/antwerp.jpg", date: "2024-06", route: "/Travelogues/antwerp-2024-06" },
  { id: "brussels-2024-06", title: "Brussels, Belgium", description: "Chocolate, waffles, and the Grand Place.", coverImage: "/images/brussels.jpg", date: "2024-06", route: "/Travelogues/brussels-2024-06" },
  { id: "colmar-2024-06", title: "Colmar, France", description: "Fairytale canals and half-timbered houses.", coverImage: "/images/colmar.jpg", date: "2024-06", route: "/Travelogues/colmar-2024-06" },
  { id: "nice-2024-06", title: "Nice, France", description: "Azure coastlines and promenades in Nice.", coverImage: "/images/nice.jpg", date: "2024-06", route: "/Travelogues/nice-2024-06" },
  { id: "menton-2024-06", title: "Menton, France", description: "Lemon-scented shores of Menton.", coverImage: "/images/menton.jpg", date: "2024-06", route: "/Travelogues/menton-2024-06" },
  { id: "monaco-2024-06", title: "Monaco", description: "Glamour and harbor views in Monaco.", coverImage: "/images/monaco.jpg", date: "2024-06", route: "/Travelogues/monaco-2024-06" },
  { id: "marseille-2024-06", title: "Marseille, France", description: "Old port and seaside vibes in Marseille.", coverImage: "/images/marseille.jpg", date: "2024-06", route: "/Travelogues/marseille-2024-06" },
  { id: "sainte-croix-2024-06", title: "Lac de Sainte-Croix, France", description: "Turquoise waters and Verdon Gorge views at Sainte-Croix Lake.", coverImage: "/images/sainte-croix.jpg", date: "2024-06", route: "/Travelogues/sainte-croix-2024-06" },
  { id: "provence-2024-06", title: "Provence, France", description: "Lavender fields and villages in Provence.", coverImage: "/images/provence.jpg", date: "2024-06", route: "/Travelogues/provence-2024-06" },
  { id: "lyon-2024-06", title: "Lyon, France", description: "Bouchons and old town alleys in Lyon.", coverImage: "/images/lyon.jpg", date: "2024-06", route: "/Travelogues/lyon-2024-06" },
  { id: "geneva-2024-06", title: "Geneva, Switzerland", description: "Lakeside walks and international Geneva.", coverImage: "/images/geneva.jpg", date: "2024-06", route: "/Travelogues/geneva-2024-06" },
  { id: "zermatt-2024-06", title: "Zermatt, Switzerland", description: "Matterhorn views from Zermatt.", coverImage: "/images/zermatt.jpg", date: "2024-06", route: "/Travelogues/zermatt-2024-06" },
  { id: "grindelwald-2024-06", title: "Grindelwald, Switzerland", description: "Alpine scenery in Grindelwald.", coverImage: "/images/grindelwald.jpg", date: "2024-06", route: "/Travelogues/grindelwald-2024-06" },
  { id: "lungern-2024-06", title: "Lungern, Switzerland", description: "Exploring Lungern.", coverImage: "/images/lungern.jpg", date: "2024-06", route: "/Travelogues/lungern-2024-06" },
  { id: "prague-2024-06", title: "Prague, Czech Republic", description: "Crossing Charles Bridge in summer.", coverImage: "/images/prague.jpg", date: "2024-06", route: "/Travelogues/prague-2024-06" },

  // 2024 January - SE Asia
  { id: "singapore-2024-01", title: "Singapore", description: "Skylines and hawker fare in Singapore.", coverImage: "/images/singapore.jpg", date: "2024-01", route: "/Travelogues/singapore-2024-01" },
  { id: "malaysia-2024-01", title: "Malaysia", description: "Discovering culture and cuisine in Malaysia.", coverImage: "/images/malaysia.jpg", date: "2024-01", route: "/Travelogues/malaysia-2024-01" },
  { id: "phuket-2024-01", title: "Phuket, Thailand", description: "Beaches and sunsets in Phuket.", coverImage: "/images/phuket.jpg", date: "2024-01", route: "/Travelogues/phuket-2024-01" },

  // 2023 January - Japan
  { id: "takayama-2023", title: "Takayama, Japan", description: "Old town charm in Takayama.", coverImage: "/images/takayama.jpg", date: "2023-01", route: "/Travelogues/takayama-2023-01" },
  { id: "shirakawa-go-2023", title: "Shirakawa-go, Japan", description: "Thatched roofs under winter skies.", coverImage: "/images/shirakawa-go.jpg", date: "2023-01", route: "/Travelogues/shirakawa-go-2023-01" },
  { id: "kanazawa-2023", title: "Kanazawa, Japan", description: "Gardens and heritage in Kanazawa.", coverImage: "/images/kanazawa.jpg", date: "2023-01", route: "/Travelogues/kanazawa-2023-01" },

  // 2022 July - Europe & Singapore
  { id: "athens-2022-07", title: "Athens, Greece", description: "Ancient sites and sunny Athens.", coverImage: "/images/athens.jpg", date: "2022-07", route: "/Travelogues/athens-2022-07" },
  { id: "vienna-2022-07", title: "Vienna, Austria", description: "Imperial streets and coffee houses.", coverImage: "/images/vienna.jpg", date: "2022-07", route: "/Travelogues/vienna-2022-07" },
  { id: "prague-2022-07", title: "Prague, Czech Republic", description: "Castles and bridges in Prague.", coverImage: "/images/prague.jpg", date: "2022-07", route: "/Travelogues/prague-2022-07" },
  { id: "karlovy-vary-2022-07", title: "Karlovy Vary, Czech Republic", description: "Historic spa town and thermal springs in Karlovy Vary.", coverImage: "/images/karlovy-vary.jpg", date: "2022-07", route: "/Travelogues/karlovy-vary-2022-07" },
  { id: "poznan-2022-07", title: "Poznań, Poland", description: "Old town squares of Poznań.", coverImage: "/images/poznan.jpg", date: "2022-07", route: "/Travelogues/poznan-2022-07" },
  { id: "berlin-2022-07", title: "Berlin, Germany", description: "History and modernity in Berlin.", coverImage: "/images/berlin.jpg", date: "2022-07", route: "/Travelogues/berlin-2022-07" },
  { id: "singapore-2022-07", title: "Singapore", description: "Connecting through Singapore.", coverImage: "/images/singapore.jpg", date: "2022-07", route: "/Travelogues/singapore-2022-07" },
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
    id: "trip-2025-july",
    title: "2025 July - Europe",
    year: "2025",
    color: "#F99386",
    description: "From Taipei to Milan, Verona, Venice, Vienna, Budapest, Warsaw, Riga, Tallinn, Helsinki, Vilnius, and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "July 2025", transportMode: "airplane" },
      { id: 2, name: "Milan, Italy", lat: 45.4642, lng: 9.1900, date: "July 2025", transportMode: "airplane", link: "/Travelogues/milan-2025-07" },
      { id: 3, name: "Verona, Italy", lat: 45.4384, lng: 10.9916, date: "July 2025", transportMode: "train", link: "/Travelogues/verona-2025-07" },
      { id: 4, name: "Venice, Italy", lat: 45.4408, lng: 12.3155, date: "July 2025", transportMode: "train", link: "/Travelogues/venice-2025-07" },
      { id: 5, name: "Vienna, Austria", lat: 48.2082, lng: 16.3738, date: "July 2025", transportMode: "airplane", link: "/Travelogues/vienna-2025-07" },
      { id: 6, name: "Budapest, Hungary", lat: 47.4979, lng: 19.0402, date: "July 2025", transportMode: "train", link: "/Travelogues/budapest-2025-07" },
      { id: 7, name: "Warsaw, Poland", lat: 52.2297, lng: 21.0122, date: "July 2025", transportMode: "airplane", link: "/Travelogues/warsaw-2025-07" },
      { id: 8, name: "Riga, Latvia", lat: 56.9496, lng: 24.1052, date: "July 2025", transportMode: "bus", link: "/Travelogues/riga-2025-07" },
      { id: 9, name: "Tallinn, Estonia", lat: 59.4370, lng: 24.7536, date: "July 2025", transportMode: "train", link: "/Travelogues/tallinn-2025-07" },
      { id: 10, name: "Helsinki, Finland", lat: 60.1699, lng: 24.9384, date: "July 2025", transportMode: "boat", link: "/Travelogues/helsinki-2025-07" },
      { id: 11, name: "Vilnius, Lithuania", lat: 54.6872, lng: 25.2797, date: "July 2025", transportMode: "bus", link: "/Travelogues/vilnius-2025-07" },
      { id: 12, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "July 2025", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2025-february",
    title: "2025 February - Korea",
    year: "2025",
    color: "#90A2D5",
    description: "From Taipei to Seoul and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "February 2025", transportMode: "airplane" },
      { id: 2, name: "Seoul, South Korea", lat: 37.5665, lng: 126.9780, date: "February 2025", transportMode: "airplane", link: "/Travelogues/seoul-2025-02" },
      { id: 3, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "February 2025", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2025-january",
    title: "2025 January - Japan",
    year: "2025",
    color: "#7DD7F5", // 淡藍綠，可調整
    description: "From Taipei to Fukuoka, Dazaifu, Yufuin, and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2025", transportMode: "airplane" },
      { id: 2, name: "Fukuoka, Japan", lat: 33.5904, lng: 130.4017, date: "January 2025", transportMode: "airplane", link: "/Travelogues/fukuoka-2025-01" },
      { id: 3, name: "Dazaifu, Japan", lat: 33.5200, lng: 130.5200, date: "January 2025", transportMode: "train", link: "/Travelogues/dazaifu-2025-01" },
      { id: 4, name: "Yufuin, Japan", lat: 33.2635, lng: 131.3537, date: "January 2025", transportMode: "train", link: "/Travelogues/yufuin-2025-01" },
      { id: 5, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2025", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2024-december",
    title: "2024 December - China",
    year: "2024",
    color: "#FF9797", // 紅色
    description: "From Taipei to Beijing, Nanjing, Hangzhou, Suzhou, Shanghai, and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "December 2024", transportMode: "airplane" },
      { id: 2, name: "Beijing, China", lat: 39.9042, lng: 116.4074, date: "December 2024", transportMode: "airplane", link: "/Travelogues/beijing-2024-12" },
      { id: 3, name: "Nanjing, China", lat: 32.0603, lng: 118.7969, date: "December 2024", transportMode: "train", link: "/Travelogues/nanjing-2024-12" },
      { id: 4, name: "Hangzhou, China", lat: 30.2741, lng: 120.1551, date: "December 2024", transportMode: "train", link: "/Travelogues/hangzhou-2024-12" },
      { id: 5, name: "Suzhou, China", lat: 31.2983, lng: 120.5832, date: "December 2024", transportMode: "train", link: "/Travelogues/suzhou-2024-12" },
      { id: 6, name: "Shanghai, China", lat: 31.2304, lng: 121.4737, date: "December 2024", transportMode: "train", link: "/Travelogues/shanghai-2024-12" },
      { id: 7, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "December 2024", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2024-july",
    title: "2024 July - Japan (Osaka & Kyoto)",
    year: "2024",
    color: "#C2C287",
    description: "From Taipei to Osaka, then Kyoto, and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "July 2024", transportMode: "airplane" },
      { id: 2, name: "Osaka, Japan", lat: 34.6937, lng: 135.5023, date: "July 2024", transportMode: "airplane", link: "/Travelogues/osaka-2024-07" },
      { id: 3, name: "Kyoto, Japan", lat: 35.0116, lng: 135.7681, date: "July 2024", transportMode: "train", link: "/Travelogues/kyoto-2024-07" },
      { id: 4, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "July 2024", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2024-june",
    title: "2024 June - Europe",
    year: "2024",
    color: "#ADADAD", // 青綠色
    description: "From Copenhagen, through Netherlands, Belgium, France, Switzerland, to Prague",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "June 2024", transportMode: "airplane" },
      { id: 2, name: "Copenhagen, Denmark", lat: 55.6761, lng: 12.5683, date: "June 2024", transportMode: "airplane", link: "/Travelogues/copenhagen-2024-06" },
      { id: 3, name: "Utrecht, Netherlands", lat: 52.0907, lng: 5.1214, date: "June 2024", transportMode: "bus", link: "/Travelogues/utrecht-2024-06" },
      { id: 4, name: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041, date: "June 2024", transportMode: "train", link: "/Travelogues/amsterdam-2024-06" },
      { id: 5, name: "Antwerp, Belgium", lat: 51.2194, lng: 4.4025, date: "June 2024", transportMode: "bus", link: "/Travelogues/antwerp-2024-06" },
      { id: 6, name: "Brussels, Belgium", lat: 50.8503, lng: 4.3517, date: "June 2024", transportMode: "car", link: "/Travelogues/brussels-2024-06" },
      { id: 7, name: "Colmar, France", lat: 48.0794, lng: 7.3586, date: "June 2024", transportMode: "bus", link: "/Travelogues/colmar-2024-06" },
      { id: 8, name: "Nice, France", lat: 43.7102, lng: 7.2620, date: "June 2024", transportMode: "bus", link: "/Travelogues/nice-2024-06" },
      { id: 9, name: "Menton, France", lat: 43.7745, lng: 7.5049, date: "June 2024", transportMode: "train", link: "/Travelogues/menton-2024-06" },
      { id: 10, name: "Monaco", lat: 43.7384, lng: 7.4246, date: "June 2024", transportMode: "train", link: "/Travelogues/monaco-2024-06" },
      { id: 11, name: "Marseille, France", lat: 43.2965, lng: 5.3698, date: "June 2024", transportMode: "bus", link: "/Travelogues/marseille-2024-06" },
      { id: 12, name: "Lac de Sainte-Croix, France", lat: 43.7700, lng: 6.2000, date: "June 2024", transportMode: "car", link: "/Travelogues/sainte-croix-2024-06" },
      { id: 13, name: "Provence, France", lat: 43.9500, lng: 5.0500, date: "June 2024", transportMode: "car", link: "/Travelogues/provence-2024-06" },
      { id: 14, name: "Lyon, France", lat: 45.7640, lng: 4.8357, date: "June 2024", transportMode: "bus", link: "/Travelogues/lyon-2024-06" },
      { id: 15, name: "Geneva, Switzerland", lat: 46.2044, lng: 6.1432, date: "June 2024", transportMode: "train", link: "/Travelogues/geneva-2024-06" },
      { id: 16, name: "Zermatt, Switzerland", lat: 46.0207, lng: 7.7491, date: "June 2024", transportMode: "bus", link: "/Travelogues/zermatt-2024-06" },
      { id: 17, name: "Grindelwald, Switzerland", lat: 46.6242, lng: 8.0340, date: "June 2024", transportMode: "bus", link: "/Travelogues/grindelwald-2024-06" },
      { id: 18, name: "Lungern, Switzerland", lat: 46.7861, lng: 8.1600, date: "June 2024", transportMode: "bus", link: "/Travelogues/lungern-2024-06" },
      { id: 19, name: "Prague, Czech Republic", lat: 50.0755, lng: 14.4378, date: "June 2024", transportMode: "bus", link: "/Travelogues/prague-2024-06" },
      { id: 20, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "June 2024", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2024-january",
    title: "2024 January - Singapore, Malaysia, Phuket",
    year: "2024",
    color: "#FFAD86",
    description: "From Taipei to Singapore, Malaysia, Phuket, and back to Taipei",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2024", transportMode: "airplane" },
      { id: 2, name: "Singapore", lat: 1.3521, lng: 103.8198, date: "January 2024", transportMode: "airplane", link: "/Travelogues/singapore-2024-01" },
      { id: 3, name: "Malaysia", lat: 3.1390, lng: 101.6869, date: "January 2024", transportMode: "airplane", link: "/Travelogues/malaysia-2024-01" },
      { id: 4, name: "Phuket, Thailand", lat: 7.9519, lng: 98.3381, date: "January 2024", transportMode: "airplane", link: "/Travelogues/phuket-2024-01" },
      { id: 5, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2024", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2023-january",
    title: "2023 January - Japan",
    year: "2023",
    color: "#84C1FF", // 淡藍色
    description: "From Taiwan to Takayama, Shirakawa-go, and Kanazawa",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2023", transportMode: "airplane" },
      { id: 2, name: "Takayama, Japan", lat: 36.1461, lng: 137.2522, date: "January 2023", transportMode: "airplane", link: "/Travelogues/takayama-2023-01" },
      { id: 3, name: "Shirakawa-go, Japan", lat: 36.2556, lng: 136.9064, date: "January 2023", transportMode: "car", link: "/Travelogues/shirakawa-go-2023-01" },
      { id: 4, name: "Kanazawa, Japan", lat: 36.5613, lng: 136.6562, date: "January 2023", transportMode: "car", link: "/Travelogues/kanazawa-2023-01" },
      { id: 5, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "January 2023", transportMode: "airplane" },
    ]
  },
  {
    id: "trip-2022-july",
    title: "2022 July - Europe and Singapore",
    year: "2022",
    color: "#FFE66F", // 淡黃色
    description: "From Greece, Vienna, Prague, Poznań, Berlin, to Singapore",
    locations: [
      { id: 1, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, date: "13 May", transportMode: "airplane" },
      { id: 2, name: "Athens, Greece", lat: 37.9838, lng: 23.7275, date: "July 2022", transportMode: "airplane", link: "/Travelogues/athens-2022-07" },
      { id: 3, name: "Vienna, Austria", lat: 48.2082, lng: 16.3738, date: "15 Apr", transportMode: "airplane", link: "/Travelogues/vienna-2022-07" },
      { id: 4, name: "Prague, Czech Republic", lat: 50.0755, lng: 14.4378, transportMode: "bus", link: "/Travelogues/prague-2022-07" },
      { id: 5, name: "Karlovy Vary, Czech Republic", lat: 50.2306, lng: 12.8711, date: "July 2022", transportMode: "car", link: "/Travelogues/karlovy-vary-2022-07" },
      { id: 6, name: "Poznań, Poland", lat: 52.4064, lng: 16.9252, transportMode: "bus", link: "/Travelogues/poznan-2022-07" },
      { id: 7, name: "Berlin, Germany", lat: 52.5200, lng: 13.4050, transportMode: "bus", link: "/Travelogues/berlin-2022-07" },
      { id: 8, name: "Singapore", lat: 1.3521, lng: 103.8198, transportMode: "airplane", link: "/Travelogues/singapore-2022-07" },
      { id: 9, name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, transportMode: "airplane" },
    ]
  },
];

export const dailyLife: DailyLife[] = [
  { id: "lego-date", title: "Lego Date", description: "A special day with LEGO.", coverImage: "/images/lego-date.jpg", date: "2025-12-24", route: "/daily-life/lego-date" },
];
