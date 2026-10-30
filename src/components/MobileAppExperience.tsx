import React, { useEffect, useState } from 'react';
import {
  Home,
  Tag,
  Camera,
  CalendarPlus,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Smartphone,
  Terminal,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  calculateBookingQuote,
  composeWhatsAppMessage,
  formatPhpCurrency,
  validateBookingInput,
} from '../core/bookingLogic';
import { PET_TYPES, TIME_SLOTS } from '../core/catalog';
import { OtpChallenge, PetNannyStore } from '../core/store';
import { BicolCity, BookingFormInput, VerifiedBooking } from '../core/types';

interface MobileAppExperienceProps {
  store: PetNannyStore;
}

type MobileTab = 'home' | 'services' | 'pupdates' | 'book' | 'owner';

export const MobileAppExperience: React.FC<MobileAppExperienceProps> = ({ store }) => {
  const [state, setState] = useState(() => store.getState());
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [city, setCity] = useState<BicolCity>('Daet');
  const [reviewVoice, setReviewVoice] = useState<'human' | 'pet'>('human');

  // 3-Step Mobile Booking Wizard
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<BookingFormInput>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    petName: '',
    petType: 'Dog',
    serviceSlug: 'dog-walking',
    city: 'Daet',
    preferredDate: '2026-11-15',
    preferredTime: '08:00',
    notes: '',
    isFirstBooking: true,
  });
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<VerifiedBooking | null>(null);

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()));
  }, [store]);

  const activeServices = state.services.filter((s) => s.isActive);
  const quote = calculateBookingQuote(form.serviceSlug, form.isFirstBooking, activeServices);

  const handleSelectMobileService = (slug: string) => {
    setForm((prev) => ({ ...prev, serviceSlug: slug, city }));
    setWizardStep(1);
    setActiveTab('book');
  };

  const handleSendMobileOtp = () => {
    const validation = validateBookingInput(
      { ...form, city },
      state.closedDates,
      '2026-10-31'
    );
    if (!validation.isValid) {
      const firstErr = Object.values(validation.errors)[0];
      setWizardError(firstErr || 'Please check your booking details.');
      return;
    }
    setWizardError(null);
    const ch = store.requestOtp({ ...form, city });
    setChallenge(ch);
    setOtpCode('');
    setWizardStep(3);
  };

  const handleVerifyMobileOtp = () => {
    if (!challenge) return;
    const res = store.verifyOtp(challenge.challengeId, otpCode);
    if (!res.success || !res.booking) {
      setWizardError(res.error || 'Invalid OTP code.');
      return;
    }
    setWizardError(null);
    setConfirmedBooking(res.booking);
    setWizardStep(4);
  };

  return (
    <div className="pn-container pn-mobile-showcase">
      {/* Interactive Mobile App Device Frame */}
      <div className="pn-phone-shell" aria-label="Pet Nanny Bicol Mobile App Preview">
        <div className="pn-phone-screen">
          {/* Status Bar */}
          <div className="pn-phone-statusbar">
            <span>9:41</span>
            <span>Pet Nanny Bicol App • {city}</span>
            <span>5G 100%</span>
          </div>

          {/* Mobile App Header */}
          <div
            style={{
              background: '#ffffff',
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border-neutral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block' }}>Pet Nanny Bicol</strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-brand-ink)',
                  fontWeight: 700,
                }}
              >
                {city} • Open Everyday
              </span>
            </div>

            <div style={{ display: 'flex', gap: 4 }}>
              {(['Daet', 'Naga City'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCity(c);
                    setForm((prev) => ({ ...prev, city: c }));
                  }}
                  style={{
                    padding: '6px 10px',
                    minHeight: 34,
                    borderRadius: 999,
                    border: '1px solid var(--color-border-neutral)',
                    background: city === c ? 'var(--color-primary-soft)' : '#ffffff',
                    color: city === c ? 'var(--color-brand-ink)' : 'var(--color-muted-foreground)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Mobile Viewport */}
          <div className="pn-phone-body">
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div style={{ display: 'grid', gap: 14 }}>
                <div
                  className="pn-card"
                  style={{
                    background: 'var(--color-surface-subtle)',
                    borderColor: 'var(--color-border)',
                    padding: 18,
                  }}
                >
                  <span className="pn-badge pn-badge-warm">10% OFF FIRST BOOKING</span>
                  <h2 style={{ fontSize: '1.25rem', marginTop: 8 }}>
                    Loving in-home pet care in {city}.
                  </h2>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--color-muted-foreground)',
                      marginTop: 6,
                    }}
                  >
                    Run by Krizzia (“The Dog Whisperer”) &amp; Daet Saving Strays rescue
                    volunteers. Verified Gov’t ID, Barangay &amp; NBI clearances.
                  </p>
                  <button
                    type="button"
                    className="pn-btn pn-btn-primary"
                    style={{ width: '100%', marginTop: 14, minHeight: 48 }}
                    onClick={() => {
                      setWizardStep(1);
                      setActiveTab('book');
                    }}
                  >
                    Book Care Now
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong style={{ fontSize: '0.96rem' }}>Quick-Book Services</strong>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                    onClick={() => setActiveTab('services')}
                  >
                    See All →
                  </button>
                </div>

                {activeServices.map((svc) => (
                  <div key={svc.id} className="pn-card" style={{ padding: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <strong style={{ fontSize: '0.96rem' }}>{svc.name}</strong>
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--color-brand-ink)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {formatPhpCurrency(svc.priceAmount, svc.priceMax)}/{svc.pricingUnit}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-muted-foreground)',
                        marginTop: 4,
                      }}
                    >
                      {svc.description}
                    </p>
                    <button
                      type="button"
                      className="pn-btn pn-btn-outline pn-btn-sm"
                      style={{ width: '100%', marginTop: 10, minHeight: 44 }}
                      onClick={() => handleSelectMobileService(svc.slug)}
                    >
                      Book {svc.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: SERVICES */}
            {activeTab === 'services' && (
              <div style={{ display: 'grid', gap: 14 }}>
                <h2 style={{ fontSize: '1.15rem' }}>Services &amp; Rates</h2>
                {activeServices.map((svc) => (
                  <div key={svc.id} className="pn-card" style={{ padding: 16 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <strong>{svc.name}</strong>
                      <span style={{ fontWeight: 700, color: 'var(--color-brand-ink)' }}>
                        {formatPhpCurrency(svc.priceAmount, svc.priceMax)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--color-muted-foreground)',
                        marginBottom: 10,
                      }}
                    >
                      {svc.description}
                    </p>
                    <ul className="pn-feature-list" style={{ marginTop: 6, marginBottom: 12 }}>
                      {svc.features.map((f, idx) => (
                        <li key={idx} style={{ fontSize: '0.82rem' }}>
                          <CheckCircle2
                            size={14}
                            color="var(--color-success)"
                            style={{ flexShrink: 0, marginTop: 3 }}
                            aria-hidden="true"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="pn-btn pn-btn-primary"
                      style={{ width: '100%', minHeight: 48 }}
                      onClick={() => handleSelectMobileService(svc.slug)}
                    >
                      Select {svc.name}
                    </button>
                  </div>
                ))}

                <div className="pn-card" style={{ padding: 16 }}>
                  <strong style={{ display: 'block', marginBottom: 8 }}>
                    Add-Ons &amp; 24/7 Smart CCTV
                  </strong>
                  {state.addons.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--color-border-neutral)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <span>{a.name}</span>
                      <strong>{a.priceLabel}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PUPDATES & REVIEWS */}
            {activeTab === 'pupdates' && (
              <div style={{ display: 'grid', gap: 14 }}>
                <h2 style={{ fontSize: '1.15rem' }}>Live Pupdates Stream</h2>
                {state.pupdates.map((p) => (
                  <div key={p.id} className="pn-card" style={{ padding: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}
                    >
                      <span className="pn-badge pn-badge-warm">{p.time}</span>
                      {p.metricsBadge && (
                        <span className="pn-badge pn-badge-blue">{p.metricsBadge}</span>
                      )}
                    </div>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{p.title}</strong>
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--color-muted-foreground)',
                        marginTop: 4,
                      }}
                    >
                      {p.message}
                    </p>
                  </div>
                ))}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <strong style={{ fontSize: '0.96rem' }}>Reviews</strong>
                  <button
                    type="button"
                    className="pn-btn pn-btn-outline pn-btn-sm"
                    onClick={() =>
                      setReviewVoice(reviewVoice === 'human' ? 'pet' : 'human')
                    }
                  >
                    <Star size={14} aria-hidden="true" />
                    {reviewVoice === 'human' ? 'See Pet Says' : 'See Furparent Says'}
                  </button>
                </div>

                {state.reviews
                  .filter((r) => r.isApproved)
                  .map((rv) => (
                    <div key={rv.id} className="pn-card" style={{ padding: 14 }}>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>
                        “{reviewVoice === 'human' ? rv.title : rv.petTranslationTitle}”
                      </strong>
                      <p
                        style={{
                          fontSize: '0.83rem',
                          color: 'var(--color-muted-foreground)',
                          margin: '6px 0',
                        }}
                      >
                        “{reviewVoice === 'human' ? rv.reviewText : rv.petTranslationText}”
                      </p>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                        — {reviewVoice === 'human' ? rv.authorName : rv.petTranslationAuthor}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB 4: THUMB-FRIENDLY 3-STEP BOOKING WIZARD */}
            {activeTab === 'book' && (
              <div style={{ display: 'grid', gap: 14 }}>
                {wizardStep === 1 && (
                  <div className="pn-card" style={{ padding: 16 }}>
                    <span className="pn-badge pn-badge-warm">
                      Step 1 of 3: Service &amp; Schedule
                    </span>
                    <div className="pn-field" style={{ marginTop: 12 }}>
                      <label htmlFor="m-service" className="pn-label">
                        Choose Care Service
                      </label>
                      <select
                        id="m-service"
                        className="pn-select"
                        value={form.serviceSlug}
                        onChange={(e) =>
                          setForm({ ...form, serviceSlug: e.target.value })
                        }
                      >
                        {activeServices.map((s) => (
                          <option key={s.slug} value={s.slug}>
                            {s.name} ({formatPhpCurrency(s.priceAmount, s.priceMax)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pn-field" style={{ marginTop: 12 }}>
                      <label htmlFor="m-date" className="pn-label">
                        Preferred Date
                      </label>
                      <input
                        id="m-date"
                        type="date"
                        className="pn-input"
                        value={form.preferredDate}
                        onChange={(e) =>
                          setForm({ ...form, preferredDate: e.target.value })
                        }
                      />
                    </div>

                    <div className="pn-field" style={{ marginTop: 12 }}>
                      <label htmlFor="m-time" className="pn-label">
                        Time Slot
                      </label>
                      <select
                        id="m-time"
                        className="pn-select"
                        value={form.preferredTime}
                        onChange={(e) =>
                          setForm({ ...form, preferredTime: e.target.value })
                        }
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        padding: 12,
                        borderRadius: 8,
                        background: 'var(--color-muted)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        Estimated Total (10% First-Booking Off)
                      </span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-brand-ink)' }}>
                        {quote.formattedFinal}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="pn-btn pn-btn-primary"
                      style={{ width: '100%', marginTop: 14, minHeight: 48 }}
                      onClick={() => setWizardStep(2)}
                    >
                      Continue to Pet Details
                    </button>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="pn-card" style={{ padding: 16 }}>
                    <span className="pn-badge pn-badge-warm">
                      Step 2 of 3: Furparent &amp; Pet
                    </span>

                    <div className="pn-field" style={{ marginTop: 12 }}>
                      <label htmlFor="m-name" className="pn-label">
                        Your Name
                      </label>
                      <input
                        id="m-name"
                        className="pn-input"
                        placeholder="Juan dela Cruz"
                        value={form.customerName}
                        onChange={(e) =>
                          setForm({ ...form, customerName: e.target.value })
                        }
                      />
                    </div>

                    <div className="pn-field" style={{ marginTop: 10 }}>
                      <label htmlFor="m-phone" className="pn-label">
                        PH Mobile
                      </label>
                      <input
                        id="m-phone"
                        type="tel"
                        inputMode="tel"
                        className="pn-input"
                        placeholder="0956 902 5256"
                        value={form.customerPhone}
                        onChange={(e) =>
                          setForm({ ...form, customerPhone: e.target.value })
                        }
                      />
                    </div>

                    <div className="pn-field" style={{ marginTop: 10 }}>
                      <label htmlFor="m-email" className="pn-label">
                        Email for OTP
                      </label>
                      <input
                        id="m-email"
                        type="email"
                        className="pn-input"
                        placeholder="furparent@example.com"
                        value={form.customerEmail}
                        onChange={(e) =>
                          setForm({ ...form, customerEmail: e.target.value })
                        }
                      />
                    </div>

                    <div className="pn-field" style={{ marginTop: 10 }}>
                      <label htmlFor="m-pet" className="pn-label">
                        Pet Name
                      </label>
                      <input
                        id="m-pet"
                        className="pn-input"
                        placeholder="Buster"
                        value={form.petName}
                        onChange={(e) => setForm({ ...form, petName: e.target.value })}
                      />
                    </div>

                    <div className="pn-field" style={{ marginTop: 10 }}>
                      <label htmlFor="m-pettype" className="pn-label">
                        Pet Type
                      </label>
                      <select
                        id="m-pettype"
                        className="pn-select"
                        value={form.petType}
                        onChange={(e) => setForm({ ...form, petType: e.target.value })}
                      >
                        {PET_TYPES.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {wizardError && (
                      <p className="pn-error-text" style={{ marginTop: 10 }}>
                        {wizardError}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button
                        type="button"
                        className="pn-btn pn-btn-outline"
                        onClick={() => setWizardStep(1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="pn-btn pn-btn-primary"
                        style={{ flex: 1, minHeight: 48 }}
                        onClick={handleSendMobileOtp}
                      >
                        Send 6-Digit OTP
                      </button>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && challenge && (
                  <div className="pn-card" style={{ padding: 16 }}>
                    <span className="pn-badge pn-badge-blue">Step 3 of 3: Verify Code</span>
                    <p style={{ fontSize: '0.84rem', marginTop: 10 }}>
                      Code sent to <strong>{challenge.destination}</strong>. Sandbox code:{' '}
                      <strong>{challenge.devCode}</strong>
                    </p>
                    <button
                      type="button"
                      className="pn-btn pn-btn-outline pn-btn-sm"
                      style={{ width: '100%', marginTop: 8 }}
                      onClick={() => {
                        setOtpCode(challenge.devCode);
                        setWizardError(null);
                      }}
                    >
                      Tap to Auto-Fill Code
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="pn-input"
                      style={{
                        marginTop: 10,
                        textAlign: 'center',
                        fontSize: '1.35rem',
                        letterSpacing: '0.3em',
                        fontWeight: 700,
                      }}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    {wizardError && (
                      <p className="pn-error-text" style={{ marginTop: 8 }}>
                        {wizardError}
                      </p>
                    )}
                    <button
                      type="button"
                      className="pn-btn pn-btn-primary"
                      style={{ width: '100%', marginTop: 12, minHeight: 48 }}
                      onClick={handleVerifyMobileOtp}
                    >
                      Verify &amp; Complete Booking
                    </button>
                  </div>
                )}

                {wizardStep === 4 && confirmedBooking && (
                  <div className="pn-card" style={{ padding: 16 }}>
                    <span className="pn-badge pn-badge-green">VERIFIED</span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: 8 }}>
                      Mobile Booking Confirmed!
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-muted-foreground)',
                        marginTop: 4,
                      }}
                    >
                      Reference <strong>{confirmedBooking.bookingReference}</strong> is queued for{' '}
                      {confirmedBooking.petName}.
                    </p>
                    <a
                      href={composeWhatsAppMessage(confirmedBooking).whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pn-btn pn-btn-primary"
                      style={{ width: '100%', marginTop: 12, minHeight: 48 }}
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                    <button
                      type="button"
                      className="pn-btn pn-btn-outline"
                      style={{ width: '100%', marginTop: 8 }}
                      onClick={() => {
                        setConfirmedBooking(null);
                        setWizardStep(1);
                      }}
                    >
                      New Booking
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: MOBILE OWNER CONSOLE */}
            {activeTab === 'owner' && (
              <div style={{ display: 'grid', gap: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h2 style={{ fontSize: '1.1rem' }}>Mobile Owner Console</h2>
                  <span className="pn-badge pn-badge-warm">
                    {state.bookings.length} Bookings
                  </span>
                </div>

                {state.bookings.map((bk) => (
                  <div key={bk.id} className="pn-card" style={{ padding: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <strong>
                        {bk.bookingReference} • {bk.petName}
                      </strong>
                      <span className="pn-badge pn-badge-blue">
                        {bk.status.toUpperCase()}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.83rem',
                        color: 'var(--color-muted-foreground)',
                        marginTop: 4,
                      }}
                    >
                      {bk.customerName} ({bk.city}) • {bk.serviceName} •{' '}
                      {formatPhpCurrency(bk.quotedPrice)}
                    </p>
                    {bk.status === 'new' && (
                      <button
                        type="button"
                        className="pn-btn pn-btn-primary pn-btn-sm"
                        style={{ width: '100%', marginTop: 10, minHeight: 44 }}
                        onClick={() => store.updateBookingStatus(bk.id, 'confirmed')}
                      >
                        Tap to Confirm Appointment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5-Tab Bottom Navigation Bar (48dp touch targets) */}
          <nav className="pn-phone-tabbar" aria-label="Mobile App Bottom Navigation">
            <button
              type="button"
              data-testid="mobile-tab-home"
              className={`pn-phone-tab ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={18} aria-hidden="true" />
              <span>Home</span>
            </button>
            <button
              type="button"
              data-testid="mobile-tab-services"
              className={`pn-phone-tab ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <Tag size={18} aria-hidden="true" />
              <span>Services</span>
            </button>
            <button
              type="button"
              data-testid="mobile-tab-pupdates"
              className={`pn-phone-tab ${activeTab === 'pupdates' ? 'active' : ''}`}
              onClick={() => setActiveTab('pupdates')}
            >
              <Camera size={18} aria-hidden="true" />
              <span>Pupdates</span>
            </button>
            <button
              type="button"
              data-testid="mobile-tab-book"
              className={`pn-phone-tab ${activeTab === 'book' ? 'active' : ''}`}
              onClick={() => setActiveTab('book')}
            >
              <CalendarPlus size={18} aria-hidden="true" />
              <span>Book</span>
            </button>
            <button
              type="button"
              data-testid="mobile-tab-owner"
              className={`pn-phone-tab ${activeTab === 'owner' ? 'active' : ''}`}
              onClick={() => setActiveTab('owner')}
            >
              <ShieldCheck size={18} aria-hidden="true" />
              <span>Owner</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Standalone Android / iOS Store Package Documentation & Build Guide */}
      <div style={{ display: 'grid', gap: 20 }}>
        <div className="pn-card">
          <span className="pn-eyebrow">
            <Smartphone size={14} aria-hidden="true" />
            Android &amp; iOS Store App Package
          </span>
          <h1 style={{ fontSize: '1.75rem', marginTop: 10 }}>
            Designed specifically for thumb-friendly mobile use.
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-muted-foreground)',
              marginTop: 8,
            }}
          >
            Unlike a desktop webpage squished onto a small screen, the Pet Nanny Bicol mobile
            app uses a persistent 5-tab bottom navigation bar (`48dp` touch targets), a
            3-step booking wizard that eliminates vertical form scrolling, and an embedded
            Mobile Owner Console so you can confirm appointments from anywhere.
          </p>
        </div>

        <div className="pn-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Terminal size={18} color="var(--color-accent)" aria-hidden="true" />
            <h2 style={{ fontSize: '1.15rem' }}>
              Standalone React Native (Expo) Project in <code>/mobile</code>
            </h2>
          </div>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-muted-foreground)',
              marginBottom: 14,
            }}
          >
            The dedicated Android &amp; iOS codebase lives in the <code>mobile/</code> directory
            with <code>app.json</code> (Bundle ID <code>com.petnannybicol.app</code>) and{' '}
            <code>eas.json</code> pre-configured for both downloadable Android APK files and
            Google Play / Apple App Store bundles:
          </p>
          <pre
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              padding: 16,
              borderRadius: 10,
              fontSize: '0.84rem',
              overflowX: 'auto',
            }}
          >
{`cd mobile
npm install

# 1. Generate a direct downloadable Android .apk file:
npm run build:android:apk

# 2. Build production Google Play (.aab) & Apple App Store (.ipa):
npm run build:android:store
npm run build:ios:store`}
          </pre>
        </div>
      </div>
    </div>
  );
};
