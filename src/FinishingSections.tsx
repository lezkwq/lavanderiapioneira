import type { ReactNode } from 'react';
import './finishing-sections.css';
import business from './data/business.json';
import { FooterSocialLinks, WhatsAppIcon } from './SocialLinks';

const { whatsapp, maps, directions } = business;
const links = [ ['Início', '#inicio'], ['Serviços', '#servicos'], ['Nosso trabalho', '#nosso-trabalho'], ['Como funciona', '#como-funciona'], ['Avaliações', '#avaliacoes'], ['Contato', '#contato'] ] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M5 12h14m-6-6 6 6-6 6'} /></svg>;
}
function ContactLink({ children, href = whatsapp, secondary = false }: { children: ReactNode; href?: string; secondary?: boolean }) {
  return <a className={`white-button${secondary ? ' white-button--outline' : ''}`} href={href} target="_blank" rel="noopener noreferrer">{children}<Arrow diagonal={href !== whatsapp} /></a>;
}
function Pin() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export function FinishingSections() {
  return <div className="white-completion">
    <section className="care-section" aria-labelledby="care-title">
      <div className="completion-container care-layout">
        <div className="care-copy"><p className="completion-eyebrow">O cuidado White</p><h2 id="care-title">Mais cuidado.<br />Mais praticidade.</h2><p className="completion-description">Da lavagem do dia a dia aos cuidados especiais com suas peças, a White ajuda a deixar sua rotina mais leve.</p><ContactLink>Falar com a White</ContactLink></div>
        <img className="care-sculpture" src="/finishing/fabric-water.webp" width="800" height="1000" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
    </section>

    <section id="avaliacoes" className="reviews-section" aria-labelledby="reviews-title">
      <div className="completion-container reviews-layout">
        <div className="reviews-copy"><p className="completion-eyebrow">Avaliações do Google</p><h2 id="reviews-title">Quem conhece,<br />recomenda.</h2><p className="completion-description">Conheça as experiências de quem já passou pela White.</p></div>
        <div className="reviews-invitation">
          <span className="reviews-label">A voz de quem confia</span>
          <div className="reviews-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(star => <svg key={star} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg>)}</div>
          <p>Histórias reais.<br />Direto de quem viveu o cuidado.</p>
          <a className="completion-text-link" href={maps} target="_blank" rel="noopener noreferrer">Ver avaliações no Google<Arrow diagonal /></a>
        </div>
      </div>
    </section>

    <section id="contato" className="location-section" aria-labelledby="location-title">
      <div className="completion-container location-layout">
        <figure className="location-photo"><img src="/finishing/storefront.webp" width="820" height="1400" alt="Fachada da Lavanderia White, com letreiro azul e branco e entrada da loja." loading="lazy" decoding="async" /><figcaption>Lavanderia White · Balneário Camboriú</figcaption></figure>
        <div className="location-copy"><p className="completion-eyebrow">Localização e contato</p><h2 id="location-title">A White pertinho de você.</h2><div className="location-details">
          <div className="location-detail"><span className="location-icon"><Pin /></span><div><h3>Venha nos conhecer</h3><address>{business.address.streetAddress}<br />{business.address.neighborhood}, {business.address.addressLocality} – {business.address.addressRegion}</address></div></div>
          <div className="location-detail"><span className="location-icon"><WhatsAppIcon /></span><div><h3>Converse com a White</h3><a className="location-phone" href={whatsapp} target="_blank" rel="noopener noreferrer">{business.telephoneDisplay}</a></div></div>
          <div className="location-hours"><span className="location-hours-dot" aria-hidden="true" /><p>Consulte nossos horários de atendimento pelo WhatsApp.</p></div>
        </div><div className="location-actions"><ContactLink>Falar com a White</ContactLink><ContactLink href={directions} secondary>Abrir Google Maps</ContactLink></div></div>
      </div>
    </section>

    <section className="closing-section" aria-labelledby="closing-title">
      <div className="completion-container closing-layout">
        <div className="closing-copy"><p className="completion-eyebrow">Mais leveza para o seu dia</p><h2 id="closing-title">Suas roupas merecem esse cuidado.</h2><p className="completion-description">Fale com a White e descubra como podemos facilitar sua rotina.</p><ContactLink>Chamar no WhatsApp</ContactLink></div>
        <img className="closing-rings" src="/finishing/liquid-rings.webp" width="900" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
    </section>

    <footer className="white-footer">
      <div className="completion-container">
        <div className="footer-main"><div className="footer-identity"><a className="footer-signature" href="#inicio" aria-label={`${business.name} — início`}><img className="official-footer-logo" src="/brand/white-official.png" width="422" height="346" alt="White Lavanderia" /></a><p>Cuidado com suas peças.<br />Leveza para sua rotina.</p></div>
          <nav className="footer-navigation" aria-label="Navegação do rodapé"><h3>Explore</h3>{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
          <div className="footer-visit"><h3>Encontre a White</h3><address>{business.address.streetAddress}<br />{business.address.neighborhood}, {business.address.addressLocality} – {business.address.addressRegion}</address><a href={directions} target="_blank" rel="noopener noreferrer">Como chegar<Arrow diagonal /></a></div>
          <div className="footer-contact"><h3>Vamos conversar</h3><FooterSocialLinks /></div>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} {business.name}. Todos os direitos reservados.</p><a href="#inicio">Voltar ao início<Arrow /></a></div>
      </div>
    </footer>
  </div>;
}





