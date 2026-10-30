import { describe, it, expect } from 'vitest';
import {
  formatPhpCurrency,
  calculateBookingQuote,
  validateBookingInput,
  composeWhatsAppMessage,
  computeDashboardMetrics,
} from '../bookingLogic';
import { DEFAULT_SERVICES } from '../catalog';
import { VerifiedBooking } from '../types';

describe('Task 1: Pet Nanny Bicol Core Domain & Booking Logic', () => {
  it('formats PHP currency strictly with ₱ symbol and never ?', () => {
    expect(formatPhpCurrency(350)).toBe('₱350');
    expect(formatPhpCurrency(350, 500)).toBe('₱350–₱500');
    expect(formatPhpCurrency(1200, 1800)).toBe('₱1,200–₱1,800');
    expect(formatPhpCurrency(1200, 1800)).not.toContain('?');
  });

  it('calculates 10% first-booking discount accurately for single and range services', () => {
    const walkRegular = calculateBookingQuote('dog-walking', false, DEFAULT_SERVICES);
    expect(walkRegular.baseMin).toBe(350);
    expect(walkRegular.finalMin).toBe(350);
    expect(walkRegular.formattedFinal).toBe('₱350');

    const walkFirst = calculateBookingQuote('dog-walking', true, DEFAULT_SERVICES);
    expect(walkFirst.discountAmountMin).toBe(35);
    expect(walkFirst.finalMin).toBe(315);
    expect(walkFirst.formattedFinal).toBe('₱315');

    const overnightFirst = calculateBookingQuote('overnight', true, DEFAULT_SERVICES);
    expect(overnightFirst.baseMin).toBe(1200);
    expect(overnightFirst.baseMax).toBe(1800);
    expect(overnightFirst.finalMin).toBe(1080);
    expect(overnightFirst.finalMax).toBe(1620);
    expect(overnightFirst.formattedFinal).toBe('₱1,080–₱1,620');
  });

  it('validates Philippine mobile numbers, emails, required fields, and closed dates', () => {
    const valid = validateBookingInput(
      {
        customerName: 'Maria Santos',
        customerPhone: '0956 902 5256',
        customerEmail: 'maria@example.com',
        petName: 'Buster',
        petType: 'Dog',
        serviceSlug: 'dog-walking',
        city: 'Daet',
        preferredDate: '2026-11-05',
        preferredTime: '08:00',
        notes: 'Loves belly rubs',
        isFirstBooking: true,
      },
      { '2026-12-25': 'Christmas Holiday' },
      '2026-10-31'
    );
    expect(valid.isValid).toBe(true);
    expect(Object.keys(valid.errors)).toHaveLength(0);

    const closedDay = validateBookingInput(
      {
        customerName: 'Maria Santos',
        customerPhone: '+639569025256',
        customerEmail: 'maria@example.com',
        petName: 'Buster',
        petType: 'Dog',
        serviceSlug: 'dog-walking',
        city: 'Daet',
        preferredDate: '2026-12-25',
        preferredTime: '08:00',
        notes: '',
        isFirstBooking: false,
      },
      { '2026-12-25': 'Christmas Holiday' },
      '2026-10-31'
    );
    expect(closedDay.isValid).toBe(false);
    expect(closedDay.errors.preferredDate).toContain('Christmas Holiday');

    const invalidFields = validateBookingInput(
      {
        customerName: 'A',
        customerPhone: '12345',
        customerEmail: 'not-an-email',
        petName: '',
        petType: '',
        serviceSlug: '',
        city: 'Daet',
        preferredDate: '2026-10-01',
        preferredTime: '',
        notes: '',
        isFirstBooking: false,
      },
      {},
      '2026-10-31'
    );
    expect(invalidFields.isValid).toBe(false);
    expect(invalidFields.errors.customerName).toBeDefined();
    expect(invalidFields.errors.customerPhone).toBeDefined();
    expect(invalidFields.errors.customerEmail).toBeDefined();
    expect(invalidFields.errors.petName).toBeDefined();
    expect(invalidFields.errors.preferredDate).toBeDefined();
    expect(invalidFields.errors.preferredTime).toBeDefined();
  });

  it('composes verified WhatsApp booking message targeting +63 956 902 5256', () => {
    const sampleBooking: VerifiedBooking = {
      id: 'bk-1',
      bookingReference: 'PN-8A2F',
      status: 'new',
      customerName: 'Juan dela Cruz',
      customerPhone: '09569025256',
      customerEmail: 'juan@example.com',
      petName: 'Buster',
      petType: 'Dog',
      serviceSlug: 'dog-walking',
      serviceName: 'Dog Walking',
      city: 'Daet',
      preferredDate: '2026-11-10',
      preferredTime: '08:00',
      notes: 'Friendly golden retriever',
      isFirstBooking: true,
      quotedPrice: 315,
      createdAt: '2026-10-31T00:00:00Z',
    };
    const { message, whatsappUrl } = composeWhatsAppMessage(sampleBooking);
    expect(message).toContain('PN-8A2F');
    expect(message).toContain('Juan dela Cruz');
    expect(message).toContain('Buster (Dog)');
    expect(message).toContain('10% discount');
    expect(whatsappUrl).toContain('https://wa.me/639569025256?text=');
  });

  it('computes owner dashboard financial and booking metrics accurately', () => {
    const bookings: VerifiedBooking[] = [
      {
        id: '1',
        bookingReference: 'PN-1001',
        status: 'completed',
        customerName: 'Maria S.',
        customerPhone: '09171234567',
        customerEmail: 'maria@example.com',
        petName: 'Buster',
        petType: 'Dog',
        serviceSlug: 'overnight',
        serviceName: 'Overnight Care',
        city: 'Daet',
        preferredDate: '2026-10-20',
        preferredTime: '19:00',
        notes: '',
        isFirstBooking: false,
        quotedPrice: 1200,
        createdAt: '2026-10-18T10:00:00Z',
      },
      {
        id: '2',
        bookingReference: 'PN-1002',
        status: 'confirmed',
        customerName: 'James L.',
        customerPhone: '09181234567',
        customerEmail: 'james@example.com',
        petName: 'Mochi',
        petType: 'Cat',
        serviceSlug: 'day-visit',
        serviceName: 'Day Visit',
        city: 'Naga City',
        preferredDate: '2026-11-02',
        preferredTime: '10:00',
        notes: '',
        isFirstBooking: true,
        quotedPrice: 315,
        createdAt: '2026-10-29T10:00:00Z',
      },
      {
        id: '3',
        bookingReference: 'PN-1003',
        status: 'cancelled',
        customerName: 'Ana P.',
        customerPhone: '09191234567',
        customerEmail: 'ana@example.com',
        petName: 'Coco',
        petType: 'Dog',
        serviceSlug: 'dog-walking',
        serviceName: 'Dog Walking',
        city: 'Daet',
        preferredDate: '2026-11-03',
        preferredTime: '07:00',
        notes: '',
        isFirstBooking: false,
        quotedPrice: 350,
        createdAt: '2026-10-30T10:00:00Z',
      },
    ];

    const metrics = computeDashboardMetrics(bookings, DEFAULT_SERVICES);
    expect(metrics.totalRequests).toBe(3);
    expect(metrics.completedCount).toBe(1);
    expect(metrics.confirmedCount).toBe(1);
    expect(metrics.cancelledCount).toBe(1);
    expect(metrics.completedRevenue).toBe(1200);
    expect(metrics.confirmedPipelineValue).toBe(315);
    expect(metrics.confirmationRatePct).toBe(67);
    expect(metrics.cancellationRatePct).toBe(33);
  });
});

