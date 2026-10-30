import { calculateBookingQuote, computeDashboardMetrics } from './bookingLogic';
import {
  DEFAULT_ADDONS,
  DEFAULT_PROFILE_CONTENT,
  DEFAULT_PUPDATE_FEED,
  DEFAULT_REVIEWS,
  DEFAULT_SERVICES,
  INITIAL_BOOKINGS,
} from './catalog';
import {
  AddonItem,
  BookingFormInput,
  BookingStatus,
  NannyProfileContent,
  PupdateFeedItem,
  ReviewItem,
  ServiceItem,
  VerifiedBooking,
} from './types';

export interface PetNannyState {
  services: ServiceItem[];
  addons: AddonItem[];
  reviews: ReviewItem[];
  pupdates: PupdateFeedItem[];
  profile: NannyProfileContent;
  bookings: VerifiedBooking[];
  closedDates: Record<string, string>;
}

export interface OtpChallenge {
  challengeId: string;
  destination: string;
  devCode: string;
  expiresIn: number;
  payload: BookingFormInput;
}

const STORAGE_KEY = 'pet_nanny_bicol_state_v2';

function loadInitialState(): PetNannyState {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        services: parsed.services || DEFAULT_SERVICES,
        addons: parsed.addons || DEFAULT_ADDONS,
        reviews: parsed.reviews || DEFAULT_REVIEWS,
        pupdates: parsed.pupdates || DEFAULT_PUPDATE_FEED,
        profile: parsed.profile || DEFAULT_PROFILE_CONTENT,
        bookings: parsed.bookings || INITIAL_BOOKINGS,
        closedDates: parsed.closedDates || {
          '2026-12-25': 'Christmas Day Family Break',
        },
      };
    }
  } catch {
    // Fallback to defaults
  }

  return {
    services: [...DEFAULT_SERVICES],
    addons: [...DEFAULT_ADDONS],
    reviews: [...DEFAULT_REVIEWS],
    pupdates: [...DEFAULT_PUPDATE_FEED],
    profile: { ...DEFAULT_PROFILE_CONTENT },
    bookings: [...INITIAL_BOOKINGS],
    closedDates: {
      '2026-12-25': 'Christmas Day Family Break',
    },
  };
}

export function createPetNannyStore() {
  let state: PetNannyState = loadInitialState();
  const listeners = new Set<() => void>();
  const challenges = new Map<string, OtpChallenge>();

  function persist() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Ignore quota errors
    }
    listeners.forEach((fn) => fn());
  }

  return {
    getState(): PetNannyState {
      return state;
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    requestOtp(payload: BookingFormInput): OtpChallenge {
      const challengeId = 'otp_' + Math.random().toString(36).slice(2, 10);
      const randomSix = String(Math.floor(100000 + Math.random() * 900000));
      const devCode = randomSix === '000000' ? '482915' : randomSix;
      const challenge: OtpChallenge = {
        challengeId,
        destination: payload.customerEmail.trim(),
        devCode,
        expiresIn: 300,
        payload,
      };
      challenges.set(challengeId, challenge);
      return challenge;
    },

    verifyOtp(
      challengeId: string,
      code: string
    ): { success: boolean; error?: string; booking?: VerifiedBooking } {
      const ch = challenges.get(challengeId);
      if (!ch) {
        return { success: false, error: 'Verification session expired. Please request a new code.' };
      }
      if (code.trim() !== ch.devCode) {
        return { success: false, error: 'Invalid 6-digit verification code. Please try again.' };
      }

      const quote = calculateBookingQuote(
        ch.payload.serviceSlug,
        ch.payload.isFirstBooking,
        state.services
      );
      const refSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      const newBooking: VerifiedBooking = {
        ...ch.payload,
        id: 'bk_' + Date.now() + '_' + refSuffix,
        bookingReference: `PN-${refSuffix}`,
        status: 'new',
        serviceName: quote.serviceName,
        quotedPrice: quote.finalMin,
        quotedPriceMax: quote.finalMax,
        createdAt: new Date().toISOString(),
      };

      state = {
        ...state,
        bookings: [newBooking, ...state.bookings],
      };
      challenges.delete(challengeId);
      persist();
      return { success: true, booking: newBooking };
    },

    updateBookingStatus(bookingId: string, status: BookingStatus) {
      state = {
        ...state,
        bookings: state.bookings.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      };
      persist();
    },

    toggleClosedDate(dateStr: string, reason = 'Owner Scheduled Closure') {
      const next = { ...state.closedDates };
      if (next[dateStr]) {
        delete next[dateStr];
      } else {
        next[dateStr] = reason;
      }
      state = {
        ...state,
        closedDates: next,
      };
      persist();
    },

    updateService(updated: ServiceItem) {
      const exists = state.services.some((s) => s.id === updated.id || s.slug === updated.slug);
      state = {
        ...state,
        services: exists
          ? state.services.map((s) =>
              s.id === updated.id || s.slug === updated.slug ? updated : s
            )
          : [...state.services, updated],
      };
      persist();
    },

    toggleReviewApproval(reviewId: string) {
      state = {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r
        ),
      };
      persist();
    },

    addReview(review: Omit<ReviewItem, 'id'>) {
      const newReview: ReviewItem = {
        ...review,
        id: 'rev_' + Date.now(),
      };
      state = {
        ...state,
        reviews: [newReview, ...state.reviews],
      };
      persist();
    },

    updateProfile(profile: Partial<NannyProfileContent>) {
      state = {
        ...state,
        profile: { ...state.profile, ...profile },
      };
      persist();
    },

    addPupdate(pupdate: Omit<PupdateFeedItem, 'id'>) {
      const item: PupdateFeedItem = {
        ...pupdate,
        id: 'pup_' + Date.now(),
      };
      state = {
        ...state,
        pupdates: [item, ...state.pupdates],
      };
      persist();
    },

    exportBookingsCsv(): string {
      const headers = [
        'Reference',
        'Status',
        'Furparent',
        'Phone',
        'Email',
        'City',
        'Pet',
        'Service',
        'Date',
        'Time',
        'Quoted PHP',
      ];
      const rows = state.bookings.map((b) =>
        [
          b.bookingReference,
          b.status,
          `"${b.customerName.replace(/"/g, '""')}"`,
          b.customerPhone,
          b.customerEmail,
          b.city,
          `"${b.petName.replace(/"/g, '""')} (${b.petType})"`,
          `"${b.serviceName}"`,
          b.preferredDate,
          b.preferredTime,
          b.quotedPrice,
        ].join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    },

    exportFinancialsCsv(): string {
      const metrics = computeDashboardMetrics(state.bookings, state.services);
      const headers = [
        'Service',
        'Total Bookings',
        'Completed Count',
        'Completed Revenue (PHP)',
        'Confirmed Pipeline (PHP)',
      ];
      const rows = metrics.servicesBreakdown.map((s) =>
        [
          `"${s.serviceName}"`,
          s.totalBookings,
          s.completedCount,
          s.completedRevenue.toFixed(2),
          s.confirmedValue.toFixed(2),
        ].join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    },
  };
}

export type PetNannyStore = ReturnType<typeof createPetNannyStore>;
export const globalPetNannyStore = createPetNannyStore();

