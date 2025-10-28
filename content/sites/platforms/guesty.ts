import ahoy from 'ahoy.js';

export function initGuesty() {

  console.log('guesty initGuesty function called')
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn') || 
        target.closest('.btn')) {
      console.log('Book Now button clicked!');
      event.preventDefault();
      event.stopPropagation();
      
      // Your custom logic here
      const metaInfo = {
        text: target.textContent?.trim(),
        href: (target as HTMLAnchorElement)?.href || null,
        location: window.location.href,
      };

      ahoy.track('click_event', metaInfo);
    }
  });
}

