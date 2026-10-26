import './how-it-works.css';
import business from './data/business.json';

const steps = [
  { title: 'Conte o que precisa', description: 'Envie uma mensagem e conte quais peças ou ambientes precisam de cuidado.', icon: 'message' },
  { title: 'Combine o atendimento', description: 'Nossa equipe orienta sobre o serviço, o orçamento e as opções de coleta e entrega.', icon: 'clothes' },
  { title: 'Deixe o cuidado com a gente', description: 'Com os detalhes combinados, suas peças seguem para o atendimento da Pioneira.', icon: 'check' },
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
        <h2 id="how-title">Seu cuidado começa por uma conversa.</h2>
        <p className="how-description">A gente cuida dos detalhes para facilitar o seu dia.</p>
      </div>
      <div className="how-layout">
        <div className="how-mascot"><img src="/how-it-works/blue-drop.webp" width="800" height="800" alt="Gota azul sorridente fazendo sinal de positivo." loading="lazy" decoding="async" /></div>
        <div className="how-process">
          <ol className="how-timeline">
            {steps.map((step, index) => <li className="how-step" key={step.icon}>
              <span className="how-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="how-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
              <span className="how-step-icon"><StepIcon name={step.icon} /></span>
            </li>)}
          </ol>
          <details className="carpet-process">
            <summary>Como cuidamos dos tapetes</summary>
            <p>Um processo em 10 etapas, conforme o método apresentado pela Pioneira.</p>
            <ol>
              <li><strong>Detecção de sujidades.</strong> Identificação dos pontos que precisam de atenção.</li>
              <li><strong>Teste químico.</strong> Avaliação da compatibilidade da peça com os produtos.</li>
              <li><strong>Batedor.</strong> Preparação do tapete para a lavagem.</li>
              <li><strong>Escovação.</strong> Aplicação dos produtos e escovação da peça.</li>
              <li><strong>Enxágue.</strong> Retirada dos resíduos da lavagem.</li>
              <li><strong>Centrifugação.</strong> Remoção do excesso de água.</li>
              <li><strong>Controle de qualidade.</strong> Conferência do resultado da lavagem.</li>
              <li><strong>Estufa.</strong> Etapa de secagem do tapete.</li>
              <li><strong>Nova conferência.</strong> Controle da qualidade da secagem.</li>
              <li><strong>Finalização.</strong> Preparação da peça para a entrega.</li>
            </ol>
          </details>
          <a className="how-contact" href={business.whatsapp} target="_blank" rel="noopener noreferrer">Falar com a Pioneira<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg><span className="how-sr-only"> pelo WhatsApp (abre em nova aba)</span></a>
        </div>
      </div>
    </div>
  </section>;
}
