import business from './data/business.json';
import { useEffect, useRef, useState } from 'react';

const { whatsapp } = business;
const navigation = [
  ['Início', '#inicio'],
  ['Serviços', '#servicos'],
  ['Como funciona', '#como-funciona'],
  ['Avaliações', '#avaliacoes'],
  ['Contato', '#contato'],
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HeroInterface() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab' && menu.current) {
        const links = menu.current.querySelectorAll<HTMLAnchorElement>('a');
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === menuButton.current) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); menuButton.current?.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); menuButton.current?.focus(); }
      }
    };
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktop = matchMedia('(min-width: 1024px)');
    const resize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    desktop.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', resize); };
  }, [menuOpen]);

  return <div className="hero-interface">
    <header className="site-header">
      <a className="brand-signature" href="#inicio" aria-label="Lavanderia Pioneira início"><img className="official-header-logo" src="/brand/pioneira-symbol.png" width="1080" height="1080" alt="" /><span className="pioneira-wordmark"><span>Lavanderia</span><strong>Pioneira</strong><small>Desde 2008</small></span></a>
      <nav className="desktop-navigation" aria-label="Navegação principal">{navigation.map(([label, href]) => <a key={href} href={href} aria-current={href === '#inicio' ? 'page' : undefined}>{label}</a>)}</nav>
      <a className="header-contact" href={whatsapp} target="_blank" rel="noopener noreferrer">Fale conosco<Arrow diagonal /></a>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><span className={menuOpen ? 'menu-lines is-open' : 'menu-lines'}><span /><span /></span></button>
      <div ref={menu} id="mobile-navigation" className="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Navegação mobile">{navigation.map(([label, href]) => <a key={href} href={href} aria-current={href === '#inicio' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}</nav>
        <a className="mobile-menu-contact" href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Fale conosco<Arrow diagonal /></a>
      </div>
    </header>
    <div className="hero-copy">
      <p className="hero-eyebrow">LAVANDERIA EM ITAJAÍ</p>
      <h1><span>Mais cuidado com suas roupas.</span><span>Mais tempo para você.</span></h1>
      <p className="hero-description description-desktop">Tapetes, estofados, cortinas e enxovais. Cuidado com o que faz parte da sua casa, com coleta e entrega.</p>
      <p className="hero-description description-mobile">Cuidado com sua casa e suas peças, com coleta e entrega.</p>
      <div className="hero-actions"><a className="primary-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Pedir orçamento<Arrow /></a><a className="secondary-cta" href="#servicos">Conhecer serviços<Arrow /></a></div>
    </div>
  </div>;
}

