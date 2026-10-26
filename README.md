# Hero Breeze — camiseta, bolhas e nuvens

Projeto local Vite + React + TypeScript + Tailwind. A hero em 100svh tem a animação existente da camiseta, aprovada pelo usuário, complementada por movimento local das bolhas e das nuvens. A câmera fica estática e não há elementos de interface sobre a imagem.

## Executar

Nesta pasta: `pnpm install`, depois `pnpm dev`. O ambiente desta entrega usou o pnpm fornecido pelo runtime do Codex; `.npmrc` evita os links simbólicos bloqueados pelo sandbox. O script de instalação do esbuild precisou ser executado com `node node_modules/esbuild/install.js`.

Prévia: `http://127.0.0.1:5173/`. Diagnóstico: `?t=4` congela a fase; `?sceneMotion=0&t=4` mostra apenas a animação anterior da camiseta, para comparação. No console, `window.__setHeroTime(null)` libera o relógio e `window.__setHeroTime(0)` congela no repouso. O parâmetro antigo `previewBreeze=1` continua compatível, mas deixou de ser necessário.

O relógio usa o tempo real entre quadros ativos. Foi retirado o limite antigo de 50 ms que alongava o ciclo sob carga; a trajetória e a intensidade da camiseta permanecem idênticas. As pausas por aba, viewport e acessibilidade continuam resetando a referência do relógio. O relatório atual está em `../scene-validation/RELATORIO.md`.

Verificação local: `node scripts/checks.cjs` executa TypeScript, build e lint, interrompendo no primeiro erro. Os comandos usuais `pnpm build` e `pnpm lint` também estão declarados no package.json.

## Arquivos

- `src/assets/*-original.jpg`: cópias das imagens anexadas, preservadas.
- `scripts/hero-layers/segment.py`: tentativa rembg/ISNet. Neste ambiente, a importação do ONNX Runtime causa uma violação de acesso nativa do Windows.
- `scripts/hero-layers/contours.json`: polígonos e dicas de pontos anotados nas imagens reais, sem dados externos.
- `scripts/hero-layers/refine.py`: GrabCut com marcadores derivados do polígono, remoção de ilhas, fechamento de buracos e borda suave.
- `scripts/hero-layers/background.py`: comparação Telea, Navier–Stokes e cópia de uma área conferida de nuvens. Nenhum resultado foi aprovado.
- `scripts/hero-layers/export.py`: WebP e metadados. As dicas dos pontos são projetadas sobre a máscara; a barra usa os pixels inferiores das colunas amostradas. Não são medições físicas dos prendedores.
- `public/hero/`: camadas **provisórias**, com `backgroundApproved: false` nos metadados.
- `src/HeroBreeze.tsx`: imagem LCP/fallback, seleção por proporção e ciclo de vida.
- `src/renderer.ts`: WebGL2 sem biblioteca, malha 32×40, alfa pré-multiplicado no upload, iluminação pela divergência.
- `src/motion.ts`: constantes e função periódica GLSL.
- `src/sceneMotion.ts`: movimento independente das bolhas e nuvens, sincronizado ao mesmo relógio de 8 s. Não modifica o movimento da camiseta.
- `scripts/hero-layers/scene-masks.py`: gera os controles locais de nuvens e as proteções do sol, corda e prendedores. Não reexporta a camiseta nem os fundos existentes.
- `public/hero/*-scene.*`: controles de movimento e coordenadas observadas das bolhas para cada variante.
- `scripts/check-scene-loop.cjs`: posições e velocidades nas extremidades do ciclo.
- `scripts/validate-scene.cjs`: comparação com capturas anteriores, loop em pixels, passos de 1/30 s, medições de frame e comportamento no Chromium.
- `scripts/smoke.cjs`: teste Chromium com Playwright já disponível; não instala navegadores. Os caminhos de Playwright/Chrome são os desta máquina.

Os scripts Python usam Pillow/NumPy e as dependências offline em `../../work/python-deps` em relação a esta pasta. Rode os scripts a partir da pasta da conversa, mantendo a estrutura entregue: `python outputs/hero-breeze/scripts/hero-layers/refine.py`, depois `background.py` e `export.py`. `segment.py` é uma tentativa separada que falhou neste ambiente.

## Histórico e limites

`../RELATORIO.md` documenta a primeira entrega e seus defeitos de recorte/fundo. O usuário aprovou posteriormente a animação existente e pediu que fosse preservada exatamente; por isso esses assets e o movimento da camiseta foram mantidos. A atualização adiciona somente movimento à cena. O campo histórico `backgroundApproved: false` nos metadados não participa do runtime e foi conservado sem reescrever os arquivos antigos. Veja `../scene-validation/` para as evidências da atualização.
