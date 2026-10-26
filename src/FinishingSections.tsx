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
  return <a className={`pioneira-button${secondary ? ' pioneira-button--outline' : ''}`} href={href} target="_blank" rel="noopener noreferrer">{children}<Arrow diagonal={href !== whatsapp} /></a>;
}
function Pin() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export function FinishingSections() {
  return <div className="pioneira-completion">
    <section className="care-section" aria-labelledby="care-title">
      <div className="completion-container care-layout">
        <div className="care-copy"><p className="completion-eyebrow">O cuidado Pioneira</p><h2 id="care-title">Desde 2008,<br />cuidando de Itajaí.</h2><p className="completion-description">A Pioneira faz parte da história de Itajaí desde 2008. Processo, cuidado e confiança em cada detalhe, do tapete da sua casa ao enxoval da sua empresa.</p><ContactLink>Falar com a Pioneira</ContactLink></div>
        <img className="care-sculpture" src="/finishing/fabric-water.webp" width="800" height="1000" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
    </section>

    <section id="avaliacoes" className="reviews-section" aria-labelledby="reviews-title">
      <div className="completion-container reviews-layout">
        <div className="reviews-copy"><p className="completion-eyebrow">Avaliações do Google</p><h2 id="reviews-title">Quem conhece,<br />recomenda.</h2><p className="completion-description">O carinho de quem já confiou suas peças à Pioneira.</p></div>
        <div className="reviews-invitation">
          <span className="reviews-label">4,9 no Google · 76 avaliações</span>
          <div className="reviews-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(star => <svg key={star} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg>)}</div>
          <p>Cuidado que vira recomendação.</p>
          <a className="completion-text-link" href={maps} target="_blank" rel="noopener noreferrer">Ver avaliações no Google<Arrow diagonal /></a>
        </div>
        <div className="review-cards">
          <figure><blockquote>“Amei, meu tapete ficou como novo e com um cheirinho super agradável! Indicarei sempre!”</blockquote><figcaption>Tamiles Luz <span>Avaliação no Google</span></figcaption></figure>
          <figure><blockquote>“Sou cliente a bastante tempo, atendimento nota 1000, tanto nas lavagens quando na higienização, fica tudo limpinho e cheiroso, preço justo pelo trabalho que entregam. Recomendo muito, só levamos e chamamos eles!!”</blockquote><figcaption>Renata Ferreira Popuniski <span>Avaliação no Google</span></figcaption></figure>
          <figure><blockquote>“Ótimo atendimento. Delivery muito bom e educado. Recomendo”</blockquote><figcaption>Ana Paula <span>Avaliação no Google</span></figcaption></figure>
        </div>
      </div>
    </section>

    <section id="contato" className="location-section" aria-labelledby="location-title">
      <div className="completion-container location-layout">
        <figure className="location-photo"><img src="/finishing/pioneira-fachada.webp" width="1561" height="1008" alt="Fachada da Lavanderia Pioneira na Rua Egon Müler, em Itajaí." loading="lazy" decoding="async" /><figcaption>Lavanderia Pioneira · Ressacada, Itajaí</figcaption></figure>
        <div className="location-copy"><p className="completion-eyebrow">Localização e contato</p><h2 id="location-title">A Pioneira pertinho de você.</h2><div className="location-details">
          <div className="location-detail"><span className="location-icon"><Pin /></span><div><h3>Venha nos conhecer</h3><address>{business.address.streetAddress}<br />{business.address.neighborhood}, {business.address.addressLocality}, {business.address.addressRegion}</address></div></div>
          <div className="location-detail"><span className="location-icon"><WhatsAppIcon /></span><div><h3>Converse com a Pioneira</h3><a className="location-phone" href={whatsapp} target="_blank" rel="noopener noreferrer">{business.whatsappTelephoneDisplay}</a><br /><a className="location-phone" href={`tel:${business.telephone}`}>Telefone: {business.telephoneDisplay}</a></div></div>
          <div className="location-hours"><span className="location-hours-dot" aria-hidden="true" /><p>Segunda a quinta: 8h às 12h e 13h15 às 18h.<br />Sexta: 8h às 12h e 13h15 às 17h.</p></div>
        </div><div className="location-actions"><ContactLink>Falar com a Pioneira</ContactLink><ContactLink href={directions} secondary>Abrir Google Maps</ContactLink></div></div>
      </div>
    </section>

    <section className="closing-section" aria-labelledby="closing-title">
      <div className="completion-container closing-layout">
        <div className="closing-copy"><p className="completion-eyebrow">Mais leveza para o seu dia</p><h2 id="closing-title">Mais cuidado com sua casa.<br />Mais tempo para você.</h2><p className="completion-description">Seu tapete, seu sofá, seu enxoval. Conte o que você precisa e deixe a Pioneira cuidar dos próximos passos.</p><ContactLink>Chamar no WhatsApp</ContactLink></div>
        <img className="closing-rings" src="/finishing/liquid-rings.webp" width="900" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
    </section>

    <footer className="pioneira-footer">
      <div className="completion-container">
        <div className="footer-main"><div className="footer-identity"><a className="footer-signature" href="#inicio" aria-label={`${business.name} início`}><img className="official-footer-logo" src="/brand/pioneira-symbol.png" width="1080" height="1080" alt="" /><span className="pioneira-wordmark"><span>Lavanderia</span><strong>Pioneira</strong><small>Desde 2008</small></span></a><p>Cuidado com suas peças.<br />Leveza para sua rotina.</p></div>
          <nav className="footer-navigation" aria-label="Navegação do rodapé"><h3>Explore</h3>{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
          <div className="footer-visit"><h3>Encontre a Pioneira</h3><address>{business.address.streetAddress}<br />{business.address.neighborhood}, {business.address.addressLocality}, {business.address.addressRegion}</address><a href={directions} target="_blank" rel="noopener noreferrer">Como chegar<Arrow diagonal /></a></div>
          <div className="footer-contact"><h3>Vamos conversar</h3><FooterSocialLinks /></div>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} {business.name}. Todos os direitos reservados.</p><a href="#inicio">Voltar ao início<Arrow /></a></div>
      </div>
    </footer>
  </div>;
}





