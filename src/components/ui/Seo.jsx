import { useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';

/**
 * Lightweight client-side SEO manager.
 * Sets document.title and meta[name="description"] dynamically based on siteConfig.
 * @param {{
 *   title?: string,
 *   description?: string
 * }} props
 */
export function Seo({ title, description }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const seoConfig = siteConfig?.seo || {};
    const titleTemplate = seoConfig.titleTemplate || '%s | Wiggle';
    const defaultTitle = seoConfig.defaultTitle || 'Wiggle | Play-first preschool';
    const defaultDescription = seoConfig.defaultDescription || 'Wiggle is a play-first preschool for children aged 1.5 to 5.5.';

    // Construct full title
    const finalTitle = title
      ? titleTemplate.replace('%s', title)
      : defaultTitle;

    document.title = finalTitle;

    // Update meta description
    const finalDesc = description || defaultDescription;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = finalDesc;
  }, [title, description]);

  return null;
}
