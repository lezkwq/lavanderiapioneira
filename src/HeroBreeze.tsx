import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { HeroInterface } from './HeroInterface';

const landscape = '(min-aspect-ratio: 1/1)';
const reducedMotion = '(prefers-reduced-motion: reduce)';
const subscribe = (query: string, callback: () => void) => {
  const media = matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const subscribeOrientation = (callback: () => void) => subscribe(landscape, callback);
const subscribeMotion = (callback: () => void) => subscribe(reducedMotion, callback);
const getOrientation = () => matchMedia(landscape).matches ? 'desktop' : 'mobile';
const getReducedMotion = () => matchMedia(reducedMotion).matches;
const asset = (variant: string, extension: string) => `${import.meta.env.BASE_URL}hero/${variant}.${extension}`;

function HeroBackground({ variant, reduced }: { variant: string; reduced: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let disposed = false;
    element.muted = true;
    void element.play().catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; element.pause(); };
  }, []);

  return <>
    <img className="hero-poster" src={asset(variant, 'webp')} alt="Camiseta branca presa a um varal, com céu azul, nuvens e bolhas de sabão" fetchPriority="high" />
    {!reduced && !failed && <video
      ref={video}
      className="hero-video"
      src={asset(variant, 'mp4')}
      poster={asset(variant, 'webp')}
      autoPlay muted loop playsInline preload="auto"
      aria-hidden="true"
      data-visible={playing}
      onPlaying={() => setPlaying(true)}
      onWaiting={() => setPlaying(false)}
      onError={() => setFailed(true)}
    />}
  </>;
}

export function HeroBreeze() {
  const variant = useSyncExternalStore(subscribeOrientation, getOrientation);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion);
  return <main id="inicio" className="hero isolate" aria-label="Lavanderia Pioneira" data-variant={variant}>
    <HeroBackground key={`${variant}-${reduced}`} variant={variant} reduced={reduced} />
    <HeroInterface />
  </main>;
}
