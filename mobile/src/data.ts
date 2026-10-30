export interface MobileService {
  id: string;
  slug: string;
  name: string;
  badge?: string;
  description: string;
  priceAmount: number;
  priceMax: number | null;
  unit: string;
  duration: string;
  features: string[];
}

export const MOBILE_SERVICES: MobileService[] = [
  {
    id: 'svc-1',
    slug: 'dog-walking',
    name: 'Dog Walking',
    badge: 'Most Fetched',
    description:
      '30–45 min leashed walk with basic commands (Sit, Stay, Wait), hydration refill, paw wipe & live pupdates.',
    priceAmount: 350,
    priceMax: null,
    unit: 'pet',
    duration: '30–45 mins',
    features: [
      'Leashed neighborhood walk',
      'Basic commands practice',
      'Fresh water & paw wipe',
      'Photo & GPS check-in',
    ],
  },
  {
    id: 'svc-2',
    slug: 'day-visit',
    name: 'Day Visit',
    description:
      'In-home drop-in within Daet: scheduled feeding, fresh water, potty break or litter scoop & companionship.',
    priceAmount: 350,
    priceMax: 500,
    unit: 'visit',
    duration: '45–60 mins',
    features: [
      'Feeding & water refresh',
      'Potty break / litter scoop',
      'Medication if needed',
      'Photo & video pupdate',
    ],
  },
  {
    id: 'svc-3',
    slug: 'in-home-day',
    name: 'In-Home Sitting (8–12 hrs)',
    description:
      'Full-day companion care in your pet’s own comfortable home for workdays and out-of-town trips.',
    priceAmount: 600,
    priceMax: 900,
    unit: 'pet',
    duration: '8–12 hours',
    features: [
      'Full-day presence (8–12 hrs)',
      'Multiple walks & meals',
      'House & routine adherence',
      'Continuous photo & video logs',
    ],
  },
  {
    id: 'svc-4',
    slug: 'overnight',
    name: 'Overnight Care',
    badge: 'Limited Slots',
    description:
      '12-hour overnight stay so your pet never sleeps alone. Evening wind-down, morning routine & 24/7 CCTV support.',
    priceAmount: 1200,
    priceMax: 1800,
    unit: 'night',
    duration: '12 hours',
    features: [
      '12-hr overnight stay (7 PM–7 AM)',
      'Bedtime cuddles & security',
      'Morning & evening feedings',
      'Wi-Fi CCTV & auto-feeder friendly',
    ],
  },
];

export const MOBILE_ADDONS = [
  { id: 'add-1', name: 'Medication Care', price: '₱150–₱300' },
  { id: 'add-2', name: 'Wi-Fi CCTV + Smart Feeder', price: '₱200/day' },
  { id: 'add-3', name: 'Pet Taxi (within Daet)', price: '₱350' },
  { id: 'add-4', name: 'Extended Overtime', price: '₱200/hr' },
];

export const MOBILE_PUPDATES = [
  {
    id: 'p1',
    time: '7:02 AM',
    pet: 'Buster',
    title: 'Morning Walk Complete (2.4 km)',
    detail: 'Practiced Sit & Wait at corners, 3 mailboxes inspected, fresh water topped up.',
  },
  {
    id: 'p2',
    time: '12:15 PM',
    pet: 'Buster',
    title: 'Lunch & Vitamin Check',
    detail: '100% bowl finished, daily vitamin hidden in cheese.',
  },
  {
    id: 'p3',
    time: '6:00 PM',
    pet: 'Mochi',
    title: 'Wi-Fi CCTV & Auto-Feeder',
    detail: 'Smart feeder dispensed evening portion on time; 24/7 live camera active.',
  },
];

export const MOBILE_REVIEWS = [
  {
    id: 'r1',
    humanAuthor: 'Maria S. • Daet',
    humanTitle: 'Krizzia is a true lifesaver!',
    humanBody:
      'Kept me updated with photos and videos the whole weekend. Buster warmed up to her immediately.',
    petAuthor: 'Buster (Golden Retriever)',
    petTitle: 'Weekend with Tita Krizzia',
    petBody:
      'I played hard to get for six minutes, then face-planted into her lap. My human received 47 photos.',
  },
  {
    id: 'r2',
    humanAuthor: 'James L. • Naga City',
    humanTitle: 'True Dog & Cat Whisperer',
    humanBody:
      'My shy rescue cat was totally relaxed by day two. The smart feeding routine gave me complete peace of mind.',
    petAuthor: 'Mochi (Rescue Cat)',
    petTitle: 'Formal review of the new staff',
    petBody:
      'Day one: evaluated her from under the bed. Day two: sat on her lap. The food robot is acceptable.',
  },
];

export function formatPhp(min: number, max?: number | null): string {
  const f = (n: number) => `₱${Math.round(n).toLocaleString('en-US')}`;
  return max && max > min ? `${f(min)}–${f(max)}` : f(min);
}

