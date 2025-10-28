import { SITE_CONFIGS } from '../configs/all-site-configs';
import type { SiteConfig } from '../configs/all-site-configs';

/**
 * Detect which site the user is currently on
 */
export function detectCurrentSite(): { key: string; config: SiteConfig } | null {
  const hostname = window.location.hostname.toLowerCase();
  
  // Check each site configuration
  for (const [siteKey, config] of Object.entries(SITE_CONFIGS)) {
    // Check if hostname matches any domain in this config
    const matches = config.domains.some(domain => 
      hostname.includes(domain) || hostname === domain
    );
    
    if (matches) {
      console.log(`✅ Detected site: ${config.name} (${config.platform})`);
      return { key: siteKey, config };
    }
  }
  
  return null;
}

/**
 * Get site configuration by key
 */
export function getSiteConfig(key: string): SiteConfig | null {
  return SITE_CONFIGS[key] || null;
}

