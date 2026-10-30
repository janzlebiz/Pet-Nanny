import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CalendarDays,
  BarChart3,
  Tag,
  Star,
  Download,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Search,
  Plus,
  Globe,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import {
  composeWhatsAppMessage,
  computeDashboardMetrics,
  formatPhpCurrency,
} from '../core/bookingLogic';
import { PetNannyStore } from '../core/store';
import { BookingStatus } from '../core/types';

interface OwnerDashboardProps {
  store: PetNannyStore;
  onNavigateMode: (mode: 'website' | 'mobile' | 'dashboard') => void;
}

type DashboardTab = 'bookings' | 'calendar' | 'analytics' | 'services' | 'reviews';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ store, onNavigateMode }) => {
  const [state, setState] = useState(() => store.getState());
  const [activeTab, setActiveTab] = useState<DashboardTab>('bookings');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Closure form
  const [closureDate, setClosureDate] = useState('2026-11-30');
  const [closureReason, setClosureReason] = useState('Bonifacio Day Team Rest');

  // Pupdate quick-post form
  const [pupdatePet, setPupdatePet] = useState('Buster');
  const [pupdateTitle, setPupdateTitle] = useState('Afternoon Play Session');
  const [pupdateMsg, setPupdateMsg] = useState(
    'Fetch session in the backyard completed, water bowl refreshed!'
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()));
  }, [store]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const metrics = computeDashboardMetrics(state.bookings, state.services);

  const filteredBookings = state.bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.petName.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q)
    );
  });

  const handleDownloadCsv = (filename: string, csvContent: string) => {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignored in test environment
    }
    showToast(`Exported ${filename}`);
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'new':
      case 'contacted':
        return 'pn-badge pn-badge-warm';
      case 'confirmed':
      case 'in_progress':
        return 'pn-badge pn-badge-blue';
      case 'completed':
        return 'pn-badge pn-badge-green';
      case 'cancelled':
        return 'pn-badge pn-badge-red';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-muted)' }}>
      {/* Owner Portal Header */}
      <header className="pn-header" style={{ background: '#ffffff' }}>
        <div className="pn-dashboard-container pn-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="pn-brand-mark" aria-hidden="true">
              <ShieldCheck size={20} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="pn-brand-title">Pet Nanny Bicol</span>
                <span className="pn-badge pn-badge-warm">Owner Console</span>
              </div>
              <span className="pn-brand-sub">Daet &amp; Naga City Operations</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="pn-btn pn-btn-outline pn-btn-sm"
              onClick={() => onNavigateMode('website')}
            >
              <Globe size={15} aria-hidden="true" />
              Public Website
            </button>
            <button
              type="button"
              className="pn-btn pn-btn-outline pn-btn-sm"
              onClick={() => onNavigateMode('mobile')}
            >
              <Smartphone size={15} aria-hidden="true" />
              Mobile App
            </button>
          </div>
        </div>
      </header>

      <div className="pn-dashboard-container pn-dash-layout">
        {/* Sidebar Navigation */}
        <aside className="pn-dash-nav" aria-label="Owner Dashboard Navigation">
          <button
            type="button"
            className={`pn-dash-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={17} aria-hidden="true" />
              Bookings Queue
            </span>
            <span className="pn-badge pn-badge-warm">{metrics.newCount}</span>
          </button>

          <button
            type="button"
            className={`pn-dash-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <CalendarDays size={17} aria-hidden="true" />
              Calendar &amp; Closures
            </span>
          </button>

          <button
            type="button"
            className={`pn-dash-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <BarChart3 size={17} aria-hidden="true" />
              Financials &amp; Analytics
            </span>
          </button>

          <button
            type="button"
            className={`pn-dash-nav-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Tag size={17} aria-hidden="true" />
              Services Catalog
            </span>
          </button>

          <button
            type="button"
            className={`pn-dash-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Star size={17} aria-hidden="true" />
              Reviews &amp; Profile
            </span>
          </button>
        </aside>

        {/* Main Workspace */}
        <main>
          {toastMsg && (
            <div
              style={{
                marginBottom: 16,
                padding: '10px 16px',
                borderRadius: 8,
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              {toastMsg}
            </div>
          )}

          {/* TAB 1: BOOKINGS QUEUE */}
          {activeTab === 'bookings' && (
            <section>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: '1.6rem' }}>Booking Requests Queue</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                    Review OTP-verified requests, confirm schedules, or message furparents on
                    WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  className="pn-btn pn-btn-outline pn-btn-sm"
                  onClick={() =>
                    handleDownloadCsv('pet-nanny-bookings.csv', store.exportBookingsCsv())
                  }
                >
                  <Download size={15} aria-hidden="true" />
                  Export CSV
                </button>
              </div>

              {/* KPI Strip */}
              <div className="pn-kpi-grid">
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Pending Review
                  </span>
                  <div className="pn-price-display" style={{ marginTop: 4 }}>
                    {metrics.newCount}
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Confirmed / Active
                  </span>
                  <div className="pn-price-display" style={{ marginTop: 4 }}>
                    {metrics.confirmedCount}
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Completed Sessions
                  </span>
                  <div className="pn-price-display" style={{ marginTop: 4 }}>
                    {metrics.completedCount}
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Completed Revenue
                  </span>
                  <div
                    className="pn-price-display"
                    style={{ marginTop: 4, color: 'var(--color-success)' }}
                  >
                    {formatPhpCurrency(metrics.completedRevenue)}
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div
                className="pn-card"
                style={{
                  marginBottom: 18,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(
                    ['all', 'new', 'confirmed', 'completed', 'cancelled'] as const
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`pn-btn pn-btn-sm ${
                        statusFilter === st ? 'pn-btn-primary' : 'pn-btn-outline'
                      }`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', minWidth: 260 }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-muted-foreground)',
                    }}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    className="pn-input"
                    style={{ paddingLeft: 36, minHeight: 38 }}
                    placeholder="Search ref, furparent, pet, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Bookings Table */}
              <div className="pn-table-wrap">
                <table className="pn-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Furparent &amp; City</th>
                      <th>Pet</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Quoted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((bk) => {
                      const wa = composeWhatsAppMessage(bk);
                      return (
                        <tr key={bk.id}>
                          <td>
                            <strong>{bk.bookingReference}</strong>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(bk.status)}>
                              {bk.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <strong>{bk.customerName}</strong>
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-muted-foreground)',
                              }}
                            >
                              {bk.city} • {bk.customerPhone}
                            </div>
                          </td>
                          <td>
                            {bk.petName} ({bk.petType})
                          </td>
                          <td>{bk.serviceName}</td>
                          <td>
                            {bk.preferredDate} • {bk.preferredTime}
                          </td>
                          <td>
                            <strong>
                              {formatPhpCurrency(bk.quotedPrice, bk.quotedPriceMax)}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {bk.status === 'new' && (
                                <button
                                  type="button"
                                  data-testid={`confirm-booking-${bk.id}`}
                                  className="pn-btn pn-btn-primary pn-btn-sm"
                                  onClick={() => {
                                    store.updateBookingStatus(bk.id, 'confirmed');
                                    showToast(`Confirmed ${bk.bookingReference}`);
                                  }}
                                >
                                  <CheckCircle2 size={14} aria-hidden="true" />
                                  Confirm
                                </button>
                              )}
                              {bk.status === 'confirmed' && (
                                <button
                                  type="button"
                                  className="pn-btn pn-btn-warm pn-btn-sm"
                                  onClick={() => {
                                    store.updateBookingStatus(bk.id, 'completed');
                                    showToast(`Marked ${bk.bookingReference} completed`);
                                  }}
                                >
                                  Complete
                                </button>
                              )}
                              {bk.status !== 'cancelled' && bk.status !== 'completed' && (
                                <button
                                  type="button"
                                  className="pn-btn pn-btn-outline pn-btn-sm"
                                  onClick={() => {
                                    store.updateBookingStatus(bk.id, 'cancelled');
                                    showToast(`Cancelled ${bk.bookingReference}`);
                                  }}
                                >
                                  <XCircle size={14} aria-hidden="true" />
                                </button>
                              )}
                              <a
                                href={wa.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pn-btn pn-btn-outline pn-btn-sm"
                                title="Message furparent on WhatsApp"
                              >
                                <MessageCircle size={14} aria-hidden="true" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 2: CALENDAR & CLOSURES */}
          {activeTab === 'calendar' && (
            <section>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: '1.6rem' }}>Availability &amp; Holiday Closures</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                  Block dates when your team is fully booked or on holiday. Closed dates
                  automatically prevent new booking requests on the website and mobile app.
                </p>
              </div>

              <div className="pn-two-col">
                <div className="pn-card">
                  <h2 style={{ fontSize: '1.15rem', marginBottom: 14 }}>
                    Block or Unblock a Date
                  </h2>
                  <div className="pn-form-grid">
                    <div className="pn-field">
                      <label htmlFor="closure-date" className="pn-label">
                        Date
                      </label>
                      <input
                        id="closure-date"
                        type="date"
                        className="pn-input"
                        value={closureDate}
                        onChange={(e) => setClosureDate(e.target.value)}
                      />
                    </div>
                    <div className="pn-field">
                      <label htmlFor="closure-reason" className="pn-label">
                        Reason
                      </label>
                      <input
                        id="closure-reason"
                        type="text"
                        className="pn-input"
                        value={closureReason}
                        onChange={(e) => setClosureReason(e.target.value)}
                      />
                    </div>
                    <div className="pn-field pn-field-full">
                      <button
                        type="button"
                        className="pn-btn pn-btn-primary"
                        onClick={() => {
                          store.toggleClosedDate(closureDate, closureReason);
                          showToast(`Updated availability for ${closureDate}`);
                        }}
                      >
                        <Plus size={16} aria-hidden="true" />
                        Toggle Date Closure
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 22 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>Active Closed Dates</h3>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {Object.entries(state.closedDates).map(([dt, reason]) => (
                        <div
                          key={dt}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.88rem',
                          }}
                        >
                          <span>
                            <strong>{dt}</strong> — {reason}
                          </span>
                          <button
                            type="button"
                            className="pn-btn pn-btn-outline pn-btn-sm"
                            onClick={() => store.toggleClosedDate(dt)}
                          >
                            Reopen
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pn-card">
                  <h2 style={{ fontSize: '1.15rem', marginBottom: 14 }}>
                    Post Live Pupdate to Customer Feed
                  </h2>
                  <div className="pn-form-grid">
                    <div className="pn-field">
                      <label htmlFor="pup-pet" className="pn-label">
                        Pet Name
                      </label>
                      <input
                        id="pup-pet"
                        className="pn-input"
                        value={pupdatePet}
                        onChange={(e) => setPupdatePet(e.target.value)}
                      />
                    </div>
                    <div className="pn-field">
                      <label htmlFor="pup-title" className="pn-label">
                        Activity Title
                      </label>
                      <input
                        id="pup-title"
                        className="pn-input"
                        value={pupdateTitle}
                        onChange={(e) => setPupdateTitle(e.target.value)}
                      />
                    </div>
                    <div className="pn-field pn-field-full">
                      <label htmlFor="pup-msg" className="pn-label">
                        Pupdate Details
                      </label>
                      <textarea
                        id="pup-msg"
                        className="pn-textarea"
                        rows={2}
                        value={pupdateMsg}
                        onChange={(e) => setPupdateMsg(e.target.value)}
                      />
                    </div>
                    <div className="pn-field pn-field-full">
                      <button
                        type="button"
                        className="pn-btn pn-btn-warm"
                        onClick={() => {
                          store.addPupdate({
                            time: 'Just now',
                            category: 'walk',
                            petName: pupdatePet,
                            title: pupdateTitle,
                            message: pupdateMsg,
                            metricsBadge: 'Verified Check-In',
                          });
                          showToast(`Published pupdate for ${pupdatePet}`);
                        }}
                      >
                        Publish Pupdate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: FINANCIALS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <section>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1 style={{ fontSize: '1.6rem' }}>Financials &amp; Service Analytics</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                    Realized revenue from completed bookings vs. confirmed upcoming pipeline.
                  </p>
                </div>
                <button
                  type="button"
                  className="pn-btn pn-btn-outline pn-btn-sm"
                  onClick={() =>
                    handleDownloadCsv('pet-nanny-financials.csv', store.exportFinancialsCsv())
                  }
                >
                  <Download size={15} aria-hidden="true" />
                  Export Financials CSV
                </button>
              </div>

              <div className="pn-kpi-grid">
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Completed Revenue
                  </span>
                  <div
                    className="pn-price-display"
                    style={{ marginTop: 4, color: 'var(--color-success)' }}
                  >
                    {formatPhpCurrency(metrics.completedRevenue)}
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Confirmed Pipeline Value
                  </span>
                  <div
                    className="pn-price-display"
                    style={{ marginTop: 4, color: 'var(--color-accent)' }}
                  >
                    {formatPhpCurrency(metrics.confirmedPipelineValue)}
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Confirmation Rate
                  </span>
                  <div className="pn-price-display" style={{ marginTop: 4 }}>
                    {metrics.confirmationRatePct}%
                  </div>
                </div>
                <div className="pn-card">
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    Cancellation Rate
                  </span>
                  <div className="pn-price-display" style={{ marginTop: 4 }}>
                    {metrics.cancellationRatePct}%
                  </div>
                </div>
              </div>

              <div className="pn-table-wrap">
                <table className="pn-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Total Requests</th>
                      <th>Completed Sessions</th>
                      <th>Completed Revenue</th>
                      <th>Confirmed Pipeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.servicesBreakdown.map((row) => (
                      <tr key={row.serviceSlug}>
                        <td>
                          <strong>{row.serviceName}</strong>
                        </td>
                        <td>{row.totalBookings}</td>
                        <td>{row.completedCount}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                          {formatPhpCurrency(row.completedRevenue)}
                        </td>
                        <td>{formatPhpCurrency(row.confirmedValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: SERVICES CATALOG */}
          {activeTab === 'services' && (
            <section>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: '1.6rem' }}>Manage Services &amp; Rates</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                  Changes immediately sync across the Customer Website and Mobile App.
                </p>
              </div>

              <div className="pn-table-wrap">
                <table className="pn-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Slug</th>
                      <th>Rate (PHP)</th>
                      <th>Unit</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.services.map((svc) => (
                      <tr key={svc.id}>
                        <td>
                          <strong>{svc.name}</strong>
                        </td>
                        <td>{svc.slug}</td>
                        <td>
                          <strong>{formatPhpCurrency(svc.priceAmount, svc.priceMax)}</strong>
                        </td>
                        <td>per {svc.pricingUnit}</td>
                        <td>{svc.durationMinutes} mins</td>
                        <td>
                          <span
                            className={
                              svc.isActive
                                ? 'pn-badge pn-badge-green'
                                : 'pn-badge pn-badge-neutral'
                            }
                          >
                            {svc.isActive ? 'ACTIVE' : 'HIDDEN'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              type="button"
                              className="pn-btn pn-btn-outline pn-btn-sm"
                              onClick={() => {
                                store.updateService({
                                  ...svc,
                                  isActive: !svc.isActive,
                                });
                                showToast(`Updated ${svc.name} visibility`);
                              }}
                            >
                              {svc.isActive ? 'Pause' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              className="pn-btn pn-btn-outline pn-btn-sm"
                              onClick={() => {
                                store.updateService({
                                  ...svc,
                                  priceAmount: svc.priceAmount + 50,
                                });
                                showToast(`Updated ${svc.name} base rate`);
                              }}
                            >
                              +₱50 Rate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 5: REVIEWS & PROFILE */}
          {activeTab === 'reviews' && (
            <section>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: '1.6rem' }}>Reviews Moderation &amp; Profile</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)' }}>
                  Approve customer reviews (including Pet Perspective translations) and update
                  Krizzia’s founder profile.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                {state.reviews.map((rv) => (
                  <div key={rv.id} className="pn-card">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <strong>{rv.authorName}</strong> ({rv.authorLocation})
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          className={
                            rv.isApproved
                              ? 'pn-badge pn-badge-green'
                              : 'pn-badge pn-badge-neutral'
                          }
                        >
                          {rv.isApproved ? 'APPROVED' : 'HIDDEN'}
                        </span>
                        <button
                          type="button"
                          className="pn-btn pn-btn-outline pn-btn-sm"
                          onClick={() => store.toggleReviewApproval(rv.id)}
                        >
                          {rv.isApproved ? 'Unpublish' : 'Approve'}
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.92rem', marginBottom: 8 }}>
                      <strong>Furparent:</strong> “{rv.reviewText}”
                    </p>
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--color-muted-foreground)',
                      }}
                    >
                      <strong>Pet Translation ({rv.petTranslationAuthor}):</strong> “
                      {rv.petTranslationText}”
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

