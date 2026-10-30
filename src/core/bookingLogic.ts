import { DEFAULT_SERVICES, WHATSAPP_NUMBER } from './catalog';
import {
  BookingFormInput,
  BookingQuote,
  DashboardMetrics,
  ServiceBreakdownRow,
  ServiceItem,
  ValidationResult,
  VerifiedBooking,
} from './types';

export function formatPhpCurrency(amount: number, maxAmount?: number | null): string {
  const fmt = (n: number) => `₱${Math.round(n).toLocaleString('en-US')}`;
  if (typeof maxAmount === 'number' && maxAmount > amount) {
    return `${fmt(amount)}–${fmt(maxAmount)}`;
  }
  return fmt(amount);
}

export function calculateBookingQuote(
  serviceSlug: string,
  isFirstBooking: boolean,
  services: ServiceItem[] = DEFAULT_SERVICES
): BookingQuote {
  const service =
    services.find((s) => s.slug === serviceSlug) || services[0] || DEFAULT_SERVICES[0];

  const baseMin = service.priceAmount;
  const baseMax = service.priceMax;

  const discountRate = isFirstBooking ? 0.1 : 0;
  const discountAmountMin = Math.round(baseMin * discountRate);
  const discountAmountMax = baseMax !== null ? Math.round(baseMax * discountRate) : null;

  const finalMin = baseMin - discountAmountMin;
  const finalMax = baseMax !== null && discountAmountMax !== null ? baseMax - discountAmountMax : null;

  return {
    serviceSlug: service.slug,
    serviceName: service.name,
    pricingUnit: service.pricingUnit,
    baseMin,
    baseMax,
    discountAmountMin,
    discountAmountMax,
    finalMin,
    finalMax,
    formattedBase: formatPhpCurrency(baseMin, baseMax),
    formattedFinal: formatPhpCurrency(finalMin, finalMax),
    formattedDiscount:
      discountAmountMin > 0
        ? `-${formatPhpCurrency(discountAmountMin, discountAmountMax)} (10% First Booking)`
        : '₱0',
  };
}

export function validateBookingInput(
  input: BookingFormInput,
  closedDates: Record<string, string> = {},
  todayStr: string = new Date().toISOString().slice(0, 10)
): ValidationResult {
  const errors: Partial<Record<keyof BookingFormInput, string>> = {};

  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your name (at least 2 characters).';
  }

  const normalizedPhone = (input.customerPhone || '').replace(/[\s-]/g, '');
  if (!/^(\+63|0)9\d{9}$/.test(normalizedPhone)) {
    errors.customerPhone = 'Enter a valid PH mobile number (e.g. 0956 902 5256).';
  }

  const email = (input.customerEmail || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.customerEmail = 'Enter a valid email address for OTP verification.';
  }

  if (!input.petName || input.petName.trim().length < 1) {
    errors.petName = "Please enter your pet's name.";
  }

  if (!input.petType || input.petType.trim().length < 1) {
    errors.petType = 'Please select your pet type.';
  }

  if (!input.serviceSlug || input.serviceSlug.trim().length < 1) {
    errors.serviceSlug = 'Please choose a service.';
  }

  if (!input.preferredDate) {
    errors.preferredDate = 'Please select a preferred date.';
  } else if (input.preferredDate < todayStr) {
    errors.preferredDate = 'Preferred date cannot be in the past.';
  } else if (closedDates[input.preferredDate]) {
    errors.preferredDate = `Closed on this date: ${closedDates[input.preferredDate]}`;
  }

  if (!input.preferredTime) {
    errors.preferredTime = 'Please select a preferred time slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function composeWhatsAppMessage(booking: VerifiedBooking): {
  message: string;
  whatsappUrl: string;
} {
  const quoteLabel = formatPhpCurrency(booking.quotedPrice, booking.quotedPriceMax);
  const lines = [
    'Hi Pet Nanny Bicol! Verified booking request:',
    `• Reference: ${booking.bookingReference}`,
    `• Furparent: ${booking.customerName.trim()} (${booking.city})`,
    `• Contact: ${booking.customerPhone.trim()} • ${booking.customerEmail.trim()}`,
    `• Pet: ${booking.petName.trim()} (${booking.petType})`,
    `• Service: ${booking.serviceName} (${quoteLabel})`,
    `• Schedule: ${booking.preferredDate} at ${booking.preferredTime}`,
  ];

  if (booking.notes?.trim()) {
    lines.push(`• Notes: ${booking.notes.trim()}`);
  }
  if (booking.isFirstBooking) {
    lines.push('• First-time booking: 10% discount applied');
  }
  lines.push('(Verified via 6-digit OTP • Status: Pending Confirmation)');

  const message = lines.join('\n');
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return { message, whatsappUrl };
}

export function computeDashboardMetrics(
  bookings: VerifiedBooking[],
  services: ServiceItem[] = DEFAULT_SERVICES
): DashboardMetrics {
  const totalRequests = bookings.length;
  const newCount = bookings.filter((b) => b.status === 'new' || b.status === 'contacted').length;
  const confirmedCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  ).length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const completedRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.quotedPrice) || 0), 0);

  const confirmedPipelineValue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'in_progress')
    .reduce((sum, b) => sum + (Number(b.quotedPrice) || 0), 0);

  const positiveCount = confirmedCount + completedCount;
  const confirmationRatePct =
    totalRequests > 0 ? Math.round((positiveCount / totalRequests) * 100) : 0;
  const cancellationRatePct =
    totalRequests > 0 ? Math.round((cancelledCount / totalRequests) * 100) : 0;

  const servicesBreakdown: ServiceBreakdownRow[] = services.map((svc) => {
    const matching = bookings.filter((b) => b.serviceSlug === svc.slug);
    const completed = matching.filter((b) => b.status === 'completed');
    const confirmed = matching.filter(
      (b) => b.status === 'confirmed' || b.status === 'in_progress'
    );
    return {
      serviceSlug: svc.slug,
      serviceName: svc.name,
      totalBookings: matching.length,
      completedCount: completed.length,
      completedRevenue: completed.reduce((s, b) => s + (Number(b.quotedPrice) || 0), 0),
      confirmedValue: confirmed.reduce((s, b) => s + (Number(b.quotedPrice) || 0), 0),
    };
  });

  return {
    totalRequests,
    newCount,
    activeCount: confirmedCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    completedRevenue,
    confirmedPipelineValue,
    confirmationRatePct,
    cancellationRatePct,
    servicesBreakdown,
  };
}
