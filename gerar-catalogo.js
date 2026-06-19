/* ============================================================================
 *  GERADOR DO CATÁLOGO  -  Produtos Originais Importados
 *  --------------------------------------------------------------------------
 *  Escaneia as pastas de "imagens/" e gera o arquivo "produtos.js" que o
 *  catálogo (index.html) usa para montar os cards.
 *
 *  COMO USAR:
 *    1) Coloque as fotos (.jpg) dentro das pastas de cada categoria:
 *         imagens/perfumes-masculinos/
 *         imagens/perfumes-femininos/
 *         imagens/eletronicos/
 *         imagens/promocoes/
 *    2) Dê dois cliques em "atualizar-catalogo.bat"  (ou rode: node gerar-catalogo.js)
 *    3) Abra o "index.html".  Pronto - as fotos novas aparecem.
 *
 *  Gerar imagens de demonstração (placeholders) novamente:
 *         node gerar-catalogo.js --demos
 * ========================================================================== */

'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const DIR_IMAGENS = path.join(RAIZ, 'imagens');
const SAIDA = path.join(RAIZ, 'produtos.js');

// Ordem e rótulos das categorias (= itens do menu e dos filtros)
const CATEGORIAS = [
  { id: 'perfumes-masculinos', titulo: 'Perfumes Masculinos' },
  { id: 'perfumes-femininos',  titulo: 'Perfumes Femininos'  },
  { id: 'eletronicos',         titulo: 'Eletrônicos'         },
  { id: 'promocoes',           titulo: 'Promoções'           },
];

const EXT_IMAGEM = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

/* ---------------------------------------------------------------- utilidades */

// Garante que as pastas existam
function garantirPastas() {
  if (!fs.existsSync(DIR_IMAGENS)) fs.mkdirSync(DIR_IMAGENS, { recursive: true });
  for (const c of CATEGORIAS) {
    const p = path.join(DIR_IMAGENS, c.id);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
}

// Ordenação "natural" (_demo-2 antes de _demo-10)
function ordenarNatural(a, b) {
  return a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' });
}

// Deriva um nome legível do arquivo - usado apenas para BUSCA (não é exibido)
function derivarNome(arquivo) {
  let n = arquivo.replace(/\.[^.]+$/, '');           // remove extensão
  n = n.replace(/^_?demo[-_ ]?\d*[-_ ]?/i, '');        // remove prefixo de demo
  n = n.replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!n) return arquivo;
  n = n.replace(/\b\p{L}/gu, (c) => c.toUpperCase());  // Title Case (com acentos)
  return n;
}

/* --------------------------------------------------------- escaneia produtos */

function lerCategoria(cat) {
  const dir = path.join(DIR_IMAGENS, cat.id);
  let arquivos = [];
  try {
    arquivos = fs.readdirSync(dir)
      .filter((f) => EXT_IMAGEM.has(path.extname(f).toLowerCase()))
      .sort(ordenarNatural);
  } catch (_) { /* pasta ainda não existe */ }

  const itens = arquivos.map((f) => ({
    img: `imagens/${cat.id}/${f}`,
    nome: derivarNome(f),
  }));

  return { id: cat.id, titulo: cat.titulo, itens };
}

function gerarManifesto() {
  const catalogo = {};
  let total = 0;
  for (const c of CATEGORIAS) {
    const r = lerCategoria(c);
    catalogo[c.id] = { titulo: r.titulo, itens: r.itens };
    total += r.itens.length;
    console.log(`  • ${r.titulo.padEnd(22)} ${r.itens.length} produto(s)`);
  }

  const cabecalho =
`/* ============================================================================
 *  ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE À MÃO.
 *  Para atualizar: adicione fotos em "imagens/<categoria>/" e rode
 *  "atualizar-catalogo.bat" (ou: node gerar-catalogo.js).
 *  Gerado em: ${new Date().toLocaleString('pt-BR')}
 * ========================================================================== */
window.CATALOGO = `;

  const corpo = JSON.stringify(catalogo, null, 2);
  fs.writeFileSync(SAIDA, `${cabecalho}${corpo};\n`, 'utf8');
  console.log(`\n✓ produtos.js gerado - ${total} produto(s) no total.`);
  return total;
}

/* ------------------------------------------------- imagens de demonstração */
/*  SVGs premium (fundo grafite + dourado) com NOME e PREÇO embutidos na
 *  imagem - exatamente como serão as fotos reais. Substitua-as pelos seus JPEGs. */

const ICONES = {
  'bottle-m':
    '<rect x="-26" y="-120" width="52" height="30" rx="3"/>' +
    '<rect x="-13" y="-94" width="26" height="20"/>' +
    '<rect x="-58" y="-76" width="116" height="176" rx="14"/>' +
    '<line x1="-40" y1="2" x2="40" y2="2"/>',
  'bottle-f':
    '<ellipse cx="0" cy="-104" rx="18" ry="20"/>' +
    '<rect x="-9" y="-90" width="18" height="16"/>' +
    '<ellipse cx="0" cy="26" rx="64" ry="76"/>',
  'earbuds':
    '<circle cx="-46" cy="-34" r="26"/><rect x="-54" y="-10" width="16" height="74" rx="8"/>' +
    '<circle cx="46" cy="-34" r="26"/><rect x="38" y="-10" width="16" height="74" rx="8"/>',
  'watch':
    '<rect x="-46" y="-46" width="92" height="92" rx="24"/>' +
    '<rect x="-30" y="-92" width="60" height="48" rx="12"/>' +
    '<rect x="-30" y="44" width="60" height="48" rx="12"/>' +
    '<rect x="46" y="-12" width="10" height="24" rx="3"/>' +
    '<circle cx="0" cy="0" r="4"/>',
  'headphone':
    '<path d="M-82 24 A82 92 0 0 1 82 24"/>' +
    '<rect x="-98" y="14" width="34" height="66" rx="14"/>' +
    '<rect x="64" y="14" width="34" height="66" rx="14"/>',
  'phone':
    '<rect x="-50" y="-112" width="100" height="224" rx="18"/>' +
    '<rect x="-38" y="-92" width="76" height="170" rx="6"/>' +
    '<circle cx="0" cy="96" r="6"/>',
};

function buildSVG(p) {
  const icon = ICONES[p.icon] || ICONES['bottle-m'];
  const promoRibbon = p.promo
    ? '<g><rect x="372" y="42" width="222" height="48" rx="24" fill="url(#gold)"/>' +
      '<text x="483" y="74" text-anchor="middle" fill="#0b0b0d" ' +
      'font-family="Montserrat,Segoe UI,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="3">PROMO</text></g>'
    : '';
  const oldPrice = p.old
    ? `<text x="320" y="688" text-anchor="middle" fill="#8c8c93" font-family="Montserrat,Segoe UI,Arial,sans-serif" font-size="30" text-decoration="line-through">${p.old}</text>`
    : '';
  const priceY = p.old ? 736 : 714;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 800" width="640" height="800" role="img" aria-label="${esc(p.name)} - ${esc(p.price)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1b21"/><stop offset="1" stop-color="#0a0a0c"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#bf953f"/><stop offset=".45" stop-color="#fcf6ba"/>
      <stop offset=".7" stop-color="#b38728"/><stop offset="1" stop-color="#fbf5b7"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".4" r=".55">
      <stop offset="0" stop-color="#d4af37" stop-opacity=".22"/>
      <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="800" fill="url(#bg)"/>
  <rect width="640" height="800" fill="url(#glow)"/>
  <rect x="22" y="22" width="596" height="756" rx="18" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".5"/>
  <text x="320" y="88" text-anchor="middle" fill="url(#gold)" font-family="Montserrat,Segoe UI,Arial,sans-serif" font-size="17" letter-spacing="5">ORIGINAL IMPORTADO</text>
  ${promoRibbon}
  <g transform="translate(320,310)" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
  <text x="320" y="588" text-anchor="middle" fill="#f4f4f6" font-family="Playfair Display,Georgia,serif" font-size="48" font-weight="700">${esc(p.name)}</text>
  <text x="320" y="628" text-anchor="middle" fill="#b9b9c0" font-family="Montserrat,Segoe UI,Arial,sans-serif" font-size="21" letter-spacing="1">${esc(p.sub || '')}</text>
  ${oldPrice}
  <text x="320" y="${priceY}" text-anchor="middle" fill="url(#gold)" font-family="Playfair Display,Georgia,serif" font-size="54" font-weight="800">${esc(p.price)}</text>
</svg>`;
}

function esc(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

const DEMOS = {
  'perfumes-masculinos': [
    { name: 'Noir Intense',  sub: 'Eau de Parfum 100ml', price: 'R$ 459', icon: 'bottle-m' },
    { name: 'Blue Aqua',     sub: 'Eau de Toilette 100ml', price: 'R$ 389', icon: 'bottle-m' },
    { name: 'Royal Oud',     sub: 'Parfum 75ml',         price: 'R$ 529', icon: 'bottle-m' },
    { name: 'Invicto Gold',  sub: 'Eau de Parfum 90ml',  price: 'R$ 415', icon: 'bottle-m' },
  ],
  'perfumes-femininos': [
    { name: 'Velvet Rose',   sub: 'Eau de Parfum 90ml',  price: 'R$ 479', icon: 'bottle-f' },
    { name: 'Aura Femme',    sub: 'Eau de Parfum 80ml',  price: 'R$ 435', icon: 'bottle-f' },
    { name: 'Golden Bloom',  sub: 'Parfum 75ml',         price: 'R$ 499', icon: 'bottle-f' },
    { name: 'Belle Nuit',    sub: 'Eau de Parfum 100ml', price: 'R$ 389', icon: 'bottle-f' },
  ],
  'eletronicos': [
    { name: 'Earbuds Pro',     sub: 'Bluetooth 5.3',     price: 'R$ 349', icon: 'earbuds' },
    { name: 'Smartwatch X',    sub: 'GPS + Saúde',       price: 'R$ 699', icon: 'watch' },
    { name: 'Headphone Studio',sub: 'Noise Cancelling',  price: 'R$ 549', icon: 'headphone' },
    { name: 'Power Bank 20k',  sub: 'Carga Rápida',      price: 'R$ 199', icon: 'phone' },
  ],
  'promocoes': [
    { name: 'Noir Intense',  sub: 'Oferta Limitada', price: 'R$ 399', old: 'R$ 459', icon: 'bottle-m', promo: true },
    { name: 'Smartwatch X',  sub: 'Oferta Limitada', price: 'R$ 599', old: 'R$ 699', icon: 'watch',    promo: true },
    { name: 'Velvet Rose',   sub: 'Oferta Limitada', price: 'R$ 419', old: 'R$ 479', icon: 'bottle-f', promo: true },
    { name: 'Earbuds Pro',   sub: 'Oferta Limitada', price: 'R$ 299', old: 'R$ 349', icon: 'earbuds',  promo: true },
  ],
};

function gerarDemos() {
  garantirPastas();
  let n = 0;
  for (const cat of CATEGORIAS) {
    const lista = DEMOS[cat.id] || [];
    lista.forEach((p, i) => {
      const slug = p.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const nome = `_demo-${String(i + 1).padStart(2, '0')}-${slug}.svg`;
      fs.writeFileSync(path.join(DIR_IMAGENS, cat.id, nome), buildSVG(p), 'utf8');
      n++;
    });
  }
  console.log(`✓ ${n} imagens de demonstração geradas em imagens/*/_demo-*.svg`);
}

/* ----------------------------------------------------------------- execução */

console.log('\n- Gerador do Catálogo - Produtos Originais Importados -\n');
garantirPastas();
if (process.argv.includes('--demos')) gerarDemos();
gerarManifesto();
console.log('\nAbra "index.html" para ver o catálogo.\n');
