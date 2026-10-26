import business from './data/business.json';
import { useEffect, useRef } from 'react';
import './social-links.css';

export function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.98L.05 24l6.23-1.64a11.9 11.9 0 0 0 5.8 1.48h.01C18.66 23.84 24 18.5 24 11.92a11.84 11.84 0 0 0-3.48-8.44ZM12.08 21.82a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.73.98 1-3.63-.24-.38a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.9-9.92 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.27-.2-.57-.35Z" /></svg>;
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}
export function FooterSocialLinks() {
  return <div className="footer-social-links">
    <a className="pioneira-social-icon" href={business.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Conversar com a Pioneira no WhatsApp: ${business.whatsappTelephoneDisplay}`} title={`WhatsApp · ${business.telephoneDisplay}`}><WhatsAppIcon /></a>
    <a className="pioneira-social-icon" href={business.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram da Pioneira: ${business.instagramHandle}`} title={`Instagram · ${business.instagramHandle}`}><InstagramIcon /></a>
  </div>;
}
export function FloatingWhatsApp() {
  const link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const mobile = matchMedia('(max-width: 767px)');
    let frame = 0;
    function place() {
      frame = 0;
      const button = link.current;
      if (!mobile.matches || !button) return;
      button.style.removeProperty('--whatsapp-lift');
      const box = button.getBoundingClientRect();
      // Keep the fixed shortcut clear of visible copy and other touch targets.
      const obstacles = [...document.querySelectorAll('p,h1,h2,h3,address,figcaption,a,button')]
        .filter(element => element !== button && !element.contains(button))
        .map(element => element.getBoundingClientRect())
        .filter(rect => rect.width && rect.height && rect.bottom > 0 && rect.top < innerHeight && rect.left < box.right + 8 && rect.right > box.left - 8);
      let lift = 0;
      for (let candidate = 0; candidate <= Math.min(320, innerHeight * .4); candidate += 8) {
        if (obstacles.every(rect => box.bottom - candidate < rect.top - 8 || box.top - candidate > rect.bottom + 8)) { lift = candidate; break; }
      }
      button.style.setProperty('--whatsapp-lift', `${lift}px`);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(place); };
    place();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
  return <a ref={link} className="mobile-whatsapp" href={business.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Pioneira pelo WhatsApp" title="Falar com a Pioneira"><WhatsAppIcon /></a>;
}
