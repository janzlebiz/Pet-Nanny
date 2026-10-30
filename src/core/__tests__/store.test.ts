import { describe, it, expect, beforeEach } from 'vitest';
import { createPetNannyStore } from '../store';

describe('Task 2: PetNannyStore State, OTP Verification, Owner Actions & CSV Export', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('requests OTP challenge, verifies 6-digit code, and creates a verified booking', () => {
    const store = createPetNannyStore();
    const initialCount = store.getState().bookings.length;

    const challenge = store.requestOtp({
      customerName: 'Krizzia Test',
      customerPhone: '09569025256',
      customerEmail: 'krizzia@example.com',
      petName: 'Buster',
      petType: 'Dog',
      serviceSlug: 'dog-walking',
      city: 'Daet',
      preferredDate: '2026-11-15',
      preferredTime: '08:00',
      notes: 'Morning walk around Bagasbas',
      isFirstBooking: true,
    });

    expect(challenge.challengeId).toBeTruthy();
    expect(challenge.devCode).toMatch(/^\d{6}$/);

    // Invalid code should fail
    const badVerify = store.verifyOtp(challenge.challengeId, '000000');
    expect(badVerify.success).toBe(false);

    // Valid code should succeed and add booking
    const goodVerify = store.verifyOtp(challenge.challengeId, challenge.devCode);
    expect(goodVerify.success).toBe(true);
    expect(goodVerify.booking?.bookingReference).toMatch(/^PN-/);
    expect(goodVerify.booking?.quotedPrice).toBe(315);
    expect(store.getState().bookings.length).toBe(initialCount + 1);
  });

  it('supports owner dashboard actions: status updates, date closures, service edits, and CSV exports', () => {
    const store = createPetNannyStore();
    const firstBooking = store.getState().bookings[0];

    store.updateBookingStatus(firstBooking.id, 'confirmed');
    expect(store.getState().bookings[0].status).toBe('confirmed');

    store.toggleClosedDate('2026-12-31', 'New Year Eve Closure');
    expect(store.getState().closedDates['2026-12-31']).toBe('New Year Eve Closure');

    store.toggleClosedDate('2026-12-31');
    expect(store.getState().closedDates['2026-12-31']).toBeUndefined();

    const dogWalking = store.getState().services.find((s) => s.slug === 'dog-walking')!;
    store.updateService({ ...dogWalking, priceAmount: 400 });
    expect(store.getState().services.find((s) => s.slug === 'dog-walking')?.priceAmount).toBe(400);

    const bookingsCsv = store.exportBookingsCsv();
    expect(bookingsCsv).toContain('Reference,Status,Furparent,Phone,Email,City,Pet,Service,Date,Time,Quoted PHP');
    expect(bookingsCsv).toContain(firstBooking.bookingReference);

    const financialsCsv = store.exportFinancialsCsv();
    expect(financialsCsv).toContain('Service,Total Bookings,Completed Count,Completed Revenue (PHP),Confirmed Pipeline (PHP)');
  });
});

