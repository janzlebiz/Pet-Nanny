import {
  AddonItem,
  NannyProfileContent,
  PupdateFeedItem,
  ReviewItem,
  ServiceItem,
  VerifiedBooking,
} from './types';

export const WHATSAPP_NUMBER = '639569025256';
export const WHATSAPP_DISPLAY = '+63 956 902 5256';
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61591940078723';
export const LIVE_WEBSITE_URL = 'https://petnannybicol.vercel.app';

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: '53ddbc35-ddfe-42ed-bc34-c0fd23486074',
    name: 'Dog Walking',
    slug: 'dog-walking',
    badge: 'Most Fetched',
    description:
      'A 30–45 minute leashed walk with basic commands (Sit, Stay, Wait). Includes fresh water refill, paw wipe, playtime, and GPS/photo pupdates.',
    priceAmount: 350,
    priceMax: null,
    currency: 'PHP',
    pricingUnit: 'pet',
    durationMinutes: 45,
    features: [
      'Leashed neighborhood walk (30–45 mins)',
      'Basic commands practice (Sit, Stay, Wait)',
      'Fresh water refill & paw wipe',
      'Real-time photo & video pupdate',
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '155427b7-9d04-4d47-8976-da89a4c6a9c8',
    name: 'Day Visit',
    slug: 'day-visit',
    description:
      'Friendly in-home drop-in visit within Daet: scheduled feeding, fresh water, potty break or litter box cleaning, medication if needed, and companionship.',
    priceAmount: 350,
    priceMax: 500,
    currency: 'PHP',
    pricingUnit: 'visit',
    durationMinutes: 60,
    features: [
      'Feeding & fresh water bowl refresh',
      'Litter box scoop or potty break',
      'Playtime, cuddles & mental enrichment',
      'Daily photo & video check-in',
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '3db08181-263c-46cf-a604-42cc2378c37c',
    name: 'In-Home Sitting (8–12 hrs)',
    slug: 'in-home-day',
    description:
      'Full-day companion care in your pet’s own familiar home for long workdays and out-of-town trips across Daet and Naga City.',
    priceAmount: 600,
    priceMax: 900,
    currency: 'PHP',
    pricingUnit: 'pet',
    durationMinutes: 600,
    features: [
      'Full-day presence (8–12 hours)',
      'Multiple walks, meals & play sessions',
      'Strict adherence to house & med routines',
      'Continuous photo & video pupdates',
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: '4f20a545-225a-4497-bd4a-242d2f223d95',
    name: 'Overnight Care',
    slug: 'overnight',
    badge: 'Limited Slots',
    description:
      '12-hour overnight stay so your pet never sleeps alone. Evening wind-down, bedtime cuddles, morning routine, and 24/7 CCTV-friendly peace of mind.',
    priceAmount: 1200,
    priceMax: 1800,
    currency: 'PHP',
    pricingUnit: 'night',
    durationMinutes: 720,
    features: [
      '12-hour overnight stay (7 PM – 7 AM)',
      'Evening wind-down & morning routine',
      'Safe inside your pet’s familiar home',
      'Wi-Fi CCTV & smart auto-feeder compatible',
    ],
    isActive: true,
    sortOrder: 4,
  },
];

export const DEFAULT_ADDONS: AddonItem[] = [
  {
    id: 'addon-meds',
    name: 'Medication Care',
    note: 'Oral, topical, or scheduled vitamins',
    priceLabel: '₱150–₱300',
    priceAmount: 150,
    priceMax: 300,
  },
  {
    id: 'addon-premium',
    name: 'Premium Smart Add-ons',
    note: 'Wi-Fi CCTV camera + automatic feeder rental',
    priceLabel: '₱200/day',
    priceAmount: 200,
  },
  {
    id: 'addon-taxi',
    name: 'Pet Taxi',
    note: 'Safe transport within Daet',
    priceLabel: '₱350',
    priceAmount: 350,
  },
  {
    id: 'addon-overtime',
    name: 'Extended Overtime',
    note: 'Flexible extra hours beyond booked slot',
    priceLabel: '₱200/hr',
    priceAmount: 200,
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Request & Verify',
    description:
      'Pick your service and schedule online or in the app. First-time furparents automatically get 10% off.',
  },
  {
    step: 2,
    title: 'Free Meet & Greet',
    description:
      'We visit beforehand with valid Government ID, Barangay Clearance, or NBI Clearance so trust is never a guessing game.',
  },
  {
    step: 3,
    title: 'Attentive In-Home Care',
    description:
      'Leashed walks with basic commands, smart scheduled feeding, playtime, and medication right in your pet’s safe space.',
  },
  {
    step: 4,
    title: 'Watch the Wag Live',
    description:
      'Receive photo & video pupdates all day—plus optional 24/7 Wi-Fi CCTV and smart auto-feeder remote access.',
  },
];

export const DEFAULT_PUPDATE_FEED: PupdateFeedItem[] = [
  {
    id: 'pup-1',
    time: '7:02 AM',
    category: 'walk',
    petName: 'Buster',
    title: 'Morning Neighborhood Walk',
    message:
      'Walk complete: 2.4 km around Daet. 3 mailboxes investigated, 1 dramatic squirrel standoff. Buster practiced Sit & Wait at every corner.',
    ownerReply: 'The squirrel standoff report made my whole morning!',
    metricsBadge: '2.4 km • 42 mins',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Buster mid-sniffari on his morning walk.',
  },
  {
    id: 'pup-2',
    time: '12:15 PM',
    category: 'meal',
    petName: 'Buster',
    title: 'Lunch & Medication Check',
    message:
      'Lunch served on schedule, fresh water bowl topped up, and daily vitamin tucked inside cheese. Zero drama.',
    metricsBadge: '100% Bowl Finished',
  },
  {
    id: 'pup-3',
    time: '6:00 PM',
    category: 'cctv',
    petName: 'Mochi',
    title: 'Wi-Fi CCTV & Smart Auto-Feeder',
    message:
      'Living room Wi-Fi camera active (24/7 remote access enabled). Smart auto-feeder dispensed evening portion right on time at 6:00 PM.',
    metricsBadge: 'LIVE 24/7 Stream',
  },
  {
    id: 'pup-4',
    time: '8:30 PM',
    category: 'cuddle',
    petName: 'Buster',
    title: 'Overnight Wind-Down & Bedtime',
    message:
      'Late-night potty break done, doors locked, and bedtime cuddle session complete. Overnight mode is on!',
    metricsBadge: 'Overnight Care Active',
  },
];

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: '57c5c5d0-6615-4151-8674-aaa50019dd35',
    authorName: 'Maria S.',
    authorLocation: 'Daet, Camarines Norte',
    rating: 5,
    title: 'Krizzia is a true lifesaver!',
    reviewText:
      'I was so anxious leaving my dog, Buster, for a full weekend, but Krizzia kept me updated with photos and videos the whole time. You can tell she genuinely loves animals—Buster warmed up to her immediately.',
    reviewDate: '2026-08-14',
    petTranslationTitle: 'Weekend with Tita Krizzia',
    petTranslationText:
      'I played hard to get for exactly six minutes, then face-planted into her lap and stayed there. My human received 47 photos. I counted.',
    petTranslationAuthor: 'Buster',
    petTranslationRole: 'Golden Retriever • Translated from woof',
    isApproved: true,
    isFeatured: true,
  },
  {
    id: 'b8d7cebe-4895-4f09-9b07-7ece76c8933e',
    authorName: 'James L.',
    authorLocation: 'Naga City, Camarines Sur',
    rating: 5,
    title: "They weren't kidding about the 'Dog Whisperer' title!",
    reviewText:
      'My rescue cat is usually terrified of strangers, but she was totally relaxed by day two. The smart feeding routine and regular photo check-ins gave me complete peace of mind while away on a business trip.',
    reviewDate: '2026-09-02',
    petTranslationTitle: 'A formal review of the new staff',
    petTranslationText:
      'Day one: evaluated her from under the bed. Day two: sat on her lap. The food robot she installed is acceptable. I permit her return.',
    petTranslationAuthor: 'Mochi',
    petTranslationRole: 'Rescue Cat • Translated from meow',
    isApproved: true,
    isFeatured: true,
  },
  {
    id: '61d5a5c7-22ac-46a4-a47c-ca64bc11eef1',
    authorName: 'Camille R.',
    authorLocation: 'Naga City, Camarines Sur',
    rating: 5,
    title: 'Professional, reliable, and super caring.',
    reviewText:
      'Grabe! Finding trustworthy overnight pet care in Bicol was always a struggle until we found Pet Nanny. Knowing they are experienced NGO rescue volunteers made us trust them right away. 10/10 service!',
    reviewDate: '2026-09-20',
    petTranslationTitle: 'Upgrade report',
    petTranslationText:
      'We used to get random sitters. Now we get the Dog Whisperer. My human trusts the NGO clearances; I trust the belly rub technique. Both are premium.',
    petTranslationAuthor: 'Luna',
    petTranslationRole: 'Shih Tzu • Translated from happy barking',
    isApproved: true,
    isFeatured: true,
  },
];

export const DEFAULT_PROFILE_CONTENT: NannyProfileContent = {
  founder: 'Isabela Krizzia',
  title: "Hi, I'm Krizzia — your pet's new favorite human.",
  caption: 'Krizzia • Daet & Naga City',
  ngoName: 'Daet Saving Strays',
  bioParagraph1:
    'Friends call me the Dog Whisperer because even shy and nervous pets warm up to me quickly. With years of hands-on experience caring for dogs and cats of every breed, size, and temperament, every furkid gets patience, kindness, and structured care.',
  bioParagraph2:
    'I am a proud member of Daet Saving Strays, a non-profit rescuing abandoned and neglected animals, backed by a dedicated team of experienced pet parents and NGO volunteers across Daet and Naga City.',
  handNote: 'Government ID, Barangay Clearance & NBI Clearance presented upon booking.',
  whatsappPhone: WHATSAPP_NUMBER,
  whatsappDisplay: WHATSAPP_DISPLAY,
  email: 'hello@petnannybicol.com',
  citiesServed: ['Daet, Camarines Norte', 'Naga City, Camarines Sur'],
  clearances: ['Valid Government ID', 'Barangay Clearance', 'NBI Clearance'],
};

export const INITIAL_BOOKINGS: VerifiedBooking[] = [
  {
    id: 'bk-seed-1',
    bookingReference: 'PN-904A',
    status: 'new',
    customerName: 'Angela Mendoza',
    customerPhone: '09178823411',
    customerEmail: 'angela.mendoza@example.com',
    petName: 'Choco',
    petType: 'Dog',
    serviceSlug: 'overnight',
    serviceName: 'Overnight Care',
    city: 'Daet',
    preferredDate: '2026-11-04',
    preferredTime: '19:00',
    notes: 'Needs evening meds with wet food at 7:30 PM.',
    isFirstBooking: true,
    quotedPrice: 1080,
    quotedPriceMax: 1620,
    createdAt: '2026-10-30T14:20:00Z',
  },
  {
    id: 'bk-seed-2',
    bookingReference: 'PN-772C',
    status: 'confirmed',
    customerName: 'Mark Villanueva',
    customerPhone: '09184459912',
    customerEmail: 'mark.v@example.com',
    petName: 'Nala',
    petType: 'Cat',
    serviceSlug: 'day-visit',
    serviceName: 'Day Visit',
    city: 'Daet',
    preferredDate: '2026-11-02',
    preferredTime: '10:00',
    notes: 'Clean litter box and refill fountain.',
    isFirstBooking: false,
    quotedPrice: 350,
    quotedPriceMax: 500,
    createdAt: '2026-10-29T09:15:00Z',
  },
  {
    id: 'bk-seed-3',
    bookingReference: 'PN-551B',
    status: 'completed',
    customerName: 'Camille Reyes',
    customerPhone: '09561123389',
    customerEmail: 'camille.r@example.com',
    petName: 'Luna',
    petType: 'Dog',
    serviceSlug: 'in-home-day',
    serviceName: 'In-Home Sitting (8–12 hrs)',
    city: 'Naga City',
    preferredDate: '2026-10-27',
    preferredTime: '08:00',
    notes: 'Two short walks at 9 AM and 4 PM.',
    isFirstBooking: false,
    quotedPrice: 750,
    quotedPriceMax: null,
    createdAt: '2026-10-25T11:00:00Z',
  },
  {
    id: 'bk-seed-4',
    bookingReference: 'PN-419D',
    status: 'completed',
    customerName: 'Maria Santos',
    customerPhone: '09175509123',
    customerEmail: 'maria.s@example.com',
    petName: 'Buster',
    petType: 'Dog',
    serviceSlug: 'dog-walking',
    serviceName: 'Dog Walking',
    city: 'Daet',
    preferredDate: '2026-10-26',
    preferredTime: '07:00',
    notes: 'Morning walk with basic Sit/Stay practice.',
    isFirstBooking: true,
    quotedPrice: 315,
    quotedPriceMax: null,
    createdAt: '2026-10-24T08:00:00Z',
  },
];

export const PET_TYPES = ['Dog', 'Cat', 'Bunny', 'Hamster', 'Bird', 'Other Companion'];

export const TIME_SLOTS = [
  { value: '07:00', label: '07:00 AM (Early Morning Walk)' },
  { value: '08:00', label: '08:00 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '17:00', label: '05:00 PM (Sunset Walk)' },
  { value: '18:00', label: '06:00 PM' },
  { value: '19:00', label: '07:00 PM (Overnight Check-In)' },
];
