import './services.css';
import business from './data/business.json';

const services = [
  { title: 'Tapetes', description: 'Da avaliação à finalização, cada etapa importa para cuidar do tapete que faz parte da sua casa.', icon: 'carpet' },
  { title: 'Estofados e colchões', description: 'Higienização de sofás, poltronas, cadeiras, puffs e colchões. Mais cuidado com os lugares onde a vida acontece.', icon: 'sofa' },
  { title: 'Cortinas e persianas', description: 'Atenção aos tecidos que vestem suas janelas e fazem parte do conforto do seu ambiente.', icon: 'curtains' },
  { title: 'Edredons e enxovais', description: 'Seu descanso também merece cuidado. Lavagem e higienização de edredons e peças do enxoval.', icon: 'bedding' },
  { title: 'Uniformes e empresas', description: 'Cuidado com uniformes esportivos e operacionais, enxovais de hotelaria e capas de elevador.', icon: 'clothes' },
  { title: 'Coleta e entrega', description: 'O cuidado da Pioneira chega até você. Consulte o atendimento e as condições para o seu endereço.', icon: 'delivery' },
] as const;

function ServiceIcon({ name }: { name: typeof services[number]['icon'] }) {
  const paths = {
    carpet: <><rect x="5" y="6" width="26" height="24" rx="2" /><path d="M10 11h16v14H10zM9 2v4m6-4v4m6-4v4m6-4v4M9 30v4m6-4v4m6-4v4m6-4v4" /></>,
    sofa: <><path d="M7 15V9a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v6M8 20h20M5 15a3 3 0 0 1 3 3v8h20v-8a3 3 0 1 1 6 0v11H2V18a3 3 0 0 1 3-3ZM7 29v3m22-3v3" /></>,
    clothes: <><path d="m11 5-5 3-3 6 5 2 2-3v16h16V13l2 3 5-2-3-6-5-3c-1 4-9 4-10 0Z" /><path d="M14 5c0 3 6 3 6 0" /></>,
    bedding: <><rect x="5" y="5" width="24" height="25" rx="3" /><path d="M5 14h24M12 5v9m10-9v9M10 20h5m5 0h4M10 25h5m5 0h4" /></>,
    curtains: <><path d="M3 6h28M6 6v24h10V6m3 0v24h10V6M6 21c5-2 7-7 10-15m3 0c2 8 5 13 10 15M10 11v7m15-7v7" /><path d="M6 23h5m13 0h5" /></>,
    delivery: <><path d="M3 8h18v18H3V8Zm18 7h6l5 6v5H21M3 16h9m-9 5h6" /><path d="M25 15v6h7" /><circle cx="9" cy="27" r="3" /><circle cx="26" cy="27" r="3" /></>,
  };
  return <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function ServicesSection() {
  return <section id="servicos" className="services-section" aria-labelledby="services-title">
    <div className="services-container">
      <div className="services-heading">
        <div className="services-intro">
          <p className="section-eyebrow">Nossos serviços</p>
          <h2 id="services-title">Cuidado em cada detalhe.</h2>
          <p className="section-description">Do tapete da sala ao enxoval da sua empresa, encontre o cuidado que você precisa.</p>
        </div>
        <img className="services-bubbles" src="/services/bubbles.webp" width="640" height="640" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
      <div className="services-grid">
        {services.map(service => <article className="service-card" key={service.icon}>
          <div className="service-icon"><ServiceIcon name={service.icon} /></div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <a className="service-link" href={`${business.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o serviço de ${service.title.toLocaleLowerCase('pt-BR')}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${service.title.toLocaleLowerCase('pt-BR')} pelo WhatsApp (abre em nova aba)`}>
            Consultar serviço
            <span className="service-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
          </a>
        </article>)}
      </div>
    </div>
  </section>;
}
