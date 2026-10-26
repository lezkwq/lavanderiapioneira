import './how-it-works.css';

const steps = [
  { title: 'Entre em contato', description: 'Chame nossa equipe pelo WhatsApp.', icon: 'message' },
  { title: 'Conte o que precisa', description: 'Informe quais peças ou serviços você procura.', icon: 'clothes' },
  { title: 'Combine os detalhes', description: 'Nossa equipe orienta você sobre o atendimento.', icon: 'check' },
] as const;

function StepIcon({ name }: { name: typeof steps[number]['icon'] }) {
  return <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'message' && <><path d="M23 13a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L4 23l1.8-5.7A9 9 0 1 1 23 13Z" /><path d="M9 11h9m-9 4h6" /></>}
    {name === 'clothes' && <><path d="m10 5-5 3-3 5 5 2 2-3v12h10V12l2 3 5-2-3-5-5-3c-1 4-7 4-8 0Z" /></>}
    {name === 'check' && <><path d="M10 5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" /><rect x="10" y="3" width="8" height="5" rx="2" /><path d="m9 16 3 3 7-7" /></>}
  </svg>;
}

export function HowItWorks() {
  return <section id="como-funciona" className="how-section" aria-labelledby="how-title">
    <div className="how-container">
      <div className="how-heading">
        <p className="how-eyebrow">Como funciona</p>
        <h2 id="how-title">Cuidar das suas roupas ficou mais simples.</h2>
        <p className="how-description">Conte com a White para facilitar sua rotina.</p>
      </div>
      <div className="how-layout">
        <div className="how-mascot"><img src="/how-it-works/white-mascot.webp" width="800" height="800" alt="Mascote da White: uma gota azul sorridente fazendo sinal de positivo." loading="lazy" decoding="async" /></div>
        <div className="how-process">
          <ol className="how-timeline">
            {steps.map((step, index) => <li className="how-step" key={step.icon}>
              <span className="how-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="how-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
              <span className="how-step-icon"><StepIcon name={step.icon} /></span>
            </li>)}
          </ol>
          <a className="how-contact" href="https://wa.me/5547997265636" target="_blank" rel="noopener noreferrer">Falar com a White<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg><span className="how-sr-only"> pelo WhatsApp (abre em nova aba)</span></a>
        </div>
      </div>
    </div>
  </section>;
}
