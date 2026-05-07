import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const CITIES = [
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    emoji: '🌷',
    accent: '#FF6B35',
  },
  {
    name: 'Jakarta',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    emoji: '🌴',
    accent: '#2ECC71',
  },
];

function formatTime(date, timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function formatDate(date, timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function getUtcOffset(timezone) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  }).formatToParts(now);
  const offset = parts.find((p) => p.type === 'timeZoneName');
  return offset ? offset.value : '';
}

function ClockCard({ city }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = formatTime(now, city.timezone);
  const [hours, minutes, seconds] = time.split(':');
  const date = formatDate(now, city.timezone);
  const offset = getUtcOffset(city.timezone);

  return (
    <View style={[styles.card, { borderTopColor: city.accent }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cityEmoji}>{city.emoji}</Text>
        <View>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.countryName}>{city.country}</Text>
        </View>
        <View style={[styles.offsetBadge, { backgroundColor: city.accent + '22' }]}>
          <Text style={[styles.offsetText, { color: city.accent }]}>{offset}</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeDigits}>{hours}</Text>
        <Text style={styles.timeSeparator}>:</Text>
        <Text style={styles.timeDigits}>{minutes}</Text>
        <Text style={styles.timeSeparator}>:</Text>
        <Text style={[styles.timeDigits, styles.secondsDigits]}>{seconds}</Text>
      </View>

      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Clock</Text>
        <Text style={styles.headerSubtitle}>Live time across the globe</Text>
      </View>
      <View style={styles.cardsContainer}>
        {CITIES.map((city) => (
          <ClockCard key={city.name} city={city} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8888aa',
    marginTop: 4,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 24,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cityEmoji: {
    fontSize: 32,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  countryName: {
    fontSize: 13,
    color: '#8888aa',
    marginTop: 2,
  },
  offsetBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  offsetText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  timeDigits: {
    fontSize: 56,
    fontWeight: '200',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: '200',
    color: '#555577',
    marginHorizontal: 2,
    lineHeight: 56,
  },
  secondsDigits: {
    fontSize: 36,
    color: '#8888aa',
  },
  dateText: {
    fontSize: 14,
    color: '#8888aa',
  },
});
