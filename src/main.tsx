import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroBreeze } from './HeroBreeze';
import './style.css';
import { ServicesSection } from './ServicesSection';
import { WorkGallery } from './WorkGallery';
import { HowItWorks } from './HowItWorks';
import { FinishingSections } from './FinishingSections';
import { FloatingWhatsApp } from './SocialLinks';
createRoot(document.getElementById('root')!).render(<StrictMode><HeroBreeze /><ServicesSection /><WorkGallery /><HowItWorks /><FinishingSections /><FloatingWhatsApp /></StrictMode>);
import './official-logo.css';

