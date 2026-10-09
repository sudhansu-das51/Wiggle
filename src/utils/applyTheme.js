import { siteConfig } from '../config/siteConfig';

/**
 * Reads siteConfig.theme.overrides and sets each key on document.documentElement.style
 * before first render, allowing complete runtime theme customization without editing CSS.
 */
export function applyTheme(customOverrides) {
  if (typeof document === 'undefined') return;

  const overrides = customOverrides || siteConfig?.theme?.overrides || {};
  const rootStyle = document.documentElement.style;

  Object.entries(overrides).forEach(([property, value]) => {
    if (property.startsWith('--') && value) {
      rootStyle.setProperty(property, value);
    }
  });
}
