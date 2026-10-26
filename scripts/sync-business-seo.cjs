// Refresh static, crawler-readable metadata after editing src/data/business.json.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const business = JSON.parse(fs.readFileSync(path.join(root, 'src/data/business.json'), 'utf8'));
const { neighborhood, ...address } = business.address;
const title = `${business.name} | ${address.addressLocality}, ${address.addressRegion}`;
const description = `${business.name} em ${neighborhood}, ${address.addressLocality}. Desde 2008, cuidando de tapetes, estofados, cortinas e enxovais, com coleta e entrega. WhatsApp: ${business.whatsappTelephoneDisplay}.`;
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const schema = {
  '@context': 'https://schema.org', '@type': 'DryCleaningOrLaundry',
  name: business.name, telephone: business.telephone, foundingDate: String(business.founded),
  address: { '@type': 'PostalAddress', ...address },
  hasMap: business.maps, sameAs: [business.instagram, business.maps],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Serviços de lavanderia',
    itemListElement: business.services.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
};
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(title)}</title>`)
  .replace(/<meta name="description"[^>]*\/?\s*>/, `<meta name="description" content="${escapeAttribute(description)}"/>`)
  .replace(/\s*<!-- business metadata:start -->[\s\S]*?<!-- business metadata:end -->/, '');
const metadata = `\n<!-- business metadata:start -->
<meta property="og:type" content="website"/>
<meta property="og:locale" content="pt_BR"/>
<meta property="og:site_name" content="${escapeAttribute(business.name)}"/>
<meta property="og:title" content="${escapeAttribute(title)}"/>
<meta property="og:description" content="${escapeAttribute(description)}"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="${escapeAttribute(title)}"/>
<meta name="twitter:description" content="${escapeAttribute(description)}"/>
<script type="application/ld+json">${JSON.stringify(schema, null, 2).replaceAll('<', '\\u003c')}</script>
<!-- business metadata:end -->\n`;
fs.writeFileSync(file, html.replace('</head>', `${metadata}</head>`));
console.log('SEO e dados estruturados sincronizados com src/data/business.json.');
