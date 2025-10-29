import { initContentScript } from "@/content/sites";
import ahoy from 'ahoy.js';

export default defineContentScript({
  matches: [
    // ===== AIRBNB =====
    '*://*.airbnb.com/*',
    '*://*.airbnb.ca/*', 
    '*://*.airbnb.co.uk/*',
    
    // ===== GUESTY =====
    '*://*.guestybookings.com/*',
    
    // ===== OWNERREZ =====
    '*://*.ownerrez.com/*',
    '*://*.wishlistnc.com/*',
    '*://*.yourcoastalproperties.com/*',
    '*://*.rockhillstays.com/*',
    '*://*.restashoarcottages.com/*',
    '*://*.thehainsley.com/*',
    '*://*.homebaserentals.com/*',
    '*://*.jaxsieproperties.com/*',
    '*://*.en.ragq.com/*',
    '*://*.sierrablancacabins.net/*',
    '*://*.pineriverranch.com/*',
    
    // ===== HOSTFULLY =====
    '*://*.book.hostfully.com/*',
    '*://*.stay.bespokepropertiesidaho.com/*',
    
    // ===== HOSPITABLE =====
    '*://*.grandeflats.com/*',
    '*://*.bolivarbeachandbay.com/*',
    '*://*.themadisonlivcollection.com/*',
    '*://*.aprilholiday.com.au/*',
    '*://*.peace-mgmt.com/*',
    '*://*.staywichita.com/*',
    '*://*.strpropertymgmt.com/*',
    '*://*.lakesammamishgetaway.com/*',
    '*://*.hospitable.rentals/*',
    '*://*.kollersignaturestays.com/*',
    
    // ===== LODGIFY =====
    '*://*.sandcastleguest.com/*',
    '*://*.smartsuites.com.au/*',
    '*://*.caribbeandreamdr.com/*',
    '*://*.malagapremiumsuites.com/*',
    '*://*.lodgify.com/*',
    '*://*.mammothmountainretreat.com/*',
    '*://*.radioguesthouse.com/*',
    '*://*.staysoulful.com/*',
    
    // ===== HOSTAWAY =====
    '*://*.dndstays.com/*',
    '*://*.airinn.au/*',
    '*://*.ohanainns.com/*',
    '*://*.iugo.co/*',
    '*://*.roarentals.ro/*',
    '*://*.book.conranproperties.com/*',
    '*://*.book.airluxemanagement.com/*',
    '*://*.bookusastay.com/*',
    '*://*.casadecooper.com/*',
    '*://*.book.staylagom.com/*',
    
    // ===== BOOSTLY =====
    '*://*.peachhausfurnishedrentals.com/*',
    '*://*.bosssa.co.uk/*',
    '*://*.sojourney.co/*',
    '*://*.craftycohost.com/*',
    '*://*.nestawaits.com/*',
    '*://*.stanleystays.com/*',
    '*://*.theairbnfree.com/*',
    '*://*.stayhellosunshine.com/*',
    '*://*.glasswingstays.co.uk/*',
    '*://*.koshproperty.com/*',
    
    // ===== HUDSON CREATIVE STUDIO =====
    '*://*.tinstarco.com/*',
    '*://*.josephellenproperties.com/*',
    '*://*.agapevacationrentals.com/*',
    '*://*.heartofcapecod.com/*',
    '*://*.luxuryvacationstays.com/*',
    '*://*.flyingsquirrelcottages.com/*',
    '*://*.micasaaustralia.com.au/*',
    '*://*.yourdevonescape.co.uk/*',
    
    // ===== ICND =====
    '*://*.realjoy.com/*',
    '*://*.shorepro.com/*',
    '*://*.rentvail.com/*',
    '*://*.beachretreatsbyvillage.com/*',
    '*://*.upstay.com/*',
    '*://*.compassresorts.com/*',
    '*://*.resortrentals.us/*',
    '*://*.beverlyserral.com/*',
    '*://*.visitmbr.com/*',
    
    // ===== REALTECH MASTERS =====
    '*://*.raveisfloridarentals.com/*',
    '*://*.roserentaldept.com/*',
    '*://*.islander-resort.com/*',
    '*://*.beachblueproperties.com/*',
    '*://*.knvinc.com/*',
    '*://*.madeirabayresort.com/*',
    '*://*.parker-kaufman.com/*',
    '*://*.tripowervacationrentals.com/*',
    '*://*.oceansluxuryvacations.com/*',
  ],
  
  main() {

    // ---  Configure Ahoy from environment variables ---
    const VISITS_URL = import.meta.env.VITE_AHOY_VISITS_URL;
    const EVENTS_URL = import.meta.env.VITE_AHOY_EVENTS_URL;

    ahoy.configure({
      cookies: true,
      visitsUrl: VISITS_URL,
      eventsUrl: EVENTS_URL,
      page: window.location.href,
      useBeacon: true,
    });

    // --- Send a "visit" event ---
    ahoy.trackView();

    initContentScript();
  }
});