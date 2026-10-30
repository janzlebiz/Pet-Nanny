import React, { useState } from 'react';
import { ShieldCheck, KeyRound, X } from 'lucide-react';
import { OtpChallenge } from '../core/store';

interface BookingModalOtpProps {
  challenge: OtpChallenge | null;
  onClose: () => void;
  onVerify: (code: string) => { success: boolean; error?: string };
}

export const BookingModalOtp: React.FC<BookingModalOtpProps> = ({
  challenge,
  onClose,
  onVerify,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!challenge) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Please enter a complete 6-digit verification code.');
      return;
    }
    const res = onVerify(code.trim());
    if (!res.success) {
      setError(res.error || 'Verification failed.');
    } else {
      setCode('');
      setError(null);
    }
  };

  return (
    <div
      className="pn-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
    >
      <div className="pn-modal">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pn-brand-mark" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 id="otp-modal-title" style={{ fontSize: '1.15rem' }}>
                Verify Your Booking Request
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                Pet Nanny Bicol Anti-Spam Security Check
              </p>
            </div>
          </div>
          <button
            type="button"
            className="pn-btn pn-btn-outline pn-btn-sm"
            onClick={onClose}
            aria-label="Close verification modal"
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', marginBottom: 14 }}>
          We dispatched a 6-digit verification code to{' '}
          <strong>{challenge.destination}</strong>. Enter it below to log your booking request:
        </p>

        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '0.84rem', color: '#1e40af' }}>
            <KeyRound size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Instant Code: <strong>{challenge.devCode}</strong>
          </span>
          <button
            type="button"
            className="pn-btn pn-btn-outline pn-btn-sm"
            onClick={() => {
              setCode(challenge.devCode);
              setError(null);
            }}
          >
            Auto-fill Sandbox Code
          </button>
        </div>

        <form onSubmit={handleConfirm}>
          <div className="pn-field" style={{ marginBottom: 16 }}>
            <label htmlFor="otp-code-input" className="pn-label">
              6-Digit Security Code
            </label>
            <input
              id="otp-code-input"
              className="pn-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.35em',
                textAlign: 'center',
                fontWeight: 700,
              }}
            />
            {error && <span className="pn-error-text">{error}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="pn-btn pn-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pn-btn pn-btn-primary">
              Confirm &amp; Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
