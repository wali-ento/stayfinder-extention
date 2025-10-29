import { injectGlobalStyles } from '../../styles';
import { initAirbnb } from './airbnb';
import { initGuesty } from './platforms/guesty';
import { initHostfully } from './platforms/hostfully';
import { initHospitable } from './platforms/hospitable';
import { initLodgify } from './platforms/lodgify';
import { initHostaway } from './platforms/hostaway';
import { initBoostly } from './platforms/boostly';
import { initHudson } from './platforms/hudson';
import { initIcnd } from './platforms/icnd';
import { initRealtech } from './platforms/realtech';
import { initOwnerRez } from './platforms/ownerrez';
import { detectCurrentSite } from './shared/site-detector';
import { showStatusIndicator } from '../components/StatusIndicator';

/**
 * Main content script entry point
 */
export function initContentScript() {  
  // Step 1: Inject global styles (once for all sites)
  injectGlobalStyles();
  
  // Step 2: Detect current site
  const siteInfo = detectCurrentSite();
  
  if (!siteInfo) {
    console.log('❌ No supported site detected');
    showStatusIndicator();
    return;
  }
  
  const { key } = siteInfo;
  
  console.log(`🚀 Initializing ${siteInfo.config.name} handler`);
  
  // Step 3: Initialize appropriate site handler
  switch (key) {
    case 'airbnb':
      initAirbnb();
      break;
    case 'guesty':
      initGuesty();
      break;
    case 'hostfully':
      initHostfully();
      break;
    case 'hospitable':
      initHospitable();
      break;
    case 'lodgify':
      initLodgify();
      break;
    case 'hostaway':
      initHostaway();
      break;
    case 'boostly':
      initBoostly();
      break;
    case 'hudson':
      initHudson();
      break;
    case 'icnd':
      initIcnd();
      break;
    case 'realtech':
      initRealtech();
      break;
    case 'ownerrez':
      initOwnerRez();
      break;
    default:
      console.log(`❌ No handler for site: ${key}`);
  }
  
  // Step 4: Show status indicator
  showStatusIndicator();
}

