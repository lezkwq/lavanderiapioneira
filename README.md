# Hero com vídeo

Projeto Vite + React + TypeScript + Tailwind. A hero usa um vídeo MP4 sem áudio,
com reprodução automática, inline e em loop. O conteúdo de HeroInterface.tsx foi
preservado.

## Executar

- `pnpm install --frozen-lockfile --ignore-scripts`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`

A configuração .npmrc usa dependências sem links simbólicos e um cache dentro de
node_modules para compatibilidade com este ambiente Windows. O lockfile foi mantido.

## Hero

- `src/HeroBreeze.tsx`: seleciona desktop quando largura >= altura; caso contrário,
  mobile. Somente a variante selecionada é inserida na página.
- `public/hero/desktop.mp4`: horizontal, 1280x720.
- `public/hero/mobile.mp4`: vertical, 720x1280.
- `public/hero/desktop.webp` e `mobile.webp`: primeiro quadro dos originais,
  exportado como WebP sem perdas adicionais.
- A capa aparece durante o carregamento e após falha de reprodução. Com a
  preferência por menos movimento, nenhum elemento de vídeo é criado.
- A escolha é atualizada ao mudar a proporção da janela. Não há canvas ou WebGL.

Os vídeos foram preparados com FFmpeg 7.1: libx264, preset veryslow, CRF 21,
yuv420p, faststart, sem áudio e sem alterar dimensões, duração ou taxa de quadros.
Também foi avaliado CRF 24; o CRF 21 foi escolhido para preservar mais detalhes.
Os originais externos ao projeto não foram modificados.

## Verificação

`node scripts/checks.cjs` verifica TypeScript, build e lint.
Com o servidor local aberto, `node scripts/validate-interface.cjs` verifica seleção
de vídeo, reprodução, loop, menos movimento, falhas e menu. As capturas e o JSON
ficam fora do repositório, na pasta outputs desta conversa.
