import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileAppExperience } from '../MobileAppExperience';
import { createPetNannyStore } from '../../core/store';

describe('Task 5: Mobile App Experience (Thumb-Friendly 5-Tab Bar, Step-by-Step Booking & Mobile Owner Console)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('navigates across all 5 mobile bottom tabs (Home, Services, Pupdates, Book, Owner) and completes mobile step-by-step booking', () => {
    const store = createPetNannyStore();
    render(<MobileAppExperience store={store} />);

    // Home Tab default
    expect(screen.getAllByText(/Pet Nanny Bicol/i).length).toBeGreaterThan(0);

    // Switch to Services Tab
    fireEvent.click(screen.getByTestId('mobile-tab-services'));
    expect(screen.getAllByText(/In-Home Sitting/i).length).toBeGreaterThan(0);

    // Switch to Pupdates Tab
    fireEvent.click(screen.getByTestId('mobile-tab-pupdates'));
    expect(screen.getAllByText(/Morning Neighborhood Walk/i).length).toBeGreaterThan(0);

    // Switch to Book Tab (Step 1 -> Step 2 -> Step 3 OTP)
    fireEvent.click(screen.getByTestId('mobile-tab-book'));
    expect(screen.getByText(/Step 1 of 3: Service & Schedule/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Continue to Pet Details/i }));
    expect(screen.getByText(/Step 2 of 3: Furparent & Pet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Your Name/i), {
      target: { value: 'Elena Gomez' },
    });
    fireEvent.change(screen.getByLabelText(/PH Mobile/i), {
      target: { value: '09569025256' },
    });
    fireEvent.change(screen.getByLabelText(/Email for OTP/i), {
      target: { value: 'elena@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Pet Name/i), {
      target: { value: 'Koko' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Send 6-Digit OTP/i }));
    expect(screen.getByText(/Step 3 of 3: Verify Code/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Tap to Auto-Fill Code/i }));
    fireEvent.click(screen.getByRole('button', { name: /Verify & Complete Booking/i }));
    expect(screen.getByText(/Mobile Booking Confirmed!/i)).toBeInTheDocument();

    // Switch to Mobile Owner Tab
    fireEvent.click(screen.getByTestId('mobile-tab-owner'));
    expect(screen.getAllByText(/Mobile Owner Console/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Elena Gomez/i)).toBeInTheDocument();
  });
});
