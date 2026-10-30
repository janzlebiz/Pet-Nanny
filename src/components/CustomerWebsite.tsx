import React, { useEffect, useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Camera,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Heart,
  Star,
  Video,
  Utensils,
  Sparkles,
  Copy,
  MessageCircle,
  Smartphone,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import {
  calculateBookingQuote,
  composeWhatsAppMessage,
  formatPhpCurrency,
  validateBookingInput,
} from '../core/bookingLogic';
import {
  FACEBOOK_PAGE_URL,
  HOW_IT_WORKS_STEPS,
  PET_TYPES,
  TIME_SLOTS,
  WHATSAPP_DISPLAY,
} from '../core/catalog';
import { OtpChallenge, PetNannyStore } from '../core/store';
import { BicolCity, BookingFormInput, VerifiedBooking } from '../core/types';
import { BookingModalOtp } from './BookingModalOtp';

interface CustomerWebsiteProps {
  store: PetNannyStore;
  onNavigateMode: (mode: 'website' | 'mobile' | 'dashboard') => void;
}

export const CustomerWebsite: React.FC<CustomerWebsiteProps> = ({ store, onNavigateMode }) => {
  const [state, setState] = useState(() => store.getState());
  const [reviewVoice, setReviewVoice] = useState<'human' | 'pet'>('human');
  const [feedFilter, setFeedFilter] = useState<'all' | 'walk' | 'meal' | 'cctv' | 'cuddle'>('all');

  const [form, setForm] = useState<BookingFormInput>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    petName: '',
    petType: 'Dog',
    serviceSlug: 'dog-walking',
    city: 'Daet',
    preferredDate: '2026-11-10',
    preferredTime: '08:00',
    notes: '',
    isFirstBooking: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormInput, string>>>({});
  const [activeChallenge, setActiveChallenge] = useState<OtpChallenge | null>(null);
  const [verifiedBooking, setVerifiedBooking] = useState<VerifiedBooking | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()));
  }, [store]);

  const activeServices = state.services.filter((s) => s.isActive);
  const approvedReviews = state.reviews.filter((r) => r.isApproved);
  const filteredPupdates =
    feedFilter === 'all'
      ? state.pupdates
      : state.pupdates.filter((p) => p.category === feedFilter);

  const liveQuote = calculateBookingQuote(form.serviceSlug, form.isFirstBooking, activeServices);

  const handleSelectService = (slug: string) => {
    setForm((prev) => ({ ...prev, serviceSlug: slug }));
    setErrors((prev) => ({ ...prev, serviceSlug: undefined }));
    const bookEl = document.getElementById('book');
    if (bookEl && typeof bookEl.scrollIntoView === 'function') {
      bookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingInput(form, state.closedDates, '2026-10-31');
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const challenge = store.requestOtp(form);
    setActiveChallenge(challenge);
  };

  const handleVerifyOtp = (code: string) => {
    if (!activeChallenge) return { success: false, error: 'No active challenge' };
    const result = store.verifyOtp(activeChallenge.challengeId, code);
    if (result.success && result.booking) {
      setActiveChallenge(null);
      setVerifiedBooking(result.booking);
    }
    return result;
  };

  const whatsappSummary = verifiedBooking ? composeWhatsAppMessage(verifiedBooking) : null;

  return (
    <div>
      {/* Minimalist Top Header */}
      <header className="pn-header">
        <div className="pn-container pn-header-inner">
          <a href="#top" className="pn-brand">
            <span className="pn-brand-mark" aria-hidden="true">
              <Heart size={20} />
            </span>
            <span>
              <span className="pn-brand-title">Pet Nanny Bicol</span>
              <span className="pn-brand-sub">Daet &amp; Naga City</span>
            </span>
          </a>

          <nav aria-label="Primary Navigation">
            <ul className="pn-nav-links">
              <li>
                <a href="#services">Services &amp; Rates</a>
              </li>
              <li>
                <a href="#how">How It Works</a>
              </li>
              <li>
                <a href="#feed">Live Pupdates</a>
              </li>
              <li>
                <a href="#about">Meet Krizzia</a>
              </li>
              <li>
                <a href="#reviews">Reviews</a>
              </li>
            </ul>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="pn-btn pn-btn-outline pn-btn-sm"
              onClick={() => onNavigateMode('mobile')}
            >
              <Smartphone size={16} aria-hidden="true" />
              Mobile App
            </button>
            <a href="#book" className="pn-btn pn-btn-primary pn-btn-sm">
              Book Care
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pn-hero" id="top">
        <div className="pn-container pn-hero-grid">
          <div>
            <span className="pn-eyebrow">
              <MapPin size={14} aria-hidden="true" />
              Daet, Camarines Norte &amp; Naga City • Open Everyday
            </span>
            <h1 className="pn-hero-title">
              Calm, attentive in-home care because they’re{' '}
              <span className="pn-hero-highlight">family</span>.
            </h1>
            <p className="pn-section-subtitle">
              Pet Nanny Bicol is a trusted team of pet parents and rescue volunteers led by
              Krizzia. We care for your dogs and cats inside the comfort of your own home—with
              real-time photo &amp; video pupdates, smart scheduled feeding, and optional 24/7
              Wi-Fi CCTV access.
            </p>

            <div className="pn-hero-actions">
              <a href="#book" className="pn-btn pn-btn-primary">
                Claim 10% Off First Booking
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="#services" className="pn-btn pn-btn-outline">
                View Transparent Rates
              </a>
            </div>

            <div className="pn-trust-strip">
              <div className="pn-trust-item">
                <ShieldCheck size={18} color="var(--color-primary)" aria-hidden="true" />
                <span>Gov’t ID, Barangay &amp; NBI Verified</span>
              </div>
              <div className="pn-trust-item">
                <Camera size={18} color="var(--color-accent)" aria-hidden="true" />
                <span>Daily Photo &amp; Video Pupdates</span>
              </div>
              <div className="pn-trust-item">
                <Video size={18} color="var(--color-success)" aria-hidden="true" />
                <span>24/7 Wi-Fi CCTV &amp; Smart Feeder</span>
              </div>
            </div>
          </div>

          {/* Minimalist Live Care Status Card */}
          <div className="pn-card" style={{ padding: 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: '1px solid var(--color-border-neutral)',
              }}
            >
              <div>
                <span className="pn-badge pn-badge-green">LIVE PUPDATE STREAM</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 6 }}>Buster’s Morning Care Log</h2>
              </div>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-muted-foreground)' }}>
                Daet, CamNorte
              </span>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {state.pupdates.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-ink)',
                      marginBottom: 4,
                    }}
                  >
                    <span>{item.title}</span>
                    <span>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-foreground)' }}>
                    {item.message}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: '1px solid var(--color-border-neutral)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ color: 'var(--color-muted-foreground)' }}>
                First-time furparents save 10% automatically
              </span>
              <a
                href="#book"
                style={{
                  color: 'var(--color-accent)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Book Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Transparent Rates */}
      <section className="pn-section" id="services">
        <div className="pn-container">
          <div className="pn-section-header">
            <span className="pn-eyebrow">Transparent Rates • No Surprise Fees</span>
            <h2 className="pn-section-title">
              Tailored pet care across Daet &amp; Naga City.
            </h2>
            <p className="pn-section-subtitle">
              Select any service below to pre-fill your booking request and preview your 10%
              first-booking discount.
            </p>
          </div>

          <div className="pn-services-grid">
            {activeServices.map((service) => (
              <article key={service.id} className="pn-card pn-service-card">
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem' }}>{service.name}</h3>
                    {service.badge && (
                      <span className="pn-badge pn-badge-warm">{service.badge}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-foreground)' }}>
                    {service.description}
                  </p>
                  <ul className="pn-feature-list">
                    {service.features.map((feat, idx) => (
                      <li key={idx}>
                        <CheckCircle2
                          size={16}
                          color="var(--color-success)"
                          style={{ flexShrink: 0, marginTop: 3 }}
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    paddingTop: 16,
                    borderTop: '1px solid var(--color-border-neutral)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <span className="pn-price-display">
                      {formatPhpCurrency(service.priceAmount, service.priceMax)}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      per {service.pricingUnit}
                    </span>
                  </div>

                  <button
                    type="button"
                    data-testid={`select-service-${service.slug}`}
                    className="pn-btn pn-btn-outline pn-btn-sm"
                    onClick={() => handleSelectService(service.slug)}
                  >
                    Select Service
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Minimalist Add-ons Strip */}
          <div className="pn-card" style={{ marginTop: 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Optional Add-Ons &amp; Smart Monitoring</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-foreground)' }}>
                  Ask us about installing a Wi-Fi CCTV camera and automatic feeder in your home
                  for 24/7 remote access.
                </p>
              </div>
              <span className="pn-badge pn-badge-blue">Available in Daet &amp; Naga</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {state.addons.map((addon) => (
                <div
                  key={addon.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: 'var(--color-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>
                      {addon.name}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                      {addon.note}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-brand-ink)' }}>
                    {addon.priceLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pn-section pn-section-alt" id="how">
        <div className="pn-container">
          <div className="pn-section-header">
            <span className="pn-eyebrow">Simple 4-Step Process</span>
            <h2 className="pn-section-title">
              Verified, transparent care from day one.
            </h2>
            <p className="pn-section-subtitle">
              Every pet nanny can present a valid Government ID, Barangay Clearance, or NBI
              Clearance during your free introductory Meet &amp; Greet.
            </p>
          </div>

          <div className="pn-steps-grid">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div key={s.step} className="pn-card">
                <div className="pn-step-number">{s.step}</div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-foreground)' }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Watch the Wag Live — Pupdate Feed */}
      <section className="pn-section" id="feed">
        <div className="pn-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div>
              <span className="pn-eyebrow">Pupdates &amp; Peace of Mind</span>
              <h2 className="pn-section-title">Away from home? Watch the wag live.</h2>
              <p className="pn-section-subtitle">
                Every walk, meal, medication check, and Wi-Fi CCTV auto-feeder event is logged
                for you.
              </p>
            </div>

            <div className="pn-segmented" role="group" aria-label="Filter pupdates">
              {(['all', 'walk', 'meal', 'cctv', 'cuddle'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pn-segmented-btn ${feedFilter === cat ? 'active' : ''}`}
                  onClick={() => setFeedFilter(cat)}
                >
                  {cat === 'all' ? 'All Logs' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))',
              gap: 20,
            }}
          >
            {filteredPupdates.map((pup) => (
              <div key={pup.id} className="pn-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span className="pn-badge pn-badge-warm">{pup.time}</span>
                  {pup.metricsBadge && (
                    <span className="pn-badge pn-badge-blue">{pup.metricsBadge}</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.08rem', marginBottom: 6 }}>{pup.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-muted-foreground)' }}>
                  {pup.message}
                </p>
                {pup.ownerReply && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'var(--color-muted)',
                      fontSize: '0.82rem',
                      fontStyle: 'italic',
                    }}
                  >
                    Furparent reply: “{pup.ownerReply}”
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Krizzia — The Dog Whisperer */}
      <section className="pn-section pn-section-alt" id="about">
        <div className="pn-container pn-two-col">
          <div className="pn-card">
            <span className="pn-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Founder &amp; Rescue Advocate
            </span>
            <h2 className="pn-section-title" style={{ marginTop: 12 }}>
              {state.profile.title}
            </h2>
            <p style={{ marginBottom: 14, color: 'var(--color-muted-foreground)' }}>
              {state.profile.bioParagraph1}
            </p>
            <p style={{ marginBottom: 18, color: 'var(--color-muted-foreground)' }}>
              {state.profile.bioParagraph2}
            </p>
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: 'var(--color-primary-soft)',
                color: 'var(--color-brand-ink)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {state.profile.handNote}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="pn-card">
              <span className="pn-price-display">2 Cities</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                Serving Daet (Camarines Norte) &amp; Naga City (Camarines Sur)
              </p>
            </div>
            <div className="pn-card">
              <span className="pn-price-display">7 Days</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                Open everyday including weekends &amp; out-of-town trips
              </p>
            </div>
            <div className="pn-card">
              <span className="pn-price-display">24/7 CCTV</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                Optional home Wi-Fi camera &amp; smart auto-feeder monitoring
              </p>
            </div>
            <div className="pn-card">
              <span className="pn-price-display">10% Off</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                Welcome discount on every furparent’s first booking
              </p>
            </div>
            <div className="pn-card" style={{ gridColumn: '1 / -1' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <strong style={{ display: 'block' }}>{state.profile.ngoName}</strong>
                  <span style={{ fontSize: '0.86rem', color: 'var(--color-muted-foreground)' }}>
                    Active rescue volunteer community in Bicol
                  </span>
                </div>
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pn-btn pn-btn-outline pn-btn-sm"
                >
                  Visit Facebook Page
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews: Human Perspective vs Pet Perspective */}
      <section className="pn-section" id="reviews">
        <div className="pn-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div>
              <span className="pn-eyebrow">Verified Bicol Reviews</span>
              <h2 className="pn-section-title">Real furparents. Real tails.</h2>
              <p className="pn-section-subtitle">
                Switch between what furparents wrote and what their pets reported back.
              </p>
            </div>

            <div className="pn-segmented" role="group" aria-label="Review perspective">
              <button
                type="button"
                className={`pn-segmented-btn ${reviewVoice === 'human' ? 'active' : ''}`}
                onClick={() => setReviewVoice('human')}
              >
                Furparent Says
              </button>
              <button
                type="button"
                className={`pn-segmented-btn ${reviewVoice === 'pet' ? 'active' : ''}`}
                onClick={() => setReviewVoice('pet')}
              >
                Pet Perspective
              </button>
            </div>
          </div>

          <div className="pn-services-grid">
            {approvedReviews.map((rv) => (
              <article key={rv.id} className="pn-card">
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }} aria-label="5 out of 5 stars">
                  {Array.from({ length: rv.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="var(--color-primary)"
                      color="var(--color-primary)"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>
                  “{reviewVoice === 'human' ? rv.title : rv.petTranslationTitle}”
                </h3>
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--color-muted-foreground)',
                    marginBottom: 18,
                  }}
                >
                  “{reviewVoice === 'human' ? rv.reviewText : rv.petTranslationText}”
                </p>
                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--color-border-neutral)',
                    fontSize: '0.86rem',
                  }}
                >
                  <strong style={{ display: 'block' }}>
                    {reviewVoice === 'human' ? rv.authorName : rv.petTranslationAuthor}
                  </strong>
                  <span style={{ color: 'var(--color-muted-foreground)' }}>
                    {reviewVoice === 'human' ? rv.authorLocation : rv.petTranslationRole}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Booking Section */}
      <section className="pn-section pn-section-alt" id="book">
        <div className="pn-container pn-two-col">
          <div>
            <span className="pn-eyebrow">Book a Session</span>
            <h2 className="pn-section-title">Reserve trusted care in under a minute.</h2>
            <p className="pn-section-subtitle" style={{ marginBottom: 24 }}>
              Verify your request with a 6-digit security code, get an instant booking
              reference, and connect directly with our WhatsApp desk ({WHATSAPP_DISPLAY}).
            </p>

            {/* Live Quote Card */}
            <div className="pn-card" style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                Estimated Care Quote
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <strong style={{ fontSize: '1.15rem' }}>{liveQuote.serviceName}</strong>
                <span className="pn-price-display">{liveQuote.formattedFinal}</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: '0.85rem',
                  color: 'var(--color-muted-foreground)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Standard Rate: {liveQuote.formattedBase}</span>
                {form.isFirstBooking && (
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                    {liveQuote.formattedDiscount}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10, fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Phone size={17} color="var(--color-primary)" aria-hidden="true" />
                <span>{WHATSAPP_DISPLAY} (WhatsApp • SMS • iMessage)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={17} color="var(--color-primary)" aria-hidden="true" />
                <span>Daet, Camarines Norte &amp; Naga City, Camarines Sur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={17} color="var(--color-primary)" aria-hidden="true" />
                <span>Open Everyday • Morning, Day &amp; Overnight Slots</span>
              </div>
            </div>
          </div>

          <div className="pn-card">
            {verifiedBooking && whatsappSummary ? (
              <div>
                <span className="pn-badge pn-badge-green">Status: Pending Confirmation</span>
                <h3 style={{ fontSize: '1.45rem', marginTop: 10 }}>Booking Request Verified!</h3>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--color-muted-foreground)',
                    marginTop: 6,
                  }}
                >
                  Thank you, <strong>{verifiedBooking.customerName}</strong>! Reference{' '}
                  <strong>{verifiedBooking.bookingReference}</strong> is now in the Owner
                  Dashboard queue.
                </p>

                <pre
                  style={{
                    background: 'var(--color-muted)',
                    border: '1px solid var(--color-border-neutral)',
                    borderRadius: 8,
                    padding: 14,
                    marginTop: 16,
                    fontSize: '0.84rem',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {whatsappSummary.message}
                </pre>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                  <a
                    href={whatsappSummary.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pn-btn pn-btn-primary"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Send to WhatsApp
                  </a>
                  <button
                    type="button"
                    className="pn-btn pn-btn-outline"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(whatsappSummary.message);
                      }
                      setCopiedToast(true);
                      setTimeout(() => setCopiedToast(false), 2500);
                    }}
                  >
                    <Copy size={16} aria-hidden="true" />
                    {copiedToast ? 'Copied!' : 'Copy Summary'}
                  </button>
                  <button
                    type="button"
                    className="pn-btn pn-btn-outline"
                    onClick={() => setVerifiedBooking(null)}
                  >
                    Book Another Session
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} noValidate>
                <div className="pn-form-grid">
                  <div className="pn-field">
                    <label htmlFor="f-name" className="pn-label">
                      Furparent Name
                    </label>
                    <input
                      id="f-name"
                      className="pn-input"
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                    />
                    {errors.customerName && (
                      <span className="pn-error-text">{errors.customerName}</span>
                    )}
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-phone" className="pn-label">
                      Mobile Number
                    </label>
                    <input
                      id="f-phone"
                      className="pn-input"
                      type="tel"
                      inputMode="tel"
                      placeholder="0956 902 5256"
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                    />
                    {errors.customerPhone && (
                      <span className="pn-error-text">{errors.customerPhone}</span>
                    )}
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-email" className="pn-label">
                      Email Address
                    </label>
                    <input
                      id="f-email"
                      className="pn-input"
                      type="email"
                      placeholder="furparent@example.com"
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                    />
                    {errors.customerEmail && (
                      <span className="pn-error-text">{errors.customerEmail}</span>
                    )}
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-city" className="pn-label">
                      Bicol Location
                    </label>
                    <select
                      id="f-city"
                      className="pn-select"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value as BicolCity })
                      }
                    >
                      <option value="Daet">Daet, Camarines Norte</option>
                      <option value="Naga City">Naga City, Camarines Sur</option>
                    </select>
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-pet" className="pn-label">
                      Pet's Name
                    </label>
                    <input
                      id="f-pet"
                      className="pn-input"
                      type="text"
                      placeholder="Buster"
                      value={form.petName}
                      onChange={(e) => setForm({ ...form, petName: e.target.value })}
                    />
                    {errors.petName && (
                      <span className="pn-error-text">{errors.petName}</span>
                    )}
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-pet-type" className="pn-label">
                      Pet Type
                    </label>
                    <select
                      id="f-pet-type"
                      className="pn-select"
                      value={form.petType}
                      onChange={(e) => setForm({ ...form, petType: e.target.value })}
                    >
                      {PET_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pn-field pn-field-full">
                    <label htmlFor="f-service" className="pn-label">
                      Selected Service
                    </label>
                    <select
                      id="f-service"
                      className="pn-select"
                      value={form.serviceSlug}
                      onChange={(e) =>
                        setForm({ ...form, serviceSlug: e.target.value })
                      }
                    >
                      {activeServices.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name} — {formatPhpCurrency(s.priceAmount, s.priceMax)}/
                          {s.pricingUnit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-date" className="pn-label">
                      Preferred Date
                    </label>
                    <input
                      id="f-date"
                      className="pn-input"
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) =>
                        setForm({ ...form, preferredDate: e.target.value })
                      }
                    />
                    {errors.preferredDate && (
                      <span className="pn-error-text">{errors.preferredDate}</span>
                    )}
                  </div>

                  <div className="pn-field">
                    <label htmlFor="f-time" className="pn-label">
                      Preferred Time
                    </label>
                    <select
                      id="f-time"
                      className="pn-select"
                      value={form.preferredTime}
                      onChange={(e) =>
                        setForm({ ...form, preferredTime: e.target.value })
                      }
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {errors.preferredTime && (
                      <span className="pn-error-text">{errors.preferredTime}</span>
                    )}
                  </div>

                  <div className="pn-field pn-field-full">
                    <label htmlFor="f-notes" className="pn-label">
                      Care Notes &amp; Instructions (Optional)
                    </label>
                    <textarea
                      id="f-notes"
                      className="pn-textarea"
                      rows={3}
                      placeholder="Feeding schedule, medications, shy temperament, or CCTV/auto-feeder request..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>

                  <div className="pn-field pn-field-full">
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.92rem',
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.isFirstBooking}
                        onChange={(e) =>
                          setForm({ ...form, isFirstBooking: e.target.checked })
                        }
                        style={{ width: 18, height: 18 }}
                      />
                      <span>
                        This is my first booking — apply my <strong>10% discount</strong>
                      </span>
                    </label>
                  </div>

                  <div className="pn-field pn-field-full" style={{ marginTop: 6 }}>
                    <button type="submit" className="pn-btn pn-btn-primary" style={{ width: '100%' }}>
                      <ShieldCheck size={18} aria-hidden="true" />
                      Verify &amp; Request Booking
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer
        style={{
          background: '#0f172a',
          color: '#cbd5e1',
          padding: '48px 0',
          fontSize: '0.9rem',
        }}
      >
        <div
          className="pn-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>
              Pet Nanny Bicol — Daet &amp; Naga City
            </strong>
            <p style={{ marginTop: 4, color: '#94a3b8' }}>
              Dog walking, day visits, in-home sitting &amp; overnight care by rescue volunteers.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="pn-btn pn-btn-outline pn-btn-sm"
              onClick={() => onNavigateMode('mobile')}
            >
              <Smartphone size={15} aria-hidden="true" />
              Open Mobile App View
            </button>
            <button
              type="button"
              className="pn-btn pn-btn-outline pn-btn-sm"
              onClick={() => onNavigateMode('dashboard')}
            >
              <LayoutDashboard size={15} aria-hidden="true" />
              Owner Dashboard
            </button>
          </div>
        </div>
      </footer>

      <BookingModalOtp
        challenge={activeChallenge}
        onClose={() => setActiveChallenge(null)}
        onVerify={handleVerifyOtp}
      />
    </div>
  );
};
