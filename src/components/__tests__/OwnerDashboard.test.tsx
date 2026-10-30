import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OwnerDashboard } from '../OwnerDashboard';
import { createPetNannyStore } from '../../core/store';

describe('Task 4: Minimalist Owner Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders bookings queue, updates booking status, and switches to financials, calendar, services, and reviews tabs', () => {
    const store = createPetNannyStore();
    render(
      <OwnerDashboard
        store={store}
        onNavigateMode={() => {}}
      />
    );

    // Bookings Queue tab is active by default
    expect(screen.getByText(/Booking Requests Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/PN-904A/i)).toBeInTheDocument();

    // Confirm a new booking
    const confirmBtn = screen.getByTestId('confirm-booking-bk-seed-1');
    fireEvent.click(confirmBtn);
    expect(store.getState().bookings.find((b) => b.id === 'bk-seed-1')?.status).toBe('confirmed');

    // Switch to Calendar & Closures tab
    fireEvent.click(screen.getByRole('button', { name: /Calendar & Closures/i }));
    expect(screen.getByText(/Availability & Holiday Closures/i)).toBeInTheDocument();

    // Switch to Financials & Analytics tab
    fireEvent.click(screen.getByRole('button', { name: /Financials & Analytics/i }));
    expect(screen.getAllByText(/Completed Revenue/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₱1,065/i).length).toBeGreaterThan(0);

    // Switch to Services Catalog tab
    fireEvent.click(screen.getByRole('button', { name: /Services Catalog/i }));
    expect(screen.getByText(/Manage Services & Rates/i)).toBeInTheDocument();

    // Switch to Reviews & Profile tab
    fireEvent.click(screen.getByRole('button', { name: /Reviews & Profile/i }));
    expect(screen.getByText(/Reviews Moderation & Profile/i)).toBeInTheDocument();
  });
});
