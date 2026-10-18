const SEASONAL_STORAGE_KEY = 'wiggle_seasonal_config_v1';
const SEASONAL_EVENT = 'wiggle:seasonal-updated';

export const SEASONAL_PRESETS = [
  {
    id: 'admissions',
    name: 'Admissions Open (2026-27)',
    tag: 'Official Term',
    icon: 'sparkle',
    tint: 'yellow',
    badgeText: 'Admissions open for 2026-27',
    announcement: '🌟 Admissions open for Batch 2026-27! Small batches, warm teachers. Book a morning tour today.',
    accentColor: '#FFD400'
  },
  {
    id: 'summer',
    name: 'Summer Splash & Art Camp',
    tag: 'Seasonal Camp',
    icon: 'sun',
    tint: 'tangerine',
    badgeText: 'Summer Camp Registrations Open!',
    announcement: '☀️ Splash pool, messy clay craft & puppet theatre! 4-week Summer Splash Camp starting May 1st.',
    accentColor: '#FF5A1F'
  },
  {
    id: 'monsoon',
    name: 'Monsoon Nature & Puddle Trail',
    tag: 'Rainy Term',
    icon: 'cloud',
    tint: 'sky',
    badgeText: 'Monsoon Nature Explorers Term',
    announcement: '🌧️ Paper boat races, organic garden planting & rain sensory play! Enrolling for the monsoon term.',
    accentColor: '#38BDF8'
  },
  {
    id: 'festive',
    name: 'Diwali & Autumn Joy Carnival',
    tag: 'Festival Season',
    icon: 'sparkle',
    tint: 'mint',
    badgeText: 'Annual Autumn Carnival Coming Soon',
    announcement: '🪔 Clay diya moulding, story circles & family lantern walk! Open house this Saturday.',
    accentColor: '#2FD88A'
  },
  {
    id: 'winter',
    name: 'Winter Wonderland Trail',
    tag: 'Winter Special',
    icon: 'star',
    tint: 'grape',
    badgeText: 'Winter Camp & Story Nights',
    announcement: '❄️ Cozy hot chocolate mornings, blanket fort reading nooks, and winter music trail.',
    accentColor: '#A78BFA'
  }
];

export const DEFAULT_SEASONAL_CONFIG = {
  activeSeasonId: 'admissions',
  showAnnouncementBanner: true,
  customAnnouncement: '',
  showBadge: true,
  lastUpdated: new Date().toISOString()
};

/**
 * Returns the current active seasonal configuration.
 */
export function getSeasonalConfig() {
  if (typeof window === 'undefined') return DEFAULT_SEASONAL_CONFIG;

  try {
    const raw = localStorage.getItem(SEASONAL_STORAGE_KEY);
    if (!raw) return DEFAULT_SEASONAL_CONFIG;
    return { ...DEFAULT_SEASONAL_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading seasonal config:', err);
    return DEFAULT_SEASONAL_CONFIG;
  }
}

/**
 * Saves seasonal configuration to localStorage and notifies listeners.
 */
export function saveSeasonalConfig(newConfig) {
  if (typeof window === 'undefined') return;

  try {
    const merged = { ...getSeasonalConfig(), ...newConfig, lastUpdated: new Date().toISOString() };
    localStorage.setItem(SEASONAL_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(SEASONAL_EVENT, { detail: merged }));
    return merged;
  } catch (err) {
    console.error('Error saving seasonal config:', err);
  }
}

/**
 * Gets the active preset details merged with any custom announcement.
 */
export function getActiveSeasonDetails() {
  const config = getSeasonalConfig();
  const preset = SEASONAL_PRESETS.find(p => p.id === config.activeSeasonId) || SEASONAL_PRESETS[0];

  return {
    ...preset,
    displayText: config.customAnnouncement?.trim() || preset.announcement,
    showBanner: config.showAnnouncementBanner,
    showBadge: config.showBadge
  };
}
