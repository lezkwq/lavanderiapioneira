# Lavanderia White — site completo atualizado

Esta entrega inclui o código completo, imagens, fontes, ícones, logotipo oficial,
dados da empresa, configurações e a versão compilada em dist/.
Inclui os últimos ajustes: ícones sociais, WhatsApp fixo no mobile e favicons.

## Rodar localmente
Instale uma versão do Node.js compatível com Vite 7 (Node 22.12+ ou 24 LTS).
Abra um terminal na pasta lavanderia-white e execute:

    npm install
    npm run dev

Abra a URL exibida no terminal (normalmente http://127.0.0.1:5173/).

## Compilar e verificar
    npm run build
    npm run lint
    npm run preview

TypeScript, build e lint passaram na última validação local. Desktop e mobile
foram conferidos no Chromium emulado; não houve teste em aparelhos físicos.

## Arquivos principais
- src/: componentes, estilos e motor WebGL da hero.
- public/: imagens, fontes locais, logo, favicons e ícones de app.
- src/data/business.json: contatos oficiais da Lavanderia White.
- docs/lavanderia white.md: levantamento original da empresa.
- index.html: metadados e dados estruturados estáticos.
- dist/: build de produção atualizado, pronto para hospedagem estática.
- scripts/: verificações e scripts auxiliares históricos de preparação de assets.

O site já usa os assets finais: não é necessário executar os scripts de imagens.
Alguns desses scripts auxiliares e testes históricos apontam para ferramentas
do ambiente original do Codex; não são necessários para instalar, rodar ou compilar.
O README.md anterior contém o histórico inicial da hero; este LEIA-ME descreve
a entrega completa atual.

Não foram incluídos node_modules, caches ou arquivos temporários.
Para publicar dist/, use uma hospedagem estática; não abra index.html por file://.
Nota/quantidade de avaliações e horários não confirmados permanecem omitidos.
