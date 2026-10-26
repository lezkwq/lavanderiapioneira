import { useEffect, useRef, useState } from 'react';
import './work-gallery.css';

const photographs = [
  { id: 'bedroom', file: 'enxoval-tapete', caption: 'Enxoval e tapetes. Cuidado que acompanha o descanso.', alt: 'Quarto com cama arrumada, enxoval claro e tapete de tons neutros.', width: 1127, height: 1395 },
  { id: 'living', file: 'estofados-cortinas', caption: 'Estofados e cortinas. Conforto em cada canto da casa.', alt: 'Sala com sofá azul, poltronas, cortinas claras e tapete.', width: 1134, height: 1387 },
] as const;

function GalleryArrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === 'left' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} /></svg>;
}

export function WorkGallery() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const opener = useRef(0);
  const photo = active === null ? null : photographs[active];

  useEffect(() => {
    if (active === null) return;
    const modal = dialog.current!;
    if (!modal.open) modal.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [active]);

  function close() {
    dialog.current?.close();
    setActive(null);
    triggers.current[opener.current]?.focus({ preventScroll: true });
  }
  function advance(direction: number) {
    setActive(current => current === null ? null : (current + direction + photographs.length) % photographs.length);
  }

  return <section id="nosso-trabalho" className="work-section" aria-labelledby="work-title">
    <div className="work-container">
      <div className="work-heading">
        <div><p className="work-eyebrow">Sua casa, bem cuidada</p><h2 id="work-title">Seu conforto merece esse cuidado.</h2></div>
        <p className="work-description">No quarto, na sala e nos detalhes.<br /> A Pioneira cuida do que faz parte da sua vida.</p>
      </div>
      <div className="work-mosaic">
        {photographs.map((item, index) => <figure className={`work-photo work-photo--${item.id}`} key={item.id}>
          <button className="work-photo-trigger" type="button" ref={element => { triggers.current[index] = element; }} aria-label={`Ampliar fotografia: ${item.caption}`} aria-haspopup="dialog" onClick={() => { opener.current = index; setActive(index); }}>
            <img src={`/work/${item.file}.webp`} width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
            <span className="work-expand" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 5h5v5M19 5l-6 6M10 19H5v-5m0 5 6-6" /></svg></span>
          </button>
          <figcaption>{item.caption}</figcaption>
        </figure>)}
      </div>
    </div>
    <dialog ref={dialog} className="work-lightbox" aria-labelledby="work-lightbox-caption" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); } }}>
      {photo && <div className="work-lightbox-content">
        <button className="work-lightbox-close" type="button" aria-label="Fechar visualização ampliada" onClick={close} autoFocus><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        <img className="work-lightbox-image" src={`/work/${photo.file}.webp`} alt={photo.alt} width={photo.width} height={photo.height} />
        <div className="work-lightbox-footer">
          <p id="work-lightbox-caption" aria-live="polite">{photo.caption}<span>{active! + 1} / {photographs.length}</span></p>
          <div className="work-lightbox-navigation"><button type="button" aria-label="Fotografia anterior" onClick={() => advance(-1)}><GalleryArrow direction="left" /></button><button type="button" aria-label="Próxima fotografia" onClick={() => advance(1)}><GalleryArrow /></button></div>
        </div>
      </div>}
    </dialog>
  </section>;
}
