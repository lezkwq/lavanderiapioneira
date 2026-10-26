import './services.css';

const services = [
  { title: 'Lavagem de roupas', description: 'Cuidado com as roupas do dia a dia, respeitando as características de cada tecido.', icon: 'clothes' },
  { title: 'Passadoria', description: 'Atenção às dobras e aos detalhes para o acabamento das suas peças.', icon: 'iron' },
  { title: 'Edredons e cobertores', description: 'Cuidados com suas peças de cama, dos tecidos ao preenchimento.', icon: 'bedding' },
  { title: 'Cortinas', description: 'Limpeza e cuidado para os tecidos que fazem parte da sua casa.', icon: 'curtains' },
  { title: 'Higienização de tênis', description: 'Limpeza com atenção aos materiais e aos detalhes de cada par.', icon: 'shoe' },
  { title: 'Coleta e entrega', description: 'Mais praticidade na sua rotina. Consulte as condições para o seu endereço.', icon: 'delivery' },
] as const;

function ServiceIcon({ name }: { name: typeof services[number]['icon'] }) {
  const paths = {
    clothes: <><path d="m11 5-5 3-3 6 5 2 2-3v16h16V13l2 3 5-2-3-6-5-3c-1 4-9 4-10 0Z" /><path d="M14 5c0 3 6 3 6 0" /></>,
    iron: <><path d="M5 20h25l-3-9a4 4 0 0 0-4-3h-8M5 20l-2 7h28l-1-7M14 13h9l2 7" /><path d="M8 13V8a3 3 0 0 0-3-3H3M12 24h1m5 0h1m5 0h1" /></>,
    bedding: <><rect x="5" y="5" width="24" height="25" rx="3" /><path d="M5 14h24M12 5v9m10-9v9M10 20h5m5 0h4M10 25h5m5 0h4" /></>,
    curtains: <><path d="M3 6h28M6 6v24h10V6m3 0v24h10V6M6 21c5-2 7-7 10-15m3 0c2 8 5 13 10 15M10 11v7m15-7v7" /><path d="M6 23h5m13 0h5" /></>,
    shoe: <><path d="m7 10 6 7 6 2 6 1c4 1 6 3 6 6v2H4a2 2 0 0 1-2-2v-7l3-9Z" /><path d="M3 24h27M13 17l-2 3m7-2-2 3m6-1-2 3M6 13l-3 4" /></>,
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
          <h2 id="services-title">Cada peça merece<br className="services-heading-break" /> um cuidado especial.</h2>
          <p className="section-description">Da lavagem do dia a dia aos cuidados especiais com suas peças, conheça os serviços da White Lavanderia.</p>
        </div>
        <img className="services-bubbles" src="/services/bubbles.webp" width="640" height="640" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      </div>
      <div className="services-grid">
        {services.map(service => <article className="service-card" key={service.icon}>
          <div className="service-icon"><ServiceIcon name={service.icon} /></div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <a className="service-link" href={`https://wa.me/5547997265636?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o serviço de ${service.title.toLocaleLowerCase('pt-BR')}.`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${service.title.toLocaleLowerCase('pt-BR')} pelo WhatsApp (abre em nova aba)`}>
            Consultar serviço
            <span className="service-arrow"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
          </a>
        </article>)}
      </div>
    </div>
  </section>;
}
