export type BookingStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type BicolCity = 'Daet' | 'Naga City';

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  description: string;
  priceAmount: number;
  priceMax: number | null;
  currency: 'PHP';
  pricingUnit: string;
  durationMinutes: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface AddonItem {
  id: string;
  name: string;
  note?: string;
  priceLabel: string;
  priceAmount: number;
  priceMax?: number;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  title: string;
  reviewText: string;
  reviewDate: string;
  petTranslationTitle: string;
  petTranslationText: string;
  petTranslationAuthor: string;
  petTranslationRole: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface PupdateFeedItem {
  id: string;
  time: string;
  category: 'walk' | 'meal' | 'cctv' | 'cuddle';
  petName: string;
  title: string;
  message: string;
  ownerReply?: string;
  metricsBadge?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface NannyProfileContent {
  founder: string;
  title: string;
  caption: string;
  ngoName: string;
  bioParagraph1: string;
  bioParagraph2: string;
  handNote: string;
  whatsappPhone: string;
  whatsappDisplay: string;
  email: string;
  citiesServed: string[];
  clearances: string[];
}

export interface BookingFormInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  petName: string;
  petType: string;
  serviceSlug: string;
  city: BicolCity;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  isFirstBooking: boolean;
}

export interface VerifiedBooking extends BookingFormInput {
  id: string;
  bookingReference: string;
  status: BookingStatus;
  serviceName: string;
  quotedPrice: number;
  quotedPriceMax?: number | null;
  createdAt: string;
}

export interface BookingQuote {
  serviceSlug: string;
  serviceName: string;
  pricingUnit: string;
  baseMin: number;
  baseMax: number | null;
  discountAmountMin: number;
  discountAmountMax: number | null;
  finalMin: number;
  finalMax: number | null;
  formattedBase: string;
  formattedFinal: string;
  formattedDiscount: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof BookingFormInput, string>>;
}

export interface ServiceBreakdownRow {
  serviceSlug: string;
  serviceName: string;
  totalBookings: number;
  completedCount: number;
  completedRevenue: number;
  confirmedValue: number;
}

export interface DashboardMetrics {
  totalRequests: number;
  newCount: number;
  activeCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  completedRevenue: number;
  confirmedPipelineValue: number;
  confirmationRatePct: number;
  cancellationRatePct: number;
  servicesBreakdown: ServiceBreakdownRow[];
}

