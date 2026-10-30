import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerWebsite } from '../CustomerWebsite';
import { createPetNannyStore } from '../../core/store';

describe('Task 3: Minimalist Customer Website', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders minimalist hero, 4 services with PHP peso symbol, add-ons, Krizzia profile, and reviews switcher', () => {
    const store = createPetNannyStore();
    render(
      <CustomerWebsite
        store={store}
        onNavigateMode={() => {}}
      />
    );

    expect(screen.getByText(/Calm, attentive in-home care/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dog Walking/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Overnight Care/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₱350/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Medication Care/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Daet Saving Strays/i).length).toBeGreaterThan(0);

    // Switch reviews from Human Says to Pet Says
    expect(screen.getByText(/Krizzia is a true lifesaver!/i)).toBeInTheDocument();
    const petBtn = screen.getByRole('button', { name: /Pet Perspective/i });
    fireEvent.click(petBtn);
    expect(screen.getByText(/Weekend with Tita Krizzia/i)).toBeInTheDocument();
  });

  it('pre-selects a service card, validates booking form, and completes OTP verification', () => {
    const store = createPetNannyStore();
    render(
      <CustomerWebsite
        store={store}
        onNavigateMode={() => {}}
      />
    );

    const bookOvernightBtn = screen.getByTestId('select-service-overnight');
    fireEvent.click(bookOvernightBtn);

    fireEvent.change(screen.getByLabelText(/Furparent Name/i), {
      target: { value: 'Carlos Rivera' },
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), {
      target: { value: '09569025256' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'carlos@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Pet's Name/i), {
      target: { value: 'Milo' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Date/i), {
      target: { value: '2026-11-20' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Time/i), {
      target: { value: '19:00' },
    });

    const submitBtn = screen.getByRole('button', { name: /Verify & Request Booking/i });
    fireEvent.click(submitBtn);

    // OTP modal should open with sandbox autofill button
    expect(screen.getByText(/Verify Your Booking Request/i)).toBeInTheDocument();
    const autoFillBtn = screen.getByRole('button', { name: /Auto-fill Sandbox Code/i });
    fireEvent.click(autoFillBtn);

    const confirmOtpBtn = screen.getByRole('button', { name: /Confirm & Submit/i });
    fireEvent.click(confirmOtpBtn);

    expect(screen.getByText(/Booking Request Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/Send to WhatsApp/i)).toBeInTheDocument();
  });
});
