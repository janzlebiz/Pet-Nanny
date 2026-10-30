import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  Linking,
} from 'react-native';
import { COLORS, HIT_SLOP, SPACING } from './src/theme';
import {
  MOBILE_ADDONS,
  MOBILE_PUPDATES,
  MOBILE_REVIEWS,
  MOBILE_SERVICES,
  formatPhp,
} from './src/data';

type TabKey = 'home' | 'services' | 'pupdates' | 'book' | 'owner';

interface MobileBookingRecord {
  id: string;
  ref: string;
  status: 'new' | 'confirmed' | 'completed';
  customerName: string;
  phone: string;
  petName: string;
  serviceName: string;
  city: 'Daet' | 'Naga City';
  date: string;
  time: string;
  quotedPhp: number;
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');
  const [city, setCity] = useState<'Daet' | 'Naga City'>('Daet');
  const [reviewMode, setReviewMode] = useState<'human' | 'pet'>('human');

  // 3-Step Mobile Booking Wizard State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSlug, setSelectedSlug] = useState('dog-walking');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('08:00 AM');
  const [firstBooking, setFirstBooking] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482915');
  const [formError, setFormError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<MobileBookingRecord[]>([
    {
      id: 'm1',
      ref: 'PN-904A',
      status: 'new',
      customerName: 'Angela Mendoza',
      phone: '09178823411',
      petName: 'Choco (Dog)',
      serviceName: 'Overnight Care',
      city: 'Daet',
      date: '2026-11-04',
      time: '07:00 PM',
      quotedPhp: 1080,
    },
    {
      id: 'm2',
      ref: 'PN-772C',
      status: 'confirmed',
      customerName: 'Mark Villanueva',
      phone: '09184459912',
      petName: 'Nala (Cat)',
      serviceName: 'Day Visit',
      city: 'Daet',
      date: '2026-11-02',
      time: '10:00 AM',
      quotedPhp: 350,
    },
  ]);

  const currentService =
    MOBILE_SERVICES.find((s) => s.slug === selectedSlug) || MOBILE_SERVICES[0];
  const discountedMin = firstBooking
    ? Math.round(currentService.priceAmount * 0.9)
    : currentService.priceAmount;

  const handleQuickBookService = (slug: string) => {
    setSelectedSlug(slug);
    setStep(1);
    setTab('book');
  };

  const handleSendOtp = () => {
    if (customerName.trim().length < 2 || phone.trim().length < 10 || !petName.trim()) {
      setFormError('Please complete your name, PH mobile number, and pet name.');
      return;
    }
    setFormError(null);
    setGeneratedOtp('482915');
    setStep(3);
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() !== generatedOtp) {
      setFormError('Invalid 6-digit code. Tap Auto-Fill to use sandbox code.');
      return;
    }
    const newBk: MobileBookingRecord = {
      id: 'm_' + Date.now(),
      ref: 'PN-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      status: 'new',
      customerName: customerName.trim(),
      phone: phone.trim(),
      petName: petName.trim(),
      serviceName: currentService.name,
      city,
      date,
      time,
      quotedPhp: discountedMin,
    };
    setBookings([newBk, ...bookings]);
    setFormError(null);
    setStep(4);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Pet Nanny Bicol</Text>
          <Text style={styles.brandSub}>{city} • Open Everyday</Text>
        </View>
        <View style={styles.cityToggle}>
          {(['Daet', 'Naga City'] as const).map((c) => (
            <Pressable
              key={c}
              hitSlop={HIT_SLOP}
              onPress={() => setCity(c)}
              style={[styles.cityPill, city === c && styles.cityPillActive]}
            >
              <Text style={[styles.cityPillText, city === c && styles.cityPillTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Scrollable Screen Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tab === 'home' && (
          <View style={styles.sectionStack}>
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>10% OFF FIRST BOOKING</Text>
              <Text style={styles.heroHeading}>
                Calm, loving in-home care while you’re away.
              </Text>
              <Text style={styles.bodyMuted}>
                Run by Krizzia (“The Dog Whisperer”) &amp; Daet Saving Strays rescue
                volunteers. Gov’t ID, Barangay &amp; NBI clearances available.
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => {
                  setStep(1);
                  setTab('book');
                }}
              >
                <Text style={styles.primaryBtnText}>Book Care in {city}</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Popular Services</Text>
            {MOBILE_SERVICES.map((svc) => (
              <View key={svc.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{svc.name}</Text>
                  <Text style={styles.priceText}>
                    {formatPhp(svc.priceAmount, svc.priceMax)}/{svc.unit}
                  </Text>
                </View>
                <Text style={styles.bodyMuted}>{svc.description}</Text>
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => handleQuickBookService(svc.slug)}
                >
                  <Text style={styles.secondaryBtnText}>Select {svc.name}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {tab === 'services' && (
          <View style={styles.sectionStack}>
            <Text style={styles.sectionTitle}>Services &amp; Transparent Rates</Text>
            {MOBILE_SERVICES.map((svc) => (
              <View key={svc.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{svc.name}</Text>
                  <Text style={styles.priceText}>
                    {formatPhp(svc.priceAmount, svc.priceMax)}
                  </Text>
                </View>
                <Text style={styles.bodyMuted}>{svc.description}</Text>
                {svc.features.map((f, i) => (
                  <Text key={i} style={styles.featureItem}>
                    • {f}
                  </Text>
                ))}
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => handleQuickBookService(svc.slug)}
                >
                  <Text style={styles.primaryBtnText}>Book {svc.name}</Text>
                </Pressable>
              </View>
            ))}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Optional Add-Ons</Text>
              {MOBILE_ADDONS.map((a) => (
                <View key={a.id} style={styles.rowBetween}>
                  <Text style={styles.bodyMuted}>{a.name}</Text>
                  <Text style={styles.addonPrice}>{a.price}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === 'pupdates' && (
          <View style={styles.sectionStack}>
            <Text style={styles.sectionTitle}>Live Pupdates &amp; 24/7 CCTV</Text>
            {MOBILE_PUPDATES.map((p) => (
              <View key={p.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.eyebrow}>{p.time}</Text>
                  <Text style={styles.eyebrow}>{p.pet}</Text>
                </View>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.bodyMuted}>{p.detail}</Text>
              </View>
            ))}

            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Verified Reviews</Text>
              <Pressable
                style={styles.cityPillActive}
                onPress={() => setReviewMode(reviewMode === 'human' ? 'pet' : 'human')}
              >
                <Text style={styles.cityPillTextActive}>
                  {reviewMode === 'human' ? 'Switch to Pet Says' : 'Switch to Human Says'}
                </Text>
              </Pressable>
            </View>

            {MOBILE_REVIEWS.map((r) => (
              <View key={r.id} style={styles.card}>
                <Text style={styles.cardTitle}>
                  “{reviewMode === 'human' ? r.humanTitle : r.petTitle}”
                </Text>
                <Text style={styles.bodyMuted}>
                  “{reviewMode === 'human' ? r.humanBody : r.petBody}”
                </Text>
                <Text style={styles.eyebrow}>
                  {reviewMode === 'human' ? r.humanAuthor : r.petAuthor}
                </Text>
              </View>
            ))}
          </View>
        )}

        {tab === 'book' && (
          <View style={styles.sectionStack}>
            {step === 1 && (
              <View style={styles.card}>
                <Text style={styles.eyebrow}>STEP 1 OF 3 • SERVICE &amp; SCHEDULE</Text>
                <Text style={styles.cardTitle}>Choose Service</Text>
                {MOBILE_SERVICES.map((s) => (
                  <Pressable
                    key={s.slug}
                    onPress={() => setSelectedSlug(s.slug)}
                    style={[
                      styles.choiceRow,
                      selectedSlug === s.slug && styles.choiceRowActive,
                    ]}
                  >
                    <Text style={styles.choiceTitle}>{s.name}</Text>
                    <Text style={styles.addonPrice}>
                      {formatPhp(s.priceAmount, s.priceMax)}
                    </Text>
                  </Pressable>
                ))}
                <Text style={styles.label}>Preferred Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="2026-11-12"
                />
                <Pressable
                  style={styles.choiceRow}
                  onPress={() => setFirstBooking(!firstBooking)}
                >
                  <Text style={styles.bodyMuted}>
                    First-time booking (-10% discount): {firstBooking ? 'YES' : 'NO'}
                  </Text>
                  <Text style={styles.priceText}>{formatPhp(discountedMin)}</Text>
                </Pressable>
                <Pressable style={styles.primaryBtn} onPress={() => setStep(2)}>
                  <Text style={styles.primaryBtnText}>Continue to Pet Details</Text>
                </Pressable>
              </View>
            )}

            {step === 2 && (
              <View style={styles.card}>
                <Text style={styles.eyebrow}>STEP 2 OF 3 • FURPARENT &amp; PET</Text>
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Juan dela Cruz"
                />
                <Text style={styles.label}>PH Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0956 902 5256"
                />
                <Text style={styles.label}>Email Address (for OTP)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="furparent@example.com"
                />
                <Text style={styles.label}>Pet Name</Text>
                <TextInput
                  style={styles.input}
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="Buster"
                />
                {formError && <Text style={styles.errorText}>{formError}</Text>}
                <Pressable style={styles.primaryBtn} onPress={handleSendOtp}>
                  <Text style={styles.primaryBtnText}>Send 6-Digit OTP</Text>
                </Pressable>
              </View>
            )}

            {step === 3 && (
              <View style={styles.card}>
                <Text style={styles.eyebrow}>STEP 3 OF 3 • VERIFY OTP</Text>
                <Text style={styles.bodyMuted}>
                  Sandbox Code: {generatedOtp}
                </Text>
                <Pressable
                  style={styles.secondaryBtn}
                  onPress={() => setOtpCode(generatedOtp)}
                >
                  <Text style={styles.secondaryBtnText}>Tap to Auto-Fill Code</Text>
                </Pressable>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="000000"
                />
                {formError && <Text style={styles.errorText}>{formError}</Text>}
                <Pressable style={styles.primaryBtn} onPress={handleVerifyOtp}>
                  <Text style={styles.primaryBtnText}>Verify &amp; Complete Booking</Text>
                </Pressable>
              </View>
            )}

            {step === 4 && (
              <View style={styles.card}>
                <Text style={styles.eyebrow}>VERIFIED REQUEST</Text>
                <Text style={styles.cardTitle}>Mobile Booking Confirmed!</Text>
                <Text style={styles.bodyMuted}>
                  Your request is logged. Tap below to chat with Krizzia on WhatsApp (+63 956
                  902 5256).
                </Text>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() =>
                    Linking.openURL('https://wa.me/639569025256')
                  }
                >
                  <Text style={styles.primaryBtnText}>Open WhatsApp Chat</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {tab === 'owner' && (
          <View style={styles.sectionStack}>
            <Text style={styles.sectionTitle}>Mobile Owner Console</Text>
            {bookings.map((b) => (
              <View key={b.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>
                    {b.ref} • {b.petName}
                  </Text>
                  <Text style={styles.eyebrow}>{b.status.toUpperCase()}</Text>
                </View>
                <Text style={styles.bodyMuted}>
                  {b.customerName} ({b.city}) • {b.serviceName} • {formatPhp(b.quotedPhp)}
                </Text>
                <Text style={styles.bodyMuted}>
                  {b.date} at {b.time}
                </Text>
                {b.status === 'new' && (
                  <Pressable
                    style={styles.primaryBtn}
                    onPress={() =>
                      setBookings(
                        bookings.map((item) =>
                          item.id === b.id ? { ...item, status: 'confirmed' } : item
                        )
                      )
                    }
                  >
                    <Text style={styles.primaryBtnText}>Confirm Appointment</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Thumb-Friendly 5-Tab Bottom Bar (>=48dp targets) */}
      <View style={styles.tabBar}>
        {(
          [
            { key: 'home', label: 'Home' },
            { key: 'services', label: 'Services' },
            { key: 'pupdates', label: 'Pupdates' },
            { key: 'book', label: 'Book' },
            { key: 'owner', label: 'Owner' },
          ] as const
        ).map((item) => (
          <Pressable
            key={item.key}
            hitSlop={HIT_SLOP}
            style={[styles.tabButton, tab === item.key && styles.tabButtonActive]}
            onPress={() => setTab(item.key)}
          >
            <Text style={[styles.tabLabel, tab === item.key && styles.tabLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderNeutral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  brandSub: {
    fontSize: 12,
    color: COLORS.brandInk,
    fontWeight: '600',
  },
  cityToggle: {
    flexDirection: 'row',
    gap: 6,
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderNeutral,
  },
  cityPillActive: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primarySoft,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedForeground,
  },
  cityPillTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brandInk,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionStack: {
    gap: 14,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.brandInk,
    letterSpacing: 0.8,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderNeutral,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  bodyMuted: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brandInk,
  },
  addonPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brandInk,
  },
  featureItem: {
    fontSize: 13,
    color: COLORS.foreground,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  primaryBtn: {
    minHeight: SPACING.touchMin,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  primaryBtnText: {
    color: COLORS.onAccent,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    minHeight: 44,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    color: COLORS.brandInk,
    fontSize: 14,
    fontWeight: '700',
  },
  choiceRow: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.borderNeutral,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  choiceRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.borderNeutral,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.foreground,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: COLORS.destructive,
    fontSize: 13,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderNeutral,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: SPACING.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primarySoft,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedForeground,
  },
  tabLabelActive: {
    color: COLORS.brandInk,
    fontWeight: '700',
  },
});
