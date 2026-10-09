/**
 * Maps curriculum area/term tint names to their corresponding stronger token colors.
 * Used by CrayonBox, PaintingScene, and painting palette blobs.
 */

export const TINT_COLOR_MAP = {
  yellow: 'var(--sunny)',
  pink: 'var(--bubblegum)',
  mint: 'var(--meadow)',
  sky: 'var(--sky)',
  grape: 'var(--grape)',
  lilac: 'var(--grape)',
};

export const TINT_PALETTE_ORDER = ['yellow', 'pink', 'mint', 'sky', 'grape'];

/**
 * Resolves a tint name to a CSS variable string.
 * If tint is unrecognized or absent, cycles through the ordered palette.
 * @param {string} tint
 * @param {number} [index=0]
 * @returns {string} CSS variable
 */
export function getTintColor(tint, index = 0) {
  if (tint && TINT_COLOR_MAP[tint]) {
    return TINT_COLOR_MAP[tint];
  }
  const fallbackKey = TINT_PALETTE_ORDER[index % TINT_PALETTE_ORDER.length];
  return TINT_COLOR_MAP[fallbackKey];
}

/**
 * Returns raw hex/color for SVG attributes if CSS var is not desired.
 */
export const TINT_RAW_COLORS = {
  yellow: '#FFD400', // sunny
  pink: '#FF5FA2',   // bubblegum
  mint: '#2FD88A',   // meadow
  sky: '#38BDF8',    // sky
  grape: '#A78BFA',  // grape
  lilac: '#C4B5FD',  // lilac
};

export function getRawTintColor(tint, index = 0) {
  if (tint && TINT_RAW_COLORS[tint]) {
    return TINT_RAW_COLORS[tint];
  }
  const fallbackKey = TINT_PALETTE_ORDER[index % TINT_PALETTE_ORDER.length];
  return TINT_RAW_COLORS[fallbackKey];
}
